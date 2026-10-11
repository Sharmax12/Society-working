import { sendCampusLeadEmail } from "@/lib/email";

type LeadKind = "society" | "college";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const organization = typeof input.organization === "string" ? input.organization.trim().replace(/\s+/g, " ") : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const kind = input.kind === "society" || input.kind === "college" ? input.kind as LeadKind : null;
  const website = typeof input.website === "string" ? input.website.trim() : "";

  // Ignore obvious bot submissions without confirming any email delivery.
  if (website) return Response.json({ success: true });

  if (!name || name.length > 100) {
    return Response.json({ error: "Enter your name (up to 100 characters)." }, { status: 400 });
  }
  if (!organization || organization.length > 160) {
    return Response.json({ error: "Enter the society or college name (up to 160 characters)." }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!kind) {
    return Response.json({ error: "Choose a valid inquiry type." }, { status: 400 });
  }

  const emailSent = await sendCampusLeadEmail({ name, organization, email, kind });
  if (!emailSent) {
    return Response.json({ error: "We couldn't send your details right now. Please try again later." }, { status: 502 });
  }

  return Response.json({ success: true });
}
