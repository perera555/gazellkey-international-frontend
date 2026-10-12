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
          background: `linear-gradient(90deg, rgb(7 26 48 / 0.92) 0%, rgb(7 26 48 / 0.7) 45%, rgb(7 26 48 / 0.25) 100%), radial-gradient(circle at 90% 110%, ${division.color}88, transparent 50%)`,
        }}
      />

      <div className={`container-page relative ${breadcrumb ? "py-14 sm:py-16" : "py-16 sm:py-24"}`}>
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          {breadcrumb ? (
            <>
              <Link href={breadcrumb.href} className="hover:text-white">{breadcrumb.label}</Link>
              <span>/</span>
            </>
          ) : null}
          <span className="line-clamp-1 text-white">{title ?? division.name}</span>
        </div>
        <span
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: division.color }} />
          {division.name}
        </span>
        <h1 className="text-3d mt-4 max-w-3xl font-display text-4xl leading-tight font-semibold sm:text-5xl">
          {title ?? division.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/85">{subtitle ?? division.tagline}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
