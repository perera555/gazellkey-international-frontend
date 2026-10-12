import type { Metadata } from "next";
import DivisionHero from "@/components/site/DivisionHero";
import EmptyState from "@/components/site/EmptyState";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import FilterTabs from "@/components/site/FilterTabs";
import { FlightSearch } from "@/components/site/HeroSearch";
import ItemCard from "@/components/site/ItemCard";
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
const SERVICES = [
  { icon: "flight", title: "Air ticketing", text: "One-way, return and multi-city fares from trusted airlines." },
  { icon: "visa", title: "Visa services", text: "Document checklists, application support and tracking until the decision." },
  { icon: "insurance", title: "Travel insurance", text: "Cover for medical, cancellation and baggage while you travel." },
];

export default async function TravelPage({ searchParams }: PageProps<"/travel">) {
  const params = await searchParams;
  const tours = await apiGet<Tour[]>(
    `/api/travel/tours${toQuery(params, ["tourType", "search", "pageNumber"], { pageSize: "9" })}`,
  );
  const filtered = param(params.tourType) || param(params.search);

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

      <section className="container-page grid gap-6 py-14 md:grid-cols-3">
        {SERVICES.map((service) => (
          <Tilt key={service.title} className="rounded-2xl">
            <div className="card flex h-full gap-4 p-6">
              <ServiceIcon name={service.icon} color={division.color} />
              <div>
                <h2 className="font-semibold text-navy-900">{service.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{service.text}</p>
                <a href="#enquire" className="mt-3 inline-block text-sm font-semibold" style={{ color: division.color }}>
                  Enquire now →
                </a>
              </div>
            </div>
          </Tilt>
        ))}
      </section>

      <section className="container-page pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="heading-display text-3xl sm:text-4xl">Popular Tour Packages</h2>
          <FilterTabs basePath="/travel" param="tourType" options={TOUR_TYPES} current={param(params.tourType)} />
        </div>

        <div className="mt-8">
          {!tours.ok ? (
            <ErrorNote message={tours.message} />
          ) : tours.data.length == 0 ? (
            <EmptyState
              title="No tours listed right now"
              text="We plan custom and private tours too. Tell us where you want to go."
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
                  details={[`${tour.durationDays} days`, tour.isCustomisable ? "Customisable" : null]}
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

      <EnquirySection division={division} />
    </>
  );
}
