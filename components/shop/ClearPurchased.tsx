"use client";

import { useEffect } from "react";
import { removeFromCart } from "@/lib/cart";

// After a successful payment, the bought items leave the cart
// (items in another currency, not paid yet, stay)
export default function ClearPurchased({ keys }: { keys: string[] }) {
  const joined = keys.join(",");
  useEffect(() => {
    removeFromCart(joined.split(","));
  }, [joined]);
  return null;
}
