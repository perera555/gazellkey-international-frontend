import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/site/EmptyState";
import ErrorNote from "@/components/site/ErrorNote";
import PageHero from "@/components/site/PageHero";
import Pagination from "@/components/site/Pagination";
import PhotoGallery from "@/components/site/PhotoGallery";
import { apiGetBody, toQuery } from "@/lib/api";
import { param } from "@/lib/format";
import { GalleryPhoto, Pagination as PageInfo } from "@/lib/types";

export const metadata: Metadata = {
  title: "Travel gallery",
  description: "Photos from holidays and tours our customers took with Gazellekey International.",
};

type PlaceCount = { country: string | null; place: string | null; count: number };
type GalleryBody = { data: GalleryPhoto[]; countries: string[]; places?: PlaceCount[]; pagination: PageInfo };
type Destination = { country: string; count: number; places: { name: string; count: number }[] };

// Country -> places tree for the side list. Older APIs send only "countries".
function destinationsOf(body: GalleryBody): Destination[] {
  if (!body.places) {
    return body.countries.map((name) => ({ country: name, count: 0, places: [] }));
  }
  const byCountry = new Map<string, Destination>();
  for (const row of body.places) {
    if (!row.country) continue;
    const entry = byCountry.get(row.country) ?? { country: row.country, count: 0, places: [] };
    entry.count += row.count;
    if (row.place) {
      entry.places.push({ name: row.place, count: row.count });
    }
    byCountry.set(row.country, entry);
  }
  return [...byCountry.values()];
}

function galleryHref(country?: string, place?: string) {
  const query = new URLSearchParams();
  if (country) query.set("country", country);
  if (place) query.set("place", place);
  const text = query.toString();
  return text ? `/gallery?${text}` : "/gallery";
}

function same(a: string | undefined, b: string) {
  return a?.toLowerCase() == b.toLowerCase();
}

// /gallery?country=Sri Lanka&place=Ella
export default async function GalleryPage({ searchParams }: PageProps<"/gallery">) {
  const params = await searchParams;
  const country = param(params.country);
  const place = param(params.place);
  const result = await apiGetBody<GalleryBody>(
    `/api/gallery${toQuery(params, ["country", "place", "pageNumber"], { division: "TRAVEL", pageSize: "30" })}`,
  );
  const destinations = result.ok ? destinationsOf(result.body) : [];
  const total = result.ok ? result.body.places?.reduce((sum, row) => sum + row.count, 0) : undefined;

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments from our trips"
        text="Tea country trains, island lagoons and city lights - a few memories from holidays planned by Gazellekey."
        image="/images/travel-sigiriya.jpg"
      />

      <section className="bg-linear-to-b from-navy-50 to-white">
        <div className="container-page py-14">
          {!result.ok ? (
            <ErrorNote message={result.message} />
          ) : (
            <div className={destinations.length > 0 ? "grid gap-8 lg:grid-cols-[260px_1fr]" : ""}>
              {destinations.length > 0 ? (
                <aside className="lg:sticky lg:top-36 lg:self-start">
                  <div className="card p-4">
                    <p className="eyebrow px-2">Countries & places</p>
                    <nav aria-label="Filter by destination" className="mt-3 max-h-80 overflow-y-auto lg:max-h-[calc(100vh-14rem)]">
                      <DestinationLink href="/gallery" label="All places" count={total} active={!country && !place} />
                      <ul className="mt-1 space-y-1">
                        {destinations.map((destination) => {
                          const countryActive = same(country, destination.country);
                          return (
                            <li key={destination.country}>
                              <DestinationLink
                                href={galleryHref(destination.country)}
                                label={destination.country}
                                count={destination.count || undefined}
                                active={countryActive && !place}
                                strong
                              />
                              {destination.places.length > 0 ? (
                                <ul className="mt-0.5 mb-2 ml-3 border-l border-slate-200 pl-2">
                                  {destination.places.map((item) => (
                                    <li key={item.name}>
                                      <DestinationLink
                                        href={galleryHref(destination.country, item.name)}
                                        label={item.name}
                                        count={item.count}
                                        active={countryActive && same(place, item.name)}
                                        pin
                                      />
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                </aside>
              ) : null}

              <div className="min-w-0">
                {country || place ? (
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-navy-950">
                      {[place, country].filter(Boolean).join(", ")}
                    </h2>
                    <span className="text-sm text-slate-500">
                      {result.body.pagination.totalCount} photo{result.body.pagination.totalCount == 1 ? "" : "s"}
                    </span>
                    <Link href="/gallery" className="text-sm font-medium text-gold-500 hover:text-gold-600">
                      Clear filter ✕
                    </Link>
                  </div>
                ) : null}

                {result.body.data.length == 0 ? (
                  <EmptyState title="No photos here yet" text="Our team adds new trip photos regularly." />
                ) : (
                  <PhotoGallery photos={result.body.data} layout="masonry" />
                )}
                <Pagination pagination={result.body.pagination} basePath="/gallery" searchParams={params} />
              </div>
            </div>
          )}

          <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-3xl bg-linear-to-r from-navy-950 to-navy-900 p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3d font-display text-2xl">Your trip could be next</h2>
              <p className="mt-1 text-white/70">Tell us where you want to go and we will plan it for you.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/travel" className="btn-gold">Browse tours</Link>
              <Link href="/appointments?division=TRAVEL" className="btn-glass">Talk to us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DestinationLink({
  href,
  label,
  count,
  active,
  strong = false,
  pin = false,
}: {
  href: string;
  label: string;
  count?: number;
  active: boolean;
  strong?: boolean;
  pin?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
        active ? "bg-navy-900 text-gold-400" : "text-slate-600 hover:bg-navy-50 hover:text-navy-950"
      } ${strong ? "font-semibold" : ""}`}
    >
      {pin ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0 opacity-70" aria-hidden="true">
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      ) : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count != null ? (
        <span className={`text-xs ${active ? "text-gold-400/80" : "text-slate-400"}`}>{count}</span>
      ) : null}
    </Link>
  );
}
