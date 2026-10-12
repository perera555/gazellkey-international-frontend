import Link from "next/link";
import { LogoMark } from "@/components/site/Logo";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="grid-floor opacity-60" aria-hidden="true" />
      <div className="container-page relative grid place-items-center py-24 text-center">
        <div>
          <LogoMark light className="mx-auto h-24 w-24 animate-float" />
          <p className="text-3d mt-6 font-display text-8xl font-bold text-gold-400">404</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">Page not found</h1>
          <p className="mt-3 text-white/75">
            This page does not exist, or the listing is no longer available.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="btn-gold">Go home</Link>
            <Link href="/contact" className="btn-glass">Send an enquiry</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
