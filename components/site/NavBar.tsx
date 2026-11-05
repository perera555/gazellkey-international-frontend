"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { NavWords } from "@/lib/i18n-nav";

// wideOnly: shown in the desktop menu on wide screens only (always in the phone menu)
export type NavLink = { href: string; label: string; wideOnly?: boolean };
export type NavDivision = NavLink & { name: string; tagline: string; color: string; icon: string };
// Work visa menu: open jobs grouped by country
export type NavJobCountry = { country: string; region: string; jobs: { title: string; slug: string }[] };

const ICONS: Record<string, string> = {
  flight: "M2 16l20-6-2-3-7 2L7 3H5l3 7-4 1-2-2H1l1 4zM2 20h20",
  event: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M4 11h16",
  gem: "M6 3h12l3 6-9 12L3 9zM3 9h18M9 3l3 18 3-18",
  vehicle: "M3 16v-4l2-5h14l2 5v4zM3 16v3h3v-3M18 16v3h3v-3M7 13h.01M17 13h.01M5 12h14",
  trade: "M3 17h18l-2 4H5zM6 17V9h12v8M9 9V5h6v4",
};

export function NavIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name] ?? ICONS.trade} />
    </svg>
  );
}

export function isActive(pathname: string, href: string) {
  return href == "/" ? pathname == "/" : pathname == href || pathname.startsWith(`${href}/`);
}

const pill = (active: boolean) =>
  `rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition 2xl:px-4 ${
    active ? "bg-white/10 text-gold-400 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]" : "text-white/75 hover:bg-white/5 hover:text-white"
  }`;

// A menu button that opens a panel on hover or click
function Dropdown({
  label,
  href,
  active,
  width,
  children,
}: {
  label: string;
  href?: string; // when set, clicking the label opens this page
  active: boolean;
  width: string; // Tailwind width class of the panel
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLLIElement>(null);

  // close on route change, outside click or Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    function onClick(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key == "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li ref={box} className="relative" onMouseLeave={() => setOpen(false)}>
      {href ? (
        // the label opens the page; hovering (or the arrow) shows the panel
        <span className={`flex items-center ${pill(active || open)} p-0! pr-1!`} onMouseEnter={() => setOpen(true)}>
          <Link href={href} aria-current={active ? "page" : undefined} className="py-2 pl-3 2xl:pl-4">
            {label}
          </Link>
          <button type="button" aria-expanded={open} aria-haspopup="true" aria-label={`${label} menu`} onClick={() => setOpen(!open)} className="rounded-full p-1.5">
            <svg viewBox="0 0 24 24" className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </span>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setOpen(true)}
          className={`flex items-center gap-1.5 ${pill(active || open)}`}
        >
          {label}
          <svg viewBox="0 0 24 24" className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      )}
      {open ? (
        // pt-3 bridges the gap so the panel stays open while the pointer moves down
        <div className={`absolute top-full left-1/2 ${width} -translate-x-1/2 pt-3`}>
          <div className="dropdown-in overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_40px_80px_-24px_rgba(6,11,26,0.55)]">
            {children}
          </div>
        </div>
      ) : null}
    </li>
  );
}

