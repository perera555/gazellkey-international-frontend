"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/shop/useCart";
import { addToCart, CartItem, cartKey, clampQuantity } from "@/lib/cart";
import { formatMoney } from "@/lib/format";

// "Add to cart" box on the detail page of a fixed-price item
export default function AddToCart({ item }: { item: Omit<CartItem, "quantity"> }) {
  const cart = useCart();
  const inCart = cart.find((each) => cartKey(each) == cartKey(item));
  const single = item.max == 1 && item.min <= 1; // one-off piece, e.g. a gem
  const [quantity, setQuantity] = useState(String(item.min));
  const [added, setAdded] = useState(false);

  const value = clampQuantity(item, Number(quantity) || item.min);
  const full = single && inCart != null;

  function add() {
    addToCart({ ...item, quantity: value });
    setQuantity(String(item.min));
    setAdded(true);
  }

  return (
    <div className="space-y-3">
      {!single ? (
        <div>
          <label className="label" htmlFor={`qty-${item.itemId}`}>
            Quantity ({item.unit})
          </label>
          <input
            id={`qty-${item.itemId}`}
            type="number"
            inputMode={item.wholeNumbers ? "numeric" : "decimal"}
            min={item.min}
            max={item.max ?? undefined}
            step={item.wholeNumbers ? 1 : "any"}
            className="input"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            onBlur={() => setQuantity(String(value))}
          />
          <p className="mt-1 text-xs text-slate-500">
            {item.min > 1 ? `Minimum order ${item.min} ${item.unit}. ` : ""}
            {item.max != null ? `${item.max} ${item.unit} available. ` : ""}
            Total {formatMoney(Number(item.unitPrice) * value, item.currency)}
          </p>
        </div>
      ) : null}

      <button type="button" onClick={add} disabled={full} className="btn-gold w-full">
        {full ? "In your cart" : "Add to cart"}
      </button>

      {added || inCart ? (
        <p role="status" className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <span>
            {inCart && !single ? `${inCart.quantity} ${item.unit} in your cart` : "Added to your cart"}
          </span>
          <Link href="/cart" className="font-semibold underline">
            View cart
          </Link>
        </p>
      ) : null}
      <p className="text-xs text-slate-500">Pay online by card (Sri Lankan or foreign) or by bank transfer.</p>
    </div>
  );
}
