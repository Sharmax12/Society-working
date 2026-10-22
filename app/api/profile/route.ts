import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

function isSafeProfileImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

const privateHeaders = { "Cache-Control": "private, no-store" };

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, college: true, bio: true, image: true },
    });
    return NextResponse.json({ user }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Could not load profile." }, { status: 500, headers: privateHeaders });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  }

  let body: unknown;
  try {
    body = await readJsonBody(request, 8 * 1024);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: "Request body is too large." }, { status: 413, headers: privateHeaders });
    }
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400, headers: privateHeaders });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: privateHeaders });
  }

  const input = body as Record<string, unknown>;
  const rawName = typeof input.name === "string" ? input.name.trim() : "";
  const rawCollege = typeof input.college === "string" ? input.college.trim() : "";
  const rawBio = typeof input.bio === "string" ? input.bio.trim() : "";
  const rawImage = typeof input.image === "string" ? input.image.trim() : "";

  if (!rawName || rawName.length > 80) {
    return NextResponse.json({ error: "Name is required and must be 80 characters or fewer." }, { status: 400, headers: privateHeaders });
  }
  if (rawCollege.length > 160) {
    return NextResponse.json({ error: "College must be 160 characters or fewer." }, { status: 400, headers: privateHeaders });
  }
  if (rawBio.length > 500) {
    return NextResponse.json({ error: "Bio must be 500 characters or fewer." }, { status: 400, headers: privateHeaders });
  }
  if (rawImage.length > 1000 || (rawImage && !isSafeProfileImageUrl(rawImage))) {
    return NextResponse.json({ error: "Profile photo must be a valid HTTPS URL (up to 1,000 characters)." }, { status: 400, headers: privateHeaders });
  }

  try {
    const user = await db.user.update({
      where: { id: session.user.id },
      data: { name: rawName, college: rawCollege || null, bio: rawBio || null, image: rawImage || null },
      select: { name: true, college: true, bio: true, image: true },
    });
    return NextResponse.json({ user }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Could not save your profile. Please try again." }, { status: 500, headers: privateHeaders });
  }
}
