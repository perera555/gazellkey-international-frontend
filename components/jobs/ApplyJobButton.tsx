"use client";

import { ReactNode } from "react";

// Opening the apply form for a job on the Work visa page happens in the
// browser, at once: the wizard (JobApplyWizard) listens for this event.
export const CHOOSE_JOB_EVENT = "gk:choose-job";

export function chooseJob(slug: string) {
  // keep the choice in the address, so a refresh or a shared link opens the same form
  window.history.replaceState(null, "", `/jobs?apply=${encodeURIComponent(slug)}`);
  window.dispatchEvent(new CustomEvent(CHOOSE_JOB_EVENT, { detail: slug }));
}

// "Apply" button that opens the form with this job (falls back to a normal link)
export default function ApplyJobButton({ slug, className, children }: { slug: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={`/jobs?apply=${encodeURIComponent(slug)}`}
      onClick={(event) => {
        event.preventDefault();
        chooseJob(slug);
      }}
      className={className}
    >
      {children}
    </a>
  );
}
