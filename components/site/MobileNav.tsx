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
        className="rounded-xl border border-slate-200 p-2 text-navy-900 shadow-[0_3px_0_#dbe3ee] hover:bg-navy-50"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-4 pb-6 shadow-2xl">
          <nav className="grid grid-cols-2 gap-1 py-3">
            {[...links, accountLink].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-medium text-navy-900 hover:bg-navy-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact" onClick={() => setOpen(false)} className="btn-gold w-full">
            Send Enquiry
          </Link>
        </div>
      )}
    </div>
  );
}
