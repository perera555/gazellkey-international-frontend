import type { Metadata } from "next";
import DivisionHero from "@/components/site/DivisionHero";
import EmptyState from "@/components/site/EmptyState";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import FilterTabs from "@/components/site/FilterTabs";
import GallerySection from "@/components/site/GallerySection";
import ReviewsSection from "@/components/site/ReviewsSection";
import { FlightSearch } from "@/components/site/HeroSearch";
import ItemCard from "@/components/site/ItemCard";
import ListTable from "@/components/site/ListTable";
import DambadivaSection from "@/components/site/DambadivaSection";
import PlacePicker from "@/components/site/PlacePicker";
import { mergePlaces, TravelPlaces } from "@/lib/places";
import ViewToggle, { listView } from "@/components/site/ViewToggle";
import Pagination from "@/components/site/Pagination";
import PhotoTile from "@/components/site/PhotoTile";
import ServiceIcon from "@/components/site/ServiceIcon";
import Tilt from "@/components/site/Tilt";
import { apiGet, toQuery } from "@/lib/api";
import { DIVISIONS, TOUR_TYPES } from "@/lib/divisions";
import { param, priceLabel } from "@/lib/format";
import { DESTINATIONS, fallbackImage } from "@/lib/media";
import { Tour } from "@/lib/types";

export const metadata: Metadata = {
  title: "Travel Services",
  description: DIVISIONS.TRAVEL.tagline,
};

const division = DIVISIONS.TRAVEL;

// Services handled through an enquiry rather than a catalogue
const SERVICES: { icon: string; title: string; text: string; href?: string; link?: string }[] = [
  { icon: "hotel", title: "Hotels", text: "Beach resorts, city hotels and villas in Sri Lanka and abroad.", href: "/hotels", link: "Browse hotels →" },
  { icon: "flight", title: "Air ticketing", text: "One-way, return and multi-city fares from trusted airlines." },
  { icon: "visa", title: "Visa services", text: "Document checklists, application support and tracking until the decision." },
  { icon: "insurance", title: "Travel insurance", text: "Cover for medical, cancellation and baggage while you travel." },
];

export default async function TravelPage({ searchParams }: PageProps<"/travel">) {
  const params = await searchParams;
  const [tours, places] = await Promise.all([
    apiGet<Tour[]>(
      `/api/travel/tours${toQuery(params, ["tourType", "country", "search", "pageNumber"], { pageSize: "9", status: "PUBLISHED" })}`,
    ),
    apiGet<TravelPlaces>("/api/travel/places"),
  ]);
  const filtered = param(params.tourType) || param(params.search) || param(params.country);
  const view = listView(params.view);
  const tourCountries = mergePlaces(places.ok ? places.data.tours : [], "tours");
  const currentCountry = param(params.country) ?? "";

  return (
    <>
      <DivisionHero
        division={division}
        title="Explore the world with Gazellekey"
        subtitle="Flights, tour packages, visas and travel insurance - planned for you, from Colombo to anywhere."
      />

      {/* Flight search (slide 7) */}
      <section id="flights" className="relative z-10 container-page -mt-10 scroll-mt-36">
        <div className="card p-6 shadow-[0_40px_80px_-40px_rgba(11,37,69,0.6)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="heading-display text-2xl sm:text-3xl">Flight Search</h2>
            <p className="text-sm text-slate-500">Our ticketing team replies with the best available fares.</p>
          </div>
          <div className="mt-5">
            <FlightSearch label="Search Flights" />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <Tilt key={service.title} className="rounded-2xl">
            <div className="card flex h-full gap-4 p-6">
              <ServiceIcon name={service.icon} color={division.color} />
              <div>
                <h2 className="font-semibold text-navy-900">{service.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{service.text}</p>
                <a href={service.href ?? "#enquire"} className="mt-3 inline-block text-sm font-semibold" style={{ color: division.color }}>
                  {service.link ?? "Enquire now →"}
                </a>
              </div>
            </div>
          </Tilt>
        ))}
      </section>

      {/* Dambadiva pilgrimage tours (hidden while searching) */}
      {!filtered ? <DambadivaSection /> : null}

      <section className={`container-page pb-16 ${!filtered ? "pt-16" : ""}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="heading-display text-3xl sm:text-4xl">Popular Tour Packages</h2>
          <div className="flex flex-wrap items-center gap-3">
            <FilterTabs basePath="/travel" param="tourType" options={TOUR_TYPES} current={param(params.tourType)} />
            <ViewToggle basePath="/travel" searchParams={params} current={view} />
          </div>
        </div>

        {/* Search tours by country and destination */}
        <form action="/travel" className="card mt-6 grid items-end gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto]">
          {param(params.tourType) ? <input type="hidden" name="tourType" value={param(params.tourType)} /> : null}
          {view == "list" ? <input type="hidden" name="view" value="list" /> : null}
          <PlacePicker
            key={`${currentCountry}|${param(params.search) ?? ""}`}
            countries={tourCountries}
            placeParam="search"
            placeLabel="Destination"
            countLabel="tour"
            defaultCountry={currentCountry}
            defaultPlace={param(params.search) ?? ""}
          />
          <button type="submit" className="btn-gold w-full px-8 lg:w-auto">
            Search
          </button>
          {filtered ? (
            <a href="/travel" className="btn-outline w-full lg:w-auto">
              Clear
            </a>
          ) : null}
        </form>

        <div className="mt-8">
          {!tours.ok ? (
            <ErrorNote message={tours.message} />
          ) : tours.data.length == 0 ? (
            <EmptyState
              title="No tours listed right now"
              text="We plan custom and private tours too. Tell us where you want to go."
            />
          ) : view == "list" ? (
            <ListTable
              rows={tours.data}
              nameHeader="Tour"
              href={(tour) => `/travel/${tour.slug}`}
              image={(tour) => tour.images[0] ?? fallbackImage("TRAVEL")}
              title={(tour) => tour.title}
              subtitle={(tour) => (tour.isCustomisable ? "Customisable" : null)}
              columns={[
                { header: "Destination", cell: (tour) => tour.destination },
                { header: "Country", cell: (tour) => tour.country ?? "-" },
                { header: "Days", cell: (tour) => tour.durationDays },
                { header: "Type", cell: (tour) => (tour.tourType == "INBOUND" ? "Sri Lanka" : "Outbound") },
                { header: "Price", cell: (tour) => priceLabel(tour), align: "right" },
              ]}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.data.map((tour) => (
                <ItemCard
                  key={tour.id}
                  href={`/travel/${tour.slug}`}
                  color={division.color}
                  image={tour.images[0]}
                  fallbackImage={fallbackImage("TRAVEL")}
                  eyebrow={tour.destination}
                  title={tour.title}
                  details={[tour.country, `${tour.durationDays} days`, tour.isCustomisable ? "Customisable" : null]}
                  price={priceLabel(tour)}
                  badge={tour.tourType == "INBOUND" ? "Sri Lanka" : "Outbound"}
                />
              ))}
            </div>
          )}
          {tours.ok ? (
            <Pagination pagination={tours.pagination} basePath="/travel" searchParams={params} />
          ) : null}
        </div>
      </section>

      {!filtered ? (
        <section className="container-page pb-20">
          <h2 className="heading-display text-3xl">Popular destinations</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((place) => (
              <PhotoTile key={place.name} href={place.href} image={place.image} title={place.name} text={place.text} tall />
            ))}
          </div>
        </section>
      ) : null}

      {!filtered ? <GallerySection /> : null}

      <ReviewsSection returnTo="/travel" />

      <EnquirySection division={division} />
    </>
  );
}
