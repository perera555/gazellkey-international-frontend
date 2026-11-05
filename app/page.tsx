import Image from "next/image";
import Link from "next/link";
import GallerySection from "@/components/site/GallerySection";
import HeroSearch from "@/components/site/HeroSearch";
import ReviewsSection from "@/components/site/ReviewsSection";
import ItemCard from "@/components/site/ItemCard";
import PhotoTile from "@/components/site/PhotoTile";
import ServiceIcon from "@/components/site/ServiceIcon";
import Tilt from "@/components/site/Tilt";
import { apiGet } from "@/lib/api";
import { mergePlaces, TravelPlaces } from "@/lib/places";
import { DIVISIONS, labelOf, EVENT_TYPES, GEM_CHIPS } from "@/lib/divisions";
import { formatDateRange, priceLabel } from "@/lib/format";
import { CATEGORY_IMAGES, DESTINATIONS, fallbackImage, HOME_HERO_IMAGE } from "@/lib/media";
import { EventItem, GemItem, Tour } from "@/lib/types";
import { fill } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-server";
import { PAGE_WORDS } from "@/lib/i18n-pages";

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
  const [{ lang }, hero, events, tours, gems, places] = await Promise.all([
    getDictionary(),
    apiGet<ContentBlock>("/api/content/home.hero"),
    // status=PUBLISHED: signed-in staff would otherwise also get drafts
    apiGet<EventItem[]>("/api/events?pageSize=3&status=PUBLISHED"),
    apiGet<Tour[]>("/api/travel/tours?pageSize=3&status=PUBLISHED"),
    apiGet<GemItem[]>("/api/gems?pageSize=4&status=PUBLISHED"),
    apiGet<TravelPlaces>("/api/travel/places"), // country -> place lists for the search
  ]);

  const w = PAGE_WORDS[lang].home;
  // staff can edit the English hero text in the admin; other languages use ours
  const heroTitle = lang == "en" && hero.ok ? hero.data.title : w.heroTitle;
  const heroText = lang == "en" && hero.ok && typeof hero.data.body?.text == "string" ? hero.data.body.text : w.heroText;

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
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-950/80 to-navy-950/55" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-navy-950 to-transparent" />
        <div className="grid-floor -z-10" aria-hidden="true" />

        <div className="container-page relative pt-20 pb-20 sm:pt-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/5 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] text-gold-400 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
            Gazellekey International
          </p>
          <h1 className="text-3d mt-6 max-w-3xl text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">{heroText}</p>
          <div className="mt-12 sm:mt-16">
            <HeroSearch
              tourPlaces={mergePlaces(places.ok ? places.data.tours : [], "tours")}
              hotelPlaces={mergePlaces(places.ok ? places.data.hotels : [], "hotels")}
            />
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="relative border-b border-ivory-200 bg-ivory-50 pt-12 pb-16">
        <div className="container-page grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {QUICK_LINKS.map((link, index) => (
            <Tilt key={link.title} className="rounded-2xl">
              <Link href={link.href} className="card group flex h-full flex-col items-start gap-4 p-5">
                <ServiceIcon name={link.icon} color={link.color} />
                <span>
                  <span className="block font-semibold tracking-tight text-navy-950 transition group-hover:text-gold-500">{w.quick[index].title}</span>
                  <span className="mt-1 block text-sm text-slate-500">{w.quick[index].text}</span>
                </span>
              </Link>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Tours */}
      <section className="reveal container-page py-20">
        <SectionHeading
          title={tours.ok && tours.data.length > 0 ? w.popularTours : w.popularDestinations}
          text={w.toursText}
          viewAll={w.viewAll}
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
                details={[fill(w.days, { count: tour.durationDays })]}
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
      <section className="reveal relative overflow-hidden bg-linear-to-br from-navy-900 to-navy-950 py-24 text-white">
        <div className="grid-floor" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">{w.gemsEyebrow}</p>
            <h2 className="text-3d mt-4 text-4xl sm:text-5xl">{w.gemsTitle}</h2>
            <p className="mt-4 text-white/70">{w.gemsText}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {GEM_CHIPS.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="rounded-full border border-gold-500/40 px-4 py-1.5 text-sm font-medium text-gold-400 transition hover:border-gold-400 hover:bg-gold-500/10"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
            <Link href="/gems" className="btn-gold mt-8">{w.viewCollection}</Link>
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
              <PhotoTile href="/gems?itemType=GEMSTONE" image="/images/gems-rough-ruby.jpg" title={w.gemstones} text={w.gemstonesText} tall />
              <PhotoTile href="/gems?itemType=JEWELLERY" image="/images/gems-pink-sapphire.jpg" title={w.jewellery} text={w.jewelleryText} tall />
            </div>
          )}
        </div>
      </section>

      {/* Trade */}
      <section className="reveal container-page py-20">
        <SectionHeading
          title={w.tradeTitle}
          text={w.tradeText}
          viewAll={w.viewAll}
          href="/export"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRADE_TILES.map((tile, index) => (
            <PhotoTile key={tile.title} href={tile.href} image={CATEGORY_IMAGES[tile.category]} title={w.trade[index].title} text={w.trade[index].text} />
          ))}
        </div>
      </section>

      {events.ok && events.data.length > 0 ? (
        <section className="reveal border-y border-slate-200 bg-navy-50 py-20">
          <div className="container-page">
            <SectionHeading title={w.upcomingEvents} href="/events" viewAll={w.viewAll} />
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
        <h2 className="heading-display text-center text-3xl sm:text-4xl">{w.processTitle}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {w.process.map(([title, text], index) => (
            <div key={title} className="card p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-900 text-lg font-bold text-gold-400">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-navy-950">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <GallerySection />

      <ReviewsSection returnTo="/" heading={w.reviewsHeading} limit={4} />

      <section className="relative overflow-hidden bg-linear-to-r from-navy-950 to-navy-900 py-16 text-white">
        <div className="grid-floor opacity-70" aria-hidden="true" />
        <div className="container-page relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3d text-3xl">{w.trackTitle}</h2>
            <p className="mt-2 text-white/70">{w.trackText}</p>
          </div>
          <Link href="/register" className="btn-gold shrink-0">{w.createAccount}</Link>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ title, text, href, viewAll }: { title: string; text?: string; href: string; viewAll: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="heading-display text-3xl sm:text-4xl">{title}</h2>
        {text ? <p className="mt-3 max-w-2xl text-slate-500">{text}</p> : null}
      </div>
      <Link href={href} className="btn-outline btn-sm shrink-0">{viewAll}</Link>
    </div>
  );
}
