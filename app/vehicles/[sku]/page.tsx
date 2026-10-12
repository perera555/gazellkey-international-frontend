import type { Metadata } from "next";
import { cache } from "react";
import DetailLayout, { FactList, specFacts } from "@/components/site/DetailLayout";
import DivisionHero from "@/components/site/DivisionHero";
import StatusBadge from "@/components/site/StatusBadge";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { apiGetItem } from "@/lib/api";
import { DIVISIONS, labelOf, VEHICLE_TYPES } from "@/lib/divisions";
import { priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { getSessionUser } from "@/lib/session";
import { Vehicle } from "@/lib/types";

const division = DIVISIONS.VEHICLES;

const getListing = cache((sku: string) =>
  apiGetItem<Vehicle>(`/api/vehicles/${encodeURIComponent(sku)}`),
);

export async function generateMetadata({ params }: PageProps<"/vehicles/[sku]">): Promise<Metadata> {
  const listing = await getListing((await params).sku);
  return { title: listing.title, description: listing.description.slice(0, 160) };
}

export default async function VehiclePage({ params }: PageProps<"/vehicles/[sku]">) {
  const listing = await getListing((await params).sku);
  const user = await getSessionUser();
  const specs = specFacts(listing.specifications);

  return (
    <>
      <DivisionHero
        division={division}
        title={listing.title}
        subtitle={labelOf(VEHICLE_TYPES, listing.listingType)}
        breadcrumb={{ href: "/vehicles", label: "Vehicles & Machinery" }}
        image={listing.images[0]}
      />
      <DetailLayout
        title={listing.title}
        images={listing.images}
        fallbackImage={fallbackImage("VEHICLES", listing.listingType)}
        main={
          <>
            <section>
              <h2 className="heading-display text-2xl">Description</h2>
              <p className="mt-4 whitespace-pre-line text-slate-700">{listing.description}</p>
            </section>
            {listing.compatibleWith.length > 0 ? (
              <section>
                <h2 className="font-semibold text-navy-900">Compatible with</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {listing.compatibleWith.map((model) => (
                    <li key={model} className="badge bg-navy-50 text-navy-800">{model}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            {specs.length > 0 ? (
              <section>
                <h2 className="font-semibold text-navy-900">Specifications</h2>
                <div className="card mt-3 px-5">
                  <FactList facts={specs} />
                </div>
              </section>
            ) : null}
          </>
        }
        aside={
          <>
            <div className="card p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="text-2xl font-semibold text-navy-900">{priceLabel(listing)}</p>
                <StatusBadge value={listing.availability} />
              </div>
              <div className="mt-4">
                <FactList
                  facts={[
                    ["Reference", listing.sku],
                    ["Make", listing.make],
                    ["Model", listing.model],
                    ["Year", listing.year],
                    ["Condition", listing.condition],
                    ["Mileage", listing.mileageKm != null ? `${listing.mileageKm.toLocaleString("en-GB")} km` : null],
                    ["Operating hours", listing.operatingHours],
                    ["Fuel", listing.fuelType],
                    ["Transmission", listing.transmission],
                    ["Part number", listing.partNumber],
                    ["In stock", listing.listingType == "SPARE_PART" ? listing.stock : null],
                  ]}
                />
              </div>
            </div>
            <div className="card p-6">
              <h2 className="font-semibold text-navy-900">Enquire about this listing</h2>
              <div className="mt-4">
                <EnquiryForm
                  division="VEHICLES"
                  services={division.services}
                  defaultService={listing.listingType}
                  itemType="VEHICLE_LISTING"
                  itemId={listing.id}
                  defaultSubject={`${listing.title} (${listing.sku})`}
                  prefill={user ?? undefined}
                  submitLabel="Request a quote"
                />
              </div>
            </div>
          </>
        }
      />
    </>
  );
}
