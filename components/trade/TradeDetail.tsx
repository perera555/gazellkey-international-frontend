import { cache } from "react";
import { notFound } from "next/navigation";
import DetailLayout, { FactList, specFacts } from "@/components/site/DetailLayout";
import DivisionHero from "@/components/site/DivisionHero";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { apiGetItem } from "@/lib/api";
import { DIVISIONS, labelOf } from "@/lib/divisions";
import { priceLabel } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { getSessionUser } from "@/lib/session";
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
              <p className="text-2xl font-semibold text-navy-900">
                {priceLabel(product)}
                {product.pricingMode == "FIXED" ? (
                  <span className="text-base font-normal text-slate-500"> / {product.unit}</span>
                ) : null}
              </p>
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
            </div>
            <div className="card p-6">
              <h2 className="font-semibold text-navy-900">Request a quotation</h2>
              <div className="mt-4">
                <EnquiryForm
                  division={direction}
                  services={division.services}
                  defaultService={product.category}
                  itemType="TRADE_PRODUCT"
                  itemId={product.id}
                  defaultSubject={`${product.name} (${product.sku})`}
                  prefill={user ?? undefined}
                  showCompany
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
