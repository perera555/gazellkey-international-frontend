import Link from "next/link";
import Tilt from "@/components/site/Tilt";
import { formatMoney } from "@/lib/format";
import { fill, Lang } from "@/lib/i18n";

// Home: the two main businesses as large 3D cards on a navy stage, then
// "why choose us". Numbers come from the database (open jobs, fertilizer price).
type Copy = {
  eyebrow: string;
  title: string;
  visaTitle: string;
  visaText: string;
  visaStats: string;
  visaCta: string;
  fertTitle: string;
  fertText: string;
  perKg: string;
  fertCta: string;
  whyEyebrow: string;
  whyTitle: string;
  why: [string, string][];
};

const COPY: Record<Lang, Copy> = {
  en: {
    eyebrow: "Main businesses",
    title: "Work abroad. Grow more.",
    visaTitle: "Work visa jobs abroad",
    visaText: "Choose a country and a job, apply in three steps - no account needed. We guide you to your flight.",
    visaStats: "{jobs} open jobs in {countries} countries",
    visaCta: "See jobs and apply",
    fertTitle: "Imported fertilizer",
    fertText: "For farms, estates and home gardens. Buy online by the kilogram, or order in bulk.",
    perKg: "per kg",
    fertCta: "Buy fertilizer",
    whyEyebrow: "Why Gazellekey",
    whyTitle: "Simple, honest and in your language",
    why: [
      ["One trusted team", "Six divisions under one name - one contact for everything you need."],
      ["Buy and apply online", "Shop, pay, apply for jobs and follow everything in your account."],
      ["Your language", "Read the website in English, සිංහල, தமிழ் or Español."],
      ["We call you back", "Every enquiry gets a reply, usually within one working day."],
    ],
  },
  si: {
    eyebrow: "ප්‍රධාන ව්‍යාපාර",
    title: "විදේශයක වැඩ කරන්න. වැඩියෙන් වවන්න.",
    visaTitle: "විදේශ රැකියා වීසා",
    visaText: "රටක් සහ රැකියාවක් තෝරා පියවර තුනකින් අයදුම් කරන්න - ගිණුමක් අවශ්‍ය නැත. ඔබේ ගුවන් ගමන දක්වා අපි මඟ පෙන්වමු.",
    visaStats: "රටවල් {countries} ක රැකියා {jobs}",
    visaCta: "රැකියා බලා අයදුම් කරන්න",
    fertTitle: "ආනයනික පොහොර",
    fertText: "ගොවිපළ, වතු සහ ගෙවතු සඳහා. කිලෝග්‍රෑම් වශයෙන් අන්තර්ජාලයෙන් හෝ තොග වශයෙන් ඇණවුම් කරන්න.",
    perKg: "කිලෝවකට",
    fertCta: "පොහොර මිලදී ගන්න",
    whyEyebrow: "ඇයි Gazellekey",
    whyTitle: "සරල, අවංක සහ ඔබේ භාෂාවෙන්",
    why: [
      ["එක් විශ්වාසවන්ත කණ්ඩායමක්", "එක් නාමයක් යටතේ අංශ හයක් - ඔබට අවශ්‍ය සියල්ලට එක් සම්බන්ධතාවයක්."],
      ["අන්තර්ජාලයෙන් මිලදී ගන්න සහ අයදුම් කරන්න", "මිලදී ගන්න, ගෙවන්න, රැකියාවලට අයදුම් කර ඔබේ ගිණුමේ සියල්ල බලන්න."],
      ["ඔබේ භාෂාව", "වෙබ් අඩවිය English, සිංහල, தமிழ் හෝ Español භාෂාවෙන් කියවන්න."],
      ["අපි ඔබට ආපසු කතා කරමු", "සෑම විමසීමකටම සාමාන්‍යයෙන් එක් වැඩ කරන දිනයක් තුළ පිළිතුරක් ලැබේ."],
    ],
  },
  ta: {
    eyebrow: "முக்கிய வணிகங்கள்",
    title: "வெளிநாட்டில் வேலை. அதிக விளைச்சல்.",
    visaTitle: "வெளிநாட்டு வேலை விசா",
    visaText: "ஒரு நாடு மற்றும் வேலையைத் தேர்ந்தெடுத்து மூன்று படிகளில் விண்ணப்பிக்கவும் - கணக்கு தேவையில்லை. உங்கள் விமானப் பயணம் வரை வழிகாட்டுவோம்.",
    visaStats: "{countries} நாடுகளில் {jobs} வேலைகள்",
    visaCta: "வேலைகளைப் பார்த்து விண்ணப்பிக்கவும்",
    fertTitle: "இறக்குமதி உரம்",
    fertText: "பண்ணைகள், தோட்டங்கள் மற்றும் வீட்டுத் தோட்டங்களுக்கு. கிலோ கணக்கில் இணையத்தில் அல்லது மொத்தமாக ஆர்டர் செய்யுங்கள்.",
    perKg: "ஒரு கிலோவுக்கு",
    fertCta: "உரம் வாங்கவும்",
    whyEyebrow: "ஏன் Gazellekey",
    whyTitle: "எளிமையானது, நேர்மையானது, உங்கள் மொழியில்",
    why: [
      ["ஒரே நம்பகமான குழு", "ஒரே பெயரில் ஆறு பிரிவுகள் - உங்களுக்குத் தேவையான அனைத்திற்கும் ஒரே தொடர்பு."],
      ["இணையத்தில் வாங்கி விண்ணப்பிக்கவும்", "வாங்குங்கள், செலுத்துங்கள், வேலைகளுக்கு விண்ணப்பித்து உங்கள் கணக்கில் அனைத்தையும் பின்தொடருங்கள்."],
      ["உங்கள் மொழி", "இணையதளத்தை English, සිංහල, தமிழ் அல்லது Español இல் படியுங்கள்."],
      ["நாங்கள் திரும்ப அழைப்போம்", "ஒவ்வொரு விசாரணைக்கும் பொதுவாக ஒரு வேலை நாளுக்குள் பதில் கிடைக்கும்."],
    ],
  },
  es: {
    eyebrow: "Negocios principales",
    title: "Trabaja en el extranjero. Cosecha más.",
    visaTitle: "Empleos con visa de trabajo",
    visaText: "Elige un país y un empleo, y postula en tres pasos, sin cuenta. Te acompañamos hasta tu vuelo.",
    visaStats: "{jobs} empleos en {countries} países",
    visaCta: "Ver empleos y postular",
    fertTitle: "Fertilizante importado",
    fertText: "Para fincas, plantaciones y huertos. Compra en línea por kilo o pide al por mayor.",
    perKg: "por kg",
    fertCta: "Comprar fertilizante",
    whyEyebrow: "Por qué Gazellekey",
    whyTitle: "Sencillo, honesto y en tu idioma",
    why: [
      ["Un equipo de confianza", "Seis divisiones bajo un nombre: un solo contacto para todo lo que necesitas."],
      ["Compra y postula en línea", "Compra, paga, postula a empleos y sigue todo en tu cuenta."],
      ["Tu idioma", "Lee el sitio en English, සිංහල, தமிழ் o Español."],
      ["Te devolvemos la llamada", "Cada consulta recibe respuesta, normalmente en un día laborable."],
    ],
  },
};

