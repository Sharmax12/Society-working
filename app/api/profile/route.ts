import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, college: true, bio: true, image: true },
  });

  return NextResponse.json({ user }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const college = typeof data.college === "string" ? data.college.trim() : "";
  const bio = typeof data.bio === "string" ? data.bio.trim() : "";
  const image = typeof data.image === "string" ? data.image.trim() : "";

  if (!name || name.length > 80) {
    return NextResponse.json({ error: "Name must be between 1 and 80 characters." }, { status: 400 });
  }
  if (college.length > 160) {
    return NextResponse.json({ error: "College must be 160 characters or fewer." }, { status: 400 });
  }
  if (bio.length > 500) {
    return NextResponse.json({ error: "Bio must be 500 characters or fewer." }, { status: 400 });
  }
  if (image.length > 1000) {
    return NextResponse.json({ error: "Profile photo URL is too long." }, { status: 400 });
  }

  if (image) {
    try {
      const parsed = new URL(image);
      if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) {
        throw new Error("Invalid image URL");
      }
    } catch {
      return NextResponse.json({ error: "Profile photo must be a valid HTTPS URL." }, { status: 400 });
    }
  }

  try {
    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        college: college || null,
        bio: bio || null,
        image: image || null,
      },
      select: { name: true, college: true, bio: true, image: true },
    });

    return NextResponse.json({ user }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Could not save your profile. Please try again." }, { status: 500 });
  }
}
