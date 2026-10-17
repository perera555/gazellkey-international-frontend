import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { FactList, specFacts } from "@/components/site/DetailLayout";
import ShareButtons from "@/components/site/ShareButtons";
import BuyBox from "@/components/shop/BuyBox";
import ProductCard from "@/components/shop/ProductCard";
import ProductGallery from "@/components/shop/ProductGallery";
import SaleCountdown from "@/components/shop/SaleCountdown";
import { apiGetBody, apiGetItem } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { shareMetadata, SITE_URL } from "@/lib/social";
import { ShopCatalogueBody, ShopProduct } from "@/lib/types";

const getProduct = cache((sku: string) =>
  apiGetItem<ShopProduct>(`/api/shop/products/${encodeURIComponent(sku)}`),
);

export async function generateMetadata({ params }: PageProps<"/shop/[sku]">): Promise<Metadata> {
  const product = await getProduct((await params).sku);
  return shareMetadata({
    title: product.name,
    description: (product.summary ?? product.description).slice(0, 160),
    path: `/shop/${product.sku}`,
    image: product.images[0] ?? fallbackImage(product.division),
  });
}

const PROMISES = [
  { title: "Secure checkout", text: "Card (PayHere / Stripe) or bank transfer", icon: "M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z M9 12l2 2 4-4" },
  { title: "Delivery", text: "We confirm delivery time and cost after your order", icon: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01" },
  { title: "Help when you need it", text: "Contact us about returns or any problem", icon: "M4 5h16v11H8l-4 4V5zM8 10h8M8 13h5" },
];

export default async function ShopProductPage({ params }: PageProps<"/shop/[sku]">) {
  const product = await getProduct((await params).sku);
  const images = product.images.length > 0 ? product.images : [fallbackImage(product.division)];
  const { compareAtPrice, discountPercent, saleEndsAt } = product.sale;
  const soldOut = product.stockQty <= 0;
  const specs = specFacts(product.specifications);

  // more from the same category
  const related = await apiGetBody<ShopCatalogueBody>(
    `/api/shop/catalogue?kind=SHOP&category=${encodeURIComponent(product.category)}&pageSize=5`,
  );
  const relatedItems = related.ok ? related.body.data.filter((item) => item.itemId != product.id).slice(0, 4) : [];

  return (
    <div className="bg-[#f8f9fb]">
      <div className="container-page py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/shop" className="hover:text-navy-900">Shop</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-navy-900">
            {product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-navy-900">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery title={product.name} images={images} />

          <div className="lg:py-2">
            {product.brand ? (
              <p className="text-sm font-semibold tracking-widest text-gold-600 uppercase">{product.brand}</p>
            ) : null}
            <h1 className="mt-2 text-3xl leading-tight font-bold tracking-tight text-navy-950 sm:text-4xl">{product.name}</h1>
            {product.summary ? <p className="mt-3 text-lg text-slate-600">{product.summary}</p> : null}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <p className="text-4xl font-extrabold tracking-tight text-navy-950">
                  {formatMoney(product.price, product.currency)}
                </p>
                {compareAtPrice != null ? (
                  <>
                    <p className="text-lg text-slate-400 line-through">{formatMoney(compareAtPrice, product.currency)}</p>
                    <span className="rounded-full bg-rose-600 px-2.5 py-1 text-sm font-bold text-white">−{discountPercent}%</span>
                  </>
                ) : null}
              </div>
              {product.unit != "item" ? <p className="mt-1 text-sm text-slate-500">per {product.unit}</p> : null}
              {saleEndsAt ? (
                <div className="mt-3">
                  <SaleCountdown endsAt={saleEndsAt} />
                </div>
              ) : null}

              <p className={`mt-4 flex items-center gap-2 text-sm font-medium ${soldOut ? "text-rose-600" : product.stockQty <= 5 ? "text-amber-600" : "text-emerald-700"}`}>
                <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                {soldOut ? "Sold out" : product.stockQty <= 5 ? `Only ${product.stockQty} left` : "In stock"}
              </p>

              <div className="mt-5 border-t border-slate-100 pt-5">
                {soldOut ? (
                  <Link href={`/contact?subject=${encodeURIComponent(`Restock: ${product.name} (${product.sku})`)}`} className="btn-outline w-full py-3.5">
                    Ask us when it is back
                  </Link>
                ) : (
                  <BuyBox
                    item={{
                      itemType: "SHOP_PRODUCT",
                      itemId: product.id,
                      name: product.name,
                      sku: product.sku,
                      href: `/shop/${product.sku}`,
                      image: product.images[0] ?? null,
                      unitPrice: product.price,
                      currency: product.currency,
                      unit: product.unit,
                      min: 1,
                      max: product.stockQty,
                      wholeNumbers: true,
                    }}
                  />
                )}
              </div>
            </div>

            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {PROMISES.map((promise) => (
                <li key={promise.title} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={promise.icon} />
                  </svg>
                  <p className="mt-2 text-sm font-semibold text-navy-950">{promise.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{promise.text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <ShareButtons url={`${SITE_URL}/shop/${product.sku}`} title={product.name} />
            </div>
          </div>
        </div>

        {/* ── Details ── */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="heading-display text-2xl">About this product</h2>
            {product.highlights.length > 0 ? (
              <ul className="mt-5 space-y-2.5">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-slate-700">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-6 whitespace-pre-line leading-relaxed text-slate-700">{product.description}</p>
          </section>

          <section className="self-start rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-navy-950">Specifications</h2>
            <div className="mt-3">
              <FactList
                facts={[
                  ["Brand", product.brand],
                  ["Category", product.category],
                  ["Item code", product.sku],
                  ...specs,
                ]}
              />
            </div>
          </section>
        </div>

        {relatedItems.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="heading-display text-2xl sm:text-3xl">You may also like</h2>
              <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="text-sm font-semibold text-navy-800 hover:text-gold-600">
                View all →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {relatedItems.map((item) => (
                <ProductCard key={item.itemId} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
