import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { DivisionInfo } from "@/lib/divisions";
import { DIVISION_IMAGES } from "@/lib/media";

// Photo banner at the top of every division page
export default function DivisionHero({
  division,
  title,
  subtitle,
  breadcrumb,
  image,
  children,
}: {
  division: DivisionInfo;
  title?: string;
  subtitle?: string;
  breadcrumb?: { href: string; label: string };
  image?: string | null; // listing photo on detail pages; division photo otherwise
  children?: ReactNode; // e.g. a search panel under the title
}) {
  const photo = image || DIVISION_IMAGES[division.key];
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      {photo.startsWith("/") ? (
        <Image
          src={photo}
          alt=""
          fill
          preload
          sizes="100vw"
          className="-z-20 animate-hero-zoom object-cover"
        />
      ) : (
        // Catalogue photos can live on any host, so a plain <img>
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="absolute inset-0 -z-20 h-full w-full animate-hero-zoom object-cover" />
      )}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(90deg, rgb(6 11 26 / 0.95) 0%, rgb(6 11 26 / 0.8) 50%, rgb(6 11 26 / 0.5) 100%), radial-gradient(circle at 85% 100%, rgb(212 166 74 / 0.25), transparent 50%)`,
        }}
      />
      <div className="grid-floor -z-10 opacity-60" aria-hidden="true" />

      <div className={`container-page relative ${breadcrumb ? "py-14 sm:py-16" : "py-16 sm:py-24"}`}>
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/55">
          <Link href="/" className="hover:text-gold-400">Home</Link>
          <span>/</span>
          {breadcrumb ? (
            <>
              <Link href={breadcrumb.href} className="hover:text-gold-400">{breadcrumb.label}</Link>
              <span>/</span>
            </>
          ) : null}
          <span className="line-clamp-1 text-white/85">{title ?? division.name}</span>
        </div>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          {division.name}
        </span>
        <h1 className="text-3d mt-5 max-w-3xl text-4xl leading-[1.1] font-extrabold sm:text-6xl">
          {title ?? division.name}
        </h1>
        <span className="mt-5 block h-1 w-16 rounded-full bg-linear-to-r from-gold-400 to-gold-600" aria-hidden="true" />
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{subtitle ?? division.tagline}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
      {/* soft fade into the page below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/25 to-transparent" aria-hidden="true" />
    </section>
  );
}
