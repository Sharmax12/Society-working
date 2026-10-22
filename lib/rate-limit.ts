import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { db } from "@/lib/db";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfterSeconds: number;
};

/**
 * Use Vercel's system-provided client-IP header first. Vercel documents that
 * these headers are overwritten at its edge to prevent client IP spoofing.
 * If no trusted IP is available, fail closed into a single fallback bucket.
 */
export function getClientIpFromHeaders(headers: Pick<Headers, "get">): string {
  const raw =
    headers.get("x-vercel-forwarded-for") ??
    headers.get("x-forwarded-for") ??
    headers.get("x-real-ip");

  const candidate = raw?.split(",").map((part) => part.trim()).filter(Boolean).at(-1);
  return candidate && isIP(candidate) ? candidate : "unknown-client-ip";
}

export function getClientIp(request: Request): string {
  return getClientIpFromHeaders(request.headers);
}

/**
 * Atomically consume one request from a fixed-window rate limit shared by all
 * app instances. The scope and identity are hashed before they reach storage.
 * Keep limits per action rather than sharing one counter across unrelated APIs.
 */
export async function consumeRateLimit(
  scope: string,
  identity: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  if (!scope || !identity || !Number.isInteger(limit) || limit < 1 ||
      !Number.isInteger(windowSeconds) || windowSeconds < 1) {
    throw new TypeError("Invalid rate-limit configuration");
  }

  // HMAC prevents a database reader from dictionary-reversing common email
  // addresses or IPs from plain SHA-256 bucket identifiers.
  const hmacSecret = process.env.RATE_LIMIT_SECRET?.trim() || process.env.AUTH_SECRET?.trim();
  if (!hmacSecret || hmacSecret.length < 32) {
    throw new Error("Configure RATE_LIMIT_SECRET (32+ chars) or AUTH_SECRET");
  }
  const key = createHmac("sha256", hmacSecret)
    .update(`${scope}\n${identity}`)
    .digest("hex");
  const rows = await db.$queryRaw<Array<{ count: number; resetAt: Date }>>`
    INSERT INTO "RateLimitBucket" ("key", "count", "resetAt", "updatedAt")
    VALUES (
      ${key},
      1,
      NOW() + (CAST(${windowSeconds} AS INTEGER) * INTERVAL '1 second'),
      NOW()
    )
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW() THEN 1
        ELSE "RateLimitBucket"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW()
          THEN NOW() + (CAST(${windowSeconds} AS INTEGER) * INTERVAL '1 second')
        ELSE "RateLimitBucket"."resetAt"
      END,
      "updatedAt" = NOW()
    RETURNING "count", "resetAt"
  `;

  const bucket = rows[0];
  if (!bucket) throw new Error("Rate-limit counter was not returned");
  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt.getTime() - Date.now()) / 1000));

  // Opportunistic cleanup prevents unbounded growth from one-off client IPs.
  // The table's resetAt index keeps this maintenance query bounded to expired rows.
  if (Math.random() < 0.01) {
    void db.rateLimitBucket
      .deleteMany({ where: { resetAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } })
      .catch(() => undefined);
  }

  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetAt: bucket.resetAt,
    retryAfterSeconds,
  };
}
