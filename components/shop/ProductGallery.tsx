"use client";

import { useState } from "react";

// Big photo with thumbnails underneath; clicking a thumbnail shows it
export default function ProductGallery({ title, images }: { title: string; images: string[] }) {
  const [index, setIndex] = useState(0);
  const shown = images[index] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        {/* Catalogue images are URLs on any host, so a plain <img> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={shown} src={shown} alt={title} className="aspect-square w-full object-cover" />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2.5">
          {images.slice(0, 10).map((image, position) => (
            <button
              key={image}
              type="button"
              onClick={() => setIndex(position)}
              aria-label={`Show photo ${position + 1}`}
              aria-pressed={position == index}
              className={`overflow-hidden rounded-xl border-2 bg-white transition ${
                position == index ? "border-gold-500 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
