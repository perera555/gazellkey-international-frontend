import Link from "next/link";
import DivisionHero from "@/components/site/DivisionHero";
import EmptyState from "@/components/site/EmptyState";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import FilterTabs from "@/components/site/FilterTabs";
import PhotoTile from "@/components/site/PhotoTile";
import ShopPagination from "@/components/shop/ShopPagination";
import WholesaleCard from "@/components/trade/WholesaleCard";
import { apiGet, toQuery } from "@/lib/api";
import { DIVISIONS, labelOf } from "@/lib/divisions";
import { param } from "@/lib/format";
import { CATEGORY_IMAGES } from "@/lib/media";
import { TradeProduct } from "@/lib/types";

// Import and Export are separate divisions on one shared product catalogue,
// so /import and /export both render this with a different direction.
//
// These pages are the WHOLESALE side for businesses: bulk quantities,
// minimum orders, sourcing, shipping and customs, quotations. Buying single
// items at a fixed price happens in the Shop (/shop) - each page links to the other.

const STEPS = {
  IMPORT: [
    { title: "Tell us what you need", text: "Product, quantity and target price - or just a photo." },
    { title: "Sourcing & samples", text: "We find trusted suppliers abroad and send samples when needed." },
    { title: "Quotation & order", text: "One price including freight, duty and delivery. You approve, we order." },
    { title: "Shipping & customs", text: "We book the shipment and clear Sri Lankan customs for you." },
    { title: "Delivered to you", text: "Track every milestone in your account until the goods arrive." },
  ],
  EXPORT: [
    { title: "Send your requirement", text: "Product, grade, quantity, packaging and destination port." },
    { title: "Samples & quotation", text: "Samples on request and a FOB or CIF price." },
    { title: "Order & packing", text: "Packed to your specification with the export documents." },
    { title: "Shipping & documents", text: "We handle phytosanitary, export permits and the bill of lading." },
    { title: "Arrives at your port", text: "Follow the shipment from Colombo to your destination." },
  ],
};

// Selling points - edit them to match exactly what Gazellekey offers
const BENEFITS = {
  IMPORT: [
    { title: "Trusted suppliers", text: "We source from suppliers abroad that we know and check." },
    { title: "Customs handled", text: "Duty, permits and clearance done by our team." },
    { title: "Volume pricing", text: "The more you order, the better the unit price." },
    { title: "One delivered price", text: "Product, freight, duty and delivery in one quotation." },
  ],
  EXPORT: [
    { title: "Direct from the source", text: "Tea, spices and produce from growers across Sri Lanka." },
    { title: "Graded quality", text: "Products graded and packed to your specification." },
    { title: "Your packaging", text: "Bulk sacks, retail packs or your own label - ask us." },
    { title: "Shipping to any port", text: "Full or shared containers, FOB or CIF." },
  ],
};

export default async function TradeCatalogue({
  direction,
  searchParams,
}: {
  direction: "IMPORT" | "EXPORT";
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const division = DIVISIONS[direction];
  const isImport = direction == "IMPORT";
  const filtered = Boolean(param(searchParams.category) || param(searchParams.search));
  const photoCategories = division.services.filter((service) => CATEGORY_IMAGES[service.value]);
  const products = await apiGet<TradeProduct[]>(
    `/api/trade/products${toQuery(searchParams, ["category", "search", "pageNumber"], {
      direction: direction,
      pageSize: "12",
      status: "PUBLISHED",
    })}`,
  );

  return (
    <>
      <DivisionHero division={division} />

      {/* ── For businesses / for you: tells the two pages apart ── */}
      <section className="border-b border-ivory-200 bg-ivory-50">
        <div className="container-page grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center">
          <p className="text-sm text-slate-600">
            <b className="text-navy-950">{isImport ? "Wholesale importing for businesses." : "Bulk export for overseas buyers."}</b>{" "}
            Bulk quantities, sourcing, shipping and customs - priced by quotation. Buying a few items for yourself? Use our online Shop.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="#enquire" className="btn-gold btn-sm">
              Request a quotation
            </a>
            <Link href={`/shop?kind=${direction}`} className="btn-outline btn-sm">
              Buy single items in the Shop
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      {!filtered ? (
        <section className="container-page pt-14">
          <p className="eyebrow">How it works</p>
          <h2 className="heading-display mt-2 text-3xl sm:text-4xl">{isImport ? "From any country to your door" : "From Sri Lanka to your port"}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-5">
            {STEPS[direction].map((step, index) => (
              <li key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-5">
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ background: division.color }}
                >
                  {index + 1}
                </span>
                <p className="mt-3 font-semibold text-navy-950">{step.title}</p>
                <p className="mt-1 text-sm text-slate-500">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-4 rounded-3xl bg-navy-950 p-6 text-white sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
            {BENEFITS[direction].map((benefit) => (
              <div key={benefit.title}>
                <p className="font-semibold text-gold-400">{benefit.title}</p>
                <p className="mt-1 text-sm text-white/70">{benefit.text}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Category photo tiles, on the unfiltered page only ── */}
      {!filtered && photoCategories.length > 0 ? (
        <section className="container-page pt-14">
          <h2 className="heading-display text-3xl sm:text-4xl">{isImport ? "What we import" : "What we export"}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photoCategories.map((category) => (
              <PhotoTile
                key={category.value}
                href={`${division.href}?category=${category.value}`}
                image={CATEGORY_IMAGES[category.value]}
                title={category.label}
                text={isImport ? "Import product" : "Export product"}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Wholesale catalogue ── */}
      <section className="container-page py-14">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="heading-display text-3xl">{isImport ? "Wholesale catalogue" : "Export catalogue"}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Examples of what we supply in bulk. Open a product for its details and to request a quotation for your quantity.
            </p>
          </div>
          <FilterTabs
            basePath={division.href}
            param="category"
            options={division.services}
            current={param(searchParams.category)}
            color={division.color}
          />
        </div>

        <div className="mt-8">
          {!products.ok ? (
            <ErrorNote message={products.message} />
          ) : products.data.length == 0 ? (
            <EmptyState
              title="No products listed in this category"
              text="We source to order. Send us your product, quantity and destination for a quotation."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.data.map((product) => (
                <WholesaleCard
                  key={product.id}
                  product={product}
                  href={`${division.href}/${encodeURIComponent(product.sku)}#enquire`}
                  categoryLabel={labelOf(division.services, product.category)}
                  color={division.color}
                />
              ))}
            </div>
          )}
          {products.ok ? (
            <ShopPagination pagination={products.pagination} basePath={division.href} searchParams={searchParams} />
          ) : null}
        </div>

        {/* ── We source anything ── */}
        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl border border-dashed border-slate-300 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h3 className="text-xl font-bold text-navy-950">{isImport ? "Can't find what you need? We'll source it." : "Need another product or grade?"}</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              {isImport
                ? "Send a photo, a model number or a supplier's link. We find it, check it and bring it to Sri Lanka at a fixed delivered price."
                : "Tell us the product, grade and packaging. We can supply far more than we list here."}
            </p>
          </div>
          <a href="#enquire" className="btn-navy shrink-0">
            Send your requirement
          </a>
        </div>
      </section>

      <EnquirySection
        division={division}
        heading={isImport ? "Request an import quotation" : "Request an export quotation"}
        text="Tell us the product, quantity, packaging and destination. We reply with pricing and shipping terms (FOB / CIF)."
        showCompany
      />
    </>
  );
}
