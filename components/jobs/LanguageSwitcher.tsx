"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LANG_COOKIE, LANGUAGES, Lang } from "@/lib/i18n";

// English / සිංහල / தமிழ் / Español for the work visa pages.
// The choice is remembered for a year in the "gk-lang" cookie.
export default function LanguageSwitcher({ lang, label, dark = false }: { lang: Lang; label: string; dark?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(code: Lang) {
    document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex flex-wrap items-center gap-1 rounded-full border p-1 ${dark ? "border-white/15 bg-white/10 backdrop-blur" : "border-slate-200 bg-white"} ${pending ? "opacity-60" : ""}`}
    >
      <span className={`px-2 text-xs font-semibold ${dark ? "text-white/60" : "text-slate-500"}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="inline h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      </span>
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          type="button"
          lang={language.code}
          aria-pressed={lang == language.code}
          onClick={() => choose(language.code)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition ${
            lang == language.code
              ? "bg-gold-500 text-navy-950"
              : dark
                ? "text-white/80 hover:bg-white/10"
                : "text-navy-900 hover:bg-navy-50"
          }`}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}
