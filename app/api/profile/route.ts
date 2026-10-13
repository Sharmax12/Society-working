import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    const college = typeof body.college === "string" ? body.college.trim().slice(0, 160) : "";
    const bio = typeof body.bio === "string" ? body.bio.trim().slice(0, 500) : "";
    const image = typeof body.image === "string" ? body.image.trim().slice(0, 1000) : "";
    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    if (image && !/^https?:\\/\\//i.test(image)) return NextResponse.json({ error: "Profile photo must be a valid https:// or http:// image URL." }, { status: 400 });
    const user = await db.user.update({ where: { id: session.user.id }, data: { name, college: college || null, bio: bio || null, image: image || null }, select: { name: true, college: true, bio: true, image: true } });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Could not save your profile. Please try again." }, { status: 500 });
  }
}
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET() { const session = await auth(); if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const user = await db.user.findUnique({ where: { id: session.user.id }, select: { name: true, college: true, bio: true, image: true } }); return NextResponse.json({ user }); }
