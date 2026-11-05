import Link from "next/link";
import Tilt from "@/components/site/Tilt";
import { Lang } from "@/lib/i18n";

// Every business of Gazellekey as 3D tiles (Home and About us).
const ICONS: Record<string, string> = {
  travel: "M2 16l20-6-2-3-7 2L7 3H5l3 7-4 1-2-2H1l1 4zM2 20h20",
  visa: "M4 7h16v12H4zM9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 12h16",
  fertilizer: "M12 21c-4-3-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-3 8-7 11zM12 10v6M9 13h6",
  events: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M4 11h16",
  gems: "M6 3h12l3 6-9 12L3 9zM3 9h18M9 3l3 18 3-18",
  vehicles: "M3 16v-4l2-5h14l2 5v4zM3 16v3h3v-3M18 16v3h3v-3M7 13h.01M17 13h.01M5 12h14",
  import: "M3 17h18l-2 4H5zM6 17V9h12v8M9 9V5h6v4",
  export: "M12 3v12M7 8l5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4",
  shop: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2M10 20h.01M17 20h.01",
};

const BUSINESSES = [
  { key: "travel", href: "/travel", tone: "#1e88e5" },
  { key: "visa", href: "/jobs", tone: "#0f766e" },
  { key: "fertilizer", href: "/fertilizer", tone: "#2e9e4f" },
  { key: "events", href: "/events", tone: "#f26b21" },
  { key: "gems", href: "/gems", tone: "#8e24aa" },
  { key: "vehicles", href: "/vehicles", tone: "#2563eb" },
  { key: "import", href: "/import", tone: "#e53935" },
  { key: "export", href: "/export", tone: "#d97706" },
  { key: "shop", href: "/shop", tone: "#b88a2e" },
] as const;

type Copy = { eyebrow: string; title: string; text: string; explore: string; items: Record<(typeof BUSINESSES)[number]["key"], [string, string]> };

