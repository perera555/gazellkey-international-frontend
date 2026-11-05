import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { fallbackImage } from "@/lib/media";
import { labelledPrice } from "@/lib/shop";
import { TradeProduct } from "@/lib/types";

// One product on the Import / Export pages: a wholesale view for businesses
// (minimum order, origin, packaging, request a bulk quote). The retail view of
// the same product - buy one online - lives in the Shop.
export default function WholesaleCard({
  product,
  href,
  categoryLabel,
  color,
}: {
  product: TradeProduct;
  href: string;
  categoryLabel: string;
  color: string;
}) {
  const moq = product.minimumOrderQty ? `${Number(product.minimumOrderQty)} ${product.unit}` : null;
  const retail = product.pricingMode == "FIXED" && product.price != null && product.currency;
  const sale = labelledPrice(product);
  const facts = [
    ["Origin", product.origin],
    ["Packaging", product.packaging],
    ["Minimum order", moq ?? "Any quantity"],
  ].filter(([, value]) => value) as [string, string][];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(6,11,26,0.45)]">
      <div className="relative aspect-16/10 overflow-hidden bg-navy-50">
        {/* Catalogue images are URLs on any host, so a plain <img> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0] || fallbackImage(product.direction, product.category)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute inset-x-0 top-0 h-1" style={{ background: color }} aria-hidden="true" />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-navy-900 shadow-sm">
          {categoryLabel}
        </span>
        {product.requiresPermit ? (
          <span className="absolute top-3 right-3 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900">Permit handled</span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="leading-snug font-semibold text-navy-950">
          {/* stretched link: the whole card opens the product */}
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <dl className="mt-3 space-y-1.5 text-sm">
          {facts.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <dt className="text-slate-500">{label}</dt>
              <dd className="text-right font-medium text-navy-900">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto pt-4">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Wholesale price</p>
          <p className="font-bold text-navy-950">Volume pricing on request</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-gold-500 group-hover:text-navy-950">
              Request bulk quote →
            </span>
            {retail ? (
              <span className="text-right text-xs text-slate-500">
                Single unit in our Shop:{" "}
                {sale ? <s className="text-slate-400">{formatMoney(sale.labelled, product.currency)}</s> : null}{" "}
                <b className="text-navy-900">{formatMoney(product.price, product.currency)}</b>
                {sale ? <span className="ml-1 font-semibold text-rose-600">−{sale.percent}%</span> : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
