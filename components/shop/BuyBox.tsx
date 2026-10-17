"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/shop/useCart";
import { addToCart, CartItem, cartKey, clampQuantity } from "@/lib/cart";
import { formatMoney } from "@/lib/format";

// Quantity stepper with "Add to cart" and "Buy now" (adds, then opens the cart)
export default function BuyBox({ item }: { item: Omit<CartItem, "quantity"> }) {
  const router = useRouter();
  const cart = useCart();
  const inCart = cart.find((each) => cartKey(each) == cartKey(item));
  const [quantity, setQuantity] = useState(item.min);
  const [added, setAdded] = useState(false);
  const atMax = item.max != null && quantity >= item.max;

  function step(change: number) {
    setQuantity((value) => clampQuantity(item, value + change));
  }

  function add() {
    addToCart({ ...item, quantity: quantity });
    setAdded(true);
  }

  function buyNow() {
    if (!inCart) {
      addToCart({ ...item, quantity: quantity });
    }
    router.push("/cart");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">Quantity</span>
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={quantity <= item.min}
            aria-label="One less"
            className="grid h-11 w-11 place-items-center rounded-full text-lg text-navy-900 transition hover:bg-navy-50 disabled:opacity-30"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            min={item.min}
            max={item.max ?? undefined}
            onChange={(event) => setQuantity(clampQuantity(item, Number(event.target.value) || item.min))}
            aria-label="Quantity"
            className="w-12 [appearance:textfield] bg-transparent text-center font-semibold text-navy-950 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atMax}
            aria-label="One more"
            className="grid h-11 w-11 place-items-center rounded-full text-lg text-navy-900 transition hover:bg-navy-50 disabled:opacity-30"
          >
            +
          </button>
        </div>
        {quantity > 1 ? (
          <span className="text-sm text-slate-500">= {formatMoney(Number(item.unitPrice) * quantity, item.currency)}</span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={add} className="btn-outline py-3.5">
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
            <circle cx="10" cy="20.5" r="1" />
            <circle cx="17" cy="20.5" r="1" />
          </svg>
          Add to cart
        </button>
        <button type="button" onClick={buyNow} className="btn-gold py-3.5">
          Buy now
        </button>
      </div>

      {added || inCart ? (
        <p role="status" className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          <span>{inCart ? `${inCart.quantity} in your cart` : "Added to your cart"}</span>
          <Link href="/cart" className="font-semibold underline underline-offset-2">
            View cart
          </Link>
        </p>
      ) : null}
    </div>
  );
}
