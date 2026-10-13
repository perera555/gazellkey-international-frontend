import { useId } from "react";

// Brand mark: gold gazelle leaping over a silver globe inside a navy swoosh.
// Same drawing as app/icon.svg (the browser tab icon).
export function LogoMark({ className = "", light = false }: { className?: string; light?: boolean }) {
  // Unique gradient ids, since the logo appears more than once per page
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}globe`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#d5dde7" />
          <stop offset="1" stopColor="#8e9cb0" />
        </radialGradient>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3d27a" />
          <stop offset="0.5" stopColor="#c9a227" />
          <stop offset="1" stopColor="#9a7414" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="34" r="20" fill={`url(#${id}globe)`} />
      <g fill="none" stroke="#7d8ba0" strokeWidth="0.9" opacity="0.7">
        <ellipse cx="32" cy="34" rx="8" ry="20" />
        <ellipse cx="32" cy="34" rx="15" ry="20" />
        <path d="M12 34H52M14.7 24H49.3M14.7 44H49.3" />
      </g>
      <path
        d="M23.45 10.51A25 25 0 1 0 51.15 50.07"
        fill="none"
        stroke={light ? "#ffffff" : "#0b2545"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g fill={`url(#${id}gold)`} stroke="#7a5a0c" strokeWidth="0.4" strokeLinejoin="round">
        <path d="M47 9L51.5 11.2L50.6 13.2L46.4 14L44.6 19L46.6 23.6L52.4 26.6L53.6 28.8L50.4 29.2L44.4 26.2L42.6 27.2L46.4 32.8L44.4 34.2L39 28.4L30.4 31.2L22.4 38.2L12.4 46.4L10.8 44.6L19.2 36.2L16.8 35.2L8.2 40.4L7.8 38.2L18 31.2L19.8 27.4L16.6 26.4L21.2 24.2L30 21L40 16.2L43 11.2L44.2 8.2Z" />
        <path d="M44.2 9.4L40.8 6.8L43.6 10.6Z" />
      </g>
      <g fill="none" stroke={`url(#${id}gold)`} strokeWidth="1.5" strokeLinecap="round">
        <path d="M45.6 9C43 3.8 38.6 2.6 35 4.8" />
        <path d="M47 8.6C45 3 41.2 1.6 37.8 2.8" />
      </g>
    </svg>
  );
}

// Full logo. "light" is for navy backgrounds (footer).
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="group/logo flex items-center gap-3">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition duration-500 group-hover/logo:border-gold-400 ${
          light ? "border-gold-500/40 bg-white/5" : "border-gold-500/40 bg-gold-100/40"
        }`}
      >
        <LogoMark light={light} className="h-9 w-9 transition duration-500 group-hover/logo:-rotate-6 group-hover/logo:scale-105" />
      </span>
      <span className="leading-none">
        <span className="block text-base font-bold tracking-[0.2em] text-gold-400">
          GAZELLEKEY
        </span>
        <span
          className={`mt-1.5 block text-[0.6rem] font-semibold tracking-[0.22em] ${light ? "text-white/50" : "text-slate-500"}`}
        >
          INTERNATIONAL (PVT) LTD
        </span>
      </span>
    </span>
  );
}
