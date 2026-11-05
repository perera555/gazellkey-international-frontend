import "server-only";
import { cookies } from "next/headers";
import { DICTIONARIES, LANG_COOKIE, toLang } from "@/lib/i18n";

// The visitor's language (cookie "gk-lang", set by the language switch) and its words
export async function getDictionary() {
  const lang = toLang((await cookies()).get(LANG_COOKIE)?.value);
  return { lang, t: DICTIONARIES[lang] };
}

// Dates and times written the visitor's way
export const DATE_LOCALES = { en: "en-GB", si: "si-LK", ta: "ta-LK", es: "es-ES" } as const;