const WHY_ICONS = [
  "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2",
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
  "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
];

export default function HomeSpotlight({
  lang,
  jobs,
  countries,
  fertilizer,
}: {
  lang: Lang;
  jobs: number;
  countries: number;
  fertilizer: { price: number; currency: string } | null;
}) {
  const c = COPY[lang];
  return (
    <>
      <section className="relative isolate overflow-hidden bg-linear-to-br from-navy-950 via-navy-900 to-navy-950 py-24 text-white">
        <div className="grid-floor -z-10 opacity-60" aria-hidden="true" />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "radial-gradient(40rem 22rem at 15% 20%, rgb(15 118 110 / 0.35), transparent 60%), radial-gradient(40rem 22rem at 85% 80%, rgb(46 158 79 / 0.3), transparent 60%)" }}
        />
        <div className="container-page">
          <p className="eyebrow text-center">{c.eyebrow}</p>
          <h2 className="text-3d mx-auto mt-3 max-w-3xl text-center text-4xl sm:text-5xl">{c.title}</h2>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <Tilt className="rounded-[2rem]" max={6}>
              <Link href="/jobs" className="glass group flex h-full flex-col p-8 sm:p-10">
                <span className="icon-3d h-16 w-16" style={{ ["--tone" as string]: "#0f766e" }}>
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 7h16v12H4zM9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 12h16" />
                  </svg>
                </span>
                <h3 className="mt-6 text-2xl font-bold sm:text-3xl">{c.visaTitle}</h3>
                <p className="mt-3 text-white/70">{c.visaText}</p>
                {jobs > 0 ? <p className="mt-6 text-3xl font-bold text-gold-400">{fill(c.visaStats, { jobs: jobs, countries: countries })}</p> : null}
                <span className="mt-auto pt-8"><span className="btn-gold">{c.visaCta} →</span></span>
              </Link>
            </Tilt>
            <Tilt className="rounded-[2rem]" max={6}>
              <Link href="/fertilizer" className="glass group flex h-full flex-col p-8 sm:p-10">
                <span className="icon-3d h-16 w-16" style={{ ["--tone" as string]: "#2e9e4f" }}>
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 21c-4-3-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-3 8-7 11zM12 10v6M9 13h6" />
                  </svg>
                </span>
                <h3 className="mt-6 text-2xl font-bold sm:text-3xl">{c.fertTitle}</h3>
                <p className="mt-3 text-white/70">{c.fertText}</p>
                {fertilizer ? (
                  <p className="mt-6 text-3xl font-bold text-gold-400">
                    {formatMoney(fertilizer.price, fertilizer.currency)} <span className="text-base font-medium text-white/60">{c.perKg}</span>
                  </p>
                ) : null}
                <span className="mt-auto pt-8"><span className="btn-gold">{c.fertCta} →</span></span>
              </Link>
            </Tilt>
          </div>
        </div>
      </section>

      <section className="stage-3d py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">{c.whyEyebrow}</p>
            <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{c.whyTitle}</h2>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.why.map(([title, text], index) => (
              <li key={title} className="card-3d hoverable p-6">
                <span className="icon-3d h-12 w-12" style={{ ["--tone" as string]: ["#0b1530", "#b88a2e", "#1e88e5", "#2e9e4f"][index] }}>
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={WHY_ICONS[index]} />
                  </svg>
                </span>
                <h3 className="mt-5 font-semibold text-navy-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
