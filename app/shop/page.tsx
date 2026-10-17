import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/site/EmptyState";
import ErrorNote from "@/components/site/ErrorNote";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopPagination from "@/components/shop/ShopPagination";
import SortSelect from "@/components/shop/SortSelect";
import { apiGetBody, toQuery } from "@/lib/api";
import { param } from "@/lib/format";
import { kindOf, SHOP_KINDS } from "@/lib/shop";
import { ShopCatalogueBody } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop online with Gazellekey: Ceylon tea and spices, certified gems, vehicle parts and handpicked products. Pay by card or bank transfer.",
};

const FILTER_KEYS = ["search", "kind", "category", "minPrice", "maxPrice", "currency", "onSale", "inStock", "sort"];

const PERKS = [
  { title: "Secure payment", text: "Visa, Mastercard, Amex and local wallets", icon: "M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z M9 12l2 2 4-4" },
  { title: "Bank transfer", text: "Local or international, held for you", icon: "M3 10l9-6 9 6M5 10v8M19 10v8M9 10v8M15 10v8M3 20h18" },
  { title: "Delivered with care", text: "Island-wide and worldwide shipping", icon: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01" },
  { title: "Real people", text: "Questions? Our team replies quickly", icon: "M4 5h16v11H8l-4 4V5zM8 10h8M8 13h5" },
];

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  const current: Record<string, string | undefined> = Object.fromEntries(
    FILTER_KEYS.map((key) => [key, param(params[key])]),
  );
  const kind = kindOf(current.kind);
  const landing = FILTER_KEYS.every((key) => !current[key]) && !param(params.pageNumber);

  const [catalogue, deals] = await Promise.all([
    apiGetBody<ShopCatalogueBody>(
      `/api/shop/catalogue${toQuery(params, [...FILTER_KEYS, "pageNumber"], { pageSize: "24" })}`,
    ),
    landing
      ? apiGetBody<ShopCatalogueBody>("/api/shop/catalogue?onSale=true&sort=discount&pageSize=4")
      : null,
  ]);
  const dealItems = deals?.ok ? deals.body.data : [];
  const total = catalogue.ok ? catalogue.body.pagination.totalCount : 0;

  const heading = current.search
    ? `Results for “${current.search}”`
    : current.onSale == "true"
      ? "On sale now"
      : (current.category ?? kind?.label ?? "All products");

  return (
    <>
      {/* ── Hero with search ── */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60rem 30rem at 85% -10%, rgb(212 166 74 / 0.28), transparent 60%), radial-gradient(40rem 24rem at 0% 120%, rgb(30 136 229 / 0.18), transparent 60%)",
          }}
        />
        <div className="grid-floor -z-10 opacity-40" aria-hidden="true" />
        <div className="container-page py-14 sm:py-20">
          <p className="eyebrow">Gazellekey online shop</p>
          <h1 className="text-3d mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            Handpicked from Sri Lanka <span className="text-gold-gradient">and beyond</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Ceylon tea and spices, certified gems, genuine parts and everyday finds. Order online and pay securely.
          </p>
          <form action="/shop" className="mt-8 flex max-w-2xl items-center gap-2 rounded-full bg-white p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
            {current.kind ? <input type="hidden" name="kind" value={current.kind} /> : null}
            <svg viewBox="0 0 24 24" className="ml-4 h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              name="search"
              defaultValue={current.search}
              placeholder="Search tea, sapphire, brake pads…"
              aria-label="Search the shop"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-navy-950 placeholder:text-slate-400 focus:outline-none"
            />
            <button type="submit" className="btn-gold px-6 py-2.5">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Collections ── */}
      <div className="sticky top-20 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl lg:top-24">
        <nav aria-label="Collections" className="container-page flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {[{ value: undefined, label: "Everything", color: "#060b1a" }, ...SHOP_KINDS].map((each) => {
            const selected = current.kind == each.value;
            return (
              <Link
                key={each.label}
                href={each.value ? `/shop?kind=${each.value}` : "/shop"}
                aria-current={selected ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                  selected ? "bg-navy-950 text-white shadow-md" : "bg-navy-50 text-navy-800 hover:bg-navy-100"
                }`}
              >
                {each.value ? <span className="h-2 w-2 rounded-full" style={{ background: each.color }} aria-hidden="true" /> : null}
                {each.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Deals (landing page only) ── */}
      {dealItems.length > 0 ? (
        <section className="container-page pt-12">
          <div className="overflow-hidden rounded-3xl bg-linear-to-br from-navy-950 via-navy-900 to-navy-800 p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Limited time</p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Today’s deals</h2>
              </div>
              <Link href="/shop?onSale=true&sort=discount" className="btn-gold-outline btn-sm">
                See all deals →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {dealItems.map((item) => (
                <ProductCard key={`${item.itemType}:${item.itemId}`} item={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Catalogue ── */}
      <section id="products" className="container-page scroll-mt-40 py-12">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-44 lg:self-start">
            {catalogue.ok ? (
              <details className="group rounded-2xl border border-slate-200 bg-white p-5 lg:border-0 lg:bg-transparent lg:p-0" open>
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-navy-900 lg:hidden">
                  Filters
                  <span className="text-slate-400 transition group-open:rotate-180">⌄</span>
                </summary>
                <div className="mt-5 lg:mt-0">
                  <ShopFilters
                    basePath="/shop"
                    current={current}
                    categories={catalogue.body.categories}
                    currencies={catalogue.body.currencies}
                  />
                </div>
              </details>
            ) : null}
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="heading-display text-2xl sm:text-3xl">{heading}</h2>
                {catalogue.ok ? (
                  <p className="mt-1 text-sm text-slate-500">
                    {total} {total == 1 ? "product" : "products"}
                  </p>
                ) : null}
              </div>
              <SortSelect current={current.sort ?? "featured"} />
            </div>

            <div className="mt-8">
              {!catalogue.ok ? (
                <ErrorNote message={catalogue.message} />
              ) : catalogue.body.data.length == 0 ? (
                <EmptyState
                  title="Nothing matches yet"
                  text="Try another search or clear the filters. Looking for something special? Contact us and we will source it for you."
                />
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                  {catalogue.body.data.map((item) => (
                    <ProductCard key={`${item.itemType}:${item.itemId}`} item={item} />
                  ))}
                </div>
              )}
              {catalogue.ok ? (
                <ShopPagination pagination={catalogue.body.pagination} basePath="/shop" searchParams={params} />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why shop with us ── */}
      <section className="border-t border-slate-200 bg-white">
        <div className="container-page grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={perk.icon} />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-navy-950">{perk.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{perk.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
