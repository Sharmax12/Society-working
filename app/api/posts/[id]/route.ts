import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Sign in to manage your posts." }, { status: 401 });
  }

  const { id } = await context.params;
  const post = await db.post.findUnique({
    where: { id },
    select: { authorId: true },
  });
  if (!post) return Response.json({ error: "Post not found." }, { status: 404 });
  if (post.authorId !== session.user.id) {
    return Response.json({ error: "You can only delete your own posts." }, { status: 403 });
  }

  await db.post.delete({ where: { id } });
  return Response.json({ success: true });
}
