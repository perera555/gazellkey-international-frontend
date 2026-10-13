import Link from "next/link";
import Tilt from "@/components/site/Tilt";

// One listing in a catalogue grid (tour, event, gem, vehicle, product):
// photo, name, details, price and a "View Details" button, on a 3D tilt card.
export default function ItemCard({
  href,
  color,
  image,
  fallbackImage,
  eyebrow,
  title,
  details,
  price,
  badge,
  action = "View Details",
}: {
  href: string;
  color: string;
  image?: string | null;
  fallbackImage?: string; // site photo when the listing has none
  eyebrow?: string;
  title: string;
  details?: (string | null | undefined)[];
  price?: string;
  badge?: string;
  action?: string;
}) {
  const detailList = (details ?? []).filter(Boolean) as string[];
  const photo = image || fallbackImage;
  return (
    <Tilt className="h-full rounded-2xl">
      <Link href={href} className="card group flex h-full flex-col overflow-hidden">
        <div
          className="relative aspect-8/5 w-full overflow-hidden bg-navy-50"
          style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${color} 35%, #0b1530), #060b1a)` }}
        >
          {photo ? (
            // Images are URLs from the catalogue on any host, so a plain <img>
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center p-6 text-center text-xl font-semibold text-white/90">
              {title}
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/30 to-transparent" />
          {badge ? (
            <span className="badge absolute top-3 left-3 bg-gold-500 font-semibold text-navy-950 shadow-md">{badge}</span>
          ) : null}
          {eyebrow ? (
            <span className="badge absolute bottom-3 left-3 bg-white/85 px-3 py-1 text-navy-900 shadow-sm backdrop-blur">
              {eyebrow}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold tracking-tight text-navy-950 transition group-hover:text-gold-500">{title}</h3>
          {detailList.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {detailList.map((detail, index) => (
                <span key={index}className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600">
                  {detail}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            {price ? <p className="font-bold text-navy-950">{price}</p> : <span />}
            <span className="inline-flex items-center gap-1 text-sm font-medium text-gold-500 transition group-hover:gap-1.5">
              {action}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
