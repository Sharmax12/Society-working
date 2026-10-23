import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http";
import { sendCampusLeadEmail } from "@/lib/email";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

type LeadKind = "society" | "college";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await readJsonBody(request, 8 * 1024);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return Response.json({ error: "Request body is too large." }, { status: 413 });
    }
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const organization = typeof input.organization === "string" ? input.organization.trim().replace(/\s+/g, " ") : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const kind = input.kind === "society" || input.kind === "college" ? input.kind as LeadKind : null;
  const website = typeof input.website === "string" ? input.website.trim() : "";

  // Ignore obvious bot submissions without confirming any email delivery.
  if (website) return Response.json({ success: true });

  if (!name || name.length > 100) {
    return Response.json({ error: "Enter your name (up to 100 characters)." }, { status: 400 });
  }
  if (!organization || organization.length > 160) {
    return Response.json({ error: "Enter the society or college name (up to 160 characters)." }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!kind) {
    return Response.json({ error: "Choose a valid inquiry type." }, { status: 400 });
  }

  // This public endpoint triggers an outbound email. Limit valid submissions by
  // trusted edge IP before contacting the email provider.
  let rateLimit;
  try {
    rateLimit = await consumeRateLimit("campus-leads", getClientIp(request), 5, 60 * 60);
  } catch {
    // Fail closed if the shared limiter is unavailable; do not send unlimited mail.
    return Response.json(
      { error: "We couldn't process your request right now. Please try again later." },
      { status: 503 },
    );
  }
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Too many inquiries from this network. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const emailSent = await sendCampusLeadEmail({ name, organization, email, kind });
  if (!emailSent) {
    return Response.json({ error: "We couldn't send your details right now. Please try again later." }, { status: 502 });
  }

  return Response.json({ success: true });
}
