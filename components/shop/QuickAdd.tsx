"use client";

import { useState } from "react";
import { useCart } from "@/components/shop/useCart";
import { addToCart, CartItem, cartKey } from "@/lib/cart";

// Small "Add to cart" button on a shop card: adds the minimum quantity.
// The product page has the full quantity picker.
export default function QuickAdd({ item }: { item: Omit<CartItem, "quantity"> }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const inCart = cart.some((each) => cartKey(each) == cartKey(item));
  const full = item.max == 1 && inCart; // one-off piece already in the cart

  function add(event: React.MouseEvent) {
    // the card around it is a link to the product page
    event.preventDefault();
    event.stopPropagation();
    addToCart({ ...item, quantity: item.min });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={full}
      aria-label={full ? `${item.name} is in your cart` : `Add ${item.name} to cart`}
      className="relative z-10 inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-navy-950 px-4 text-xs font-semibold text-white transition hover:bg-gold-500 hover:text-navy-950 disabled:cursor-default disabled:bg-emerald-600 disabled:text-white"
    >
      {added || full ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
          <circle cx="10" cy="20.5" r="1" />
          <circle cx="17" cy="20.5" r="1" />
        </svg>
      )}
      <span>{full ? "In cart" : added ? "Added" : "Add"}</span>
    </button>
  );
}
