"use client";

import { Toaster } from "react-hot-toast";

// Pop-up messages for every page ("Added to cart", "Request sent" ...).
// Call toast.success("...") / toast.error("...") from react-hot-toast anywhere
// in a client component. Shown at the top, below the sticky header.
export default function Toasts() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ top: 104 }}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#0b1530",
          color: "#ffffff",
          borderRadius: "999px",
          padding: "10px 18px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 18px 40px -18px rgba(6, 11, 26, 0.75)",
        },
        success: { iconTheme: { primary: "#d4a64a", secondary: "#0b1530" } },
        error: { duration: 5000, iconTheme: { primary: "#ef4444", secondary: "#ffffff" } },
      }}
    />
  );
}
