import { cache } from "react";
import { notFound } from "next/navigation";
import DetailLayout, { FactList, specFacts } from "@/components/site/DetailLayout";
import DivisionHero from "@/components/site/DivisionHero";
import EnquiryForm from "@/components/forms/EnquiryForm";
import AddToCart from "@/components/shop/AddToCart";
import SignInGate from "@/components/site/SignInGate";
import { apiGetItem } from "@/lib/api";
import { DIVISIONS, labelOf } from "@/lib/divisions";
import { formatMoney, priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { labelledPrice } from "@/lib/shop";
import { getSessionUser } from "@/lib/session";
import { shareMetadata } from "@/lib/social";
import { TradeProduct } from "@/lib/types";

// One product, only on the matching division URL (/export/x is not /import/x)
export const getTradeProduct = cache(async (direction: "IMPORT" | "EXPORT", sku: string) => {
  const product = await apiGetItem<TradeProduct>(
    `/api/trade/products/${encodeURIComponent(sku)}`,
  );
  if (product.direction != direction) {
    notFound();
  }
  return product;
});

// Page title + link preview for social media
export async function tradeMetadata(direction: "IMPORT" | "EXPORT", sku: string) {
  const product = await getTradeProduct(direction, sku);
  return shareMetadata({
    title: product.name,
    description: product.description.slice(0, 160),
    path: `${DIVISIONS[direction].href}/${product.sku}`,
    image: product.images[0] ?? fallbackImage(direction, product.category),
  });
}

export default async function TradeDetail({
  direction,
  sku,
}: {
  direction: "IMPORT" | "EXPORT";
  sku: string;
}) {
  const product = await getTradeProduct(direction, sku);
  const user = await getSessionUser();
  const division = DIVISIONS[direction];
  const specs = specFacts(product.specifications);
  const quantity = (value: string | null) => (value ? `${Number(value)} ${product.unit}` : null);
  const sale = labelledPrice(product);

  return (
    <>
      <DivisionHero
        division={division}
        title={product.name}
        subtitle={labelOf(division.services, product.category)}
        breadcrumb={{ href: division.href, label: division.name }}
        image={product.images[0]}
      />
      <DetailLayout
        title={product.name}
        sharePath={`${division.href}/${product.sku}`}
        images={product.images}
        fallbackImage={fallbackImage(direction, product.category)}
        main={
          <>
            <section>
              <h2 className="heading-display text-2xl">Description</h2>
              <p className="mt-4 whitespace-pre-line text-slate-700">{product.description}</p>
            </section>
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
              {sale ? (
                <p className="mb-1 flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Labelled price</span>
                  <span className="text-slate-400 line-through">{formatMoney(sale.labelled, product.currency)}</span>
                  <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">−{sale.percent}%</span>
                </p>
              ) : null}
              <p className="text-2xl font-semibold text-navy-900">
                {sale ? <span className="mr-1 text-sm font-medium text-slate-500">Now</span> : null}
                {priceLabel(product)}
                {product.pricingMode == "FIXED" ? (
                  <span className="text-base font-normal text-slate-500"> / {product.unit}</span>
                ) : null}
              </p>
              {sale ? (
                <p className="mt-1 text-sm font-semibold text-emerald-700">
                  You save {formatMoney(sale.labelled - Number(product.price), product.currency)}
                </p>
              ) : null}
              <div className="mt-4">
                <FactList
                  facts={[
                    ["Reference", product.sku],
                    ["Category", labelOf(division.services, product.category)],
                    ["Origin", product.origin],
                    ["Packaging", product.packaging],
                    ["Minimum order", quantity(product.minimumOrderQty)],
                    ["Available", quantity(product.stockQty)],
                    ["Permit required", product.requiresPermit ? "Yes" : null],
                  ]}
                />
              </div>
              {product.pricingMode == "FIXED" &&
              product.price != null &&
              product.currency &&
              (product.stockQty == null || Number(product.stockQty) > 0) ? (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <AddToCart
                    item={{
                      itemType: "TRADE_PRODUCT",
                      itemId: product.id,
                      name: product.name,
                      sku: product.sku,
                      href: `${division.href}/${product.sku}`,
                      image: product.images[0] ?? null,
                      unitPrice: product.price,
                      currency: product.currency,
                      unit: product.unit,
                      min: product.minimumOrderQty ? Number(product.minimumOrderQty) : 1,
                      max: product.stockQty != null ? Number(product.stockQty) : null,
                      wholeNumbers: false,
                    }}
                  />
                </div>
              ) : null}
            </div>
            <div id="enquire" className="card scroll-mt-36 p-6">
              {user == null ? (
                <SignInGate
                  title="Sign up to request a quotation"
                  text="Create a free account to request a quote for this product and follow our reply."
                  returnTo={`${division.href}/${product.sku}#enquire`}
                  compact
                />
              ) : (
                <>
                  <h2 className="font-semibold text-navy-900">Request a quotation</h2>
                  <div className="mt-4">
                    <EnquiryForm
                      division={direction}
                      services={division.services}
                      defaultService={product.category}
                      itemType="TRADE_PRODUCT"
                      itemId={product.id}
                      defaultSubject={`${product.name} (${product.sku})`}
                      prefill={user}
                      showCompany
                      submitLabel="Request a quote"
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
