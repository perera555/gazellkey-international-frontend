import Image from "next/image";
import Link from "next/link";
import HeroSearch from "@/components/site/HeroSearch";
import ItemCard from "@/components/site/ItemCard";
import PhotoTile from "@/components/site/PhotoTile";
import ServiceIcon from "@/components/site/ServiceIcon";
import Tilt from "@/components/site/Tilt";
import { apiGet } from "@/lib/api";
import { DIVISIONS, labelOf, EVENT_TYPES, GEM_CHIPS } from "@/lib/divisions";
import { formatDateRange, priceLabel } from "@/lib/format";
import { CATEGORY_IMAGES, DESTINATIONS, fallbackImage, HOME_HERO_IMAGE } from "@/lib/media";
import { EventItem, GemItem, Tour } from "@/lib/types";

type ContentBlock = { key: string; title: string; body: { text?: string } | null };

// Entry points under the hero (slide 6): one per service, in division colours
const QUICK_LINKS = [
  { href: "/travel#flights", icon: "flight", title: "Flight Tickets", text: "Best fares worldwide", color: DIVISIONS.TRAVEL.color },
  { href: "/travel", icon: "tour", title: "Tour Packages", text: "Amazing destinations", color: "#00a6a6" },
  { href: "/gems", icon: "gem", title: "Gems & Jewellery", text: "Certified natural gems", color: DIVISIONS.GEMS.color },
  { href: "/events", icon: "event", title: "Events", text: "Shows, expos & festivals", color: DIVISIONS.EVENTS.color },
  { href: "/vehicles", icon: "vehicle", title: "Vehicles", text: "Cars, parts & machinery", color: DIVISIONS.VEHICLES.color },
  { href: "/export", icon: "trade", title: "Import & Export", text: "Global trade solutions", color: DIVISIONS.IMPORT.color },
];

// Trade tiles: Sri Lankan exports first, then what we import
const TRADE_TILES = [
  { category: "TEA", title: "Ceylon Tea", text: "Export product", href: "/export?category=TEA" },
  { category: "SPICES", title: "Spices & Cinnamon", text: "Export product", href: "/export?category=SPICES" },
  { category: "COFFEE", title: "Coffee", text: "Export product", href: "/export?category=COFFEE" },
  { category: "FRUITS_VEGETABLES", title: "Fruits & Vegetables", text: "Export product", href: "/export?category=FRUITS_VEGETABLES" },
  { category: "ELECTRICAL_ITEMS", title: "Electronics", text: "Import product", href: "/import?category=ELECTRICAL_ITEMS" },
  { category: "HEAVY_MACHINERY", title: "Machinery", text: "Import product", href: "/vehicles?listingType=HEAVY_MACHINERY" },
];

