"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Camera, LoaderCircle, MessageCircle, Send, Trash2, UserRound } from "lucide-react";

type PostAuthor = {
  id: string;
  name: string | null;
  college: string | null;
  profilePhoto: string | null;
  image: string | null;
};

type CampusPost = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  author: PostAuthor;
};

function Avatar({ author }: { author: PostAuthor }) {
  const photo = author.profilePhoto || author.image;
  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted text-muted-foreground">
      {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5" />}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function PostsFeed({ currentUserId }: { currentUserId: string }) {
  const [posts, setPosts] = useState<CampusPost[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Couldn't load posts.");
      setPosts(result.posts as CampusPost[]);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function publishPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    setPosting(true);
    setError("");
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Couldn't publish your post.");
      setPosts((current) => [result.post as CampusPost, ...current]);
      setContent("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't publish your post.");
    } finally {
      setPosting(false);
    }
  }

  async function deletePost(id: string) {
    setDeletingId(id);
    setError("");
    try {
      const response = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Couldn't delete this post.");
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't delete this post.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <form onSubmit={publishPost} className="rounded-[1.5rem] border bg-card p-4 shadow-sm sm:p-6">
        <label htmlFor="new-post" className="mb-3 block text-sm font-black">What's on your mind?</label>
        <textarea id="new-post" value={content} onChange={(event) => setContent(event.target.value)} maxLength={2000} rows={4} placeholder="Share an update, a project, an idea, or a question…" className="w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{content.length}/2000 characters · Visible to signed-in students</p>
          <button type="submit" disabled={posting || !content.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {posting ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Posting…</> : <><Send className="h-4 w-4" /> Publish post</>}
          </button>
        </div>
      </form>

      {error && <p role="alert" className="mt-4 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="mb-4 mt-8 flex items-center justify-between">
        <h2 className="text-lg font-black">Latest from campus</h2>
        <span className="rounded-full border bg-card px-3 py-1 text-xs font-bold">{posts.length} {posts.length === 1 ? "post" : "posts"}</span>
      </div>

      {loading ? (
        <div className="grid place-items-center rounded-2xl border bg-card py-14 text-muted-foreground"><LoaderCircle className="h-6 w-6 animate-spin" /><p className="mt-3 text-sm">Loading posts…</p></div>
      ) : posts.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed bg-card/60 px-6 py-14 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><MessageCircle className="h-5 w-5" /></div>
          <p className="mt-4 font-black">It's quiet here — start the conversation.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Your post will be the first one in the feed. Share something your campus community might enjoy.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-[1.5rem] border bg-card p-4 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <Avatar author={post.author} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">{post.author.name || "Campus student"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{post.author.college || "HallWayLoop member"} · {formatDate(post.createdAt)}</p>
                </div>
                {post.authorId === currentUserId && (
                  <button type="button" onClick={() => void deletePost(post.id)} disabled={deletingId === post.id} aria-label="Delete post" title="Delete post" className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50">
                    {deletingId === post.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                )}
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7">{post.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
