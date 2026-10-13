import Image from "next/image";
import { HOME_HERO_IMAGE } from "@/lib/media";

// Photo banner for pages outside the divisions (about, contact ...)
export default function PageHero({
  eyebrow,
  title,
  text,
  image = HOME_HERO_IMAGE,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <Image src={image} alt="" fill preload sizes="100vw" className="-z-20 animate-hero-zoom object-cover" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-950/80 to-navy-950/50" />
      <div className="grid-floor -z-10 opacity-60" aria-hidden="true" />
      <div className="container-page py-16 sm:py-24">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="text-3d mt-4 max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {text ? <p className="mt-4 max-w-2xl text-lg text-white/70">{text}</p> : null}
      </div>
    </section>
  );
}
