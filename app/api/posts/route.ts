import { auth } from "@/auth";
import { db } from "@/lib/db";

const authorSelect = {
  id: true,
  name: true,
  college: true,
  profilePhoto: true,
  image: true,
} as const;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in to view campus posts." }, { status: 401 });
  }

  const posts = await db.post.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      authorId: true,
      content: true,
      createdAt: true,
      author: { select: authorSelect },
    },
  });
  return Response.json({ posts });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in to publish a post." }, { status: 401 });
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
  const content = (body as Record<string, unknown>).content;
  const text = typeof content === "string" ? content.trim() : "";
  if (!text || text.length > 2000) {
    return Response.json({ error: "Write a post between 1 and 2,000 characters." }, { status: 400 });
  }

  const post = await db.post.create({
    data: { content: text, authorId: session.user.id },
    select: {
      id: true,
      authorId: true,
      content: true,
      createdAt: true,
      author: { select: authorSelect },
    },
  });
  return Response.json({ post }, { status: 201 });
}
