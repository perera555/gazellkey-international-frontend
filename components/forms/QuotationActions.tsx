"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

type Action = "ACCEPT" | "REJECT" | "REQUEST_CHANGES";

const CONFIRM: Record<Action, string> = {
  ACCEPT: "Accept this quotation? We will create your booking / order.",
  REJECT: "Decline this quotation?",
  REQUEST_CHANGES: "Ask us to change this quotation?",
};

// Customer answers a SENT quotation (POST /api/quotations/{id}/respond)
export default function QuotationActions({ quotationId }: { quotationId: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function respond(action: Action) {
    if (action == "REQUEST_CHANGES" && note.trim() == "") {
      setMessage({ ok: false, text: "Tell us what you would like changed." });
      return;
    }
    if (!window.confirm(CONFIRM[action])) {
      return;
    }
    setBusy(true);
    setMessage(null);
    const result = await apiRequest("POST", `/api/quotations/${quotationId}/respond`, {
      action: action,
      note: note.trim() || undefined,
    });
    setBusy(false);
    setMessage({
      ok: result.ok,
      text: result.data.message ?? (result.ok ? "Done." : "Something went wrong."),
    });
    if (result.ok) {
      setNote("");
      router.refresh();
    }
  }

  return (
    <div className="space-y-3">
      <label className="label" htmlFor={`note-${quotationId}`}>
        Note to our team (optional, required when asking for changes)
      </label>
      <textarea
        id={`note-${quotationId}`}
        rows={2}
        maxLength={2000}
        className="input"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      {message ? (
        <p
          role="alert"
          className={`rounded-lg px-3 py-2 text-sm ${message.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => respond("ACCEPT")} className="btn-gold">
          Accept quotation
        </button>
        <button type="button" disabled={busy} onClick={() => respond("REQUEST_CHANGES")} className="btn-outline">
          Request changes
        </button>
        <button type="button" disabled={busy} onClick={() => respond("REJECT")} className="btn-danger">
          Decline
        </button>
      </div>
    </div>
  );
}