const COPY: Record<Lang, Copy> = {
  en: {
    eyebrow: "What we do",
    title: "One company, many ways to help you",
    text: "Each business has its own specialists - and you deal with one trusted team.",
    explore: "Explore",
    items: {
      travel: ["Travel & Tours", "Flights, holidays, hotels, visas and insurance."],
      visa: ["Work Visa Jobs", "Jobs abroad in the Middle East and worldwide."],
      fertilizer: ["Fertilizer", "Imported fertilizer - LKR 150 per kg, buy online."],
      events: ["Events & Rentals", "Event management, huts, chairs and sound for hire."],
      gems: ["Gems & Jewellery", "Certified Ceylon gemstones and fine jewellery."],
      vehicles: ["Vehicles & Machinery", "Cars, spare parts and heavy machinery."],
      import: ["Import", "Quality goods sourced worldwide for Sri Lanka."],
      export: ["Export", "Ceylon tea, spices and produce to the world."],
      shop: ["Online Shop", "Buy online and pay by card or bank transfer."],
    },
  },
  si: {
    eyebrow: "අප කරන දේ",
    title: "එක් සමාගමක්, ඔබට උදව් කිරීමට බොහෝ ක්‍රම",
    text: "සෑම ව්‍යාපාරයකටම තමන්ගේම විශේෂඥයින් සිටී - ඔබ ගනුදෙනු කරන්නේ එක් විශ්වාසවන්ත කණ්ඩායමක් සමඟයි.",
    explore: "බලන්න",
    items: {
      travel: ["සංචාරක සේවා", "ගුවන් ටිකට්, නිවාඩු, හෝටල්, වීසා සහ රක්ෂණ."],
      visa: ["රැකියා වීසා", "මැද පෙරදිග සහ ලොව පුරා විදේශ රැකියා."],
      fertilizer: ["පොහොර", "ආනයනික පොහොර - කිලෝවකට රු. 150, අන්තර්ජාලයෙන් මිලදී ගන්න."],
      events: ["උත්සව සහ කුලියට", "උත්සව කළමනාකරණය, මඩු, පුටු සහ ශබ්ද උපකරණ කුලියට."],
      gems: ["මැණික් සහ ස්වර්ණාභරණ", "සහතික කළ ලංකා මැණික් සහ ස්වර්ණාභරණ."],
      vehicles: ["වාහන සහ යන්ත්‍ර", "මෝටර් රථ, අමතර කොටස් සහ බර යන්ත්‍ර."],
      import: ["ආනයන", "ලොව පුරා සිට ශ්‍රී ලංකාවට ගුණාත්මක භාණ්ඩ."],
      export: ["අපනයන", "ලෝකයට ලංකා තේ, කුළුබඩු සහ නිෂ්පාදන."],
      shop: ["අන්තර්ජාල සාප්පුව", "අන්තර්ජාලයෙන් මිලදී ගෙන කාඩ්පතෙන් හෝ බැංකු මාරුවෙන් ගෙවන්න."],
    },
  },
  ta: {
    eyebrow: "நாங்கள் செய்வது",
    title: "ஒரே நிறுவனம், உங்களுக்கு உதவ பல வழிகள்",
    text: "ஒவ்வொரு வணிகத்திற்கும் அதன் சொந்த நிபுணர்கள் உள்ளனர் - நீங்கள் ஒரே நம்பகமான குழுவுடன் தொடர்பு கொள்கிறீர்கள்.",
    explore: "பாருங்கள்",
    items: {
      travel: ["பயணம் & சுற்றுலா", "விமானங்கள், விடுமுறைகள், ஹோட்டல்கள், விசா மற்றும் காப்பீடு."],
      visa: ["வேலை விசா வேலைகள்", "மத்திய கிழக்கிலும் உலகெங்கிலும் வெளிநாட்டு வேலைகள்."],
      fertilizer: ["உரம்", "இறக்குமதி உரம் - கிலோவுக்கு ரூ. 150, இணையத்தில் வாங்குங்கள்."],
      events: ["நிகழ்வுகள் & வாடகை", "நிகழ்வு மேலாண்மை, கூடாரங்கள், நாற்காலிகள் மற்றும் ஒலி வாடகைக்கு."],
      gems: ["இரத்தினங்கள் & நகைகள்", "சான்றளிக்கப்பட்ட இலங்கை இரத்தினங்கள் மற்றும் நகைகள்."],
      vehicles: ["வாகனங்கள் & இயந்திரங்கள்", "கார்கள், உதிரிப்பாகங்கள் மற்றும் கனரக இயந்திரங்கள்."],
      import: ["இறக்குமதி", "உலகெங்கிலுமிருந்து இலங்கைக்குத் தரமான பொருட்கள்."],
      export: ["ஏற்றுமதி", "உலகிற்கு இலங்கைத் தேநீர், மசாலா மற்றும் பொருட்கள்."],
      shop: ["இணையக் கடை", "இணையத்தில் வாங்கி அட்டை அல்லது வங்கிப் பரிமாற்றம் மூலம் செலுத்துங்கள்."],
    },
  },
  es: {
    eyebrow: "Lo que hacemos",
    title: "Una empresa, muchas formas de ayudarte",
    text: "Cada negocio tiene sus propios especialistas, y tú tratas con un solo equipo de confianza.",
    explore: "Ver",
    items: {
      travel: ["Viajes y tours", "Vuelos, vacaciones, hoteles, visados y seguros."],
      visa: ["Empleos con visa", "Empleos en Oriente Medio y en todo el mundo."],
      fertilizer: ["Fertilizantes", "Fertilizante importado: LKR 150 por kg, compra en línea."],
      events: ["Eventos y alquiler", "Gestión de eventos, carpas, sillas y sonido en alquiler."],
      gems: ["Gemas y joyería", "Gemas de Ceilán certificadas y joyería fina."],
      vehicles: ["Vehículos y maquinaria", "Coches, repuestos y maquinaria pesada."],
      import: ["Importación", "Productos de calidad de todo el mundo para Sri Lanka."],
      export: ["Exportación", "Té, especias y productos de Ceilán para el mundo."],
      shop: ["Tienda en línea", "Compra en línea y paga con tarjeta o transferencia."],
    },
  },
};

export default function BusinessShowcase({ lang, heading = true }: { lang: Lang; heading?: boolean }) {
  const c = COPY[lang];
  return (
    <section className="stage-3d py-20">
      <div className="container-page">
        {heading ? (
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="heading-display mt-3 text-3xl sm:text-5xl">{c.title}</h2>
            <p className="mt-4 text-slate-600">{c.text}</p>
          </div>
        ) : null}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BUSINESSES.map((business, index) => {
            const [title, text] = c.items[business.key];
            return (
              <li key={business.key} className="rise" style={{ animationDelay: `${index * 70}ms` }}>
                <Tilt className="h-full rounded-[1.75rem]">
                  <Link href={business.href} className="card-3d group flex h-full items-start gap-5 p-6">
                    <span className="icon-3d h-14 w-14 shrink-0" style={{ ["--tone" as string]: business.tone }}>
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={ICONS[business.key]} />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold tracking-tight text-navy-950">{title}</span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">{text}</span>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-600 transition group-hover:gap-2">
                        {c.explore} <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </Link>
                </Tilt>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
