"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { consumeRateLimit, getClientIpFromHeaders } from "@/lib/rate-limit";
import { isAllowedCollegeEmail } from "@/modules/auth/college-email";
import { hashPassword } from "@/modules/auth/password";

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  let registrationAllowed = false;
  try {
    const requestHeaders = await headers();
    const [ipLimit, emailLimit] = await Promise.all([
      consumeRateLimit("auth:register:ip", getClientIpFromHeaders(requestHeaders), 10, 60 * 60),
      consumeRateLimit("auth:register:email", email, 3, 60 * 60),
    ]);
    registrationAllowed = ipLimit.allowed && emailLimit.allowed;
  } catch {
    redirect("/auth/register?error=unavailable");
  }
  if (!registrationAllowed) redirect("/auth/register?error=rate");

  const existingUser = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existingUser) redirect("/auth/register?error=exists");

  const passwordHash = await hashPassword(password);
  try {
    await db.user.create({
      data: { name, email, passwordHash, role: "STUDENT" },
    });
  } catch (error) {
    const duplicate = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (duplicate) redirect("/auth/register?error=exists");
    throw error;
  }

  redirect("/auth/sign-in?registered=1");
}
