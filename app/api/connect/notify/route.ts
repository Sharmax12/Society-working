import { db } from "@/lib/db"
import { sendConnectSignupEmail } from "@/lib/email"

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : ""

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  try {
    await db.connectSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    })

    const emailSent = await sendConnectSignupEmail(email)
    if (!emailSent) {
      return Response.json(
        { error: "We couldn't send the confirmation email. Please try again." },
        { status: 502 },
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Connect signup failed:", error)
    return Response.json({ error: "Unable to join the list right now. Please try again." }, { status: 500 })
  }
}