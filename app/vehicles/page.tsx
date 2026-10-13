import type { Metadata } from "next";
import DivisionHero from "@/components/site/DivisionHero";
import EmptyState from "@/components/site/EmptyState";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import FilterTabs from "@/components/site/FilterTabs";
import ItemCard from "@/components/site/ItemCard";
import Pagination from "@/components/site/Pagination";
import { apiGet, toQuery } from "@/lib/api";
import { DIVISIONS, labelOf, VEHICLE_TYPES } from "@/lib/divisions";
import { humanize, param, priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { Vehicle } from "@/lib/types";

export const metadata: Metadata = {
  title: "Vehicles & Machinery",
  description: DIVISIONS.VEHICLES.tagline,
};

const division = DIVISIONS.VEHICLES;

// /vehicles?listingType=USED_VEHICLE&make=toyota&yearFrom=2018
export default async function VehiclesPage({ searchParams }: PageProps<"/vehicles">) {
  const params = await searchParams;
  const listings = await apiGet<Vehicle[]>(
    `/api/vehicles${toQuery(
      params,
      ["listingType", "make", "yearFrom", "yearTo", "search", "pageNumber"],
      { pageSize: "12", status: "PUBLISHED" },
    )}`,
  );

  return (
    <>
      <DivisionHero division={division} />

      <section className="container-page py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="heading-display text-3xl">Listings</h2>
          <FilterTabs
            basePath="/vehicles"
            param="listingType"
            options={VEHICLE_TYPES}
            current={param(params.listingType)}
            color={division.color}
          />
        </div>

        {/* Plain GET form: filters live in the URL and work without JavaScript */}
        <form action="/vehicles" className="card mt-6 grid gap-3 p-4 sm:grid-cols-5">
          {param(params.listingType) ? (
            <input type="hidden" name="listingType" value={param(params.listingType)} />
          ) : null}
          <input name="search" placeholder="Model, part number..." defaultValue={param(params.search)} aria-label="Search" className="input sm:col-span-2" />
          <input name="make" placeholder="Make" defaultValue={param(params.make)} aria-label="Make" className="input" />
          <input name="yearFrom" type="number" min={1950} max={2100} placeholder="Year from" defaultValue={param(params.yearFrom)} aria-label="Year from" className="input" />
          <button type="submit" className="btn-navy">Search</button>
        </form>

        <div className="mt-8">
          {!listings.ok ? (
            <ErrorNote message={listings.message} />
          ) : listings.data.length == 0 ? (
            <EmptyState
              title="No matching listings"
              text="We import to order. Tell us the make, model or part you need and we will find it."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {listings.data.map((listing) => (
                <ItemCard
                  key={listing.id}
                  href={`/vehicles/${encodeURIComponent(listing.sku)}`}
                  color={division.color}
                  image={listing.images[0]}
                  fallbackImage={fallbackImage("VEHICLES", listing.listingType)}
                  eyebrow={labelOf(VEHICLE_TYPES, listing.listingType)}
                  title={listing.title}
                  details={[
                    listing.year ? String(listing.year) : null,
                    listing.mileageKm != null ? `${listing.mileageKm.toLocaleString("en-GB")} km` : null,
                    listing.fuelType,
                    listing.partNumber,
                  ]}
                  price={priceLabel(listing)}
                  badge={listing.availability != "AVAILABLE" ? humanize(listing.availability) : undefined}
                />
              ))}
            </div>
          )}
          {listings.ok ? (
            <Pagination pagination={listings.pagination} basePath="/vehicles" searchParams={params} />
          ) : null}
        </div>
      </section>

      <EnquirySection division={division} showCompany />
    </>
  );
}
