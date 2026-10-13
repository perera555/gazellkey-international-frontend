import { ReactNode } from "react";
import Tilt from "@/components/site/Tilt";

// Two-column layout of every catalogue detail page:
// gallery + description on the left, facts + enquiry box on the right.
export default function DetailLayout({
  title,
  images,
  fallbackImage,
  main,
  aside,
}: {
  color?: string;
  title: string;
  images: string[];
  fallbackImage: string; // site photo when the listing has none
  main: ReactNode;
  aside: ReactNode;
}) {
  return (
    <div className="bg-[#f8f9fb]">
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-8">
          <Gallery title={title} images={images.length > 0 ? images : [fallbackImage]} />
          <div className="card space-y-8 p-6 sm:p-8">{main}</div>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-36 lg:self-start">{aside}</aside>
      </div>
    </div>
  );
}

function Gallery({ title, images }: { title: string; images: string[] }) {
  return (
    <div className="space-y-4">
      <Tilt max={4} className="rounded-3xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_30px_60px_-30px_rgba(6,11,26,0.5)]">
          {/* Images are URLs from the catalogue on any host, so a plain <img> */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={title} className="aspect-video w-full object-cover" />
        </div>
      </Tilt>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(1, 5).map((image, index) => (
            <a
              key={image}
              href={image}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-xl border border-slate-200 transition hover:-translate-y-1 hover:border-gold-500/60 hover:shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={`${title} photo ${index + 2}`} className="aspect-square w-full object-cover" />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// Label / value list, e.g. "Year 2021", "Mileage 40,000 km". Empty values are skipped.
export function FactList({ facts }: { facts: [string, string | number | null | undefined][] }) {
  const shown = facts.filter(([, value]) => value != null && value !== "");
  if (shown.length == 0) {
    return null;
  }
  return (
    <dl className="divide-y divide-slate-100 text-sm">
      {shown.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 py-2.5">
          <dt className="text-slate-500">{label}</dt>
          <dd className="text-right font-medium text-navy-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// "Specifications" JSON object -> fact rows
export function specFacts(specs: Record<string, unknown> | null): [string, string][] {
  if (specs == null || typeof specs != "object" || Array.isArray(specs)) {
    return [];
  }
  return Object.entries(specs).map(([key, value]) => [key, String(value)]);
}
