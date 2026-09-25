type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
  idempotencyKey: string
}

const RESEND_API_URL = "https://api.resend.com/emails"
const DEFAULT_FROM = "Society <onboarding@resend.dev>"

function escapeHtml(value: string | null | undefined) {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

async function sendEmail({
  to,
  subject,
  html,
  text,
  idempotencyKey,
}: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || DEFAULT_FROM

  if (!apiKey) {
    console.warn("Email notifications are disabled: RESEND_API_KEY is not configured.")
    return false
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      const details = await response.text()
      console.error("Email provider rejected the message:", response.status, details)
      return false
    }

    return true
  } catch (error) {
    console.error("Email notification failed:", error)
    return false
  }
}

export async function sendApplicationReceivedEmail({
  applicationId,
  applicantName,
  applicantEmail,
  societyName,
}: {
  applicationId: string
  applicantName: string | null
  applicantEmail: string
  societyName: string
}) {
  const name = applicantName?.trim() || "there"
  const safeName = escapeHtml(name)
  const safeSociety = escapeHtml(societyName)

  return sendEmail({
    to: applicantEmail,
    subject: \`Application received — \${societyName}\`,
    idempotencyKey: \`application-received-\${applicationId}\`,
    text: \`Hi \${name},

We have received your application to join \${societyName}.

Your application is now under review. You will receive another email when your application is reviewed.

Regards,
\${societyName} Team\`,
    html: \`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
      <h2 style="margin-bottom:8px">Application received</h2>
      <p>Hi \${safeName},</p>
      <p>We have received your application to join <strong>\${safeSociety}</strong>.</p>
      <p>Your application is now under review. You will receive another email when your application is reviewed.</p>
      <p style="margin-top:24px">Regards,<br />\${safeSociety} Team</p>
    </div>\`,
  })
}

export async function sendApplicationAcceptedEmail({
  applicationId,
  applicantName,
  applicantEmail,
  societyName,
}: {
  applicationId: string
  applicantName: string | null
  applicantEmail: string
  societyName: string
}) {
  const name = applicantName?.trim() || "there"
  const safeName = escapeHtml(name)
  const safeSociety = escapeHtml(societyName)

  return sendEmail({
    to: applicantEmail,
    subject: \`Application accepted — \${societyName}\`,
    idempotencyKey: \`application-accepted-\${applicationId}\`,
    text: \`Hi \${name},

Your application to join \${societyName} has been accepted.

We are excited to have you as part of the community. Further information about joining and upcoming activities will be shared with you soon.

Regards,
\${societyName} Team\`,
    html: \`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
      <h2 style="margin-bottom:8px">Application accepted</h2>
      <p>Hi \${safeName},</p>
      <p>Your application to join <strong>\${safeSociety}</strong> has been accepted.</p>
      <p>We are excited to have you as part of the community. Further information about joining and upcoming activities will be shared with you soon.</p>
      <p style="margin-top:24px">Regards,<br />\${safeSociety} Team</p>
    </div>\`,
  })
}

export async function sendInterviewInvitationEmail({
  applicationId,
  applicantName,
  applicantEmail,
  societyName,
}: {
  applicationId: string
  applicantName: string | null
  applicantEmail: string
  societyName: string
}) {
  const name = applicantName?.trim() || "there"
  const safeName = escapeHtml(name)
  const safeSociety = escapeHtml(societyName)

  return sendEmail({
    to: applicantEmail,
    subject: \`Interview invitation — \${societyName}\`,
    idempotencyKey: \`interview-invitation-\${applicationId}\`,
    text: \`Hi \${name},

Thank you for applying to \${societyName}.

We would like to invite you for an interview. Further details regarding the interview will be shared with you shortly.

Regards,
\${societyName} Team\`,
    html: \`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
      <h2 style="margin-bottom:8px">Interview invitation</h2>
      <p>Hi \${safeName},</p>
      <p>Thank you for applying to <strong>\${safeSociety}</strong>.</p>
      <p>We would like to invite you for an interview. Further details regarding the interview will be shared with you shortly.</p>
      <p style="margin-top:24px">Regards,<br />\${safeSociety} Team</p>
    </div>\`,
  })
}
