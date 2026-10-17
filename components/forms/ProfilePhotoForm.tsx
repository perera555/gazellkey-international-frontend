"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar, { sharpPhotoUrl } from "@/components/site/Avatar";
import { apiRequest } from "@/lib/api-client";

const MAX_SIZE = 5 * 1024 * 1024; // same limit as the API

// Customer uploads / removes their profile photo (POST / DELETE /api/auth/photo)
export default function ProfilePhotoForm({
  firstName,
  lastName,
  photoUrl,
}: {
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState(photoUrl ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(false);

  async function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow choosing the same file again
    if (!file) return;
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG or WEBP photo.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("The photo is larger than 5 MB.");
      return;
    }

    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await fetch("/api/auth/photo", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.message ?? "Could not upload the photo.");
      } else {
        setCurrent(data.photoUrl ?? null);
        router.refresh(); // header picks up the new photo
      }
    } catch {
      setError("Network error. Please check your connection.");
    }
    setBusy(false);
  }

  async function onRemove() {
    setBusy(true);
    setError("");
    const result = await apiRequest("DELETE", "/api/auth/photo");
    setBusy(false);
    if (!result.ok) {
      setError(result.data.message ?? "Could not remove the photo.");
      return;
    }
    setCurrent(null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      {current ? (
        <button
          type="button"
          onClick={() => setViewing(true)}
          aria-label="View photo full size"
          className="group relative rounded-full"
        >
          <Avatar firstName={firstName} lastName={lastName} photoUrl={current} size={128} />
          <span className="absolute inset-0 grid place-items-center rounded-full bg-navy-950/0 text-xs font-semibold text-white opacity-0 transition group-hover:bg-navy-950/45 group-hover:opacity-100">
            View
          </span>
        </button>
      ) : (
        <Avatar firstName={firstName} lastName={lastName} photoUrl={current} size={128} />
      )}

      {viewing && current ? (
        // full-size photo; click anywhere or press Escape to close
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Your profile photo"
          onClick={() => setViewing(false)}
          onKeyDown={(event) => event.key == "Escape" && setViewing(false)}
          className="fixed inset-0 z-60 grid place-items-center bg-navy-950/85 p-6 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sharpPhotoUrl(current, 600)}
            alt="Your profile photo"
            referrerPolicy="no-referrer"
            className="lightbox-in max-h-[80vh] max-w-full rounded-3xl object-contain shadow-2xl"
          />
          <button
            type="button"
            autoFocus
            onClick={() => setViewing(false)}
            className="btn-glass btn-sm absolute top-5 right-5"
          >
            Close
          </button>
        </div>
      ) : null}
      <div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="btn-navy btn-sm">
            {busy ? "Saving..." : current ? "Change photo" : "Upload photo"}
          </button>
          {current ? (
            <button type="button" disabled={busy} onClick={onRemove} className="btn-outline btn-sm">
              Remove
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-slate-500">JPG, PNG or WEBP, up to 5 MB.</p>
        {error ? (
          <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onPick}
          className="hidden"
          aria-label="Choose a profile photo"
        />
      </div>
    </div>
  );
}
