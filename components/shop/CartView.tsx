"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/shop/useCart";
import { apiRequest } from "@/lib/api-client";
import { CartItem, cartKey, removeFromCart, setCartQuantity } from "@/lib/cart";
import { formatMoney } from "@/lib/format";
import { ShopPaymentMethod, ShopPaymentOption } from "@/lib/types";

type Delivery = { phone: string; address: string; city: string; country: string };

type CheckoutResponse = {
  data?: {
    redirect?: string;
    form?: { action: string; fields: Record<string, string> };
  };
};

// PayHere wants a real form POST from the browser to its payment page
function postForm(action: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

type ChoiceKey = "CARD" | "BANK";

type PaymentChoice = {
  key: ChoiceKey;
  title: string;
  text: string;
  method: ShopPaymentMethod | null; // what is sent to the backend
  unavailable: string | null; // why it cannot be picked for this order
};

// The two ways to pay, always shown so customers see their options.
// "Card" uses PayHere when it takes this currency, otherwise Stripe -
// the customer does not need to know which gateway is behind it.
function paymentChoices(options: ShopPaymentOption[], currency: string): PaymentChoice[] {
  const takes = (id: ShopPaymentMethod) =>
    options.find((option) => option.id == id && (option.currencies == null || option.currencies.includes(currency)));
  const payhere = takes("PAYHERE");
  const stripe = takes("STRIPE");
  const bank = takes("BANK_TRANSFER");
  const anyCard = options.some((option) => option.id == "PAYHERE" || option.id == "STRIPE");

  return [
    {
      key: "CARD",
      title: "Credit / Debit card",
      text:
        "Visa, Mastercard, Amex - Sri Lankan and foreign cards" +
        (payhere ? ", or eZ Cash / Genie wallet" : "") +
        ". You pay on a secure payment page.",
      method: payhere?.id ?? stripe?.id ?? null,
      unavailable:
        payhere || stripe
          ? null
          : anyCard
            ? `Card payment is not available for ${currency} prices.`
            : "Not available yet - please choose bank transfer.",
    },
    {
      key: "BANK",
      title: "Bank transfer",
      text:
        bank?.description ??
        "Local or international (SWIFT) transfer. You get our account details after placing the order.",
      method: bank ? "BANK_TRANSFER" : null,
      unavailable: bank ? null : "Not available yet.",
    },
  ];
}

function ChoiceIcon({ choice }: { choice: ChoiceKey }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {choice == "CARD" ? (
        <>
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M2.5 10h19M6 15h4" />
        </>
      ) : (
        <path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />
      )}
    </svg>
  );
}

