import type { Metadata } from "next";
import DivisionHero from "@/components/site/DivisionHero";
import EmptyState from "@/components/site/EmptyState";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import { ChipNav } from "@/components/site/FilterTabs";
import ItemCard from "@/components/site/ItemCard";
import ListTable from "@/components/site/ListTable";
import ViewToggle, { listView } from "@/components/site/ViewToggle";
import Pagination from "@/components/site/Pagination";
import { apiGet, toQuery } from "@/lib/api";
import { DIVISIONS, GEM_CHIPS } from "@/lib/divisions";
import { humanize, param, priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { GemItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Gems & Jewellery",
  description: DIVISIONS.GEMS.tagline,
};

const division = DIVISIONS.GEMS;

export default async function GemsPage({ searchParams }: PageProps<"/gems">) {
  const params = await searchParams;
  const items = await apiGet<GemItem[]>(
    `/api/gems${toQuery(params, ["itemType", "category", "search", "pageNumber"], { pageSize: "12", status: "PUBLISHED" })}`,
  );

  const view = listView(params.view);

  // The chip matching the current ?search= or ?itemType= is highlighted
  const current = param(params.search)
    ? `/gems?search=${param(params.search)?.toLowerCase()}`
    : param(params.itemType)
      ? `/gems?itemType=${param(params.itemType)}`
      : "/gems";

  return (
    <>
      <DivisionHero division={division} />

      <section className="container-page py-14">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="heading-display text-3xl sm:text-4xl">Gemstone Collection</h2>
            <ViewToggle basePath="/gems" searchParams={params} current={view} />
          </div>
          <ChipNav
            chips={[{ href: "/gems", label: "All" }, ...GEM_CHIPS].map((chip) => ({
              ...chip,
              active: chip.href == current,
            }))}
          />
        </div>

        <div className="mt-8">
          {!items.ok ? (
            <ErrorNote message={items.message} />
          ) : items.data.length == 0 ? (
            <EmptyState
              title="Nothing listed in this collection yet"
              text="Looking for a specific stone or a custom piece? Our gemmologists can source it for you."
            />
          ) : view == "list" ? (
            <ListTable
              rows={items.data}
              nameHeader="Gem / piece"
              href={(item) => `/gems/${encodeURIComponent(item.sku)}`}
              image={(item) => item.images[0] ?? fallbackImage("GEMS", item.itemType)}
              title={(item) => item.name}
              subtitle={(item) => (item.availability != "AVAILABLE" ? humanize(item.availability) : item.category)}
              columns={[
                { header: "SKU", cell: (item) => item.sku, mono: true },
                { header: "Type", cell: (item) => humanize(item.itemType) },
                { header: "Weight", cell: (item) => (item.weight ? `${Number(item.weight)} ${item.weightUnit}` : "-") },
                { header: "Colour", cell: (item) => item.colour ?? "-" },
                { header: "Origin", cell: (item) => item.origin ?? "-" },
                { header: "Price", cell: (item) => priceLabel(item), align: "right" },
              ]}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.data.map((item) => (
                <ItemCard
                  key={item.id}
                  href={`/gems/${encodeURIComponent(item.sku)}`}
                  color={division.color}
                  image={item.images[0]}
                  fallbackImage={fallbackImage("GEMS", item.itemType)}
                  eyebrow={item.category}
                  title={item.name}
                  details={[
                    item.origin,
                    item.weight ? `${Number(item.weight)} ${item.weightUnit}` : null,
                    item.colour,
                  ]}
                  price={priceLabel(item)}
                  badge={item.availability != "AVAILABLE" ? humanize(item.availability) : undefined}
                />
              ))}
            </div>
          )}
          {items.ok ? (
            <Pagination pagination={items.pagination} basePath="/gems" searchParams={params} />
          ) : null}
        </div>
      </section>

      <EnquirySection
        division={division}
        text="Buying, custom jewellery, mining, dealing or gem export / import - tell us what you are looking for."
      />
    </>
  );
}
