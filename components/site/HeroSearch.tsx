"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";
import { DIVISIONS, GEM_TYPES } from "@/lib/divisions";
import AirportInput from "./AirportInput";

type Tab = "flights" | "tours" | "hotels" | "gems" | "trade";

const TABS: { key: Tab; label: string; icon: ReactNode }[] = [
  { key: "flights", label: "Flights", icon: <path d="M2 16l20-6-2-3-7 2L7 3H5l3 7-4 1-2-2H1l1 4zM2 20h20" /> },
  { key: "tours", label: "Tours", icon: <path d="M12 3v18M5 8c2-3 5-4 7-5 2 1 5 2 7 5M4 21h16M8 12l4-4 4 4" /> },
  { key: "hotels", label: "Hotels", icon: <path d="M3 20V6h8v4h10v10M3 14h18M7 10h.01M15 14v-2h4" /> },
  { key: "gems", label: "Gems", icon: <path d="M6 3h12l3 6-9 12L3 9zM3 9h18M9 3l3 18 3-18" /> },
  { key: "trade", label: "Trade", icon: <path d="M3 17h18l-2 4H5zM6 17V9h12v8M9 9V5h6v4" /> },
];

// Flights and hotels are booked by our team (no live inventory), so those
// searches open the enquiry form already filled in with the request.
function enquiryHref(service: string, subject: string, lines: string[]) {
  const query = new URLSearchParams({
    division: "TRAVEL",
    subject: subject,
    message: lines.filter(Boolean).join("\n"),
  });
  if (service) {
    query.set("service", service);
  }
  return `/contact?${query.toString()}#enquiry`;
}

