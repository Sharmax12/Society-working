import { auth } from "@/auth";
import { db } from "@/lib/db";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/http";
import { NextResponse } from "next/server";
import { consumeRateLimit } from "@/lib/rate-limit";

const privateHeaders = { "Cache-Control": "private, no-store" };

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  }

  try {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        author: { select: { id: true, name: true, image: true, college: true } },
      },
    });
    return NextResponse.json({ posts }, { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Could not load posts." }, { status: 500, headers: privateHeaders });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  }

  try {
    const rateLimit = await consumeRateLimit("posts:create", session.user.id, 10, 60 * 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many posts. Please try again later." },
        { status: 429, headers: { ...privateHeaders, "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }
  } catch {
    return NextResponse.json({ error: "Publishing is temporarily unavailable." }, { status: 503, headers: privateHeaders });
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

  const content = typeof (body as Record<string, unknown>).content === "string"
    ? ((body as Record<string, unknown>).content as string).trim()
    : "";

  if (!content) {
    return NextResponse.json({ error: "Write something before posting." }, { status: 400, headers: privateHeaders });
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: "Posts must be 2,000 characters or fewer." }, { status: 400, headers: privateHeaders });
  }

  try {
    const post = await db.post.create({
      data: { content, authorId: session.user.id },
      include: {
        author: { select: { id: true, name: true, image: true, college: true } },
      },
    });
    return NextResponse.json({ post }, { status: 201, headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Could not publish your post." }, { status: 500, headers: privateHeaders });
  }
}