// Desktop navigation: links in a glass pill, divisions and work visa jobs in dropdown panels
export default function NavBar({
  before,
  after,
  divisions,
  jobCountries,
  words,
}: {
  before: NavLink[]; // links before "Divisions"
  after: NavLink[]; // links after "Work visa"
  divisions: NavDivision[];
  jobCountries: NavJobCountry[]; // "Work visa" menu, right after Divisions
  words: NavWords;
}) {
  const pathname = usePathname();
  const divisionActive = divisions.some((division) => isActive(pathname, division.href));
  const navRef = useRef<HTMLElement>(null);

  // Does the full menu bar fit between the logo and the buttons? If not, the
  // header switches to the ☰ menu (data-compact, see Header). Measured on
  // every resize and language change, so any language and screen size fits.
  useEffect(() => {
    const nav = navRef.current;
    const slot = nav?.parentElement; // the menu's place in the header row
    const row = slot?.parentElement;
    const header = nav?.closest("header");
    if (!nav || !slot || !row || !header) return;
    function check() {
      const list = nav!.querySelector("ul");
      if (!list) return;
      const style = getComputedStyle(row!);
      const gap = parseFloat(style.columnGap) || 0;
      const shown = [...row!.children].filter((child) => child != slot && getComputedStyle(child).display != "none");
      const others = shown.reduce((sum, child) => sum + child.getBoundingClientRect().width, 0);
      // the ☰ button is only there while compact: leave it out, or the menu could never come back
      const toggle = row!.querySelector<HTMLElement>("[data-menu-toggle]");
      const toggleWidth = toggle && getComputedStyle(toggle).display != "none" ? toggle.getBoundingClientRect().width + 10 : 0;
      const room = row!.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - others + toggleWidth - gap * shown.length;
      header!.dataset.compact = list.scrollWidth + 8 > room ? "true" : "false";
    }
    check();
    const observer = new ResizeObserver(check);
    observer.observe(row);
    return () => observer.disconnect();
  }, [before, after, words]);

  const linkItem = (link: NavLink) => (
    <li key={link.href} className={link.wideOnly ? "hidden min-[1600px]:block" : undefined}>
      <Link href={link.href} aria-current={isActive(pathname, link.href) ? "page" : undefined} className={pill(isActive(pathname, link.href))}>
        {link.label}
      </Link>
    </li>
  );

  return (
    <nav ref={navRef} aria-label="Main">
      <ul className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/3 p-1.5 2xl:gap-2">
        {before.map(linkItem)}
        <Dropdown label={words.divisions} active={divisionActive} width="w-160">
                <ul className="grid grid-cols-2 gap-1 p-3">
                  {divisions.map((division) => (
                    <li key={division.href}>
                      <Link
                        href={division.href}
                        className={`group flex gap-3.5 rounded-2xl p-3.5 transition hover:bg-navy-50 ${
                          isActive(pathname, division.href) ? "bg-navy-50" : ""
                        }`}
                      >
                        <span
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white shadow-[0_10px_20px_-10px_currentColor] transition group-hover:scale-105"
                          style={{ background: division.color, color: division.color }}
                        >
                          <span className="text-white"><NavIcon name={division.icon} /></span>
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-navy-950">{division.name}</span>
                          <span className="mt-0.5 block text-xs leading-5 text-slate-500">{division.tagline}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-navy-50/60 px-6 py-4">
                  <p className="text-sm text-slate-600">{words.notSure}</p>
                  <div className="flex gap-2">
                    <Link href="/contact" className="btn-outline btn-sm">{words.sendEnquiry}</Link>
                    <Link href="/appointments" className="btn-navy btn-sm">{words.bookAppointment}</Link>
                  </div>
                </div>
        </Dropdown>
        <Dropdown label={words.workVisa} href="/jobs" active={isActive(pathname, "/jobs")} width="w-180">
          {jobCountries.length == 0 ? (
            <p className="p-6 text-sm text-slate-600">{words.jobsComingSoon}</p>
          ) : (
            <div className="grid max-h-[65vh] grid-cols-3 gap-1 overflow-y-auto p-3">
              {jobCountries.map((entry) => (
                <div key={entry.country} className="rounded-2xl p-3 hover:bg-navy-50/60">
                  <Link href={`/jobs?country=${encodeURIComponent(entry.country)}`} className="block text-sm font-semibold text-navy-950 hover:underline">
                    {entry.country}
                  </Link>
                  <p className="text-[11px] text-slate-400">{entry.region}</p>
                  <ul className="mt-2 space-y-1.5">
                    {entry.jobs.slice(0, 4).map((job) => (
                      <li key={job.slug} className="flex items-center justify-between gap-2">
                        <Link href={`/jobs/${job.slug}`} className="min-w-0 truncate text-xs text-slate-600 hover:text-navy-900 hover:underline">
                          {job.title}
                        </Link>
                        <Link href={`/jobs/${job.slug}#apply`} className="shrink-0 rounded-full bg-gold-500 px-2 py-0.5 text-[11px] font-semibold text-navy-950 hover:bg-gold-400">
                          {words.apply}
                        </Link>
                      </li>
                    ))}
                    {entry.jobs.length > 4 ? (
                      <li>
                        <Link href={`/jobs?country=${encodeURIComponent(entry.country)}`} className="text-xs font-medium text-navy-800 hover:underline">
                          + {entry.jobs.length - 4} {words.more}
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-navy-50/60 px-6 py-4">
            <p className="text-sm text-slate-600">{words.jobsMenuText}</p>
            <div className="flex gap-2">
              <Link href="/jobs#enquire" className="btn-outline btn-sm">{words.sendEnquiry}</Link>
              <Link href="/jobs" className="btn-navy btn-sm">{words.allJobs}</Link>
            </div>
          </div>
        </Dropdown>
        {after.map(linkItem)}
      </ul>
    </nav>
  );
}
