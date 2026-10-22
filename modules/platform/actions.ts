"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

async function requireSuperAdmin() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard")
  return session
}

export async function setSocietyVerification(
  societyId: string,
  status: "VERIFIED" | "SUSPENDED"
) {
  await requireSuperAdmin()

  if (
    typeof societyId !== "string" ||
    societyId.trim().length === 0 ||
    societyId.length > 128
  ) {
    throw new Error("Invalid society")
  }

  // TypeScript types are not runtime validation for server actions.
  if (status !== "VERIFIED" && status !== "SUSPENDED") {
    throw new Error("Invalid verification status")
  }

  await db.society.update({
    where: { id: societyId },
    data: { verificationStatus: status },
  })

  revalidatePath("/super-admin")
  revalidatePath("/societies")
  revalidatePath("/events")
}
