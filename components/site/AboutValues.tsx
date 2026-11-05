import Link from "next/link";
import Tilt from "@/components/site/Tilt";
import { Lang } from "@/lib/i18n";

// About us: mission, vision and values as 3D cards, and a closing call to action.
type Copy = {
  eyebrow: string;
  title: string;
  cards: [string, string][]; // mission, vision, values
  values: string[];
  ctaTitle: string;
  ctaText: string;
  contact: string;
  appointment: string;
};

const COPY: Record<Lang, Copy> = {
  en: {
    eyebrow: "Who we are",
    title: "Built on trust, run by people who care",
    cards: [
      ["Our mission", "To make travel, work abroad, trade and everyday buying simple and honest for every Sri Lankan family and business."],
      ["Our vision", "To be the one name people trust for opportunities in Sri Lanka and around the world."],
      ["Our promise", "Clear prices, honest advice and a reply to every message - in your own language."],
    ],
    values: ["Honesty", "Care", "Clear prices", "Fast replies", "Respect for every customer"],
    ctaTitle: "Let's talk about what you need",
    ctaText: "Send an enquiry, call us or visit our office - one team for everything.",
    contact: "Contact us",
    appointment: "Book an appointment",
  },
  si: {
    eyebrow: "අපි කවුද",
    title: "විශ්වාසය මත ගොඩනැගූ, සැලකිලිමත් අය විසින් පවත්වාගෙන යන",
    cards: [
      ["අපේ මෙහෙවර", "සෑම ශ්‍රී ලාංකේය පවුලකටම සහ ව්‍යාපාරයකටම සංචාරය, විදේශ රැකියා, වෙළඳාම සහ එදිනෙදා මිලදී ගැනීම සරල සහ අවංක කිරීම."],
      ["අපේ දැක්ම", "ශ්‍රී ලංකාවේ සහ ලොව පුරා අවස්ථා සඳහා ජනතාව විශ්වාස කරන එකම නාමය වීම."],
      ["අපේ පොරොන්දුව", "පැහැදිලි මිල, අවංක උපදෙස් සහ සෑම පණිවිඩයකටම පිළිතුරක් - ඔබේම භාෂාවෙන්."],
    ],
    values: ["අවංකභාවය", "සැලකිල්ල", "පැහැදිලි මිල", "ඉක්මන් පිළිතුරු", "සෑම පාරිභෝගිකයෙකුටම ගෞරවය"],
    ctaTitle: "ඔබට අවශ්‍ය දේ ගැන කතා කරමු",
    ctaText: "විමසීමක් එවන්න, අප අමතන්න හෝ අපේ කාර්යාලයට පැමිණෙන්න - සියල්ලටම එක් කණ්ඩායමක්.",
    contact: "අප අමතන්න",
    appointment: "හමුවීමක් වෙන් කරන්න",
  },
  ta: {
    eyebrow: "நாங்கள் யார்",
    title: "நம்பிக்கையில் கட்டமைக்கப்பட்டு, அக்கறையுள்ளவர்களால் நடத்தப்படுகிறது",
    cards: [
      ["எங்கள் நோக்கம்", "ஒவ்வொரு இலங்கைக் குடும்பத்திற்கும் வணிகத்திற்கும் பயணம், வெளிநாட்டு வேலை, வர்த்தகம் மற்றும் அன்றாடக் கொள்முதலை எளிமையாகவும் நேர்மையாகவும் ஆக்குவது."],
      ["எங்கள் தொலைநோக்கு", "இலங்கையிலும் உலகெங்கிலும் வாய்ப்புகளுக்காக மக்கள் நம்பும் ஒரே பெயராக இருப்பது."],
      ["எங்கள் வாக்குறுதி", "தெளிவான விலைகள், நேர்மையான ஆலோசனை மற்றும் ஒவ்வொரு செய்திக்கும் பதில் - உங்கள் சொந்த மொழியில்."],
    ],
    values: ["நேர்மை", "அக்கறை", "தெளிவான விலைகள்", "விரைவான பதில்கள்", "ஒவ்வொரு வாடிக்கையாளருக்கும் மரியாதை"],
    ctaTitle: "உங்களுக்குத் தேவையானதைப் பற்றிப் பேசுவோம்",
    ctaText: "விசாரணையை அனுப்புங்கள், அழையுங்கள் அல்லது எங்கள் அலுவலகத்திற்கு வாருங்கள் - அனைத்திற்கும் ஒரே குழு.",
    contact: "தொடர்பு கொள்ளவும்",
    appointment: "சந்திப்பை முன்பதிவு செய்யவும்",
  },
  es: {
    eyebrow: "Quiénes somos",
    title: "Construidos sobre la confianza, dirigidos por personas que se preocupan",
    cards: [
      ["Nuestra misión", "Hacer que viajar, trabajar en el extranjero, comerciar y comprar a diario sea sencillo y honesto para cada familia y empresa de Sri Lanka."],
      ["Nuestra visión", "Ser el nombre de confianza para las oportunidades en Sri Lanka y en todo el mundo."],
      ["Nuestra promesa", "Precios claros, consejos honestos y respuesta a cada mensaje, en tu propio idioma."],
    ],
    values: ["Honestidad", "Cuidado", "Precios claros", "Respuestas rápidas", "Respeto por cada cliente"],
    ctaTitle: "Hablemos de lo que necesitas",
    ctaText: "Envía una consulta, llámanos o visita nuestra oficina: un equipo para todo.",
    contact: "Contáctanos",
    appointment: "Reservar una cita",
  },
};

const ICONS = [
  "M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z",
  "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  "M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z",
];
const TONES = ["#b88a2e", "#1e88e5", "#e53935"];

export function AboutValues({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <section className="stage-3d bg-ivory-50 py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{c.title}</h2>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {c.cards.map(([title, text], index) => (
            <li key={title}>
              <Tilt className="h-full rounded-[1.75rem]">
                <div className="card-3d h-full p-8">
                  <span className="icon-3d h-14 w-14" style={{ ["--tone" as string]: TONES[index] }}>
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={ICONS[index]} />
                    </svg>
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-navy-950">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{text}</p>
                </div>
              </Tilt>
            </li>
          ))}
        </ul>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {c.values.map((value) => (
            <li key={value} className="rounded-full border border-gold-400/50 bg-white px-5 py-2 text-sm font-semibold text-navy-900 shadow-[0_6px_14px_-10px_rgba(11,21,48,0.5)]">
              ✦ {value}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutCta({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-r from-navy-950 to-navy-900 py-16 text-white">
      <div className="grid-floor -z-10 opacity-70" aria-hidden="true" />
      <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-3d text-3xl">{c.ctaTitle}</h2>
          <p className="mt-2 text-white/70">{c.ctaText}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn-gold">{c.contact}</Link>
          <Link href="/appointments" className="btn-gold-outline">{c.appointment}</Link>
        </div>
      </div>
    </section>
  );
}
