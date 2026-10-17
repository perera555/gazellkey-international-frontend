"use client";

import { useEffect, useRef, useState } from "react";

// Google account photos come as ".../photo=s96-c" (96 px). Ask for a size
// that stays sharp on high-resolution screens.
export function sharpPhotoUrl(photoUrl: string, size: number) {
  const pixels = Math.max(128, Math.round(size * 3));
  return photoUrl.includes("googleusercontent.com")
    ? photoUrl.replace(/=s\d+(-c)?$/, `=s${pixels}-c`)
    : photoUrl;
}

// Round profile photo, or the person's initials when they have none.
// `online` adds a green dot in the corner.
export default function Avatar({
  firstName,
  lastName,
  photoUrl,
  size = 36,
  online = false,
  className = "",
}: {
  firstName: string;
  lastName?: string;
  photoUrl?: string | null;
  size?: number;
  online?: boolean;
  className?: string;
}) {
  const initials = `${firstName.charAt(0)}${(lastName ?? "").charAt(0)}`.toUpperCase();
  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) };
  // photo that could not be loaded: show the initials instead of a broken image
  const [failed, setFailed] = useState<string | null>(null);
  const image = useRef<HTMLImageElement>(null);

  // a photo that failed before the page became interactive fires no onError
  useEffect(() => {
    const element = image.current;
    if (photoUrl && element && element.complete && element.naturalWidth == 0) {
      setFailed(photoUrl);
    }
  }, [photoUrl]);

  const picture =
    photoUrl && failed != photoUrl ? (
      // Google photos live on another host, so a plain <img>
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={image}
        src={sharpPhotoUrl(photoUrl, size)}
        alt=""
        width={size}
        height={size}
        style={style}
        decoding="async"
        onError={() => setFailed(photoUrl)}
        referrerPolicy="no-referrer" // Google photo links refuse some referrers
        // faces sit in the upper part of most photos, so crop a little above centre
        className={`rounded-full bg-navy-100 object-cover object-[50%_30%] ring-2 ring-gold-500/70 ring-offset-2 ring-offset-transparent ${className}`}
      />
    ) : (
      <span
        style={style}
        aria-hidden="true"
        className={`grid place-items-center rounded-full bg-gold-500 font-bold text-navy-950 ring-2 ring-gold-500/40 ${className}`}
      >
        {initials || "?"}
      </span>
    );

  const dot = Math.max(10, Math.round(size * 0.26));
  return (
    <span className="relative inline-flex shrink-0">
      {picture}
      {online ? (
        <span
          title="Online"
          style={{ width: dot, height: dot }}
          className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_0_2px_rgb(16_185_129/0.25)]"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" aria-hidden="true" />
          <span className="sr-only">Online</span>
        </span>
      ) : null}
    </span>
  );
}
