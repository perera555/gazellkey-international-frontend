"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatFileSize } from "@/lib/format";
import { Dict, fill } from "@/lib/i18n";

const MAX_SIZE = 10 * 1024 * 1024; // same limit as the API (lib/storage.ts)
const ACCEPTED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

const FILES = ["cv", "passport", "photo"] as const;

// Apply for an overseas job (POST /api/jobs/applications, multipart/form-data).
// No account needed: details plus optional CV, passport and photo.
// Our team calls back about the next steps. Words come from `t` (lib/i18n.ts).
export default function JobApplyForm({
  t,
  vacancyId,
  returnTo,
  prefill,
  onDone,
}: {
  t: Dict;
  vacancyId: string;
  returnTo: string;
  onDone?: (reference: string) => void; // wizard: show its own "sent" step
  prefill: { firstName: string; lastName: string; email: string } | null; // null = guest
}) {
  const router = useRouter();
  const signedIn = prefill != null;
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [chosen, setChosen] = useState<Record<string, File | null>>({});
  const [done, setDone] = useState<string | null>(null); // reference, after a guest applies

  const fileWords: Record<(typeof FILES)[number], [string, string]> = {
    cv: [t.cv, t.cvHint],
    passport: [t.passportCopy, t.passportHint],
    photo: [t.photo, t.photoHint],
  };

  function choose(name: string, file: File | undefined) {
    setError("");
    if (file && !ACCEPTED.includes(file.type)) {
      setError(t.fileType);
      return false;
    }
    if (file && file.size > MAX_SIZE) {
      setError(t.fileSize);
      return false;
    }
    setChosen((files) => ({ ...files, [name]: file ?? null }));
    return true;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    form.set("vacancyId", vacancyId);
    for (const name of FILES) {
      form.delete(name);
      const file = chosen[name];
      if (file) form.append(name, file);
    }

    // XMLHttpRequest instead of fetch, so we can show upload progress
    const request = new XMLHttpRequest();
    request.open("POST", "/api/jobs/applications");
    request.upload.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) {
        setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    };
    request.onload = () => {
      setProgress(null);
      let body: { message?: string; reference?: string } = {};
      try {
        body = JSON.parse(request.responseText);
      } catch {}
      if (request.status >= 200 && request.status < 300) {
        toast.success(fill(t.sentToast, { reference: body.reference ?? "" }));
        if (onDone) {
          onDone(body.reference ?? "");
        } else if (signedIn) {
          router.push(`/account/jobs?applied=${encodeURIComponent(body.reference ?? "")}`);
        } else {
          setDone(body.reference ?? "");
        }
      } else {
        // the server's own message explains what to fix (shown as sent)
        const text = body.message ?? t.sendFailed;
        setError(text);
        toast.error(text);
      }
    };
    request.onerror = () => {
      setProgress(null);
      setError(t.networkError);
      toast.error(t.networkError);
    };
    setProgress(0);
    request.send(form);
  }

  if (done != null) {
    const next = encodeURIComponent(returnTo);
    return (
      <div role="status" className="space-y-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-700" aria-hidden="true">✓</span>
        <h3 className="text-xl font-semibold text-navy-950">{t.thanksTitle}</h3>
        <p className="text-sm text-slate-600">{fill(t.thanksText, { reference: done })}</p>
        <div className="rounded-xl bg-navy-50 p-4 text-sm text-navy-900">
          {t.followOnline}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={`/register?next=${next}`} className="btn-gold btn-sm">{t.createAccount}</Link>
            <Link href={`/login?next=${next}`} className="btn-outline btn-sm">{t.signIn}</Link>
          </div>
        </div>
      </div>
    );
  }

  const busy = progress != null;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* honeypot: hidden from people, bots fill it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="label">{t.firstName} *</label>
          <input id="firstName" name="firstName" required maxLength={100} defaultValue={prefill?.firstName} className="input" autoComplete="given-name" />
        </div>
        <div>
          <label htmlFor="lastName" className="label">{t.lastName}</label>
          <input id="lastName" name="lastName" maxLength={100} defaultValue={prefill?.lastName} className="input" autoComplete="family-name" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="label">{t.mobile} *</label>
          <input id="phone" name="phone" type="tel" required minLength={6} maxLength={30} className="input" placeholder="07X XXX XXXX" autoComplete="tel" />
        </div>
        {signedIn ? null : (
          <div className="sm:col-span-2">
            <label htmlFor="email" className="label">{t.email} *</label>
            <input id="email" name="email" type="email" required maxLength={200} className="input" autoComplete="email" />
          </div>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="experienceYears" className="label">{t.experience}</label>
          <input id="experienceYears" name="experienceYears" type="number" min={0} max={50} className="input" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="label">{t.message}</label>
        <textarea id="message" name="message" rows={3} maxLength={3000} className="input" placeholder={t.messageHint} />
      </div>

      <details className="rounded-xl border border-slate-200 px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-navy-900">{t.moreDetails}</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="dateOfBirth" className="label">{t.dateOfBirth}</label>
            <input id="dateOfBirth" name="dateOfBirth" type="date" className="input" />
          </div>
          <div>
            <label htmlFor="passportNumber" className="label">{t.passportNumber}</label>
            <input id="passportNumber" name="passportNumber" maxLength={20} className="input uppercase" placeholder="N1234567" />
          </div>
          <div>
            <label htmlFor="passportExpiry" className="label">{t.passportExpiry}</label>
            <input id="passportExpiry" name="passportExpiry" type="date" className="input" />
          </div>
          <div>
            <label htmlFor="currentJob" className="label">{t.currentJob}</label>
            <input id="currentJob" name="currentJob" maxLength={200} className="input" />
          </div>
        </div>
      </details>

      <details open className="rounded-xl border border-slate-200 px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-navy-900">{t.uploadDocs}</summary>
        <div className="mt-3 space-y-3">
          {FILES.map((name) => {
            const file = chosen[name];
            const [label, hint] = fileWords[name];
            return (
              <div key={name}>
                <label htmlFor={`file-${name}`} className="label">{label}</label>
                <input
                  id={`file-${name}`}
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  className="input file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-3 file:py-1 file:text-sm file:text-white"
                  onChange={(event) => {
                    if (!choose(name, event.target.files?.[0])) event.target.value = "";
                  }}
                />
                <p className="mt-1 text-xs text-slate-500">{file ? `${file.name} · ${formatFileSize(file.size)}` : hint}</p>
              </div>
            );
          })}
        </div>
      </details>

      {busy ? (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-linear-to-r from-gold-400 to-gold-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button type="submit" disabled={busy} className="btn-gold w-full">
        {busy ? fill(t.sending, { percent: progress ?? 0 }) : t.send}
      </button>
      <p className="text-xs text-slate-500">{signedIn ? t.privacySignedIn : t.privacyGuest}</p>
    </form>
  );
}
