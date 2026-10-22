"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

/**
 * Return only the signed-in user's profile. Server actions are network-callable,
 * so the requested ID must never be treated as proof of authorization.
 */
export async function getUserById(id: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== id) return null;

  try {
    return await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        college: true,
        bio: true,
        role: true,
        rollNumber: true,
      },
    });
  } catch {
    return null;
  }
}

/**
 * Account tokens are credentials, not profile data. Never return access,
 * refresh, or ID tokens from a server action.
 */
export async function getAccountByUserId(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) return null;

  try {
    return await db.account.findFirst({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        type: true,
        provider: true,
      },
    });
  } catch {
    return null;
  }
}

export async function currentUser() {
  const session = await auth();
  return session?.user ?? null;
}
