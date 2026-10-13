import type { Metadata } from "next";
import Link from "next/link";
import DivisionHero from "@/components/site/DivisionHero";
import EmptyState from "@/components/site/EmptyState";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import FilterTabs from "@/components/site/FilterTabs";
import ItemCard from "@/components/site/ItemCard";
import Pagination from "@/components/site/Pagination";
import { apiGet, toQuery } from "@/lib/api";
import { DIVISIONS, EVENT_TYPES, labelOf } from "@/lib/divisions";
import { formatDateRange, formatMoney, param } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { EventItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Event Management",
  description: DIVISIONS.EVENTS.tagline,
};

const division = DIVISIONS.EVENTS;

// /events?eventType=CONFERENCE  /events?past=true
export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const params = await searchParams;
  const past = param(params.past) == "true";
  const events = await apiGet<EventItem[]>(
    `/api/events${toQuery(params, ["eventType", "past", "search", "pageNumber"], { pageSize: "9", status: "PUBLISHED" })}`,
  );

  return (
    <>
      <DivisionHero division={division} />

      <section className="container-page py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="heading-display text-3xl">{past ? "All events" : "Upcoming events"}</h2>
            <Link
              href={past ? "/events" : "/events?past=true"}
              className="mt-2 inline-block text-sm text-navy-700 hover:underline"
            >
              {past ? "Show upcoming only" : "Include past events"}
            </Link>
          </div>
          <FilterTabs
            basePath="/events"
            param="eventType"
            options={EVENT_TYPES}
            current={param(params.eventType)}
            color={division.color}
          />
        </div>

        <div className="mt-8">
          {!events.ok ? (
            <ErrorNote message={events.message} />
          ) : events.data.length == 0 ? (
            <EmptyState
              title="No events scheduled"
              text="New events are added regularly. Planning your own event? We can organise it for you."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.data.map((event) => (
                <ItemCard
                  key={event.id}
                  href={`/events/${event.slug}`}
                  color={division.color}
                  image={event.images[0]}
                  fallbackImage={fallbackImage("EVENTS", event.eventType)}
                  eyebrow={labelOf(EVENT_TYPES, event.eventType)}
                  title={event.name}
                  details={[formatDateRange(event.startDate, event.endDate), event.city ?? event.venue]}
                  price={event.fee ? formatMoney(event.fee, event.currency) : "Free"}
                  badge={event.seatsLeft != null && event.seatsLeft <= 0 ? "Fully booked" : undefined}
                />
              ))}
            </div>
          )}
          {events.ok ? (
            <Pagination pagination={events.pagination} basePath="/events" searchParams={params} />
          ) : null}
        </div>
      </section>

      <EnquirySection
        division={division}
        heading="Organise an event with us"
        text="Trade shows, exhibitions, conferences, festivals or tournaments - tell us about your event or ask for exhibitor space."
        showCompany
      />
    </>
  );
}
