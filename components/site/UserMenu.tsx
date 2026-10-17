"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoutButton } from "@/components/forms/AuthForms";
import Avatar from "@/components/site/Avatar";
import OnlineBadge from "@/components/site/OnlineBadge";

// Signed-in person in the header: photo + first name, and a menu with
// account links and "Sign out"
export default function UserMenu({
  firstName,
  lastName,
  email,
  photoUrl,
  accountLink,
}: {
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string | null;
  accountLink: { href: string; label: string };
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // close when clicking elsewhere or pressing Escape
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

  const isCustomer = accountLink.href == "/account";
  const itemClass = "block rounded-lg px-3 py-2 text-sm text-navy-900 hover:bg-navy-50";

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pr-3 pl-1 text-sm font-medium text-white transition hover:border-gold-500/50"
      >
        <Avatar firstName={firstName} lastName={lastName} photoUrl={photoUrl} size={36} online />
        <span className="hidden min-w-0 text-left leading-tight sm:block">
          <span className="block max-w-28 truncate">{firstName}</span>
          <span className="block text-[10px] font-semibold text-emerald-400">Online</span>
        </span>
        <svg viewBox="0 0 24 24" className={`h-4 w-4 text-white/60 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div role="menu" className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_48px_-16px_rgba(6,11,26,0.5)]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-3 pt-2 pb-3">
            <Avatar firstName={firstName} lastName={lastName} photoUrl={photoUrl} size={56} online />
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy-950">{firstName} {lastName}</p>
              <p className="truncate text-xs text-slate-500">{email}</p>
              <OnlineBadge />
            </div>
          </div>
          <div className="py-1" onClick={() => setOpen(false)}>
            <Link href={accountLink.href} role="menuitem" className={itemClass}>{accountLink.label}</Link>
            {isCustomer ? (
              <>
                <Link href="/account/enquiries" role="menuitem" className={itemClass}>My enquiries</Link>
                <Link href="/account/settings" role="menuitem" className={itemClass}>Profile & photo</Link>
                <Link href="/guide" role="menuitem" className={itemClass}>User guide</Link>
              </>
            ) : null}
          </div>
          <div className="border-t border-slate-100 pt-1">
            <LogoutButton className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
