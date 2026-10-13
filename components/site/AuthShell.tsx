import Image from "next/image";
import { ReactNode } from "react";
import { LogoMark } from "@/components/site/Logo";

// Sign-in / register layout: the form card floats over the beach photo
export default function AuthShell({
  title,
  text,
  wide = false,
  children,
}: {
  title: string;
  text: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="relative isolate grid min-h-[calc(100vh-7rem)] place-items-center overflow-hidden px-4 py-16">
      <Image src="/images/hero-beach.jpg" alt="" fill preload sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-navy-950/85 backdrop-blur-[2px]" />
      <div className="grid-floor -z-10" aria-hidden="true" />
      <div
        className={`w-full rounded-3xl border border-white/20 bg-white/90 p-6 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8 ${wide ? "max-w-lg" : "max-w-sm"}`}
      >
        <LogoMark light className="mx-auto -mt-16 mb-2 h-20 w-20 rounded-2xl border border-gold-500/40 bg-navy-950 p-2 shadow-xl" />
        <h1 className="heading-display text-center text-2xl">{title}</h1>
        <p className="mt-1 mb-6 text-center text-sm text-slate-600">{text}</p>
        {children}
      </div>
    </section>
  );
}
