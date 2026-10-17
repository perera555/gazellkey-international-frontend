"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_CART, readCart, subscribeCart } from "@/lib/cart";

// The cart in a client component; re-renders when it changes (also in other tabs).
// The server render and the first browser render show an empty cart.
export function useCart() {
  return useSyncExternalStore(subscribeCart, readCart, () => EMPTY_CART);
}
