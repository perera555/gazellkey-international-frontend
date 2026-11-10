"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api-client";

// My account > Membership, for customers who did not join when they registered
export default function JoinMembershipButton() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function join() {
    setSending(true);
    setError("");
    const result = await apiRequest("POST", "/api/me/membership");
    setSending(false);
    if (!result.ok) {
      setError(result.data.message ?? "Could not join. Please try again.");
      return;
    }
    toast.success("Welcome! Your membership card is ready.");
    router.refresh();
  }

  return (
    <>
      <button type="button" onClick={join} disabled={sending} className="btn-gold mt-5">
        {sending ? "Joining..." : "Become a member - free"}
      </button>
      {error ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
