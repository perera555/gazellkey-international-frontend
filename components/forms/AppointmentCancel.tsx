"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

// Customer cancels their own upcoming appointment
// (POST /api/appointments/{id}/cancel)
export default function AppointmentCancel({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function cancel() {
    setBusy(true);
    setError("");
    const result = await apiRequest("POST", `/api/appointments/${appointmentId}/cancel`, {
      reason: reason.trim() || undefined,
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.data.message ?? "Could not cancel the appointment.");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-danger btn-sm">
        Cancel
      </button>
    );
  }

  return (
    <div className="w-full space-y-3 rounded-xl border border-red-200 bg-red-50/60 p-4">
      <label className="label" htmlFor={`reason-${appointmentId}`}>
        Cancel this appointment? Tell us why (optional)
      </label>
      <textarea
        id={`reason-${appointmentId}`}
        rows={2}
        maxLength={1000}
        className="input"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />
      {error ? (
        <p role="alert" className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={cancel} disabled={busy} className="btn-danger btn-sm">
          {busy ? "Cancelling..." : "Yes, cancel it"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-outline btn-sm">
          Keep it
        </button>
      </div>
    </div>
  );
}
