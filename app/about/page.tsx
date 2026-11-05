import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LeadershipSection from "@/components/site/LeadershipSection";
import PageHero from "@/components/site/PageHero";
import PhotoTile from "@/components/site/PhotoTile";
import { LogoMark } from "@/components/site/Logo";
import { apiGet } from "@/lib/api";
import { DIVISION_LIST } from "@/lib/divisions";
import { DIVISION_IMAGES } from "@/lib/media";
import { getDictionary } from "@/lib/i18n-server";
import { PAGE_WORDS } from "@/lib/i18n-pages";

export const metadata: Metadata = { title: "About us" };

type ContentBlock = { title: string; body: { paragraphs?: string[]; text?: string } | null };

const DEFAULT_PARAGRAPHS = [
  "Gazellekey International (Pvt) Ltd is a Sri Lankan company that brings six businesses together under one trusted name: travel services, event management, gems and jewellery, vehicles and machinery, import and export.",
  "Whatever you need, you deal with one team. Send us an enquiry and the right specialist will reply with options, a clear quotation and support until the job is done.",
];

export default async function AboutPage() {
  // Editable by staff as content key "about.page"
  const [content, { lang }] = await Promise.all([apiGet<ContentBlock>("/api/content/about.page"), getDictionary()]);
  const w = PAGE_WORDS[lang];
  // staff can edit the English text in the admin; other languages use ours
  const body = lang == "en" && content.ok ? content.data.body : null;
  const paragraphs =
    body?.paragraphs ?? (typeof body?.text == "string" ? body.text.split(/\n\s*\n/) : lang == "en" ? DEFAULT_PARAGRAPHS : w.about.paragraphs);

  return (
    <>
      <PageHero
        eyebrow={w.about.eyebrow}
        title={lang == "en" && content.ok ? content.data.title : w.about.title}
        text={w.about.text}
        image="/images/travel-sigiriya.jpg"
      />

      <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5 text-lg leading-8 text-slate-700">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <Link href="/contact" className="btn-gold mt-4">{w.about.talkToUs}</Link>
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
          <h2 className="heading-display text-3xl sm:text-4xl">{w.about.divisions}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DIVISION_LIST.map((division) => (
              <PhotoTile
                key={division.key}
                href={division.href}
                image={DIVISION_IMAGES[division.key]}
                title={w.divisionNames[division.key]}
                text={division.tagline}
              />
            ))}
          </div>
        </div>
      </section>

      <LeadershipSection variant="about" />
    </>
  );
}
