import { useId } from "react";

// Gazelle Key brand mark: the "GK" monogram - an amber-to-orange G with its
// middle bar, and a grey K whose top arm is an orange bar. Drawn from the
// company logo; same drawing as app/icon.svg.
// "light" = for navy backgrounds: the grey K is lightened so it stays visible.
export function LogoMark({ className = "", light = false }: { className?: string; light?: boolean }) {
  // Unique gradient ids, since the logo appears more than once per page
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const fill = `url(#${id}gk)`;
  return (
    <svg viewBox="215 255 1170 825" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}gk`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fdb71a" />
          <stop offset="1" stopColor="#ee6523" />
        </linearGradient>
      </defs>
      {/* G */}
      <path fill={fill} d="M951 435A397 397 0 1 0 1006 802L858 802A263 263 0 1 1 841 514Z" />
      <path fill={fill} d="M698 597H971L879 737H607Z" />
      {/* K */}
      <path fill={fill} d="M1201 270H1366L1291 392H1125Z" />
      <path fill={light ? "#c3cad6" : "#636363"} d="M1118 407H1284L1106 689L1366 1063H1201L937 689Z" />
    </svg>
  );
}

// Full logo: monogram + GAZELLE KEY / INTERNATIONAL (PVT) LTD.
// "light" is for navy backgrounds (header, footer).
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="group/logo flex items-center gap-3">
      <LogoMark
        light={light}
        className="h-10 w-14 shrink-0 transition duration-500 group-hover/logo:scale-105 sm:h-11 sm:w-15"
      />
      <span className="leading-none">
        <span className={`block text-[1.05rem] font-extrabold tracking-[0.14em] sm:text-lg ${light ? "text-white" : "text-[#111]"}`}>
          GAZELLE KEY
        </span>
        <span className={`mt-1.5 block text-[0.58rem] font-bold tracking-[0.2em] ${light ? "text-white/60" : "text-slate-600"}`}>
          INTERNATIONAL (PVT) LTD
        </span>
      </span>
    </span>
  );
}
