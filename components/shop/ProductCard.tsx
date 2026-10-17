import Link from "next/link";
import QuickAdd from "@/components/shop/QuickAdd";
import SaleCountdown from "@/components/shop/SaleCountdown";
import { formatMoney } from "@/lib/format";
import { kindOf, ShopCardItem, shopItemHref, shopItemImage, toCartItem } from "@/lib/shop";

// One product in a shop grid: square photo, discount badge, name, price
// (with the "was" price while on sale) and a quick "Add" button.
// Items without a price (wholesale, "price on request") link to their page to enquire.
export default function ProductCard({ item }: { item: ShopCardItem }) {
  const href = shopItemHref(item);
  const price = item.price;
  const soldOut = price != null && item.stock != null && item.stock <= 0;
  const lowStock = !soldOut && item.stock != null && item.stock <= 5 && item.kind != "GEMS";
  const kind = kindOf(item.kind);
  const perUnit = !item.wholeNumbers || item.unit != "item" ? ` / ${item.unit}` : "";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_24px_48px_-24px_rgba(6,11,26,0.35)]">
      <div className="relative aspect-square overflow-hidden bg-navy-50">
        {/* Catalogue images are URLs on any host, so a plain <img> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shopItemImage(item)}
          alt={item.name}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${soldOut ? "opacity-60 grayscale" : ""}`}
        />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {item.discountPercent > 0 ? (
            <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              −{item.discountPercent}%
            </span>
          ) : null}
          {item.featured ? (
            <span className="rounded-full bg-navy-950/85 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gold-400 backdrop-blur">
              ★ Featured
            </span>
          ) : null}
        </div>
        {soldOut ? (
          <span className="absolute inset-x-0 bottom-0 bg-navy-950/80 py-2 text-center text-xs font-semibold tracking-widest text-white uppercase">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          {kind && item.kind != "SHOP" ? (
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: kind.color }} aria-hidden="true" />
          ) : null}
          <span className="truncate">{item.brand ?? item.category}</span>
        </p>
        <h3 className="mt-1.5 line-clamp-2 leading-snug font-semibold text-navy-950">
          {/* stretched link: the whole card opens the product */}
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {item.name}
          </Link>
        </h3>
        {item.summary ? <p className="mt-1 line-clamp-1 text-sm text-slate-500">{item.summary}</p> : null}

        <div className="mt-auto pt-4">
          {item.saleEndsAt ? (
            <div className="mb-1.5">
              <SaleCountdown endsAt={item.saleEndsAt} compact />
            </div>
          ) : null}
          {price == null ? (
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-bold text-navy-950">Price on request</p>
                <p className="text-xs text-slate-500">
                  {item.minQuantity > 1 ? `MOQ ${item.minQuantity} ${item.unit} · ` : ""}Wholesale quote
                </p>
              </div>
              {/* not clickable itself: the card's link underneath opens the product */}
              <span className="inline-flex h-10 shrink-0 items-center rounded-full border border-slate-200 px-4 text-xs font-semibold text-navy-900 transition group-hover:border-gold-500 group-hover:bg-gold-100">
                Enquire
              </span>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-extrabold tracking-tight text-navy-950">
                  {formatMoney(price, item.currency)}
                  <span className="text-xs font-medium text-slate-500">{perUnit}</span>
                </p>
                {item.compareAtPrice != null ? (
                  <p className="text-xs text-slate-400 line-through">{formatMoney(item.compareAtPrice, item.currency)}</p>
                ) : lowStock ? (
                  <p className="text-xs font-medium text-amber-600">Only {item.stock} left</p>
                ) : item.minQuantity > 1 ? (
                  <p className="text-xs text-slate-500">
                    Min. {item.minQuantity} {item.unit}
                  </p>
                ) : null}
              </div>
              {!soldOut ? <QuickAdd item={toCartItem({ ...item, price: price })} /> : null}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
