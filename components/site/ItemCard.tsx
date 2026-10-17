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
          <span className="absolute inset-0 bg-linear-to-t from-navy-950/55 via-navy-950/0 to-transparent transition duration-500 group-hover:from-navy-950/35" />
          {/* division colour accent along the top of the photo */}
          <span className="absolute inset-x-0 top-0 h-1" style={{ background: color }} aria-hidden="true" />
          {badge ? (
            <span className="badge absolute top-4 left-4 bg-gold-500 px-3 py-1 font-semibold text-navy-950 shadow-md">{badge}</span>
          ) : null}
          {eyebrow ? (
            <span className="badge absolute bottom-4 left-4 bg-white/90 px-3 py-1 font-semibold text-navy-900 shadow-sm backdrop-blur">
              {eyebrow}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-lg leading-snug font-bold tracking-tight text-navy-950 transition group-hover:text-gold-600">{title}</h3>
          {detailList.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {detailList.map((detail, index) => (
                <span key={index} className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {detail}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            {price ? (
              <p className="text-base font-extrabold tracking-tight whitespace-nowrap text-navy-950">{price}</p>
            ) : (
              <span />
            )}
            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-navy-800" title={action}>
              <span className="sr-only">{action}</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-950 text-gold-400 transition duration-300 group-hover:rotate-45 group-hover:bg-gold-500 group-hover:text-navy-950">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