export default async function HomePage() {
  // Hero text is editable by staff (content key "home.hero"); fall back to the default
  const [hero, events, tours, gems] = await Promise.all([
    apiGet<ContentBlock>("/api/content/home.hero"),
    apiGet<EventItem[]>("/api/events?pageSize=3"),
    apiGet<Tour[]>("/api/travel/tours?pageSize=3"),
    apiGet<GemItem[]>("/api/gems?pageSize=4"),
  ]);

  const heroTitle = hero.ok ? hero.data.title : "Explore the World With Gazellekey";
  const heroText =
    hero.ok && typeof hero.data.body?.text == "string"
      ? hero.data.body.text
      : "Your trusted travel, gems and trade partner. Global services, local care.";

  return (
    <>
      {/* Hero: beach photo, title and the tabbed search panel */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <Image
          src={HOME_HERO_IMAGE}
          alt=""
          fill
          preload
          sizes="100vw"
          className="-z-20 animate-hero-zoom object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/85 via-navy-950/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-navy-950/60 to-transparent" />

        <div className="container-page relative pt-20 pb-16 sm:pt-28">
          <p className="text-sm font-semibold tracking-[0.25em] text-gold-400 uppercase">
            Gazellekey International
          </p>
          <h1 className="text-3d mt-4 max-w-2xl text-4xl leading-[1.1] font-extrabold sm:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/90 sm:text-xl">{heroText}</p>
          <div className="mt-12 sm:mt-16">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="relative bg-navy-50 pt-12 pb-16">
        <div className="container-page grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {QUICK_LINKS.map((link) => (
            <Tilt key={link.title} className="rounded-2xl">
              <Link href={link.href} className="card flex h-full flex-col items-start gap-3 p-5">
                <ServiceIcon name={link.icon} color={link.color} />
                <span>
                  <span className="block font-semibold text-navy-900">{link.title}</span>
                  <span className="block text-sm text-slate-500">{link.text}</span>
                </span>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Tours */}
      <section className="reveal container-page py-20">
        <SectionHeading
          title={tours.ok && tours.data.length > 0 ? "Popular Tour Packages" : "Popular Destinations"}
          text="Holidays abroad and across Sri Lanka, planned end to end by our travel team."
          href="/travel"
        />
        {tours.ok && tours.data.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.data.map((tour) => (
              <ItemCard
                key={tour.id}
                href={`/travel/${tour.slug}`}
                color={DIVISIONS.TRAVEL.color}
                image={tour.images[0]}
                fallbackImage={fallbackImage("TRAVEL")}
                eyebrow={tour.destination}
                title={tour.title}
                details={[`${tour.durationDays} days`]}
                price={priceLabel(tour)}
              />
            ))}
          </div>
        ) : null}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((place) => (
            <PhotoTile key={place.name} href={place.href} image={place.image} title={place.name} text={place.text} tall />
          ))}
        </div>
      </section>

      {/* Gems */}
      <section className="reveal relative overflow-hidden bg-navy-950 py-20 text-white">
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(circle at 85% 15%, ${DIVISIONS.GEMS.color}aa, transparent 45%)` }}
        />
        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-gold-400 uppercase">Gems & Jewellery</p>
            <h2 className="text-3d mt-3 font-display text-4xl font-semibold">Gemstone Collection</h2>
            <p className="mt-4 text-white/80">
              Certified natural Ceylon sapphires, rubies and fine jewellery - with certificates
              where available, and custom pieces made to order.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {GEM_CHIPS.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
            <Link href="/gems" className="btn-gold mt-8">View the collection</Link>
          </div>
          {gems.ok && gems.data.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {gems.data.slice(0, 4).map((item) => (
                <ItemCard
                  key={item.id}
                  href={`/gems/${encodeURIComponent(item.sku)}`}
                  color={DIVISIONS.GEMS.color}
                  image={item.images[0]}
                  fallbackImage={fallbackImage("GEMS", item.itemType)}
                  title={item.name}
                  details={[item.origin, item.weight ? `${Number(item.weight)} ${item.weightUnit}` : null]}
                  price={priceLabel(item)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              <PhotoTile href="/gems?itemType=GEMSTONE" image="/images/gems-rough-ruby.jpg" title="Gemstones" text="Sapphire, ruby and more" tall />
              <PhotoTile href="/gems?itemType=JEWELLERY" image="/images/gems-pink-sapphire.jpg" title="Jewellery" text="Rings, pendants, custom pieces" tall />
            </div>
          )}
        </div>
      </section>

      {/* Trade */}
      <section className="reveal container-page py-20">
        <SectionHeading
          title="Our Trade Products"
          text="Ceylon produce to the world, and quality goods sourced worldwide for Sri Lanka."
          href="/export"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRADE_TILES.map((tile) => (
            <PhotoTile key={tile.title} href={tile.href} image={CATEGORY_IMAGES[tile.category]} title={tile.title} text={tile.text} />
          ))}
        </div>
      </section>

      {events.ok && events.data.length > 0 ? (
        <section className="reveal bg-navy-50 py-20">
          <div className="container-page">
            <SectionHeading title="Upcoming Events" href="/events" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.data.map((event) => (
                <ItemCard
                  key={event.id}
                  href={`/events/${event.slug}`}
                  color={DIVISIONS.EVENTS.color}
                  image={event.images[0]}
                  fallbackImage={fallbackImage("EVENTS", event.eventType)}
                  eyebrow={labelOf(EVENT_TYPES, event.eventType)}
                  title={event.name}
                  details={[formatDateRange(event.startDate, event.endDate), event.city ?? event.venue]}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* How it works */}
      <section className="reveal container-page py-20">
        <h2 className="heading-display text-center text-3xl sm:text-4xl">One team, one simple process</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            ["Send one enquiry", "Tell us what you need - a ticket, a tour, a gem or a shipment."],
            ["Get a clear quotation", "The right specialist replies with options and a quote you can accept online."],
            ["Track it in your account", "Follow bookings, orders, payments and documents in one place."],
          ].map(([title, text], index) => (
            <div key={title} className="card relative p-7 pt-10">
              <span className="absolute -top-6 left-7 grid h-12 w-12 place-items-center rounded-xl bg-linear-to-b from-gold-400 to-gold-500 text-xl font-extrabold text-navy-950 shadow-[0_4px_0_var(--color-gold-600),0_14px_20px_-8px_rgba(201,162,39,0.8)]">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-900 py-16 text-white">
        <div className="grid-floor opacity-50" aria-hidden="true" />
        <div className="container-page relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3d font-display text-3xl font-semibold">Track everything in one place</h2>
            <p className="mt-2 text-white/80">
              Create a free account to follow your enquiries, accept quotations and download your documents.
            </p>
          </div>
          <Link href="/register" className="btn-gold shrink-0">Create an account</Link>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ title, text, href }: { title: string; text?: string; href: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="heading-display text-3xl sm:text-4xl">{title}</h2>
        {text ? <p className="mt-2 max-w-2xl text-slate-600">{text}</p> : null}
      </div>
      <Link href={href} className="btn-outline btn-sm shrink-0">View All</Link>
    </div>
  );
}
