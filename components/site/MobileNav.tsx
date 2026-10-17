"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isActive, NavDivision, NavIcon, NavLink } from "@/components/site/NavBar";

export default function MobileNav({
  links,
  divisions,
  accountLink,
}: {
  links: NavLink[];
  divisions: NavDivision[];
  accountLink: NavLink;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close on navigation; stop the page scrolling behind the open menu
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold-500/60 hover:text-gold-400"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
        </svg>
      </button>

      {open && (
        <div className="dropdown-in absolute inset-x-0 top-full h-[calc(100dvh-6rem)] overflow-y-auto border-t border-white/10 bg-navy-950 px-4 pt-4 pb-10 sm:px-6">
          <nav aria-label="Main" className="grid gap-1">
            {[...links, accountLink].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition ${
                  isActive(pathname, link.href) ? "bg-white/10 text-gold-400" : "text-white/85 hover:bg-white/5"
                }`}
              >
                {link.label}
                <span aria-hidden="true" className="text-white/30">→</span>
              </Link>
            ))}
          </nav>

          <p className="eyebrow mt-8 px-4">Divisions</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {divisions.map((division) => (
              <Link
                key={division.href}
                href={division.href}
                className={`flex flex-col gap-3 rounded-2xl border p-4 transition ${
                  isActive(pathname, division.href) ? "border-gold-500/50 bg-white/10" : "border-white/10 bg-white/3 hover:bg-white/5"
                }`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: division.color }}>
                  <NavIcon name={division.icon} />
                </span>
                <span className="text-sm font-semibold text-white">{division.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/appointments" className="btn-glass w-full">Book Appointment</Link>
            <Link href="/contact" className="btn-gold w-full">Send Enquiry</Link>
          </div>
          <Link href="/guide" className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-gold-400">
            <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full border border-current text-[11px] font-bold">?</span>
            User guide - how to use this website
          </Link>
        </div>
      )}
    </div>
  );
}
