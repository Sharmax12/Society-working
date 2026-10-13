import { auth } from "@/auth";
import { db } from "@/lib/db";

const MAX_PHOTO_LENGTH = 850_000;

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in to update your profile." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const college = typeof input.college === "string" ? input.college.trim().replace(/\s+/g, " ") : "";
  const bio = typeof input.bio === "string" ? input.bio.trim() : "";
  const profilePhoto = input.profilePhoto;

  if (!name || name.length > 80) {
    return Response.json({ error: "Enter a name between 1 and 80 characters." }, { status: 400 });
  }
  if (college.length > 160) {
    return Response.json({ error: "College must be 160 characters or fewer." }, { status: 400 });
  }
  if (bio.length > 500) {
    return Response.json({ error: "Bio must be 500 characters or fewer." }, { status: 400 });
  }
  if (
    profilePhoto !== null &&
    (typeof profilePhoto !== "string" ||
      profilePhoto.length > MAX_PHOTO_LENGTH ||
      !/^data:image\/(?:webp|jpeg|png);base64,/i.test(profilePhoto))
  ) {
    return Response.json({ error: "Choose a smaller JPG, PNG, or WebP photo." }, { status: 400 });
  }

  const user = await db.user.update({
    where: { id: session.user.id },
    data: {
      name,
      college: college || null,
      bio: bio || null,
      profilePhoto,
    },
    select: {
      id: true,
      name: true,
      email: true,
      college: true,
      bio: true,
      profilePhoto: true,
      image: true,
    },
  });

  return Response.json({ profile: user });
}