// Cart contents, delivery details and payment. One payment has one currency,
// so items are grouped by currency and each group is paid on its own.
export default function CartView({
  signedIn,
  staff = false,
  options,
  prefill,
}: {
  signedIn: boolean;
  staff?: boolean; // signed in, but not with a customer account: cannot check out
  options: ShopPaymentOption[];
  prefill: Delivery;
}) {
  const cart = useCart();
  const [delivery, setDelivery] = useState<Delivery>(prefill);
  const [chosen, setChosen] = useState<Record<string, ChoiceKey>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<{ currency: string; text: string } | null>(null);

  if (cart.length == 0) {
    return (
      <div className="card px-6 py-14 text-center">
        <p className="text-lg font-semibold text-navy-900">Your cart is empty</p>
        <p className="mt-1 text-sm text-slate-600">
          Items with a fixed price can be bought online. Browse our collections:
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/gems" className="btn-outline btn-sm">Gems & Jewellery</Link>
          <Link href="/vehicles" className="btn-outline btn-sm">Vehicles & parts</Link>
          <Link href="/import" className="btn-outline btn-sm">Import</Link>
          <Link href="/export" className="btn-outline btn-sm">Export</Link>
        </div>
      </div>
    );
  }

  const groups = new Map<string, CartItem[]>();
  for (const item of cart) {
    groups.set(item.currency, [...(groups.get(item.currency) ?? []), item]);
  }

  async function checkout(currency: string, items: CartItem[], method: ShopPaymentMethod | undefined) {
    if (!signedIn) {
      window.location.assign(`/login?next=${encodeURIComponent("/cart")}`);
      return;
    }
    if (method == undefined) {
      setError({ currency, text: "Please choose how you want to pay." });
      return;
    }
    const missing = (["phone", "address", "city", "country"] as const).find((key) => delivery[key].trim() == "");
    if (missing) {
      setError({ currency, text: `Please fill in your ${missing} under delivery details.` });
      document.getElementById(`delivery-${missing}`)?.focus();
      return;
    }

    setBusy(currency);
    setError(null);
    const result = await apiRequest<CheckoutResponse>("POST", "/api/shop/checkout", {
      paymentMethod: method,
      delivery: delivery,
      items: items.map((item) => ({
        itemType: item.itemType,
        itemId: item.itemId,
        quantity: item.quantity,
      })),
    });
    const data = result.data.data;
    if (result.ok && data?.form) {
      postForm(data.form.action, data.form.fields); // PayHere's secure page
      return;
    }
    if (result.ok && data?.redirect) {
      window.location.assign(data.redirect); // Stripe, or our bank details page
      return;
    }
    setBusy(null);
    setError({
      currency: currency,
      text:
        result.status == 401
          ? "Please sign in again to check out."
          : (result.data.message ?? "The payment could not be started. Please try again."),
    });
  }

  return (
    <div className="space-y-8">
      {signedIn && !staff ? (
        <section className="card p-6">
          <h2 className="font-semibold text-navy-900">Delivery details</h2>
          <p className="mt-1 text-sm text-slate-600">
            Where we deliver your order. Customers abroad: include the country code in your phone number.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field id="phone" label="Phone" value={delivery.phone} type="tel" autoComplete="tel"
              placeholder="+94 77 123 4567" onChange={(phone) => setDelivery({ ...delivery, phone })} />
            <Field id="country" label="Country" value={delivery.country} autoComplete="country-name"
              onChange={(country) => setDelivery({ ...delivery, country })} />
            <div className="sm:col-span-2">
              <Field id="address" label="Address" value={delivery.address} autoComplete="street-address"
                onChange={(address) => setDelivery({ ...delivery, address })} />
            </div>
            <Field id="city" label="City" value={delivery.city} autoComplete="address-level2"
              onChange={(city) => setDelivery({ ...delivery, city })} />
          </div>
        </section>
      ) : null}

      {groups.size > 1 ? (
        <p className="rounded-xl border border-gold-400/40 bg-gold-100 px-4 py-3 text-sm text-navy-900">
          Your cart has prices in {groups.size} currencies. Each currency is paid separately.
        </p>
      ) : null}

      {[...groups].map(([currency, items]) => {
        const total = items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
        const choices = paymentChoices(options, currency);
        const available = choices.filter((choice) => choice.unavailable == null);
        // with only one way to pay, it is ticked already
        const picked = choices.find(
          (choice) => choice.key == (chosen[currency] ?? (available.length == 1 ? available[0].key : undefined)),
        );
        const method = picked?.unavailable == null ? (picked?.method ?? undefined) : undefined;
        return (
          <section key={currency} className="card overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <CartRow key={cartKey(item)} item={item} />
              ))}
            </ul>

            <div className="border-t border-slate-100 px-5 py-5">
              <h2 className="font-semibold text-navy-900">Choose your payment method</h2>
              <p className="text-xs text-slate-500">Tick one.</p>
              <fieldset className="mt-3 grid gap-3 sm:grid-cols-2">
                <legend className="sr-only">Payment method for {currency}</legend>
                {choices.map((choice) => {
                  const selected = picked?.key == choice.key && choice.unavailable == null;
                  const disabled = choice.unavailable != null;
                  return (
                    <label
                      key={choice.key}
                      className={`relative flex gap-3 rounded-2xl border-2 p-4 transition ${
                        disabled
                          ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                          : selected
                            ? "cursor-pointer border-gold-500 bg-gold-100/60 shadow-[0_10px_24px_-14px_rgba(201,162,39,0.8)]"
                            : "cursor-pointer border-slate-200 hover:border-gold-400/70"
                      }`}
                    >
                      {/* one choice per order, so a radio underneath the checkbox look */}
                      <input
                        type="radio"
                        name={`method-${currency}`}
                        value={choice.key}
                        checked={selected}
                        disabled={disabled}
                        onChange={() => {
                          setChosen({ ...chosen, [currency]: choice.key });
                          setError(null);
                        }}
                        className="peer sr-only"
                      />
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-400 ${
                          selected ? "border-gold-500 bg-gold-500 text-navy-950" : "border-slate-300 bg-white"
                        }`}
                        aria-hidden="true"
                      >
                        {selected ? (
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5 10 17l9-10" />
                          </svg>
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 font-semibold text-navy-900">
                          <span className={selected ? "text-gold-500" : "text-navy-700"}>
                            <ChoiceIcon choice={choice.key} />
                          </span>
                          {choice.title}
                        </span>
                        {choice.key == "CARD" ? (
                          <span className="mt-1.5 flex flex-wrap gap-1.5" aria-hidden="true">
                            {["VISA", "Mastercard", "Amex"].map((brand) => (
                              <span key={brand} className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-navy-800">
                                {brand}
                              </span>
                            ))}
                          </span>
                        ) : null}
                        <span className="mt-1.5 block text-xs text-slate-600">{choice.unavailable ?? choice.text}</span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              {available.length == 0 ? (
                <p className="mt-3 text-sm text-slate-600">
                  Online payment is not available for this order yet.{" "}
                  <Link href="/contact" className="font-semibold underline">Send us an enquiry</Link> and we will arrange it.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 bg-navy-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-600">Total ({currency})</p>
                <p className="text-2xl font-bold text-navy-900">{formatMoney(total, currency)}</p>
                <p className="text-xs text-slate-500">Prices and stock are checked again when you pay.</p>
              </div>
              <div className="sm:w-72">
                <button
                  type="button"
                  disabled={busy != null || staff || (signedIn && available.length == 0)}
                  onClick={() => checkout(currency, items, method)}
                  className="btn-gold w-full"
                >
                  {busy == currency
                    ? "Please wait..."
                    : staff
                      ? "Customer account needed"
                      : !signedIn
                      ? "Sign in to check out"
                      : method == undefined
                        ? "Choose a payment method"
                        : method == "BANK_TRANSFER"
                          ? "Place order - pay by bank transfer"
                          : `Pay ${formatMoney(total, currency)} by card`}
                </button>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  Card details are entered on the payment provider&apos;s secure page
                </p>
              </div>
            </div>
            {error?.currency == currency ? (
              <p role="alert" className="border-t border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800">
                {error.text}
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={`delivery-${id}`}>{label}</label>
      <input
        id={`delivery-${id}`}
        type={type}
        required
        maxLength={id == "address" ? 200 : 80}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const key = cartKey(item);
  const [draft, setDraft] = useState<string | null>(null);
  const single = item.max == 1 && item.min <= 1;

  return (
    <li className="flex gap-4 px-5 py-4">
      {item.image ? (
        // catalogue images can be on any host, so a plain <img>
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="h-20 w-20 shrink-0 rounded-xl border border-slate-200 object-cover" />
      ) : (
        <span className="h-20 w-20 shrink-0 rounded-xl bg-navy-50" aria-hidden="true" />
      )}
      <div className="min-w-0 flex-1">
        <Link href={item.href} className="font-semibold text-navy-900 hover:underline">
          {item.name}
        </Link>
        <p className="text-xs text-slate-500">
          {item.sku} · {formatMoney(item.unitPrice, item.currency)} / {item.unit}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {single ? (
            <span className="text-sm text-slate-600">1 {item.unit}</span>
          ) : (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Qty
              <input
                type="number"
                min={item.min}
                max={item.max ?? undefined}
                step={item.wholeNumbers ? 1 : "any"}
                className="input w-28 py-1.5"
                value={draft ?? String(item.quantity)}
                onChange={(event) => setDraft(event.target.value)}
                onBlur={() => {
                  if (draft != null && Number(draft) > 0) {
                    setCartQuantity(key, Number(draft));
                  }
                  setDraft(null);
                }}
              />
              {item.unit}
            </label>
          )}
          <button
            type="button"
            onClick={() => removeFromCart([key])}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
      <p className="font-semibold whitespace-nowrap text-navy-900">
        {formatMoney(Number(item.unitPrice) * item.quantity, item.currency)}
      </p>
    </li>
  );
}
