import Link from "next/link";
import { DIVISION_LIST } from "@/lib/divisions";
import { ADMIN_URL, getSessionUser } from "@/lib/session";
import Logo from "@/components/site/Logo";
import SocialIcon from "@/components/site/SocialIcon";
import { SOCIAL_LABELS, socialProfiles } from "@/lib/social";
import { getDictionary } from "@/lib/i18n-server";
import { PAGE_WORDS } from "@/lib/i18n-pages";

export default async function Footer() {
  const [user, { lang }] = await Promise.all([getSessionUser(), getDictionary()]);
  const profiles = socialProfiles();
  const w = PAGE_WORDS[lang].footer;
  const names = PAGE_WORDS[lang].divisionNames;

  return (
    <footer className="relative overflow-hidden print:hidden bg-linear-to-b from-navy-900 to-navy-950 text-white/65">
      {/* gold edge and a soft glow from the logo colours */}
      <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold-500/70 to-transparent" aria-hidden="true" />
      <span
        className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #fdb71a, #ee6523 60%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="container-page relative grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-6">
            {w.about}
          </p>
          <Link href="/contact" className="btn-gold-outline mt-6">{w.sendEnquiry}</Link>
          {profiles.length > 0 ? (
            <div className="mt-8">
              <h3 className="eyebrow">{w.followUs}</h3>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {profiles.map((profile) => (
                  <li key={profile.network}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Gazellekey on ${SOCIAL_LABELS[profile.network]}`}
                      title={SOCIAL_LABELS[profile.network]}
                      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500 hover:text-navy-950"
                    >
                      <SocialIcon network={profile.network} className="h-4.5 w-4.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div>
          <h3 className="eyebrow">{w.divisions}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {DIVISION_LIST.map((division) => (
              <li key={division.key}>
                <Link href={division.href} className="transition hover:text-gold-400">
                  {names[division.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">{w.company}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-gold-400">{w.aboutUs}</Link></li>
            <li><Link href="/contact" className="hover:text-gold-400">{w.contact}</Link></li>
            <li><Link href="/appointments" className="hover:text-gold-400">{w.bookAppointment}</Link></li>
            <li><Link href="/gallery" className="hover:text-gold-400">{w.gallery}</Link></li>
            <li><Link href="/reviews" className="hover:text-gold-400">{w.reviews}</Link></li>
            <li><Link href="/guide" className="hover:text-gold-400">{w.guide}</Link></li>
            {user ? (
              <li><Link href="/account" className="hover:text-gold-400">{w.myAccount}</Link></li>
            ) : (
              <>
                <li><Link href="/login" className="hover:text-gold-400">{w.signIn}</Link></li>
                <li><Link href="/register" className="hover:text-gold-400">{w.createAccount}</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/5">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Gazellekey International (Pvt) Ltd. {w.rights}</p>
          {/* Staff sign in to the separate admin portal */}
          <a href={ADMIN_URL} className="inline-flex items-center gap-1.5 hover:text-gold-400">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            {w.staffPortal}
          </a>
        </div>
      </div>
    </footer>
  );
}
