"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api-client";
import { Dict, fill } from "@/lib/i18n";

// Candidate withdraws their own job application (PUT { status: "WITHDRAWN" })
export default function WithdrawApplication({ t, applicationId, reference }: { t: Dict; applicationId: string; reference: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);

  async function withdraw() {
    setBusy(true);
    const result = await apiRequest("PUT", `/api/jobs/applications/${applicationId}`, { status: "WITHDRAWN" });
    setBusy(false);
    if (result.ok) {
      dialog.current?.close();
      toast.success(t.withdrawn);
      router.refresh();
    }
  }

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className="btn-outline btn-sm">
        {t.withdraw}
      </button>
      <dialog ref={dialog} className="modal" aria-labelledby={`withdraw-${applicationId}`}>
        <div className="card space-y-4 p-6">
          <h2 id={`withdraw-${applicationId}`} className="text-xl font-semibold text-navy-950">{fill(t.withdrawTitle, { reference: reference })}</h2>
          <p className="text-sm text-slate-600">{t.withdrawText}</p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => dialog.current?.close()} className="btn-outline">{t.keepIt}</button>
            <button type="button" disabled={busy} onClick={withdraw} className="btn-navy">
              {busy ? t.withdrawing : t.withdraw}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
