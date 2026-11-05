"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api-client";
import { formatMoney } from "@/lib/format";
import { RENTAL_EVENT_TYPES, rentalDayCount } from "@/lib/rentals";
import { RentalItem } from "@/lib/types";

type Prefill = { firstName: string; lastName: string; email: string } | null;
type Availability = Record<string, number>; // itemId -> units free on every chosen day

const STORAGE_KEY = "gazellekey-rental-list";

function todayInColombo() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(new Date());
}

// The whole rental flow on one page: dates -> items -> request form
export default function RentalPlanner({
  items,
  fallbackImage,
  prefill,
}: {
  items: RentalItem[];
  fallbackImage: string;
  prefill: Prefill;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [checking, setChecking] = useState(false);
  const [dateError, setDateError] = useState("");
  const [category, setCategory] = useState("All");
  const [list, setList] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ reference: string; total: string; currency: string } | null>(null);

  const today = todayInColombo();
  const days = rentalDayCount(from, to);
  const datesReady = days > 0;

  // keep the chosen items if the visitor reloads or signs in
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
      if (saved && typeof saved == "object") {
        setList(saved.list ?? {});
        setFrom(saved.from ?? "");
        setTo(saved.to ?? "");
      }
    } catch {
      // storage blocked: the list lives until the page closes
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ list, from, to }));
    } catch {
      // ignore
    }
  }, [list, from, to, loaded]);

  // free stock for the chosen dates
  useEffect(() => {
    if (!datesReady) {
      setAvailability(null);
      setDateError(from && to && to < from ? "The last day must be on or after the first day." : "");
      return;
    }
    let cancelled = false;
    setChecking(true);
    setDateError("");
    apiRequest<{ data: { itemId: string; available: number }[] }>("GET", `/api/rentals/availability?from=${from}&to=${to}`).then(
      (result) => {
        if (cancelled) {
          return;
        }
        setChecking(false);
        if (!result.ok) {
          setAvailability(null);
          setDateError(result.data.message ?? "Could not check these dates.");
          return;
        }
        setAvailability(Object.fromEntries(result.data.data.map((row) => [row.itemId, row.available])));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [from, to, datesReady]);

  const categories = useMemo(() => ["All", ...new Set(items.map((item) => item.category))], [items]);
  const shown = category == "All" ? items : items.filter((item) => item.category == category);
  const chosen = items.filter((item) => (list[item.id] ?? 0) > 0);
  const currency = chosen[0]?.currency ?? items[0]?.currency ?? "LKR";
  const perDay = chosen.reduce((sum, item) => sum + Number(item.pricePerDay) * list[item.id], 0);
  const total = perDay * Math.max(days, 1);

  const maxFor = (item: RentalItem) => (availability ? (availability[item.id] ?? 0) : item.quantityOwned);
  const tooMany = chosen.filter((item) => list[item.id] > maxFor(item));

  function setQuantity(item: RentalItem, value: number) {
    if ((list[item.id] ?? 0) == 0 && value > 0) {
      toast.success(`${item.name} added to your rental list`);
    }
    setList((current) => {
      const next = { ...current };
      const quantity = Math.max(0, Math.min(Math.round(value) || 0, item.quantityOwned));
      if (quantity == 0) {
        delete next[item.id];
      } else {
        next[item.id] = quantity;
      }
      return next;
    });
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!datesReady) {
      setError("Please choose your dates at the top of the page.");
      return;
    }
    if (chosen.length == 0) {
      setError("Please add at least one item.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    setSending(true);
    const result = await apiRequest<{ data?: { reference: string; estimatedTotal: string; currency: string } }>(
      "POST",
      "/api/rentals/bookings",
      {
        eventType: text("eventType"),
        startDate: from,
        endDate: to,
        venue: text("venue"),
        city: text("city"),
        guests: text("guests") ? Number(text("guests")) : undefined,
        needsDelivery: form.get("needsDelivery") == "on",
        needsSetup: form.get("needsSetup") == "on",
        message: text("message") || undefined,
        items: chosen.map((item) => ({ rentalItemId: item.id, quantity: list[item.id] })),
        firstName: text("firstName"),
        lastName: text("lastName") || undefined,
        email: text("email"),
        phone: text("phone"),
        website: text("website") || undefined,
      },
    );
    setSending(false);
    if (!result.ok || !result.data.data) {
      setError(result.data.message ?? "Could not send your request. Please try again.");
      return;
    }
    setDone({ reference: result.data.data.reference, total: result.data.data.estimatedTotal, currency: result.data.data.currency });
    toast.success(`Rental request ${result.data.data.reference} sent`);
    setList({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <section className="container-page py-16">
        <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</span>
          <h2 className="heading-display mt-5 text-3xl">Request sent</h2>
          <p className="mt-3 text-slate-600">
            Your reference is <b>{done.reference}</b>. Estimated price for the items: <b>{formatMoney(done.total, done.currency)}</b>. Our events team
            will call you to confirm the items, delivery and the final price. We also sent you an email.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {prefill ? (
              <Link href="/account/rentals" className="btn-navy">
                See my rentals
              </Link>
            ) : null}
            <button type="button" className="btn-outline" onClick={() => setDone(null)}>
              Plan another event
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ── 1. Dates ── */}
      <div className="sticky top-20 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl lg:top-24">
        <div className="container-page flex flex-wrap items-end gap-x-6 gap-y-3 py-4">
          <p className="w-full text-xs font-bold tracking-widest text-navy-900 uppercase sm:w-auto sm:self-center">1 · Your event dates</p>
          <label className="grid gap-1 text-xs font-semibold text-slate-500">
            First day
            <input
              id="rental-from"
              type="date"
              min={today}
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                if (!to || to < event.target.value) {
                  setTo(event.target.value);
                }
              }}
              className="input py-2"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-500">
            Last day
            <input
              id="rental-to"
              type="date"
              min={from || today}
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="input py-2"
            />
          </label>
          <p className="text-sm text-slate-600 sm:self-center" aria-live="polite">
            {dateError ? (
              <span className="text-red-700">{dateError}</span>
            ) : checking ? (
              "Checking availability..."
            ) : datesReady ? (
              <>
                <b>
                  {days} day{days == 1 ? "" : "s"}
                </b>{" "}
                · showing what is free on your dates
              </>
            ) : (
              "Choose dates to see what is available."
            )}
          </p>
        </div>
      </div>

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          {/* ── 2. Items ── */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="heading-display text-2xl">2 · Choose your items</h2>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group" aria-label="Category">
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                aria-pressed={category == name}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  category == name ? "bg-navy-950 text-white" : "bg-navy-50 text-navy-800 hover:bg-navy-100"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((item) => {
              const quantity = list[item.id] ?? 0;
              const free = availability ? (availability[item.id] ?? 0) : null;
              const soldOut = free != null && free < item.minQuantity;
              return (
                <li key={item.id} className={`card flex flex-col overflow-hidden ${quantity > 0 ? "ring-2 ring-gold-500" : ""}`}>
                  <div className="relative aspect-4/3 bg-navy-50">
                    {/* Catalogue images are URLs on any host, so a plain <img> */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.images[0] || fallbackImage} alt={item.name} loading="lazy" className={`h-full w-full object-cover ${soldOut ? "opacity-60 grayscale" : ""}`} />
                    {item.featured ? (
                      <span className="absolute top-3 left-3 rounded-full bg-navy-950/85 px-2.5 py-1 text-[11px] font-semibold text-gold-400">★ Popular</span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{item.category}</p>
                    <h3 className="mt-1 leading-snug font-semibold text-navy-950">{item.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</p>
                    <p className="mt-3 text-lg font-extrabold text-navy-950">
                      {formatMoney(item.pricePerDay, item.currency)}
                      <span className="text-xs font-medium text-slate-500">
                        {" "}
                        / {item.unit} / day
                      </span>
                    </p>
                    <p className={`mt-0.5 text-xs font-medium ${soldOut ? "text-red-700" : free != null ? "text-emerald-700" : "text-slate-500"}`}>
                      {free == null
                        ? `${item.quantityOwned} available in total${item.minQuantity > 1 ? ` · min. ${item.minQuantity}` : ""}`
                        : soldOut
                          ? "Fully booked on your dates"
                          : `${free} free on your dates${item.minQuantity > 1 ? ` · min. ${item.minQuantity}` : ""}`}
                    </p>

                    <div className="mt-auto pt-4">
                      {quantity == 0 ? (
                        <button
                          type="button"
                          disabled={soldOut}
                          onClick={() => setQuantity(item, item.minQuantity)}
                          className="btn-navy w-full py-2.5"
                        >
                          {soldOut ? "Not available" : "Add to my list"}
                        </button>
                      ) : (
                        <div className="flex items-center justify-between gap-2 rounded-full border border-slate-200 p-1">
                          <button
                            type="button"
                            onClick={() => setQuantity(item, quantity <= item.minQuantity ? 0 : quantity - 1)}
                            className="grid h-9 w-9 place-items-center rounded-full text-lg hover:bg-navy-50"
                            aria-label={`One less ${item.name}`}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            min={item.minQuantity}
                            max={free ?? item.quantityOwned}
                            onChange={(event) => setQuantity(item, Number(event.target.value))}
                            aria-label={`Quantity of ${item.name}`}
                            className="w-16 [appearance:textfield] bg-transparent text-center font-semibold [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            onClick={() => setQuantity(item, quantity + 1)}
                            disabled={quantity >= (free ?? item.quantityOwned)}
                            className="grid h-9 w-9 place-items-center rounded-full text-lg hover:bg-navy-50 disabled:opacity-30"
                            aria-label={`One more ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      )}
                      {free != null && quantity > free ? (
                        <p className="mt-1.5 text-xs font-medium text-red-700">Only {free} free on your dates.</p>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* ── 3. Request ── */}
          <form id="request" onSubmit={send} className="card mt-12 scroll-mt-44 p-6 sm:p-8">
            <h2 className="heading-display text-2xl">3 · Send your request</h2>
            <p className="mt-1 text-sm text-slate-500">Nothing to pay now. Our team confirms the items and the final price with you first.</p>

            <fieldset className="mt-6">
              <legend className="label">Type of event</legend>
              <div className="flex flex-wrap gap-2">
                {RENTAL_EVENT_TYPES.map((type, index) => (
                  <label key={type.value} className="relative cursor-pointer">
                    <input type="radio" name="eventType" value={type.value} defaultChecked={index == 0} required className="peer absolute inset-0 opacity-0" />
                    <span className="inline-block rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-navy-800 transition peer-checked:border-gold-500 peer-checked:bg-gold-100 peer-focus-visible:outline-2 peer-focus-visible:outline-gold-500">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="venue">Venue address</label>
                <input id="venue" name="venue" required minLength={3} maxLength={300} className="input" placeholder="e.g. 25 Temple Road, or the hotel / hall name" />
              </div>
              <div>
                <label className="label" htmlFor="city">City / town</label>
                <input id="city" name="city" required minLength={2} maxLength={80} className="input" placeholder="Colombo" />
              </div>
              <div>
                <label className="label" htmlFor="guests">Number of guests (optional)</label>
                <input id="guests" name="guests" type="number" min={1} className="input" />
              </div>
              <label className="flex items-center gap-2.5 text-sm text-slate-700">
                <input id="needsDelivery" name="needsDelivery" type="checkbox" defaultChecked className="h-4 w-4 accent-navy-900" />
                Deliver and collect the items
              </label>
              <label className="flex items-center gap-2.5 text-sm text-slate-700">
                <input id="needsSetup" name="needsSetup" type="checkbox" className="h-4 w-4 accent-navy-900" />
                Set up at the venue (huts, tables, decoration)
              </label>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="message">Anything else? (optional)</label>
                <textarea id="message" name="message" rows={3} maxLength={3000} className="input" placeholder="Colours, timings, access to the venue..." />
              </div>
            </div>

            <h3 className="mt-7 font-semibold text-navy-900">Your contact details</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="firstName">First name</label>
                <input id="firstName" name="firstName" required defaultValue={prefill?.firstName} autoComplete="given-name" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" defaultValue={prefill?.lastName} autoComplete="family-name" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required defaultValue={prefill?.email} autoComplete="email" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" required minLength={6} autoComplete="tel" className="input" placeholder="077 123 4567" />
              </div>
            </div>
            {/* honeypot: hidden from people, bots fill it in */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            {error ? (
              <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <button type="submit" disabled={sending} className="btn-gold mt-6 w-full sm:w-auto">
              {sending ? "Sending..." : "Send rental request"}
            </button>
          </form>
        </div>

        {/* ── Summary ── */}
        <aside className="lg:sticky lg:top-48 lg:self-start">
          <div className="card overflow-hidden">
            <div className="bg-navy-950 px-5 py-4 text-white">
              <p className="text-xs font-bold tracking-widest text-gold-400 uppercase">Your rental list</p>
              <p className="mt-1 text-sm text-white/70">
                {datesReady ? `${days} day${days == 1 ? "" : "s"}` : "Dates not chosen yet"}
              </p>
            </div>
            <div className="p-5">
              {chosen.length == 0 ? (
                <p className="text-sm text-slate-500">Add huts, chairs, tables and more. They appear here with an estimated price.</p>
              ) : (
                <ul className="space-y-3">
                  {chosen.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="min-w-0">
                        <span className="font-medium text-navy-900">
                          {list[item.id]} × {item.name}
                        </span>
                        {tooMany.includes(item) ? <span className="block text-xs text-red-700">Not enough free on your dates</span> : null}
                      </span>
                      <button type="button" onClick={() => setQuantity(item, 0)} className="shrink-0 text-xs text-slate-400 hover:text-red-600" aria-label={`Remove ${item.name}`}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {chosen.length > 0 ? (
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="flex justify-between text-sm text-slate-600">
                    <span>Per day</span>
                    <span className="tabular-nums">{formatMoney(perDay, currency)}</span>
                  </p>
                  <p className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-navy-900">Estimated total</span>
                    <span className="text-xl font-extrabold text-navy-950 tabular-nums">{datesReady ? formatMoney(total, currency) : "-"}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Delivery and setup are added when we confirm.</p>
                  <a href="#request" className="btn-gold mt-4 w-full">
                    Continue to request
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
