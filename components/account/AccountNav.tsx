"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/account", label: "Overview" },
  { href: "/account/enquiries", label: "Enquiries" },
  { href: "/account/quotations", label: "Quotations" },
  { href: "/account/orders", label: "Orders & bookings" },
  { href: "/account/payments", label: "Payments" },
  { href: "/account/travel", label: "Travel & events" },
  { href: "/account/documents", label: "Documents" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Account">
      {LINKS.map((link) => {
        const active = pathname == link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm whitespace-nowrap transition ${
              active
                ? "bg-navy-900 font-semibold text-white shadow-[0_3px_0_var(--color-navy-950),0_10px_18px_-10px_rgba(7,26,48,0.8)]"
                : "text-navy-800 hover:bg-white hover:shadow-[0_3px_0_#dbe3ee]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
