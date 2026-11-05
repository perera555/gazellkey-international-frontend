// Shop page helpers shared by server and client components
import { CartItem } from "@/lib/cart";
import { fallbackImage } from "@/lib/media";
import { ShopKind, ShopListItem, TradeProduct } from "@/lib/types";

// What a product card shows. price null = "Price on request" (no online purchase).
export type ShopCardItem = Omit<ShopListItem, "price"> & {
  price: number | null;
  fallbackImage?: string;
};

// Labelled ("was") price of a fixed-price trade product, while it is higher
export function labelledPrice(product: TradeProduct) {
  if (product.pricingMode != "FIXED" || product.price == null || product.compareAtPrice == null) {
    return null;
  }
  const price = Number(product.price);
  const labelled = Number(product.compareAtPrice);
  if (labelled <= price) {
    return null;
  }
  return { labelled: labelled, percent: Math.round(((labelled - price) / labelled) * 100) };
}

export const SHOP_SORTS = [
  { value: "featured", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "discount", label: "Biggest discount" },
];

// Collections across the top of the Shop page
export const SHOP_KINDS: { value: ShopKind; label: string; color: string }[] = [
  { value: "SHOP", label: "Gazellekey picks", color: "#D4A64A" },
  { value: "GEMS", label: "Gems & jewellery", color: "#8E24AA" },
  { value: "VEHICLES", label: "Vehicles & parts", color: "#2E9E4F" },
  { value: "EXPORT", label: "Ceylon produce", color: "#E0A100" },
  { value: "IMPORT", label: "Imported goods", color: "#E53935" },
];

export function kindOf(value: string | undefined) {
  return SHOP_KINDS.find((kind) => kind.value == value);
}

const DETAIL_PATHS: Record<ShopKind, string> = {
  SHOP: "/shop",
  GEMS: "/gems",
  VEHICLES: "/vehicles",
  IMPORT: "/import",
  EXPORT: "/export",
};

// Retail products have their own page under /shop; the rest keep their division page
export function shopItemHref(item: Pick<ShopListItem, "kind" | "sku">) {
  return `${DETAIL_PATHS[item.kind]}/${encodeURIComponent(item.sku)}`;
}

export function shopItemImage(item: ShopCardItem) {
  return item.image || item.fallbackImage || fallbackImage(item.kind == "SHOP" ? "IMPORT" : item.kind);
}

export function toCartItem(item: ShopCardItem & { price: number }): Omit<CartItem, "quantity"> {
  return {
    itemType: item.itemType,
    itemId: item.itemId,
    name: item.name,
    sku: item.sku,
    href: shopItemHref(item),
    image: item.image,
    unitPrice: String(item.price),
    currency: item.currency,
    unit: item.unit,
    min: item.minQuantity,
    max: item.stock,
    wholeNumbers: item.wholeNumbers,
  };
}
