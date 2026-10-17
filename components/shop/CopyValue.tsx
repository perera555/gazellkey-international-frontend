"use client";

import { useState } from "react";

// One bank detail with a "Copy" button, so customers paste it without typos
export default function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked: the value is still there to select by hand
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="font-mono text-base font-semibold break-all text-navy-900 select-all">{value}</dd>
      </div>
      <button type="button" onClick={copy} className="btn-outline btn-sm shrink-0" aria-label={`Copy ${label}`}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
