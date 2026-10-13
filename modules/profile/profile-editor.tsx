"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, CheckCircle2, LoaderCircle, UserRound, X } from "lucide-react";

type Profile = {
  name: string | null;
  email: string;
  college: string | null;
  bio: string | null;
  profilePhoto: string | null;
  image: string | null;
};

export function ProfileEditor({ initialProfile }: { initialProfile: Profile }) {
  const [name, setName] = useState(initialProfile.name ?? "");
  const [college, setCollege] = useState(initialProfile.college ?? "");
  const [bio, setBio] = useState(initialProfile.bio ?? "");
  const [profilePhoto, setProfilePhoto] = useState(initialProfile.profilePhoto);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const displayedPhoto = profilePhoto || initialProfile.image;

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setSaved(false);

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Choose a photo under 10 MB. It will be compressed before saving.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const photo = new Image();
    photo.onload = () => {
      try {
        const maxDimension = 512;
        const scale = Math.min(1, maxDimension / Math.max(photo.naturalWidth, photo.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(photo.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(photo.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Your browser couldn't process this image.");
        context.drawImage(photo, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL("image/webp", 0.78);
        if (compressed.length > 850_000) throw new Error("This photo is still too large. Try a simpler image.");
        setProfilePhoto(compressed);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Couldn't process this photo.");
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    photo.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError("Couldn't open that image. Try another photo.");
    };
    photo.src = objectUrl;
    event.target.value = "";
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, college, bio, profilePhoto }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Couldn't save your profile.");
      setSaved(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={saveProfile} className="rounded-[1.75rem] border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border bg-muted text-muted-foreground">
          {displayedPhoto ? <img src={displayedPhoto} alt="Profile preview" className="h-full w-full object-cover" /> : <UserRound className="h-9 w-9" />}
        </div>
        <div>
          <p className="font-black">Profile photo</p>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">Choose a JPG, PNG, or WebP image. It is resized in your browser before being saved.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition hover:bg-muted"><Camera className="h-4 w-4" /> Upload photo</button>
            {profilePhoto && <button type="button" onClick={() => { setProfilePhoto(null); setSaved(false); }} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted"><X className="h-4 w-4" /> Remove photo</button>}
          </div>
          <input ref={fileInput} type="file" accept="image/*" onChange={choosePhoto} className="sr-only" aria-label="Choose profile photo" />
        </div>
      </div>

      <div className="mt-6 grid gap-5">
        <div>
          <label htmlFor="profile-name" className="mb-2 block text-sm font-bold">Name</label>
          <input id="profile-name" value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} required maxLength={80} autoComplete="name" placeholder="How should students know you?" className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
        </div>
        <div>
          <label htmlFor="profile-college" className="mb-2 block text-sm font-bold">College or university</label>
          <input id="profile-college" value={college} onChange={(event) => { setCollege(event.target.value); setSaved(false); }} maxLength={160} placeholder="e.g. Delhi Technological University" className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3"><label htmlFor="profile-bio" className="text-sm font-bold">Bio</label><span className="text-xs text-muted-foreground">{bio.length}/500</span></div>
          <textarea id="profile-bio" value={bio} onChange={(event) => { setBio(event.target.value); setSaved(false); }} maxLength={500} rows={5} placeholder="What are you into? Clubs, projects, interests, or what you'd love to do on campus…" className="w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
        </div>
      </div>

      {error && <p role="alert" className="mt-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
      {saved && <p role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Profile saved.</p>}
      <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">Signed in as {initialProfile.email}</p>
        <button disabled={saving} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving…</> : "Save profile"}
        </button>
      </div>
    </form>
  );
}
