import Image from "next/image";
import Link from "next/link";
import Tilt from "@/components/site/Tilt";

// Photo with a caption, used for destinations and trade categories
export default function PhotoTile({
  href,
  image,
  title,
  text,
  tall = false,
}: {
  href: string;
  image: string;
  title: string;
  text?: string;
  tall?: boolean;
}) {
  return (
    <Tilt className="rounded-2xl">
      <Link
        href={href}
        className={`group relative block overflow-hidden rounded-2xl border border-slate-200/60 shadow-[0_20px_40px_-28px_rgba(6,11,26,0.7)] ${tall ? "aspect-3/4" : "aspect-4/3"}`}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <span className="absolute inset-0 bg-linear-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 p-5 text-white">
          <span className="block text-lg font-semibold tracking-tight">{title}</span>
          {text ? <span className="mt-0.5 block text-sm text-white/75">{text}</span> : null}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gold-400 transition group-hover:gap-2">
            Explore →
          </span>
        </span>
      </Link>
    </Tilt>
  );
}
