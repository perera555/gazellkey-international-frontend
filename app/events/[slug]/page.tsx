import type { Metadata } from "next";
import { cache } from "react";
import DetailLayout, { FactList } from "@/components/site/DetailLayout";
import DivisionHero from "@/components/site/DivisionHero";
import EventRegistrationForm from "@/components/forms/EventRegistrationForm";
import { apiGetItem } from "@/lib/api";
import { DIVISIONS, EVENT_TYPES, labelOf } from "@/lib/divisions";
import { formatDateRange, formatMoney } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { getSessionUser } from "@/lib/session";
import { EventItem } from "@/lib/types";

const division = DIVISIONS.EVENTS;

const getEvent = cache((slug: string) =>
  apiGetItem<EventItem>(`/api/events/${encodeURIComponent(slug)}`),
);

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  return { title: event.name, description: event.description.slice(0, 160) };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const event = await getEvent((await params).slug);
  const user = await getSessionUser();
  const feeLabel = event.fee ? formatMoney(event.fee, event.currency) : undefined;
  const ended = new Date(event.endDate) < new Date();
  const place = [event.venue, event.city, event.country].filter(Boolean).join(", ");

  return (
    <>
      <DivisionHero
        division={division}
        title={event.name}
        subtitle={`${formatDateRange(event.startDate, event.endDate)} · ${place}`}
        breadcrumb={{ href: "/events", label: "Events" }}
        image={event.images[0]}
      />
      <DetailLayout
        title={event.name}
        images={event.images}
        fallbackImage={fallbackImage("EVENTS", event.eventType)}
        main={
          <>
            <section>
              <h2 className="heading-display text-2xl">About this event</h2>
              <p className="mt-4 whitespace-pre-line text-slate-700">{event.description}</p>
            </section>
            {event.terms ? (
              <section>
                <h2 className="font-semibold text-navy-900">Terms</h2>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{event.terms}</p>
              </section>
            ) : null}
          </>
        }
        aside={
          <>
            <div className="card p-6">
              <FactList
                facts={[
                  ["Type", labelOf(EVENT_TYPES, event.eventType)],
                  ["Dates", formatDateRange(event.startDate, event.endDate)],
                  ["Venue", place],
                  ["Organiser", event.organiser],
                  ["Fee", feeLabel ?? "Free"],
                  ["Seats left", event.seatsLeft],
                ]}
              />
            </div>
            <div id="register" className="card p-6">
              <h2 className="mb-4 font-semibold text-navy-900">Register</h2>
              {ended ? (
                <p className="text-sm text-slate-600">This event has ended.</p>
              ) : !event.registrationOpen ? (
                <p className="text-sm text-slate-600">Registration is closed for this event.</p>
              ) : (
                <EventRegistrationForm
                  eventId={event.id}
                  seatsLeft={event.seatsLeft}
                  feeLabel={feeLabel}
                  prefill={user ?? undefined}
                />
              )}
            </div>
          </>
        }
      />
    </>
  );
}
