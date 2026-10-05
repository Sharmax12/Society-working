import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ConnectClient } from "@/modules/connect/components/connect-client"

export default async function ConnectPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/sign-in")
  }

  return <ConnectClient currentUserId={session.user.id} />
}
