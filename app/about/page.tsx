import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import PhotoTile from "@/components/site/PhotoTile";
import { LogoMark } from "@/components/site/Logo";
import { apiGet } from "@/lib/api";
import { DIVISION_LIST } from "@/lib/divisions";
import { DIVISION_IMAGES } from "@/lib/media";

export const metadata: Metadata = { title: "About us" };

type ContentBlock = { title: string; body: { paragraphs?: string[]; text?: string } | null };

const DEFAULT_PARAGRAPHS = [
  "Gazellekey International (Pvt) Ltd is a Sri Lankan company that brings six businesses together under one trusted name: travel services, event management, gems and jewellery, vehicles and machinery, import and export.",
  "Whatever you need, you deal with one team. Send us an enquiry and the right specialist will reply with options, a clear quotation and support until the job is done.",
];

export default async function AboutPage() {
  // Editable by staff as content key "about.page"
  const content = await apiGet<ContentBlock>("/api/content/about.page");
  const body = content.ok ? content.data.body : null;
  const paragraphs =
    body?.paragraphs ?? (typeof body?.text == "string" ? body.text.split(/\n\s*\n/) : DEFAULT_PARAGRAPHS);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={content.ok ? content.data.title : "About Gazellekey"}
        text="One platform. Six business divisions. Global opportunities."
        image="/images/travel-sigiriya.jpg"
      />

      <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5 text-lg leading-8 text-slate-700">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <Link href="/contact" className="btn-gold mt-4">Talk to us</Link>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-6 overflow-hidden rounded-4xl border-4 border-white shadow-[0_40px_80px_-40px_rgba(11,37,69,0.7)] transform-[perspective(900px)_rotateY(-10deg)_rotateX(4deg)]">
            <Image src="/images/travel-ella.jpg" alt="Nine Arch Bridge, Ella, Sri Lanka" fill sizes="(min-width: 1024px) 28rem, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-2 -left-2 grid h-32 w-32 animate-float place-items-center rounded-3xl bg-white shadow-[0_30px_50px_-20px_rgba(11,37,69,0.55)]">
            <LogoMark className="h-24 w-24" />
          </div>
        </div>
      </section>

      <section className="bg-navy-50 py-20">
        <div className="container-page">
          <h2 className="heading-display text-3xl sm:text-4xl">Our divisions</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DIVISION_LIST.map((division) => (
              <PhotoTile
                key={division.key}
                href={division.href}
                image={DIVISION_IMAGES[division.key]}
                title={division.name}
                text={division.tagline}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
