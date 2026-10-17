"use client";

import { DragEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatFileSize } from "@/lib/format";

const MAX_SIZE = 10 * 1024 * 1024; // same limit as the API (lib/storage.ts)
const ACCEPTED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

// Document types a customer can send us. The backend keeps the ones marked
// `check` waiting until an admin approves them (APPROVAL_REQUIRED_TYPES).
const TYPES: { value: string; label: string; check?: boolean }[] = [
  { value: "PASSPORT", label: "Passport copy", check: true },
  { value: "VISA_DOCUMENT", label: "Visa document (bank statement, letter ...)", check: true },
  { value: "TICKET", label: "Air ticket" },
  { value: "ITINERARY", label: "Itinerary / travel plan" },
  { value: "INSURANCE_POLICY", label: "Insurance policy" },
  { value: "INVOICE", label: "Invoice / payment slip" },
  { value: "CERTIFICATE", label: "Certificate (gem, business ...)", check: true },
  { value: "VALUATION", label: "Valuation report", check: true },
  { value: "OWNERSHIP", label: "Ownership / registration papers", check: true },
  { value: "PERMIT", label: "Import / export permit", check: true },
  { value: "PACKING_LIST", label: "Packing list" },
  { value: "SHIPPING_RECORD", label: "Shipping record (bill of lading ...)" },
  { value: "OTHER", label: "Other" },
];

export type UploadTarget = { value: string; label: string }; // value = "ENTITYTYPE:id"

// Customer uploads a file to their profile or to one of their records
// (POST /api/documents, multipart/form-data)
export default function DocumentUploadForm({ targets }: { targets: UploadTarget[] }) {
  const router = useRouter();
  const picker = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(targets[0]?.value ?? "");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const chosenType = TYPES.find((each) => each.value == type);

  function choose(picked: File | undefined) {
    setMessage(null);
    if (!picked) return;
    if (!ACCEPTED.includes(picked.type)) {
      setMessage({ ok: false, text: "Please choose a PDF, JPG, PNG or WEBP file." });
      return;
    }
    if (picked.size > MAX_SIZE) {
      setMessage({ ok: false, text: "The file is larger than 10 MB." });
      return;
    }
    setFile(picked);
    // suggest a title from the file name
    if (title.trim() == "") {
      setTitle(picked.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").slice(0, 200));
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    choose(event.dataTransfer.files?.[0]);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!file) {
      setMessage({ ok: false, text: "Please choose a file to upload." });
      return;
    }
    if (!type) {
      setMessage({ ok: false, text: "Please choose what kind of document this is." });
      return;
    }
    const [entityType, entityId] = target.split(":");
    const form = new FormData();
    form.append("file", file);
    form.append("entityType", entityType);
    form.append("entityId", entityId);
    form.append("type", type);
    form.append("title", title.trim() || file.name);

    // XMLHttpRequest instead of fetch, so we can show upload progress
    const request = new XMLHttpRequest();
    request.open("POST", "/api/documents");
    request.upload.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) {
        setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    };
    request.onload = () => {
      setProgress(null);
      let body: { message?: string; data?: { approval?: string } } = {};
      try {
        body = JSON.parse(request.responseText);
      } catch {}
      if (request.status >= 200 && request.status < 300) {
        setMessage({
          ok: true,
          text:
            body.data?.approval == "PENDING"
              ? "Uploaded. Our team will check it and you will see the result below."
              : "Uploaded. You can see it in the list below.",
        });
        setFile(null);
        setTitle("");
        setType("");
        router.refresh();
      } else {
        setMessage({
          ok: false,
          text:
            request.status == 401
              ? "Please sign in again to upload."
              : (body.message ?? "The upload did not work. Please try again."),
        });
      }
    };
    request.onerror = () => {
      setProgress(null);
      setMessage({ ok: false, text: "Network error. Please check your connection." });
    };
    setProgress(0);
    request.send(form);
  }

  const busy = progress != null;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => picker.current?.click()}
        onKeyDown={(event) => (event.key == "Enter" || event.key == " ") && picker.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
          dragging
            ? "border-gold-500 bg-gold-100/60"
            : file
              ? "border-emerald-300 bg-emerald-50/60"
              : "border-slate-300 bg-slate-50 hover:border-gold-400 hover:bg-gold-100/30"
        }`}
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-900 text-gold-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {file ? (
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 14l2 2 4-4" />
            ) : (
              <path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            )}
          </svg>
        </span>
        {file ? (
          <>
            <p className="mt-3 max-w-full truncate font-semibold text-navy-900">{file.name}</p>
            <p className="text-xs text-slate-500">
              {formatFileSize(file.size)} · <span className="font-medium text-navy-700 underline">choose another file</span>
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 font-semibold text-navy-900">
              Drag a file here, or <span className="text-gold-600 underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">PDF, JPG, PNG or WEBP · up to 10 MB · photos from your phone are fine</p>
          </>
        )}
        <input
          ref={picker}
          type="file"
          accept=".pdf,image/jpeg,image/png,image/webp"
          className="hidden"
          aria-label="Choose a document"
          onChange={(event) => {
            choose(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="doc-type">Document type *</label>
          <select id="doc-type" className="input" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">Choose...</option>
            {TYPES.map((each) => (
              <option key={each.value} value={each.value}>{each.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="doc-target">Related to</label>
          <select id="doc-target" className="input" value={target} onChange={(event) => setTarget(event.target.value)}>
            {targets.map((each) => (
              <option key={each.value} value={each.value}>{each.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="doc-title">Title</label>
          <input
            id="doc-title"
            className="input"
            maxLength={200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Passport - Nimal Perera"
          />
        </div>
      </div>

      {chosenType?.check ? (
        <p className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span aria-hidden="true">ⓘ</span>
          Our team checks this kind of document before it is used. You will see &quot;Approved&quot; or a note in the list below.
        </p>
      ) : null}

      {busy ? (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-linear-to-r from-gold-400 to-gold-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      {message ? (
        <p
          role={message.ok ? "status" : "alert"}
          className={`rounded-xl px-4 py-3 text-sm ${message.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          Only you and our team can see your documents.
        </p>
        <button type="submit" disabled={busy} className="btn-gold">
          {busy ? `Uploading ${progress}%...` : "Upload document"}
        </button>
      </div>
    </form>
  );
}
