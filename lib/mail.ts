import nodemailer from "nodemailer"

type ApplicationNotification = {
  applicantEmail?: string | null
  applicantName?: string | null
  societyName: string
  adminEmail: string
  rollNumber: string
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const password = process.env.SMTP_PASSWORD

  if (!host || !user || !password) return null

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass: password },
  })
}

export async function sendApplicationNotifications({
  applicantEmail,
  applicantName,
  societyName,
  adminEmail,
  rollNumber,
}: ApplicationNotification) {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn("Application email skipped: SMTP is not configured")
    return
  }

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER
  const greeting = applicantName ? ` ${applicantName}` : ""

  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `New application for ${societyName}`,
    text: `A new application was submitted for ${societyName}.\n\nApplicant:${greeting}\nRoll number: ${rollNumber}`,
  })

  if (applicantEmail) {
    await transporter.sendMail({
      from,
      to: applicantEmail,
      subject: `Application received: ${societyName}`,
      text: `Hi${greeting},\n\nYour application to ${societyName} has been received and is pending review.`,
    })
  }
}