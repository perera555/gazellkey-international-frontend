import { humanize } from "@/lib/format";

// Colour by meaning, so the same idea looks the same on every list
const TONES: Record<string, string> = {
  // waiting
  NEW: "bg-blue-100 text-blue-800",
  PENDING: "bg-amber-100 text-amber-800",
  REQUESTED: "bg-blue-100 text-blue-800",
  QUEUED: "bg-slate-100 text-slate-700",
  // in progress
  ASSIGNED: "bg-indigo-100 text-indigo-800",
  IN_PROGRESS: "bg-indigo-100 text-indigo-800",
  IN_FULFILMENT: "bg-indigo-100 text-indigo-800",
  AWAITING_CUSTOMER: "bg-amber-100 text-amber-800",
  QUOTED: "bg-violet-100 text-violet-800",
  SENT: "bg-violet-100 text-violet-800",
  REVISED: "bg-slate-100 text-slate-700",
  // good outcome
  CONVERTED: "bg-green-100 text-green-800",
  ACCEPTED: "bg-green-100 text-green-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  PAID: "bg-green-100 text-green-800",
  ISSUED: "bg-green-100 text-green-800",
  POLICY_ISSUED: "bg-green-100 text-green-800",
  DELIVERED: "bg-green-100 text-green-800",
  // bad outcome
  CLOSED_LOST: "bg-slate-200 text-slate-700",
  CANCELLED: "bg-slate-200 text-slate-700",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-slate-200 text-slate-700",
  FAILED: "bg-red-100 text-red-800",
  DELAYED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-red-100 text-red-800",
  REFUNDED: "bg-slate-200 text-slate-700",
  PARTIALLY_REFUNDED: "bg-amber-100 text-amber-800",
  // catalogue availability
  AVAILABLE: "bg-green-100 text-green-800",
  RESERVED: "bg-amber-100 text-amber-800",
  SOLD: "bg-slate-200 text-slate-700",
};

export default function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`badge ${TONES[value] ?? "bg-slate-100 text-slate-700"}`}>
      {humanize(value)}
    </span>
  );
}
