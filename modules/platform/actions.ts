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

  await db.society.update({
    where: { id: societyId },
    data: { verificationStatus: status },
  })

  revalidatePath("/super-admin")
  revalidatePath("/societies")
  revalidatePath("/events")
}
