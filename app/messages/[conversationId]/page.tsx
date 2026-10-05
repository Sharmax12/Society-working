import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ChatClient } from "@/modules/messages/components/chat-client"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/sign-in")

  const { conversationId } = await params
  return <ChatClient conversationId={conversationId} userId={session.user.id} />
}
