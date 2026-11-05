import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import { apiGetBody } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { formatMoney } from "@/lib/format";
import { Lang } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-server";
import { COMPANY, WHATSAPP_NUMBER } from "@/lib/social";
import { ShopCatalogueBody } from "@/lib/types";

export const metadata: Metadata = {
  title: "Fertilizer - buy online in Sri Lanka",
  description:
    "Imported fertilizer from Gazellekey International. Buy online by the kilogram, or contact us for bulk, estate and dealer orders with delivery in Sri Lanka.",
  keywords: ["fertilizer Sri Lanka", "buy fertilizer online", "imported fertilizer", "fertilizer price Sri Lanka", "Gazellekey International"],
  alternates: { canonical: "/fertilizer" },
};

// The products shown here are the shop products in the "Fertilizer" category
// (admin: Catalogue > Shop products). Their price, stock and unit come from there.
const CATEGORY = "Fertilizer";

const WORDS: Record<Lang, {
  eyebrow: string; title: string; titleGold: string; text: string; from: string; perKg: string;
  buyOnline: string; bulk: string; productsTitle: string; productsText: string; none: string;
  stepsTitle: string; steps: [string, string][]; bulkTitle: string; bulkText: string;
  call: string; callText: string; contactPage: string; whatsapp: string; enquiryHeading: string; enquiryText: string;
}> = {
  en: {
    eyebrow: "Import · Fertilizer",
    title: "Quality imported fertilizer,",
    titleGold: "straight from the importer",
    text: "For farms, estates and home gardens. Buy online by the kilogram, or contact us for bulk and dealer orders.",
    from: "Price",
    perKg: "per kg",
    buyOnline: "Buy online",
    bulk: "Bulk order / contact us",
    productsTitle: "Buy fertilizer online",
    productsText: "Choose the quantity, add it to your cart and pay by card or bank transfer.",
    none: "Our fertilizer will be listed here soon. Please contact us to order.",
    stepsTitle: "How to buy",
    steps: [
      ["Add to cart", "Choose how many kilograms you need."],
      ["Pay online", "By card, or by bank transfer with your order reference."],
      ["We contact you", "Our team arranges delivery or collection with you."],
    ],
    bulkTitle: "Large quantities and dealers",
    bulkText: "Buying for an estate, a farm or a shop? Send us an enquiry with the quantity and place - we reply with a price and delivery date.",
    call: "Call or visit us",
    callText: "Our phone numbers and address are on the Contact page.",
    contactPage: "Contact us",
    whatsapp: "WhatsApp us",
    enquiryHeading: "Fertilizer enquiry",
    enquiryText: "Tell us the quantity, the place and when you need it. Our team replies, usually within one working day.",
  },
  si: {
    eyebrow: "ආනයන · පොහොර",
    title: "ගුණාත්මක ආනයනික පොහොර,",
    titleGold: "ආනයනකරුගෙන්ම",
    text: "ගොවිපළ, වතු සහ ගෙවතු සඳහා. කිලෝග්‍රෑම් වශයෙන් අන්තර්ජාලයෙන් මිලදී ගන්න, නැතහොත් තොග සහ වෙළඳ ඇණවුම් සඳහා අප අමතන්න.",
    from: "මිල",
    perKg: "කිලෝවකට",
    buyOnline: "අන්තර්ජාලයෙන් මිලදී ගන්න",
    bulk: "තොග ඇණවුම / අප අමතන්න",
    productsTitle: "අන්තර්ජාලයෙන් පොහොර මිලදී ගන්න",
    productsText: "ප්‍රමාණය තෝරා, කරත්තයට එක් කර කාඩ්පතෙන් හෝ බැංකු මාරුවෙන් ගෙවන්න.",
    none: "අපේ පොහොර ඉක්මනින් මෙහි පෙන්වයි. ඇණවුම් කිරීමට කරුණාකර අප අමතන්න.",
    stepsTitle: "මිලදී ගන්නා ආකාරය",
    steps: [
      ["කරත්තයට එක් කරන්න", "ඔබට අවශ්‍ය කිලෝග්‍රෑම් ගණන තෝරන්න."],
      ["අන්තර්ජාලයෙන් ගෙවන්න", "කාඩ්පතෙන්, හෝ ඔබේ ඇණවුම් යොමු අංකය සමඟ බැංකු මාරුවෙන්."],
      ["අපි ඔබව අමතන්නෙමු", "අපේ කණ්ඩායම ඔබ සමඟ බෙදාහැරීම හෝ ලබාගැනීම සකස් කරයි."],
    ],
    bulkTitle: "විශාල ප්‍රමාණ සහ වෙළඳුන්",
    bulkText: "වත්තකට, ගොවිපළකට හෝ කඩයකට මිලදී ගන්නවාද? ප්‍රමාණය සහ ස්ථානය සමඟ විමසීමක් එවන්න - අපි මිල සහ බෙදාහැරීමේ දිනය සමඟ පිළිතුරු දෙමු.",
    call: "අප අමතන්න හෝ පැමිණෙන්න",
    callText: "අපේ දුරකථන අංක සහ ලිපිනය සම්බන්ධතා පිටුවේ ඇත.",
    contactPage: "අප අමතන්න",
    whatsapp: "WhatsApp කරන්න",
    enquiryHeading: "පොහොර විමසීම",
    enquiryText: "ප්‍රමාණය, ස්ථානය සහ අවශ්‍ය දිනය අපට කියන්න. අපේ කණ්ඩායම සාමාන්‍යයෙන් එක් වැඩ කරන දිනයක් තුළ පිළිතුරු දෙයි.",
  },
  ta: {
    eyebrow: "இறக்குமதி · உரம்",
    title: "தரமான இறக்குமதி உரம்,",
    titleGold: "இறக்குமதியாளரிடமிருந்து நேரடியாக",
    text: "பண்ணைகள், தோட்டங்கள் மற்றும் வீட்டுத் தோட்டங்களுக்கு. கிலோ கணக்கில் இணையத்தில் வாங்குங்கள், அல்லது மொத்த மற்றும் விற்பனையாளர் ஆர்டர்களுக்கு எங்களைத் தொடர்பு கொள்ளுங்கள்.",
    from: "விலை",
    perKg: "ஒரு கிலோவுக்கு",
    buyOnline: "இணையத்தில் வாங்கவும்",
    bulk: "மொத்த ஆர்டர் / தொடர்பு கொள்ளவும்",
    productsTitle: "இணையத்தில் உரம் வாங்குங்கள்",
    productsText: "அளவைத் தேர்ந்தெடுத்து, கூடையில் சேர்த்து, அட்டை அல்லது வங்கிப் பரிமாற்றம் மூலம் செலுத்துங்கள்.",
    none: "எங்கள் உரம் விரைவில் இங்கே பட்டியலிடப்படும். ஆர்டர் செய்ய எங்களைத் தொடர்பு கொள்ளுங்கள்.",
    stepsTitle: "எப்படி வாங்குவது",
    steps: [
      ["கூடையில் சேர்க்கவும்", "உங்களுக்குத் தேவையான கிலோகிராம் அளவைத் தேர்ந்தெடுக்கவும்."],
      ["இணையத்தில் செலுத்தவும்", "அட்டை மூலம், அல்லது உங்கள் ஆர்டர் குறிப்புடன் வங்கிப் பரிமாற்றம் மூலம்."],
      ["நாங்கள் தொடர்பு கொள்வோம்", "எங்கள் குழு உங்களுடன் விநியோகம் அல்லது பெற்றுக்கொள்வதை ஏற்பாடு செய்யும்."],
    ],
    bulkTitle: "பெரிய அளவுகள் மற்றும் விற்பனையாளர்கள்",
    bulkText: "தோட்டம், பண்ணை அல்லது கடைக்கு வாங்குகிறீர்களா? அளவு மற்றும் இடத்துடன் விசாரணையை அனுப்புங்கள் - விலை மற்றும் விநியோகத் தேதியுடன் பதிலளிப்போம்.",
    call: "அழைக்கவும் அல்லது வருகை தரவும்",
    callText: "எங்கள் தொலைபேசி எண்களும் முகவரியும் தொடர்பு பக்கத்தில் உள்ளன.",
    contactPage: "தொடர்பு கொள்ளவும்",
    whatsapp: "WhatsApp செய்யவும்",
    enquiryHeading: "உர விசாரணை",
    enquiryText: "அளவு, இடம் மற்றும் தேவைப்படும் நேரத்தைச் சொல்லுங்கள். எங்கள் குழு பொதுவாக ஒரு வேலை நாளுக்குள் பதிலளிக்கும்.",
  },
  es: {
    eyebrow: "Importación · Fertilizantes",
    title: "Fertilizante importado de calidad,",
    titleGold: "directo del importador",
    text: "Para fincas, plantaciones y huertos. Compra en línea por kilo, o contáctanos para pedidos al por mayor y distribuidores.",
    from: "Precio",
    perKg: "por kg",
    buyOnline: "Comprar en línea",
    bulk: "Pedido al por mayor / contacto",
    productsTitle: "Compra fertilizante en línea",
    productsText: "Elige la cantidad, añádela al carrito y paga con tarjeta o transferencia bancaria.",
    none: "Pronto publicaremos nuestro fertilizante aquí. Contáctanos para hacer un pedido.",
    stepsTitle: "Cómo comprar",
    steps: [
      ["Añade al carrito", "Elige cuántos kilos necesitas."],
      ["Paga en línea", "Con tarjeta, o por transferencia bancaria con la referencia del pedido."],
      ["Te contactamos", "Nuestro equipo organiza contigo la entrega o la recogida."],
    ],
    bulkTitle: "Grandes cantidades y distribuidores",
    bulkText: "¿Compras para una plantación, una finca o una tienda? Envíanos una consulta con la cantidad y el lugar, y te responderemos con precio y fecha de entrega.",
    call: "Llámanos o visítanos",
    callText: "Nuestros teléfonos y dirección están en la página de Contacto.",
    contactPage: "Contáctanos",
    whatsapp: "Escríbenos por WhatsApp",
    enquiryHeading: "Consulta sobre fertilizantes",
    enquiryText: "Dinos la cantidad, el lugar y cuándo lo necesitas. Nuestro equipo responde normalmente en un día laborable.",
  },
};

