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
  const detailText = (details ?? []).filter(Boolean).join(" · ");
  const photo = image || fallbackImage;
  return (
    <Tilt className="h-full rounded-2xl">
      <Link href={href} className="card group flex h-full flex-col overflow-hidden">
        <div
          className="relative aspect-4/3 w-full overflow-hidden bg-navy-50"
          style={{ background: `linear-gradient(135deg, ${color}, #0b2545)` }}
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
            <span className="absolute inset-0 grid place-items-center p-6 text-center font-display text-2xl text-white/90">
              {title}
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/35 to-transparent" />
          {badge ? (
            <span className="badge absolute top-3 left-3 bg-white/95 text-navy-900 shadow-md">{badge}</span>
          ) : null}
          {eyebrow ? (
            <span
              className="badge absolute bottom-3 left-3 text-white shadow-md"
              style={{ background: color }}
            >
              {eyebrow}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-semibold text-navy-900">{title}</h3>
          {detailText ? <p className="mt-1 text-sm text-slate-500">{detailText}</p> : null}
          {price ? <p className="mt-3 text-xl font-bold text-navy-900">{price}</p> : null}
          <div className="mt-auto pt-4">
            <span className="btn-gold w-full">{action}</span>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
