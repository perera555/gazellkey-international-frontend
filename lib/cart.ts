// Shopping cart, kept in this browser (localStorage) so visitors can fill it
// before signing in. Prices here are only for display: at checkout the
// backend reads every price and stock level again (POST /api/shop/checkout).
// No React here, so server components can use cartKey(); client components
// read the cart with useCart() from components/shop/useCart.ts.

export type ShopItemType = "SHOP_PRODUCT" | "GEM_ITEM" | "VEHICLE_LISTING" | "TRADE_PRODUCT";

export interface CartItem {
  itemType: ShopItemType;
  itemId: string;
  name: string;
  sku: string;
  href: string; // product page
  image: string | null;
  unitPrice: string;
  currency: string;
  unit: string; // "piece", "unit", "kg" ...
  quantity: number;
  min: number; // minimum order
  max: number | null; // stock, null = no limit
  wholeNumbers: boolean; // false for trade goods sold by kg, litre ...
}

const STORAGE_KEY = "gazellekey-cart";
export const EMPTY_CART: CartItem[] = [];
const listeners = new Set<() => void>();
let cache: CartItem[] | null = null;

export function cartKey(item: { itemType: string; itemId: string }) {
  return `${item.itemType}:${item.itemId}`;
}

export function readCart(): CartItem[] {
  if (cache != null) {
    return cache;
  }
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    cache = Array.isArray(stored) ? stored : [];
  } catch {
    cache = []; // private window or blocked storage: an empty cart still works
  }
  return cache!;
}

function write(items: CartItem[]) {
  cache = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage blocked: the cart lives until the page is closed
  }
  listeners.forEach((listener) => listener());
}

export function subscribeCart(listener: () => void) {
  listeners.add(listener);
  // keep several open tabs in step
  const onStorage = (event: StorageEvent) => {
    if (event.key == STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Quantity kept within the minimum order and the stock
export function clampQuantity(item: Pick<CartItem, "min" | "max" | "wholeNumbers">, quantity: number) {
  let value = item.wholeNumbers ? Math.round(quantity) : Math.round(quantity * 1000) / 1000;
  value = Math.max(value, item.min);
  if (item.max != null) {
    value = Math.min(value, item.max);
  }
  return value;
}

export function addToCart(item: CartItem) {
  const items = readCart();
  const existing = items.find((each) => cartKey(each) == cartKey(item));
  if (existing) {
    write(
      items.map((each) =>
        each == existing
          ? { ...item, quantity: clampQuantity(item, existing.quantity + item.quantity) }
          : each,
      ),
    );
  } else {
    write([...items, { ...item, quantity: clampQuantity(item, item.quantity) }]);
  }
}

export function setCartQuantity(key: string, quantity: number) {
  write(
    readCart().map((item) =>
      cartKey(item) == key ? { ...item, quantity: clampQuantity(item, quantity) } : item,
    ),
  );
}

export function removeFromCart(keys: string[]) {
  write(readCart().filter((item) => !keys.includes(cartKey(item))));
}
