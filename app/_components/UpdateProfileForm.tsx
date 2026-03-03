"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { updateProfileAction } from "../_lib/actions";
import Button from "./Button";

type User = { id: number; name: string; email: string; avatar?: string };

export default function UpdateProfileForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData(e.currentTarget);
      await updateProfileAction(user.id, formData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const currentAvatar = avatarPreview ?? user.avatar;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 flex flex-col gap-5">
      <div>
        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
          Photo
        </label>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 shrink-0">
            {currentAvatar ? (
              <Image
                src={currentAvatar}
                width={30}
                height={30}
                alt="Avatar"
                className="object-cover w-7.5 h-7.5"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-lg font-semibold text-slate-500">
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm text-lime-600 hover:text-lime-700 font-medium transition-colors"
            >
              Change photo
            </button>
            <p className="text-xs text-slate-400">JPG, PNG or WebP. Max 2MB.</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
          Name
        </label>
        <input
          name="name"
          defaultValue={user.name}
          required
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-200 placeholder-slate-400"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
          Email
        </label>
        <input
          value={user.email}
          disabled
          className="w-full border border-slate-100 rounded-lg px-4 py-2.5 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
        />
        <p className="text-xs text-slate-400 mt-1">
          Email is managed by Google and cannot be changed here.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-1">
        <Button type="submit" className="h-10" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </Button>
        {success && (
          <p className="text-sm text-lime-600">Profile updated successfully.</p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  );
}
