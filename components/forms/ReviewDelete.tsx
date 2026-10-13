"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

// Customer deletes their own review (DELETE /api/reviews/{id})
export default function ReviewDelete({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm("Delete this review? This cannot be undone.")) {
      return;
    }
    setBusy(true);
    setError("");
    const result = await apiRequest("DELETE", `/api/reviews/${reviewId}`);
    setBusy(false);
    if (!result.ok) {
      setError(result.data.message ?? "Could not delete the review.");
      return;
    }
    router.refresh();
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={remove} disabled={busy} className="btn-danger btn-sm">
        {busy ? "Deleting..." : "Delete"}
      </button>
      {error ? <span role="alert" className="text-xs text-red-700">{error}</span> : null}
    </span>
  );
}
