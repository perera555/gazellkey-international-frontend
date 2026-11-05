import Link from "next/link";
import { ADMIN_URL, getSessionUser, isStaff } from "@/lib/session";
import { DIVISION_LIST } from "@/lib/divisions";
import { Division } from "@/lib/types";
import MobileNav from "@/components/site/MobileNav";
import NavBar, { NavDivision, NavJobCountry } from "@/components/site/NavBar";
import { apiGet } from "@/lib/api";
import { JobVacancy } from "@/lib/jobs";
import Logo from "@/components/site/Logo";
import UserMenu from "@/components/site/UserMenu";
import CartLink from "@/components/shop/CartLink";
import LanguageMenu from "@/components/site/LanguageMenu";
import { getDictionary } from "@/lib/i18n-server";
import { NAV_WORDS } from "@/lib/i18n-nav";

const DIVISION_ICONS: Record<Division, string> = {
  TRAVEL: "flight",
  EVENTS: "event",
  GEMS: "gem",
  VEHICLES: "vehicle",
  IMPORT: "trade",
  EXPORT: "trade",
};

export default async function Header() {
  const [user, jobs, { lang }] = await Promise.all([
    getSessionUser(),
    apiGet<JobVacancy[]>("/api/jobs/vacancies?view=public&pageSize=100"),
    getDictionary(),
  ]);
  const w = NAV_WORDS[lang];

  // "Work visa" menu: open jobs grouped by country
  const jobCountries: NavJobCountry[] = [];
  for (const job of jobs.ok ? jobs.data : []) {
    let entry = jobCountries.find((each) => each.country == job.country);
    if (entry == null) {
      entry = { country: job.country, region: job.region, jobs: [] };
      jobCountries.push(entry);
    }
    entry.jobs.push({ title: job.title, slug: job.slug });
  }
  jobCountries.sort((a, b) => a.region.localeCompare(b.region) || a.country.localeCompare(b.country));
  const accountLink = user
    ? isStaff(user)
      ? { href: ADMIN_URL, label: w.staffPortal }
      : { href: "/account", label: w.myAccount }
    : { href: "/login", label: w.signIn };

  const before = [
    { href: "/", label: w.home },
    { href: "/about", label: w.about },
  ];
  const after = [
    { href: "/shop", label: w.shop },
    { href: "/rentals", label: w.rentals },
    { href: "/gallery", label: w.gallery, wideOnly: true },
    { href: "/reviews", label: w.reviews, wideOnly: true },
    { href: "/contact", label: w.contact },
  ];
  const divisions: NavDivision[] = DIVISION_LIST.map((division) => ({
    href: division.href,
    label: division.short,
    name: division.name,
    tagline: division.tagline,
    color: division.color,
    icon: DIVISION_ICONS[division.key],
  }));

  return (
    <>
      {/* Visitor notice: scrolls away; only the main bar below stays on screen */}
      {user == null ? (
        <p className="bg-linear-to-r from-gold-600 via-gold-500 to-gold-600 px-4 py-2 text-center text-xs font-medium text-navy-950 print:hidden">
          {w.visitorNotice}{" "}
          <Link href="/login" className="font-semibold underline underline-offset-2">{w.signIn}</Link> {w.or}{" "}
          <Link href="/register" className="font-semibold underline underline-offset-2">{w.register}</Link>{w.first ? ` ${w.first}` : "."}
        </p>
      ) : null}

      {/* data-compact: NavBar measures whether the full menu bar fits between the
          logo and the buttons; when it does not, the ☰ menu is used instead.
          Longer words (Sinhala, Tamil, Spanish) start compact until measured. */}
      <header
        data-compact={lang == "en" ? "false" : "true"}
        className="group/header sticky top-0 z-40 border-b border-white/10 print:hidden bg-navy-950/85 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl backdrop-saturate-150">
        <div className="container-wide flex h-20 items-center gap-4 lg:h-24 xl:gap-6">
          {/* Logo on the far left, with room to breathe */}
          <Link href="/" aria-label="Gazellekey home" className="mr-auto shrink-0 py-2 pr-2">
            <Logo light />
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center xl:flex group-data-[compact=true]/header:pointer-events-none group-data-[compact=true]/header:invisible group-data-[compact=true]/header:absolute">
            <NavBar before={before} after={after} divisions={divisions} jobCountries={jobCountries} words={w} />
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:gap-2.5">
            {/* Book an appointment: main call to action on wide screens
                (smaller screens: Divisions menu and the phone menu) */}
            <Link href="/appointments" className="btn-gold-outline btn-sm hidden px-4 py-2.5 whitespace-nowrap min-[2200px]:inline-flex">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
              </svg>
              {w.bookAppointment}
            </Link>
            {/* Staff portal (admin): a gold button for signed-in staff,
                a quiet lock button for everyone else */}
            {user && isStaff(user) ? (
              <a href={ADMIN_URL} className="btn-gold btn-sm hidden px-4 py-2.5 sm:inline-flex">
                {w.staffPortal} →
              </a>
            ) : (
              <a
                href={ADMIN_URL}
                aria-label={w.staffPortal}
                title={w.staffPortal}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-gold-500/60 hover:text-gold-400 sm:flex"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                
              </a>
            )}
            <div className="hidden sm:block">
              <LanguageMenu lang={lang} label={w.language} />
            </div>
            <Link
              href="/guide"
              aria-label={w.help}
              title={w.help}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-gold-500/60 hover:text-gold-400 sm:flex"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.9M12 17h.01" />
              </svg>
              
            </Link>
            {user == null || !isStaff(user) ? <CartLink /> : null}
            {user ? (
              <UserMenu
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                photoUrl={user.photoUrl}
                accountLink={accountLink}
              />
            ) : (
              // Browsing is open to everyone; an account is only needed to
              // book, enquire or register for events
              <>
                <Link href="/login" className="hidden rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap text-white/85 transition hover:text-gold-400 min-[1500px]:inline-flex">
                  {w.signIn}
                </Link>
                <Link href="/register" className="btn-gold btn-sm hidden px-5 py-2.5 whitespace-nowrap sm:inline-flex">{w.createAccount}</Link>
              </>
            )}
            <MobileNav
              hideClass="xl:hidden group-data-[compact=true]/header:block!"
              words={w}
              lang={lang}
              links={[
                ...before,
                { href: "/jobs", label: w.workVisa },
                ...after,
                { href: "/guide", label: w.help },
                ...(user == null ? [{ href: "/register", label: w.createAccount }] : []),
              ]} divisions={divisions} accountLink={accountLink} />
          </div>
        </div>
      </header>
    </>
  );
}
