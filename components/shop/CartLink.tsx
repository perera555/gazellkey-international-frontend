"use client";

import Link from "next/link";
import { useCart } from "@/components/shop/useCart";

// Cart icon in the header with the number of items
export default function CartLink() {
  const count = useCart().length;
  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Cart, ${count} item${count == 1 ? "" : "s"}` : "Cart"}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold-500/60 hover:text-gold-400"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
        <circle cx="10" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
      </svg>
      {count > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-navy-950">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
