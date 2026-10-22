"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { consumeRateLimit, getClientIpFromHeaders } from "@/lib/rate-limit";
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/email";
import { isAllowedCollegeEmail } from "@/modules/auth/college-email";
import { hashPassword } from "@/modules/auth/password";

const TOKEN_LIFETIME_MS = 30 * 60 * 1000;

type TokenPurpose = "EMAIL_VERIFICATION" | "PASSWORD_RESET";

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function createRawToken(): string {
  return randomBytes(32).toString("base64url");
}

async function actionRateAllowed(
  scope: string,
  identity: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const result = await consumeRateLimit(scope, identity, limit, windowSeconds);
  return result.allowed;
}

async function replaceAuthToken(userId: string, purpose: TokenPurpose) {
  const rawToken = createRawToken();
  const tokenHash = hashToken(rawToken);
  await db.$transaction(async (tx) => {
    await tx.authToken.deleteMany({ where: { userId, purpose } });
    await tx.authToken.create({
      data: {
        userId,
        purpose,
        tokenHash,
        expiresAt: new Date(Date.now() + TOKEN_LIFETIME_MS),
      },
    });
  });
  return { rawToken, tokenHash };
}

async function getRequestIdentity() {
  const requestHeaders = await headers();
  return getClientIpFromHeaders(requestHeaders);
}

export async function registerLocalAccount(formData: FormData): Promise<never> {
  const name = readText(formData, "name").trim();
  const email = readText(formData, "email").trim().toLowerCase();
  const password = readText(formData, "password");
  const confirmPassword = readText(formData, "confirmPassword");

  if (!name || name.length > 80 || !isValidEmail(email)) {
    redirect("/auth/register?error=invalid");
  }
  if (!isAllowedCollegeEmail(email)) {
    redirect("/auth/register?error=invalid");
  }
  if (password.length < 10 || password.length > 128) {
    redirect("/auth/register?error=password");
  }
  if (password !== confirmPassword) {
    redirect("/auth/register?error=mismatch");
  }

  try {
    const ip = await getRequestIdentity();
    const [ipAllowed, emailAllowed] = await Promise.all([
      actionRateAllowed("auth:register:ip", ip, 10, 60 * 60),
      actionRateAllowed("auth:register:email", email, 3, 60 * 60),
    ]);
    if (!ipAllowed || !emailAllowed) redirect("/auth/register?error=rate");
  } catch (error) {
    // Next redirect throws internally and must not be turned into a DB error.
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/auth/register?error=unavailable");
  }

  const existingUser = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, passwordHash: true, emailVerified: true },
  });
  if (existingUser) {
    // Do not reveal whether an address is registered. If this is an unverified
    // password account, send a fresh verification link without changing its password.
    if (existingUser.passwordHash && !existingUser.emailVerified) {
      try {
        const { rawToken, tokenHash } = await replaceAuthToken(existingUser.id, "EMAIL_VERIFICATION");
        const sent = await sendEmailVerificationEmail({ email, name: existingUser.name, token: rawToken });
        if (!sent) {
          await db.authToken.deleteMany({ where: { userId: existingUser.id, tokenHash } }).catch(() => undefined);
        }
      } catch {
        // Keep the response indistinguishable from a normal registration.
      }
    }
    redirect("/auth/sign-in?verification=sent");
  }

  const passwordHash = await hashPassword(password);
  const rawToken = createRawToken();
  const tokenHash = hashToken(rawToken);
  let userId: string;

  try {
    const user = await db.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: { name, email, passwordHash, role: "STUDENT", emailVerified: null },
        select: { id: true },
      });
      await tx.authToken.create({
        data: {
          userId: createdUser.id,
          purpose: "EMAIL_VERIFICATION",
          tokenHash,
          expiresAt: new Date(Date.now() + TOKEN_LIFETIME_MS),
        },
      });
      return createdUser;
    });
    userId = user.id;
  } catch (error) {
    const duplicate = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (duplicate) redirect("/auth/sign-in?verification=sent");
    throw error;
  }

  const sent = await sendEmailVerificationEmail({ email, name, token: rawToken });
  if (!sent) {
    await db.authToken.deleteMany({ where: { userId, tokenHash } }).catch(() => undefined);
  }
  redirect("/auth/sign-in?verification=sent");
}

/** Generic response prevents account enumeration; a fresh link invalidates older links. */
export async function requestEmailVerification(formData: FormData): Promise<never> {
  const email = readText(formData, "email").trim().toLowerCase();
  if (!isValidEmail(email)) redirect("/auth/verify-email?status=sent");

  try {
    const ip = await getRequestIdentity();
    const [ipAllowed, emailAllowed] = await Promise.all([
      actionRateAllowed("auth:verify:ip", ip, 10, 60 * 60),
      actionRateAllowed("auth:verify:email", email, 3, 60 * 60),
    ]);
    if (!ipAllowed || !emailAllowed) redirect("/auth/verify-email?status=sent");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/auth/verify-email?status=sent");
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, passwordHash: true, emailVerified: true },
  });
  if (user?.passwordHash && !user.emailVerified) {
    const { rawToken, tokenHash } = await replaceAuthToken(user.id, "EMAIL_VERIFICATION");
    const sent = await sendEmailVerificationEmail({ email, name: user.name, token: rawToken });
    if (!sent) {
      await db.authToken.deleteMany({ where: { userId: user.id, tokenHash } }).catch(() => undefined);
    }
  }
  redirect("/auth/verify-email?status=sent");
}