// Tabbed search panel in the home page hero (slide 6 of the design document)
export default function HeroSearch() {
  const [tab, setTab] = useState<Tab>("flights");
  const router = useRouter();

  function onHotels(event: FormEvent<HTMLFormElement>) {
    const value = reader(event);
    router.push(
      enquiryHref("", `Hotel reservation: ${value("city")}`, [
        `Destination: ${value("city")}`,
        `Check-in: ${value("checkin")}`,
        `Check-out: ${value("checkout")}`,
        `Guests: ${value("guests")}`,
      ]),
    );
  }

  return (
    <div className="glass w-full max-w-5xl p-3 sm:p-4">
      <div role="tablist" aria-label="Search" className="flex gap-1 overflow-x-auto pb-3">
        {TABS.map((item) => {
          const active = tab == item.key;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.key)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-6 ${
                active
                  ? "bg-gold-500 text-navy-950 shadow-[0_10px_24px_-12px_rgba(212,166,74,0.9)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {item.icon}
              </svg>
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-4 text-navy-900 sm:p-5">
        {tab == "flights" ? <FlightSearch /> : null}

        {tab == "tours" ? (
          <Form action="/travel">
            <Row>
              <Field label="Destination" wide><input name="search" placeholder="Maldives, Phuket, Kandy..." className="input" /></Field>
              <Field label="Country"><input name="country" placeholder="Any country" className="input" /></Field>
              <Field label="Tour type">
                <select name="tourType" className="input" defaultValue="">
                  <option value="">All tours</option>
                  <option value="OUTBOUND">Outbound tours</option>
                  <option value="INBOUND">Sri Lanka tours</option>
                </select>
              </Field>
              <SearchButton />
            </Row>
          </Form>
        ) : null}

        {tab == "hotels" ? (
          <form onSubmit={onHotels}>
            <Row>
              <Field label="City or hotel" wide><input name="city" required placeholder="Where are you staying?" className="input" /></Field>
              <Field label="Check-in"><input name="checkin" type="date" required className="input" /></Field>
              <Field label="Check-out"><input name="checkout" type="date" required className="input" /></Field>
              <Field label="Guests">
                <select name="guests" className="input" defaultValue="2 guests">
                  {["1 guest", "2 guests", "3 guests", "4 guests", "5+ guests"].map((count) => (
                    <option key={count}>{count}</option>
                  ))}
                </select>
              </Field>
              <SearchButton />
            </Row>
          </form>
        ) : null}

        {tab == "gems" ? (
          <Form action="/gems">
            <Row>
              <Field label="Looking for" wide><input name="search" placeholder="Blue sapphire, ruby, ring..." className="input" /></Field>
              <Field label="Type">
                <select name="itemType" className="input" defaultValue="">
                  <option value="">Gems & jewellery</option>
                  {GEM_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </Field>
              <SearchButton />
            </Row>
          </Form>
        ) : null}

        {tab == "trade" ? <TradeSearch /> : null}
      </div>
    </div>
  );
}

function reader(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  return (name: string) => String(form.get(name) ?? "").trim();
}

// Flight search (slide 7): becomes an air-ticket request our team prices
export function FlightSearch({ label = "Search" }: { label?: string }) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const value = reader(event);
    router.push(
      enquiryHref("AIR_TICKET", `Air ticket: ${value("from")} to ${value("to")}`, [
        `Trip: ${value("trip")}`,
        `From: ${value("from")}`,
        `To: ${value("to")}`,
        `Departure date: ${value("depart")}`,
        value("return") ? `Return date: ${value("return")}` : "",
        `Passengers: ${value("passengers")}`,
      ]),
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-wrap gap-4 text-sm">
        {["One way", "Round trip", "Multi-city"].map((trip, index) => (
          <label key={trip} className="flex items-center gap-1.5">
            <input type="radio" name="trip" value={trip} defaultChecked={index == 1} className="accent-gold-500" />
            {trip}
          </label>
        ))}
      </div>
      <Row>
        <Field label="From"><AirportInput name="from" required placeholder="Colombo (CMB)" /></Field>
        <Field label="To"><AirportInput name="to" required placeholder="Dubai (DXB)" /></Field>
        <Field label="Departure date"><input name="depart" type="date" required className="input" /></Field>
        <Field label="Return date"><input name="return" type="date" className="input" /></Field>
        <Field label="Passengers">
          <select name="passengers" className="input" defaultValue="1 adult">
            {["1 adult", "2 adults", "3 adults", "4 adults", "5+ travellers"].map((count) => (
              <option key={count}>{count}</option>
            ))}
          </select>
        </Field>
        <SearchButton label={label} />
      </Row>
    </form>
  );
}

// Import and export are separate catalogues, so the form action follows the choice
function TradeSearch() {
  const [direction, setDirection] = useState<"IMPORT" | "EXPORT">("EXPORT");
  const division = DIVISIONS[direction];
  return (
    <Form action={division.href}>
      <Row>
        <Field label="I want to">
          <select
            className="input"
            value={direction}
            onChange={(event) => setDirection(event.target.value as "IMPORT" | "EXPORT")}
          >
            <option value="EXPORT">Buy from Sri Lanka (export)</option>
            <option value="IMPORT">Import to Sri Lanka</option>
          </select>
        </Field>
        <Field label="Category">
          <select name="category" className="input" defaultValue="" key={direction}>
            <option value="">All categories</option>
            {division.services.map((service) => (
              <option key={service.value} value={service.value}>{service.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Product"><input name="search" placeholder="Product name" className="input" /></Field>
        <SearchButton />
      </Row>
    </Form>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="grid items-end gap-3 sm:grid-cols-2 lg:flex">{children}</div>;
}

function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={`block min-w-0 ${wide ? "sm:col-span-2 lg:flex-2" : "lg:flex-1"}`}>
      <span className="mb-1 block text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</span>
      {children}
    </label>
  );
}

function SearchButton({ label = "Search" }: { label?: string }) {
  return (
    <button type="submit" className="btn-gold w-full px-8 sm:col-span-2 lg:w-auto">
      {label}
    </button>
  );
}
