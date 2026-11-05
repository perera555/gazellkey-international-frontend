"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { LANG_COOKIE, LANGUAGES, Lang } from "@/lib/i18n";

const SHORT: Record<Lang, string> = { en: "EN", si: "සිං", ta: "தமி", es: "ES" };

// Language choice in the top menu bar (every page): a globe button showing
// the current language; the choice is remembered in the "gk-lang" cookie.
export default function LanguageMenu({ lang, label }: { lang: Lang; label: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const box = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((language) => language.code == lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key == "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(code: Lang) {
    document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    document.documentElement.lang = code;
    setOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${label}: ${current.label}`}
        title={label}
        onClick={() => setOpen(!open)}
        className={`flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-2.5 text-sm font-medium text-white transition hover:border-gold-500/60 hover:text-gold-400 ${pending ? "opacity-60" : ""}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        <span className="pr-0.5" lang={current.code}>
          {SHORT[current.code]}
        </span>
      </button>
      {open ? (
        <ul className="dropdown-in absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-[0_24px_48px_-20px_rgba(6,11,26,0.5)]">
          {LANGUAGES.map((language) => (
            <li key={language.code}>
              <button
                type="button"
                lang={language.code}
                onClick={() => choose(language.code)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-navy-50 ${
                  language.code == lang ? "font-semibold text-navy-950" : "text-slate-700"
                }`}
              >
                {language.label}
                {language.code == lang ? <span className="text-gold-600" aria-hidden="true">✓</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