/** The user must submit the confirmation page; GET requests alone never consume a token. */
export async function verifyEmail(formData: FormData): Promise<never> {
  const token = readText(formData, "token");
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) {
    redirect("/auth/verify-email?error=invalid");
  }

  try {
    const ip = await getRequestIdentity();
    if (!(await actionRateAllowed("auth:verify:submit:ip", ip, 20, 60 * 60))) {
      redirect("/auth/verify-email?error=invalid");
    }
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/auth/verify-email?error=invalid");
  }

  const tokenHash = hashToken(token);
  const now = new Date();
  const verified = await db.$transaction(async (tx) => {
    const record = await tx.authToken.findFirst({
      where: {
        tokenHash,
        purpose: "EMAIL_VERIFICATION",
        usedAt: null,
        expiresAt: { gt: now },
      },
      select: { id: true, userId: true },
    });
    if (!record) return false;

    const consumed = await tx.authToken.updateMany({
      where: {
        id: record.id,
        usedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    });
    if (consumed.count !== 1) return false;

    await tx.user.update({
      where: { id: record.userId },
      data: { emailVerified: now },
    });
    await tx.authToken.deleteMany({
      where: { userId: record.userId, purpose: "EMAIL_VERIFICATION", id: { not: record.id } },
    });
    return true;
  });

  if (!verified) redirect("/auth/verify-email?error=invalid");
  redirect("/auth/sign-in?verified=1");
}

/** Always returns the same status even when the email does not belong to an account. */
export async function requestPasswordReset(formData: FormData): Promise<never> {
  const email = readText(formData, "email").trim().toLowerCase();
  if (!isValidEmail(email)) redirect("/auth/forgot-password?status=sent");

  try {
    const ip = await getRequestIdentity();
    const [ipAllowed, emailAllowed] = await Promise.all([
      actionRateAllowed("auth:password-reset:ip", ip, 10, 60 * 60),
      actionRateAllowed("auth:password-reset:email", email, 3, 60 * 60),
    ]);
    if (!ipAllowed || !emailAllowed) redirect("/auth/forgot-password?status=sent");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/auth/forgot-password?status=sent");
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, passwordHash: true, emailVerified: true },
  });
  if (user?.passwordHash && user.emailVerified) {
    const { rawToken, tokenHash } = await replaceAuthToken(user.id, "PASSWORD_RESET");
    const sent = await sendPasswordResetEmail({ email, name: user.name, token: rawToken });
    if (!sent) {
      await db.authToken.deleteMany({ where: { userId: user.id, tokenHash } }).catch(() => undefined);
    }
  }
  redirect("/auth/forgot-password?status=sent");
}

export async function resetPassword(formData: FormData): Promise<never> {
  const token = readText(formData, "token");
  const password = readText(formData, "password");
  const confirmPassword = readText(formData, "confirmPassword");

  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) {
    redirect("/auth/reset-password?error=invalid");
  }
  if (password.length < 10 || password.length > 128) {
    redirect("/auth/reset-password?error=password");
  }
  if (password !== confirmPassword) {
    redirect("/auth/reset-password?error=mismatch");
  }

  const tokenHash = hashToken(token);
  try {
    const ip = await getRequestIdentity();
    const [ipAllowed, tokenAllowed] = await Promise.all([
      actionRateAllowed("auth:password-reset:submit:ip", ip, 10, 60 * 60),
      actionRateAllowed("auth:password-reset:submit:token", tokenHash, 5, 60 * 60),
    ]);
    if (!ipAllowed || !tokenAllowed) redirect("/auth/reset-password?error=invalid");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/auth/reset-password?error=invalid");
  }
  const now = new Date();
  const record = await db.authToken.findFirst({
    where: {
      tokenHash,
      purpose: "PASSWORD_RESET",
      usedAt: null,
      expiresAt: { gt: now },
    },
    select: { id: true, userId: true },
  });
  if (!record) redirect("/auth/reset-password?error=invalid");

  const passwordHash = await hashPassword(password);
  const applied = await db.$transaction(async (tx) => {
    const consumed = await tx.authToken.updateMany({
      where: {
        id: record.id,
        userId: record.userId,
        purpose: "PASSWORD_RESET",
        usedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    });
    if (consumed.count !== 1) return false;

    await tx.user.update({
      where: { id: record.userId },
      data: { passwordHash, authVersion: { increment: 1 } },
    });
    await tx.authToken.deleteMany({
      where: { userId: record.userId, purpose: "PASSWORD_RESET", id: { not: record.id } },
    });
    return true;
  });
  if (!applied) redirect("/auth/reset-password?error=invalid");
  redirect("/auth/sign-in?passwordReset=1");
}
