import type { Metadata } from "next";
import Link from "next/link";
import DivisionHero from "@/components/site/DivisionHero";
import EmptyState from "@/components/site/EmptyState";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import ItemCard from "@/components/site/ItemCard";
import ListTable from "@/components/site/ListTable";
import Pagination from "@/components/site/Pagination";
import Stars from "@/components/site/Stars";
import ViewToggle, { listView } from "@/components/site/ViewToggle";
import { apiGet, toQuery } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { param, priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { mergePlaces, TravelPlaces } from "@/lib/places";
import { Hotel } from "@/lib/types";
import PlacePicker from "@/components/site/PlacePicker";

export const metadata: Metadata = {
  title: "Hotels",
  description: "Hotels in Sri Lanka and abroad, booked for you by the Gazellekey travel team.",
};

const division = DIVISIONS.TRAVEL;

// The stay a visitor searched for, passed on to the hotel page and its booking request
const STAY_KEYS = ["checkin", "checkout", "guests"] as const;

// /hotels?country=Sri Lanka&city=Galle&stars=4&checkin=2026-12-20&checkout=2026-12-23&guests=2 guests&view=list
// (?search= is still accepted: free text matched on hotel name, city and country)
export default async function HotelsPage({ searchParams }: PageProps<"/hotels">) {
  const params = await searchParams;
  const view = listView(params.view);
  const country = param(params.country) ?? "";
  const city = param(params.city) ?? "";
  const search = city || param(params.search) || country;
  const [hotels, places] = await Promise.all([
    apiGet<Hotel[]>(
      `/api/travel/hotels${toQuery(params, ["country", "city", "search", "stars", "pageNumber"], { pageSize: "12", status: "PUBLISHED" })}`,
    ),
    apiGet<TravelPlaces>("/api/travel/places"),
  ]);
  const countries = mergePlaces(places.ok ? places.data.hotels : [], "hotels");

  // stay details travel with the links to each hotel
  const stay = new URLSearchParams();
  for (const key of STAY_KEYS) {
    const value = param(params[key]);
    if (value) stay.set(key, value);
  }
  const hotelHref = (hotel: Hotel) => `/hotels/${hotel.slug}${stay.size ? `?${stay}` : ""}`;
  const fromPrice = (hotel: Hotel) => (hotel.pricingMode == "FIXED" ? `From ${priceLabel(hotel)}` : priceLabel(hotel));

  const requestHref = `/contact?${new URLSearchParams({
    division: "TRAVEL",
    service: "HOTEL",
    subject: `Hotel reservation${search ? `: ${search}` : ""}`,
    message: [
      search ? `Destination: ${search}` : "",
      param(params.checkin) ? `Check-in: ${param(params.checkin)}` : "",
      param(params.checkout) ? `Check-out: ${param(params.checkout)}` : "",
      param(params.guests) ? `Guests: ${param(params.guests)}` : "",
    ].filter(Boolean).join("\n"),
  })}#enquiry`;

  return (
    <>
      <DivisionHero
        division={division}
        title="Hotels"
        subtitle="From beach resorts in Sri Lanka to city hotels abroad - choose a hotel and our travel team books it for you."
        breadcrumb={{ href: "/travel", label: "Travel" }}
        image="/images/travel-maldives.jpg"
      />

      <section className="container-page py-12">
        {/* Plain GET form: filters live in the URL */}
        <form action="/hotels" className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
          {view == "list" ? <input type="hidden" name="view" value="list" /> : null}
          {param(params.search) ? <input type="hidden" name="search" value={param(params.search)} /> : null}
          <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3 lg:col-span-6">
            <PlacePicker
              key={`${country}|${city}`}
              countries={countries}
              placeParam="city"
              placeLabel="City"
              countLabel="hotel"
              defaultCountry={country}
              defaultPlace={city}
              hotelHrefQuery={stay.size ? `?${stay}` : ""}
            />
          </div>
          <label className="block">
            <span className="label">Stars</span>
            <select name="stars" defaultValue={param(params.stars) ?? ""} className="input">
              <option value="">Any</option>
              <option value="3">3 stars +</option>
              <option value="4">4 stars +</option>
              <option value="5">5 stars</option>
            </select>
          </label>
          <label className="block">
            <span className="label">Check-in</span>
            <input name="checkin" type="date" defaultValue={param(params.checkin)} className="input" />
          </label>
          <label className="block">
            <span className="label">Check-out</span>
            <input name="checkout" type="date" defaultValue={param(params.checkout)} className="input" />
          </label>
          <label className="block">
            <span className="label">Guests</span>
            <select name="guests" defaultValue={param(params.guests) ?? "2 guests"} className="input">
              {["1 guest", "2 guests", "3 guests", "4 guests", "5+ guests"].map((count) => (
                <option key={count}>{count}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2 sm:col-span-2 lg:justify-end">
            {search || param(params.stars) ? <Link href={view == "list" ? "/hotels?view=list" : "/hotels"} className="btn-outline">Clear</Link> : null}
            <button type="submit" className="btn-gold px-8">Search hotels</button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="heading-display text-3xl">{search ? `Hotels in ${search}` : "Our hotels"}</h2>
            {hotels.ok ? (
              <p className="mt-1 text-sm text-slate-500">
                {hotels.pagination?.totalCount ?? hotels.data.length} hotel{(hotels.pagination?.totalCount ?? hotels.data.length) == 1 ? "" : "s"} found
              </p>
            ) : null}
          </div>
          <ViewToggle basePath="/hotels" searchParams={params} current={view} />
        </div>

        <div className="mt-6">
          {!hotels.ok ? (
            <ErrorNote message={hotels.message} />
          ) : hotels.data.length == 0 ? (
            <div className="space-y-4">
              <EmptyState
                title="No hotels listed here yet"
                text="We book hotels worldwide. Tell us where and when, and we will send you the best options."
              />
              <div className="text-center">
                <Link href={requestHref} className="btn-gold">Request a hotel{search ? ` in ${search}` : ""}</Link>
              </div>
            </div>
          ) : view == "list" ? (
            <ListTable
              rows={hotels.data}
              nameHeader="Hotel"
              href={hotelHref}
              image={(hotel) => hotel.images[0] ?? fallbackImage("TRAVEL")}
              title={(hotel) => hotel.name}
              subtitle={(hotel) => hotel.address}
              columns={[
                { header: "City", cell: (hotel) => hotel.city },
                { header: "Country", cell: (hotel) => hotel.country },
                { header: "Stars", cell: (hotel) => (hotel.starRating ? <Stars rating={hotel.starRating} size={14} /> : "-") },
                { header: "Rooms", cell: (hotel) => (hotel.roomTypes.length ? `${hotel.roomTypes.length} types` : "-") },
                { header: "Per night", cell: fromPrice, align: "right" },
              ]}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.data.map((hotel) => (
                <ItemCard
                  key={hotel.id}
                  href={hotelHref(hotel)}
                  color={division.color}
                  image={hotel.images[0]}
                  fallbackImage={fallbackImage("TRAVEL")}
                  eyebrow={hotel.starRating ? `${"★".repeat(hotel.starRating)} hotel` : "Hotel"}
                  title={hotel.name}
                  details={[[hotel.city, hotel.country].join(", "), hotel.facilities.slice(0, 2).join(" · ") || null]}
                  price={fromPrice(hotel)}
                />
              ))}
            </div>
          )}
          {hotels.ok ? <Pagination pagination={hotels.pagination} basePath="/hotels" searchParams={params} /> : null}
        </div>
      </section>

      <EnquirySection
        division={division}
        heading="Can't find your hotel?"
        text="We book hotels worldwide. Tell us the city, dates and budget and we will reply with options and prices."
      />
    </>
  );
}
