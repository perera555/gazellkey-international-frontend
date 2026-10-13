"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GalleryPhoto } from "@/lib/types";

function placeOf(photo: GalleryPhoto) {
  return [photo.place, photo.country].filter(Boolean).join(", ");
}

// Trip photos. "mosaic" = one big photo and four small ones (a preview on
// the Travel page); "masonry" = every photo in flowing columns (/gallery).
// Clicking a photo opens a full-screen viewer: arrows / swipe to move, Esc to close.
export default function PhotoGallery({
  photos,
  layout = "masonry",
}: {
  photos: GalleryPhoto[];
  layout?: "mosaic" | "masonry";
}) {
  const [open, setOpen] = useState<number | null>(null);

  if (photos.length == 0) {
    return null;
  }

  return (
    <>
      {layout == "mosaic" ? (
        <div className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] md:grid-cols-4">
          {photos.slice(0, 5).map((photo, index) => (
            <Tile
              key={photo.id}
              photo={photo}
              onOpen={() => setOpen(index)}
              className={index == 0 ? "col-span-2 row-span-2" : ""}
              big={index == 0}
              more={index == 4 && photos.length > 5 ? photos.length - 5 : 0}
            />
          ))}
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((photo, index) => (
            <Tile key={photo.id} photo={photo} onOpen={() => setOpen(index)} className="mb-4 break-inside-avoid" natural />
          ))}
        </div>
      )}
      {open != null ? <Lightbox photos={photos} start={open} onClose={() => setOpen(null)} /> : null}
    </>
  );
}

function Tile({
  photo,
  onOpen,
  className = "",
  big = false,
  natural = false,
  more = 0,
}: {
  photo: GalleryPhoto;
  onOpen: () => void;
  className?: string;
  big?: boolean;
  natural?: boolean; // keep the photo's own shape (masonry)
  more?: number; // "+12" on the last mosaic tile
}) {
  const place = placeOf(photo);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo: ${photo.title}`}
      className={`group relative block w-full overflow-hidden rounded-2xl bg-navy-900 text-left shadow-[0_18px_40px_-24px_rgba(6,11,26,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${className}`}
    >
      {/* Photos can come from any host (uploads or links), so a plain <img> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.title}
        loading="lazy"
        className={`w-full transition duration-700 ease-out group-hover:scale-105 ${natural ? "h-auto" : "h-full object-cover"}`}
      />
      <span className="absolute inset-0 bg-linear-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-80 transition group-hover:opacity-100" />
      <span className="absolute inset-x-0 bottom-0 translate-y-1 p-4 transition duration-300 group-hover:translate-y-0">
        {place ? (
          <span className="mb-1 flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.18em] text-gold-400 uppercase">
            <PinIcon /> {place}
          </span>
        ) : null}
        <span className={`block font-display font-semibold text-white ${big ? "text-2xl sm:text-3xl" : "text-base"}`}>
          {photo.title}
        </span>
        {big && photo.caption ? (
          <span className="mt-1 hidden max-w-md text-sm text-white/80 sm:block">{photo.caption}</span>
        ) : null}
      </span>
      {more > 0 ? (
        <span className="absolute inset-0 grid place-items-center bg-navy-950/60 text-2xl font-semibold text-white backdrop-blur-[2px]">
          +{more} more
        </span>
      ) : null}
    </button>
  );
}

function Lightbox({ photos, start, onClose }: { photos: GalleryPhoto[]; start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const touchX = useRef<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const photo = photos[index];

  const move = useCallback(
    (step: number) => setIndex((current) => (current + step + photos.length) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    closeButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // no page scrolling behind
    function onKey(event: KeyboardEvent) {
      if (event.key == "Escape") onClose();
      if (event.key == "ArrowRight") move(1);
      if (event.key == "ArrowLeft") move(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [move, onClose]);

  const place = placeOf(photo);
  const taken = photo.takenAt
    ? new Date(photo.takenAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-[60] flex flex-col bg-navy-950/95 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={(event) => (touchX.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchX.current == null) return;
        const distance = event.changedTouches[0].clientX - touchX.current;
        if (Math.abs(distance) > 50) move(distance < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-sm text-white/70 sm:px-6">
        <span>
          {index + 1} / {photos.length}
        </span>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.id}
          src={photo.src}
          alt={photo.title}
          onClick={(event) => event.stopPropagation()}
          className="lightbox-in max-h-full max-w-full rounded-xl object-contain shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
        />
        {photos.length > 1 ? (
          <>
            <NavButton side="left" onClick={() => move(-1)} />
            <NavButton side="right" onClick={() => move(1)} />
          </>
        ) : null}
      </div>

      <div className="px-4 pt-4 pb-3 text-center sm:px-6" onClick={(event) => event.stopPropagation()}>
        {place ? (
          <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
            {place}
            {taken ? ` · ${taken}` : ""}
          </p>
        ) : null}
        <p className="mt-1 font-display text-xl text-white">{photo.title}</p>
        {photo.caption ? <p className="mx-auto mt-1 max-w-2xl text-sm text-white/70">{photo.caption}</p> : null}

        {photos.length > 1 ? (
          <div className="mx-auto mt-4 flex max-w-3xl justify-center gap-2 overflow-x-auto pb-1">
            {photos.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-label={`Show photo ${itemIndex + 1}`}
                aria-current={itemIndex == index}
                className={`h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  itemIndex == index ? "border-gold-500" : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={side == "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-gold-500 hover:text-navy-950 sm:grid ${
        side == "left" ? "left-4" : "right-4"
      }`}
    >
      {side == "left" ? "‹" : "›"}
    </button>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