export default async function FertilizerPage() {
  const [{ lang }, catalogue] = await Promise.all([
    getDictionary(),
    apiGetBody<ShopCatalogueBody>(`/api/shop/catalogue?category=${encodeURIComponent(CATEGORY)}&pageSize=24`),
  ]);
  const w = WORDS[lang];
  const products = catalogue.ok ? catalogue.body.data : [];
  const cheapest = products.reduce<(typeof products)[number] | null>((best, item) => (best == null || item.price < best.price ? item : best), null);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(56rem 28rem at 88% -10%, rgb(46 158 79 / 0.40), transparent 60%), radial-gradient(40rem 24rem at 0% 120%, rgb(212 166 74 / 0.25), transparent 60%)",
          }}
        />
        <div className="grid-floor -z-10 opacity-40" aria-hidden="true" />
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">{w.eyebrow}</p>
            <h1 className="text-3d mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              {w.title} <span className="text-gold-gradient">{w.titleGold}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/70">{w.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#buy" className="btn-gold">{w.buyOnline}</a>
              <a href="#enquire" className="btn-gold-outline">{w.bulk}</a>
            </div>
          </div>
          {cheapest ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
              <p className="text-sm font-semibold tracking-wide text-white/60 uppercase">{w.from}</p>
              <p className="mt-2 text-5xl font-bold text-gold-400">{formatMoney(cheapest.price, cheapest.currency)}</p>
              <p className="mt-1 text-white/70">{cheapest.unit == "kg" ? w.perKg : `/ ${cheapest.unit}`}</p>
              <a href="#buy" className="btn-gold mt-6 w-full">{w.buyOnline}</a>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Buy online ── */}
      <section id="buy" className="scroll-mt-28 py-16">
        <div className="container-page">
          <p className="eyebrow">{w.eyebrow}</p>
          <h2 className="heading-display mt-2 text-3xl sm:text-4xl">{w.productsTitle}</h2>
          <p className="mt-3 max-w-2xl text-slate-600">{w.productsText}</p>
          <div className="mt-8">
            {!catalogue.ok ? (
              <ErrorNote message={catalogue.message} />
            ) : products.length == 0 ? (
              <p className="card px-6 py-12 text-center text-slate-600">{w.none}</p>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((item) => (
                  <li key={item.itemId}>
                    <ProductCard item={item} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* how to buy */}
          <h3 className="mt-14 text-sm font-semibold tracking-wide text-slate-500 uppercase">{w.stepsTitle}</h3>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {w.steps.map(([title, text], index) => (
              <li key={title} className="card flex gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-950 font-bold text-gold-400">{index + 1}</span>
                <span>
                  <span className="block font-semibold text-navy-950">{title}</span>
                  <span className="mt-1 block text-sm text-slate-600">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Bulk + contact ── */}
      <section className="bg-ivory-50 py-14">
        <div className="container-page grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="card p-7">
            <h2 className="heading-display text-2xl">{w.bulkTitle}</h2>
            <p className="mt-3 text-slate-600">{w.bulkText}</p>
            <a href="#enquire" className="btn-gold mt-6">{w.bulk}</a>
          </div>
          <div className="card p-7">
            <h2 className="font-semibold text-navy-950">{w.call}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {COMPANY.phone ? <a href={`tel:${COMPANY.phone}`} className="font-medium text-navy-900">{COMPANY.phone}</a> : w.callText}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/contact" className="btn-outline btn-sm">{w.contactPage}</Link>
              {WHATSAPP_NUMBER ? (
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">{w.whatsapp}</a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <EnquirySection
        division={DIVISIONS.IMPORT}
        heading={w.enquiryHeading}
        text={w.enquiryText}
        returnTo="/fertilizer#enquire"
        defaultSubject="Fertilizer order"
        showCompany
      />
    </>
  );
}
