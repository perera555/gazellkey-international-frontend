import type { Metadata } from "next";
import Link from "next/link";
import DivisionHero from "@/components/site/DivisionHero";
import EmptyState from "@/components/site/EmptyState";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import { ChipNav } from "@/components/site/FilterTabs";
import ItemCard from "@/components/site/ItemCard";
import Pagination from "@/components/site/Pagination";
import MakeModelPicker from "@/components/vehicles/MakeModelPicker";
import { apiGet, toQuery } from "@/lib/api";
import { DIVISIONS, labelOf, VEHICLE_TYPES } from "@/lib/divisions";
import { humanize, param, priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { Vehicle } from "@/lib/types";
import { MakeEntry, mergeModels, splitFits } from "@/lib/vehicle-models";

export const metadata: Metadata = {
  title: "Vehicles & Machinery",
  description: DIVISIONS.VEHICLES.tagline,
};

const division = DIVISIONS.VEHICLES;
const VEHICLE_KINDS = VEHICLE_TYPES.filter((type) => type.value != "SPARE_PART");

type Section = "vehicles" | "parts";

// /vehicles                         vehicles + machinery (?listingType=&make=&model=&yearFrom=&yearTo=&search=)
// /vehicles?section=parts           spare parts (?fits=Toyota Aqua&search=part number)
export default async function VehiclesPage({ searchParams }: PageProps<"/vehicles">) {
  const params = await searchParams;
  const section: Section = param(params.section) == "parts" ? "parts" : "vehicles";
  const make = param(params.make) ?? "";
  const model = param(params.model) ?? "";
  const fits = param(params.fits) ?? "";
  const search = param(params.search) ?? "";

  const [listings, catalogueModels] = await Promise.all([
    apiGet<Vehicle[]>(
      `/api/vehicles${toQuery(
        params,
        section == "parts"
          ? ["make", "fits", "search", "pageNumber"]
          : ["listingType", "make", "model", "yearFrom", "yearTo", "search", "pageNumber"],
        { pageSize: section == "parts" ? "20" : "12", status: "PUBLISHED", kind: section },
      )}`,
    ),
    apiGet<MakeEntry[]>("/api/vehicles/models"),
  ]);
  const directory = mergeModels(catalogueModels.ok ? catalogueModels.data : []);
  const pickerMakes = directory.map((entry) => ({ make: entry.make, models: entry.models.map((each) => each.model) }));

  const [fitsMake, fitsModel] = fits ? splitFits(fits) : [make, ""];
  const lookingFor =
    section == "parts"
      ? fits || make
      : [make, model].filter(Boolean).join(" ");

  // contact form, pre-filled, for anything we do not have in stock
  const requestHref = `/contact?${new URLSearchParams({
    division: "VEHICLES",
    service: section == "parts" ? "SPARE_PART" : (param(params.listingType) ?? "USED_VEHICLE"),
    subject: section == "parts"
      ? `Spare part${lookingFor ? ` for ${lookingFor}` : ""}${search ? `: ${search}` : ""}`
      : `Looking for${lookingFor ? ` a ${lookingFor}` : " a vehicle"}`,
  })}#enquiry`;

  return (
    <>
      <DivisionHero division={division} />

      {/* Vehicles | Spare parts */}
      <section className="container-page pt-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <SectionCard
            href="/vehicles"
            active={section == "vehicles"}
            title="Vehicles & machinery"
            text="New and used cars, vans, SUVs and heavy machinery - in stock or imported to order."
            icon="M3 16v-4l2-5h14l2 5v4zM3 16v3h3v-3M18 16v3h3v-3M7 13h.01M17 13h.01M5 12h14"
          />
          <SectionCard
            href="/vehicles?section=parts"
            active={section == "parts"}
            title="Spare parts"
            text="Genuine and reconditioned parts. Find parts by your vehicle's make and model, or by part number."
            icon="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"
          />
        </div>
      </section>

      <section className="container-page py-10">
        {/* Filters: a plain GET form, so filters live in the URL */}
        <form action="/vehicles" className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
          {section == "parts" ? (
            <>
              <input type="hidden" name="section" value="parts" />
              <input name="search" placeholder="Part name, SKU or part number..." defaultValue={search} aria-label="Search parts" className="input lg:col-span-2" />
              <MakeModelPicker key={fits || make} makes={pickerMakes} mode="parts" defaultMake={fitsMake} defaultModel={fitsModel} />
              <button type="submit" className="btn-navy lg:col-span-2">Find parts</button>
            </>
          ) : (
            <>
              {param(params.listingType) ? <input type="hidden" name="listingType" value={param(params.listingType)} /> : null}
              <input name="search" placeholder="Search vehicles..." defaultValue={search} aria-label="Search vehicles" className="input lg:col-span-2" />
              <MakeModelPicker key={`${make}|${model}`} makes={pickerMakes} mode="vehicle" defaultMake={make} defaultModel={model} />
              <input name="yearFrom" type="number" min={1950} max={2100} placeholder="Year from" defaultValue={param(params.yearFrom)} aria-label="Year from" className="input" />
              <button type="submit" className="btn-navy">Search</button>
            </>
          )}
        </form>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="heading-display text-2xl sm:text-3xl">
              {section == "parts"
                ? fits || make
                  ? `Parts for ${fits || make}`
                  : "Spare parts"
                : lookingFor
                  ? lookingFor
                  : "Vehicles & machinery"}
            </h2>
            {listings.ok ? (
              <p className="mt-1 text-sm text-slate-500">
                {listings.pagination?.totalCount ?? listings.data.length} {section == "parts" ? "part" : "listing"}
                {(listings.pagination?.totalCount ?? listings.data.length) == 1 ? "" : "s"} found
                {lookingFor || search ? (
                  <>
                    {" · "}
                    <Link href={section == "parts" ? "/vehicles?section=parts" : "/vehicles"} className="font-medium text-navy-800 underline">
                      Clear filters
                    </Link>
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
          {section == "vehicles" ? (
            <ChipNav
              chips={[{ value: "", label: "All" }, ...VEHICLE_KINDS].map((option) => {
                const query = new URLSearchParams();
                if (option.value) query.set("listingType", option.value);
                if (make) query.set("make", make);
                if (model) query.set("model", model);
                return {
                  href: `/vehicles${query.size ? `?${query}` : ""}`,
                  label: option.label,
                  active: (param(params.listingType) ?? "") == option.value,
                };
              })}
            />
          ) : null}
        </div>

        {/* Results */}
        <div className="mt-6">
          {!listings.ok ? (
            <ErrorNote message={listings.message} />
          ) : listings.data.length == 0 ? (
            <div className="space-y-4">
              <EmptyState
                title={section == "parts" ? "No matching parts in stock" : "No matching vehicles in stock"}
                text={
                  section == "parts"
                    ? "We source parts to order. Tell us your vehicle and the part you need, and we will find it."
                    : "We import to order. Tell us the make, model and year you want, and we will find it."
                }
              />
              <div className="text-center">
                <Link href={requestHref} className="btn-gold">
                  {section == "parts" ? `Request ${lookingFor ? `parts for ${lookingFor}` : "a part"}` : `Request ${lookingFor || "a vehicle"}`}
                </Link>
              </div>
            </div>
          ) : section == "parts" ? (
            <PartsList parts={listings.data} />
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
                    [listing.make, listing.model].filter(Boolean).join(" ") || null,
                    listing.year ? String(listing.year) : null,
                    listing.mileageKm != null ? `${listing.mileageKm.toLocaleString("en-GB")} km` : null,
                    listing.operatingHours != null ? `${listing.operatingHours.toLocaleString("en-GB")} hrs` : null,
                    listing.fuelType,
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

      {/* Browse by make & model */}
      <section id="models" className="scroll-mt-28 border-t border-slate-200 bg-white py-14">
        <div className="container-page">
          <p className="eyebrow">Model list</p>
          <h2 className="heading-display mt-2 text-3xl">
            {section == "parts" ? "Find parts by make & model" : "Browse by make & model"}
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            {section == "parts"
              ? "Choose your vehicle to see the parts that fit it. Green numbers show parts we have in stock."
              : "Choose a model to see what we have. Green numbers show vehicles in stock - anything else we can import to order."}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {directory.map((entry) => {
              const count = section == "parts" ? entry.parts : entry.vehicles;
              const makeHref =
                section == "parts"
                  ? `/vehicles?${new URLSearchParams({ section: "parts", make: entry.make })}`
                  : `/vehicles?${new URLSearchParams({ make: entry.make })}`;
              return (
                <div key={entry.make} className="card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={makeHref} className="flex items-center gap-3 font-semibold text-navy-950 hover:text-gold-600">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-sm font-bold text-gold-400">
                        {entry.make.charAt(0)}
                      </span>
                      {entry.make}
                    </Link>
                    <span className="text-xs text-slate-500">
                      {entry.machinery ? "Machinery · " : ""}
                      {count > 0 ? <b className="text-emerald-700">{count} in stock</b> : "To order"}
                    </span>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {entry.models.map((each) => {
                      const modelCount = section == "parts" ? each.parts : each.vehicles;
                      const href =
                        section == "parts"
                          ? `/vehicles?${new URLSearchParams({ section: "parts", fits: `${entry.make} ${each.model}` })}`
                          : `/vehicles?${new URLSearchParams({ make: entry.make, model: each.model })}`;
                      const active =
                        section == "parts"
                          ? fits.toLowerCase() == `${entry.make} ${each.model}`.toLowerCase()
                          : make.toLowerCase() == entry.make.toLowerCase() && model.toLowerCase() == each.model.toLowerCase();
                      return (
                        <li key={each.model}>
                          <Link
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                              active
                                ? "border-gold-500 bg-gold-500 text-navy-950"
                                : "border-slate-200 text-slate-700 hover:border-gold-500/60 hover:text-navy-950"
                            }`}
                          >
                            {each.model}
                            {modelCount > 0 ? (
                              <span className="rounded-full bg-emerald-100 px-1.5 text-[10px] font-bold text-emerald-800">{modelCount}</span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <EnquirySection division={division} showCompany />
    </>
  );
}

function SectionCard({ href, active, title, text, icon }: { href: string; active: boolean; title: string; text: string; icon: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group flex gap-4 rounded-3xl border-2 p-5 transition ${
        active
          ? "border-gold-500 bg-navy-900 text-white shadow-[0_24px_48px_-24px_rgba(6,11,26,0.7)]"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-gold-500/60"
      }`}
    >
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${active ? "bg-gold-500 text-navy-950" : "bg-navy-900 text-gold-400"}`}>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={icon} />
        </svg>
      </span>
      <span>
        <span className={`block text-lg font-bold ${active ? "text-white" : "text-navy-950"}`}>{title}</span>
        <span className={`mt-1 block text-sm ${active ? "text-white/70" : "text-slate-500"}`}>{text}</span>
      </span>
    </Link>
  );
}

// Spare parts as a table: Part name | SKU | Part number | Fits models | Stock | Price.
// On phones each part becomes a small card with the same details.
function PartsList({ parts }: { parts: Vehicle[] }) {
  const rows = parts.map((part) => ({
    part,
    href: `/vehicles/${encodeURIComponent(part.sku)}`,
    fits:
      part.compatibleWith.length > 0
        ? part.compatibleWith
        : part.make && part.model
          ? [`${part.make} ${part.model}`]
          : [],
  }));

  return (
    <>
      {/* Table (tablet and computer) */}
      <div className="card hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-navy-900 text-left text-xs font-semibold tracking-wide text-white/80 uppercase">
            <tr>
              <th scope="col" className="px-5 py-3.5">Part name</th>
              <th scope="col" className="px-4 py-3.5">SKU</th>
              <th scope="col" className="px-4 py-3.5">Part number</th>
              <th scope="col" className="px-4 py-3.5">Fits models</th>
              <th scope="col" className="px-4 py-3.5">Stock</th>
              <th scope="col" className="px-4 py-3.5 text-right">Price</th>
              <th scope="col" className="px-5 py-3.5"><span className="sr-only">View</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(({ part, href, fits }) => (
              <tr key={part.id} className="align-top transition hover:bg-gold-100/30">
                <td className="px-5 py-4">
                  <div className="flex min-w-56 gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={part.images[0] ?? fallbackImage("VEHICLES", "SPARE_PART")}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-lg bg-navy-50 object-cover"
                    />
                    <div>
                      <Link href={href} className="font-semibold text-navy-950 hover:text-gold-600 hover:underline">{part.title}</Link>
                      {part.condition ? <p className="text-xs text-slate-500">{part.condition}</p> : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-xs whitespace-nowrap text-navy-800">{part.sku}</td>
                <td className="px-4 py-4 font-mono text-xs whitespace-nowrap text-navy-800">{part.partNumber ?? "-"}</td>
                <td className="px-4 py-4">
                  <FitsTags fits={fits} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap"><StockBadge part={part} /></td>
                <td className="px-4 py-4 text-right font-semibold whitespace-nowrap text-navy-900">{priceLabel(part)}</td>
                <td className="px-5 py-4 text-right">
                  <Link href={href} className="btn-outline btn-sm">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (phones) */}
      <ul className="space-y-3 md:hidden">
        {rows.map(({ part, href, fits }) => (
          <li key={part.id} className="card p-4">
            <Link href={href} className="font-semibold text-navy-950">{part.title}</Link>
            <dl className="mt-2 grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-slate-500">SKU</dt>
              <dd className="font-mono text-xs text-navy-800">{part.sku}</dd>
              <dt className="text-slate-500">Part number</dt>
              <dd className="font-mono text-xs text-navy-800">{part.partNumber ?? "-"}</dd>
              <dt className="text-slate-500">Fits</dt>
              <dd><FitsTags fits={fits} /></dd>
              <dt className="text-slate-500">Stock</dt>
              <dd><StockBadge part={part} /></dd>
              <dt className="text-slate-500">Price</dt>
              <dd className="font-semibold text-navy-900">{priceLabel(part)}</dd>
            </dl>
            <Link href={href} className="btn-outline btn-sm mt-3">View</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function FitsTags({ fits }: { fits: string[] }) {
  if (fits.length == 0) {
    return <span className="text-xs text-slate-400">-</span>;
  }
  return (
    <ul className="flex max-w-72 flex-wrap gap-1">
      {fits.slice(0, 6).map((name) => (
        <li key={name}>
          <Link
            href={`/vehicles?${new URLSearchParams({ section: "parts", fits: name })}`}
            className="inline-block rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-navy-800 hover:bg-gold-100"
          >
            {name}
          </Link>
        </li>
      ))}
      {fits.length > 6 ? <li className="text-[11px] text-slate-500">+{fits.length - 6} more</li> : null}
    </ul>
  );
}

function StockBadge({ part }: { part: Vehicle }) {
  return part.availability != "AVAILABLE" ? (
    <span className="badge bg-slate-100 text-slate-700">{humanize(part.availability)}</span>
  ) : part.stock > 0 ? (
    <span className="badge bg-emerald-100 text-emerald-800">{part.stock} in stock</span>
  ) : (
    <span className="badge bg-amber-100 text-amber-800">To order</span>
  );
}
