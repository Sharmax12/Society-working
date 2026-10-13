import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { author: { select: { id: true, name: true, image: true, college: true } } } });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) return NextResponse.json({ error: "Write something before posting." }, { status: 400 });
    if (content.length > 2000) return NextResponse.json({ error: "Posts must be 2,000 characters or fewer." }, { status: 400 });
    const post = await db.post.create({ data: { content, authorId: session.user.id }, include: { author: { select: { id: true, name: true, image: true, college: true } } } });
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not publish your post." }, { status: 500 });
  }
}
