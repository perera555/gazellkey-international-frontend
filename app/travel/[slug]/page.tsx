import type { Metadata } from "next";
import { cache } from "react";
import DetailLayout, { FactList } from "@/components/site/DetailLayout";
import DivisionHero from "@/components/site/DivisionHero";
import EnquiryForm from "@/components/forms/EnquiryForm";
import ReviewsSection from "@/components/site/ReviewsSection";
import { apiGetItem } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { formatDate, priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { getSessionUser } from "@/lib/session";
import { Tour } from "@/lib/types";

const division = DIVISIONS.TRAVEL;

const getTour = cache((slug: string) =>
  apiGetItem<Tour>(`/api/travel/tours/${encodeURIComponent(slug)}`),
);

export async function generateMetadata({ params }: PageProps<"/travel/[slug]">): Promise<Metadata> {
  const tour = await getTour((await params).slug);
  return { title: tour.title, description: tour.summary };
}

export default async function TourPage({ params }: PageProps<"/travel/[slug]">) {
  const tour = await getTour((await params).slug);
  const user = await getSessionUser();
  const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : [];
  const groupSize =
    tour.minGroupSize || tour.maxGroupSize
      ? [tour.minGroupSize, tour.maxGroupSize].filter(Boolean).join(" - ") + " people"
      : null;

  return (
    <>
      <DivisionHero
        division={division}
        title={tour.title}
        subtitle={tour.summary}
        breadcrumb={{ href: "/travel", label: "Travel" }}
        image={tour.images[0]}
      />
      <DetailLayout
        title={tour.title}
        images={tour.images}
        fallbackImage={fallbackImage("TRAVEL")}
        main={
          <>
            {itinerary.length > 0 ? (
              <section>
                <h2 className="heading-display text-2xl">Itinerary</h2>
                <ol className="mt-5 space-y-4">
                  {itinerary.map((day, index) => (
                    <li key={index} className="flex gap-4">
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
                        style={{ background: division.color }}
                      >
                        {day.day ?? index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-navy-900">{day.title}</h3>
                        {day.description ? (
                          <p className="mt-1 text-sm text-slate-600">{day.description}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <div className="grid gap-6 sm:grid-cols-2">
              <TextList title="Included" items={tour.inclusions} mark="✓" />
              <TextList title="Not included" items={tour.exclusions} mark="–" />
            </div>
          </>
        }
        aside={
          <>
            <div className="card overflow-hidden p-6">
              <span className="-mx-6 -mt-6 mb-5 block h-1.5" style={{ background: division.color }} />
              <p className="text-3xl font-bold text-navy-900">{priceLabel(tour)}</p>
              {tour.pricingMode == "FIXED" ? <p className="text-sm text-slate-500">per person</p> : null}
              <div className="mt-4">
                <FactList
                  facts={[
                    ["Destination", tour.destination],
                    ["Country", tour.country],
                    ["Duration", `${tour.durationDays} days`],
                    ["Group size", groupSize],
                    ["Custom / private", tour.isCustomisable ? "Available" : null],
                  ]}
                />
              </div>
              {tour.departureDates.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-navy-900">Departure dates</h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {tour.departureDates.map((date) => (
                      <li key={date} className="badge bg-navy-50 text-navy-800">{formatDate(date)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <div className="card p-6">
              <h2 className="font-semibold text-navy-900">Enquire about this tour</h2>
              <div className="mt-4">
                <EnquiryForm
                  division="TRAVEL"
                  services={division.services}
                  defaultService={tour.tourType == "INBOUND" ? "INBOUND_TOUR" : "OUTBOUND_TOUR"}
                  itemType="TOUR_PACKAGE"
                  itemId={tour.id}
                  defaultSubject={`Tour: ${tour.title}`}
                  prefill={user ?? undefined}
                  submitLabel="Request a quote"
                />
              </div>
            </div>
          </>
        }
      />
      <ReviewsSection
        tourId={tour.id}
        tourTitle={tour.title}
        heading="Reviews of this tour"
        text="What travellers say about this package."
        returnTo={`/travel/${tour.slug}`}
      />
    </>
  );
}

function TextList({ title, items, mark }: { title: string; items: string[]; mark: string }) {
  if (items.length == 0) {
    return null;
  }
  return (
    <section>
      <h2 className="font-semibold text-navy-900">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="text-slate-400">{mark}</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
