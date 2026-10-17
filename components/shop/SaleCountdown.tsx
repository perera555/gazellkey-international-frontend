"use client";

import { useEffect, useState } from "react";

function remaining(endsAt: string, now: number) {
  const total = Math.max(0, new Date(endsAt).getTime() - now);
  return {
    total: total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor(total / 3_600_000) % 24,
    minutes: Math.floor(total / 60_000) % 60,
    seconds: Math.floor(total / 1000) % 60,
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

// "Sale ends in 2d 04:13:09", ticking every second. Renders nothing on the
// server, so the time shown is always the visitor's own clock.
export default function SaleCountdown({ endsAt, compact = false }: { endsAt: string; compact?: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (now == null) {
    return null;
  }
  const left = remaining(endsAt, now);
  if (left.total == 0) {
    return <span className="text-xs font-semibold text-slate-500">Sale ended</span>;
  }
  const clock = `${left.days > 0 ? `${left.days}d ` : ""}${pad(left.hours)}:${pad(left.minutes)}:${pad(left.seconds)}`;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 tabular-nums">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2 2M9 2h6" />
        </svg>
        {clock}
      </span>
    );
  }
  return (
    <p className="flex items-center gap-2 text-sm text-rose-700">
      <span className="font-medium">Sale ends in</span>
      <span className="rounded-md bg-rose-50 px-2 py-0.5 font-bold tabular-nums ring-1 ring-rose-200">{clock}</span>
    </p>
  );
}
