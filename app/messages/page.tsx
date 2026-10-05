import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { MessagesClient } from "@/modules/messages/components/messages-client"

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")
  return <MessagesClient />
}
