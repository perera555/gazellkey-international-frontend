"use client";

import Link from "next/link";
import { useState } from "react";

type NavLink = { href: string; label: string };

export default function MobileNav({
  links,
  accountLink,
}: {
  links: NavLink[];
  accountLink: NavLink;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-lg border border-white/15 p-2 text-white hover:border-gold-500/60 hover:text-gold-400"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-white/10 bg-navy-950/98 px-4 pb-6 shadow-2xl backdrop-blur-xl">
          <nav className="grid grid-cols-2 gap-1 py-3">
            {[...links, accountLink].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-medium text-white/85 hover:bg-white/5 hover:text-gold-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/appointments" onClick={() => setOpen(false)} className="btn-glass w-full">
              Book Appointment
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="btn-gold w-full">
              Send Enquiry
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
