"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Dict } from "@/lib/i18n";

const MAX_SIZE = 10 * 1024 * 1024; // same limit as the API (lib/storage.ts)
const ACCEPTED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

// value -> the English title staff see in the admin
const TYPES = [
  { value: "CV", title: "CV" },
  { value: "PASSPORT", title: "Passport copy" },
  { value: "PHOTO", title: "Passport-size photo" },
  { value: "CERTIFICATE", title: "Certificate / service letter" },
  { value: "OTHER", title: "Other document" },
];

// Candidate adds a document to their job application (POST /api/documents)
export default function JobDocumentUpload({ t, applicationId, reference }: { t: Dict; applicationId: string; reference: string }) {
  const router = useRouter();
  const [type, setType] = useState("CV");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  // what the candidate reads, in their language
  const labels: Record<string, string> = {
    CV: t.cv,
    PASSPORT: t.passportCopy,
    PHOTO: t.photo,
    CERTIFICATE: t.docCertificate,
    OTHER: t.docOther,
  };

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!file) {
      toast.error(t.chooseFile);
      return;
    }
    if (!ACCEPTED.includes(file.type) || file.size > MAX_SIZE) {
      toast.error(`${t.fileType} ${t.fileSize}`);
      return;
    }
    const form = new FormData();
    form.append("file", file);
    form.append("entityType", "JOB_APPLICATION");
    form.append("entityId", applicationId);
    form.append("type", type);
    form.append("title", `${TYPES.find((each) => each.value == type)?.title ?? type} - ${reference}`);
    setBusy(true);
    try {
      const response = await fetch("/api/documents", { method: "POST", body: form });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(body.message ?? t.uploadFailed);
        return;
      }
      toast.success(t.uploaded);
      setFile(null);
      formElement.reset();
      router.refresh();
    } catch {
      toast.error(t.networkError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={upload} className="flex flex-wrap items-end gap-2">
      <div className="min-w-40 flex-1">
        <label htmlFor={`doc-type-${applicationId}`} className="label">{t.addDocument}</label>
        <select id={`doc-type-${applicationId}`} className="input" value={type} onChange={(event) => setType(event.target.value)}>
          {TYPES.map((each) => (
            <option key={each.value} value={each.value}>{labels[each.value]}</option>
          ))}
        </select>
      </div>
      <input
        type="file"
        aria-label={t.addDocument}
        accept=".pdf,image/jpeg,image/png,image/webp"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="input min-w-52 flex-1 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-3 file:py-1 file:text-sm file:text-white"
      />
      <button type="submit" disabled={busy} className="btn-navy">
        {busy ? t.uploading : t.upload}
      </button>
    </form>
  );
}
