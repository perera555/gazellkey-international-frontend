"use client";

import { useEffect } from "react";
import { apiRequest } from "@/lib/api-client";

// After "back" on Stripe's payment page: tells the backend to release the
// items that were held for that payment, so the customer can try again now
export default function ReleaseCheckout({ checkout }: { checkout: string }) {
  useEffect(() => {
    // background clean-up: no error pop-up if it fails
    apiRequest("DELETE", `/api/shop/checkout?checkout=${encodeURIComponent(checkout)}`, undefined, { quiet: true });
  }, [checkout]);
  return null;
}
