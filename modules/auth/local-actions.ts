"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
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
