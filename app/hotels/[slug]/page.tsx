import type { Metadata } from "next";
import { cache } from "react";
import DetailLayout, { FactList } from "@/components/site/DetailLayout";
import DivisionHero from "@/components/site/DivisionHero";
import SignInGate from "@/components/site/SignInGate";
import Stars from "@/components/site/Stars";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { apiGetItem } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { param, priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { getSessionUser } from "@/lib/session";
import { shareMetadata } from "@/lib/social";
import { Hotel } from "@/lib/types";

const division = DIVISIONS.TRAVEL;

const getHotel = cache((slug: string) => apiGetItem<Hotel>(`/api/travel/hotels/${encodeURIComponent(slug)}`));

export async function generateMetadata({ params }: PageProps<"/hotels/[slug]">): Promise<Metadata> {
  const hotel = await getHotel((await params).slug);
  return shareMetadata({
    title: `${hotel.name}, ${hotel.city}`,
    description: hotel.summary.slice(0, 160),
    path: `/hotels/${hotel.slug}`,
    image: hotel.images[0] ?? fallbackImage("TRAVEL"),
  });
}

// /hotels/{slug}?checkin=&checkout=&guests= (stay details from the hotel search)
export default async function HotelPage({ params, searchParams }: PageProps<"/hotels/[slug]">) {
  const [hotel, query, user] = await Promise.all([
    getHotel((await params).slug),
    searchParams,
    getSessionUser(),
  ]);
  const stay = {
    checkin: param(query.checkin),
    checkout: param(query.checkout),
    guests: param(query.guests),
  };
  const stayQuery = new URLSearchParams(Object.entries(stay).filter((entry): entry is [string, string] => Boolean(entry[1])));
  const returnTo = `/hotels/${hotel.slug}${stayQuery.size ? `?${stayQuery}` : ""}#book`;

  return (
    <>
      <DivisionHero
        division={division}
        title={hotel.name}
        subtitle={[hotel.city, hotel.country].join(", ")}
        breadcrumb={{ href: "/hotels", label: "Hotels" }}
        image={hotel.images[0]}
      />
      <DetailLayout
        title={hotel.name}
        sharePath={`/hotels/${hotel.slug}`}
        images={hotel.images}
        fallbackImage={fallbackImage("TRAVEL")}
        main={
          <>
            <section>
              {hotel.starRating ? <Stars rating={hotel.starRating} size={20} /> : null}
              <h2 className="heading-display mt-2 text-2xl">About the hotel</h2>
              <p className="mt-4 whitespace-pre-line text-slate-700">{hotel.summary}</p>
            </section>

            {hotel.roomTypes.length > 0 ? (
              <section>
                <h2 className="font-semibold text-navy-900">Rooms</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {hotel.roomTypes.map((room) => (
                    <li key={room} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-900 text-gold-400" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 20V8M21 20v-6a3 3 0 0 0-3-3H8v6M3 17h18M6 11a2 2 0 1 0 0-.01" />
                        </svg>
                      </span>
                      {room}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {hotel.facilities.length > 0 ? (
              <section>
                <h2 className="font-semibold text-navy-900">Facilities</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {hotel.facilities.map((facility) => (
                    <li key={facility} className="badge gap-1.5 bg-navy-50 py-1 text-navy-800">
                      <span className="text-gold-600" aria-hidden="true">✓</span>
                      {facility}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        }
        aside={
          <>
            <div className="card overflow-hidden p-6">
              <span className="-mx-6 -mt-6 mb-5 block h-1.5" style={{ background: division.color }} />
              <p className="text-3xl font-bold text-navy-900">
                {hotel.pricingMode == "FIXED" ? <span className="text-base font-medium text-slate-500">From </span> : null}
                {priceLabel(hotel)}
              </p>
              {hotel.pricingMode == "FIXED" ? <p className="text-sm text-slate-500">per room, per night</p> : null}
              <div className="mt-4">
                <FactList
                  facts={[
                    ["City", hotel.city],
                    ["Country", hotel.country],
                    ["Address", hotel.address],
                    ["Check-in", hotel.checkInTime ? `from ${hotel.checkInTime}` : null],
                    ["Check-out", hotel.checkOutTime ? `until ${hotel.checkOutTime}` : null],
                  ]}
                />
              </div>
            </div>

            <div id="book" className="card scroll-mt-36 p-6">
              {user == null ? (
                <SignInGate
                  title="Sign up to request a booking"
                  text="Create a free account to request this hotel and follow our reply."
                  returnTo={returnTo}
                  compact
                />
              ) : (
                <>
                  <h2 className="font-semibold text-navy-900">Request a booking</h2>
                  <p className="mt-1 text-xs text-slate-500">Our travel team checks availability and replies with the best rate.</p>
                  <div className="mt-4">
                    <EnquiryForm
                      division="TRAVEL"
                      services={division.services}
                      defaultService="HOTEL"
                      itemType="HOTEL"
                      itemId={hotel.id}
                      defaultSubject={`Hotel: ${hotel.name}, ${hotel.city}`}
                      defaultMessage={[
                        `Check-in: ${stay.checkin ?? ""}`,
                        `Check-out: ${stay.checkout ?? ""}`,
                        `Guests: ${stay.guests ?? ""}`,
                        hotel.roomTypes.length > 0 ? "Room type: " : "",
                      ].filter(Boolean).join("\n")}
                      prefill={user}
                      submitLabel="Request booking"
                    />
                  </div>
                </>
              )}
            </div>
          </>
        }
      />
    </>
  );
}
