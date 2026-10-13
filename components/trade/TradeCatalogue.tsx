import DivisionHero from "@/components/site/DivisionHero";
import EmptyState from "@/components/site/EmptyState";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import FilterTabs from "@/components/site/FilterTabs";
import ItemCard from "@/components/site/ItemCard";
import Pagination from "@/components/site/Pagination";
import { apiGet, toQuery } from "@/lib/api";
import { DIVISIONS, labelOf } from "@/lib/divisions";
import { param, priceLabel } from "@/lib/format";
import { CATEGORY_IMAGES, fallbackImage } from "@/lib/media";
import PhotoTile from "@/components/site/PhotoTile";
import { TradeProduct } from "@/lib/types";

// Import and Export are separate divisions on one shared product catalogue,
// so /import and /export both render this with a different direction.
export default async function TradeCatalogue({
  direction,
  searchParams,
}: {
  direction: "IMPORT" | "EXPORT";
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const division = DIVISIONS[direction];
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

      {/* Category photo tiles (slide 10), on the unfiltered page only */}
      {!param(searchParams.category) && !param(searchParams.search) && photoCategories.length > 0 ? (
        <section className="container-page pt-14">
          <h2 className="heading-display text-3xl sm:text-4xl">Our Trade Products</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photoCategories.map((category) => (
              <PhotoTile
                key={category.value}
                href={`${division.href}?category=${category.value}`}
                image={CATEGORY_IMAGES[category.value]}
                title={category.label}
                text={direction == "EXPORT" ? "Export product" : "Import product"}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page py-14">
        <div className="flex flex-col gap-4">
          <h2 className="heading-display text-3xl">
            {direction == "EXPORT" ? "Products we export" : "Products we import"}
          </h2>
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.data.map((product) => (
                <ItemCard
                  key={product.id}
                  href={`${division.href}/${encodeURIComponent(product.sku)}`}
                  color={division.color}
                  image={product.images[0]}
                  fallbackImage={fallbackImage(direction, product.category)}
                  eyebrow={labelOf(division.services, product.category)}
                  title={product.name}
                  details={[
                    product.origin,
                    product.minimumOrderQty
                      ? `MOQ ${Number(product.minimumOrderQty)} ${product.unit}`
                      : null,
                  ]}
                  price={
                    product.pricingMode == "FIXED"
                      ? `${priceLabel(product)} / ${product.unit}`
                      : priceLabel(product)
                  }
                />
              ))}
            </div>
          )}
          {products.ok ? (
            <Pagination pagination={products.pagination} basePath={division.href} searchParams={searchParams} />
          ) : null}
        </div>
      </section>

      <EnquirySection
        division={division}
        heading={direction == "EXPORT" ? "Request an export quotation" : "Request an import quotation"}
        text="Tell us the product, quantity, packaging and destination. We reply with pricing and shipping terms (FOB / CIF)."
        showCompany
      />
    </>
  );
}
