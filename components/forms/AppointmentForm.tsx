"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api-client";
import { DIVISION_LIST } from "@/lib/divisions";
import {
  APPOINTMENT_MODES,
  formatOfficeClock,
  formatOfficeDay,
  officeDay,
  OFFICE_TIME_ZONE,
} from "@/lib/format";
import { AppointmentSlots, Division } from "@/lib/types";

type Props = {
  defaultDivision?: Division;
  defaultService?: string;
  defaultSubject?: string;
  enquiryId?: string; // booked from an enquiry in the account
  prefill?: { firstName?: string; lastName?: string; email?: string };
  signedIn?: boolean;
};

const DAYS_SHOWN = 14;
const MAX_DAYS_AHEAD = 60;

function addDays(day: string, count: number) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
}

function isSunday(day: string) {
  return new Date(`${day}T00:00:00Z`).getUTCDay() == 0;
}

// The next working days (office time), Sundays left out - the office is closed
function nextWorkingDays(today: string) {
  const days: string[] = [];
  for (let offset = 0; days.length < DAYS_SHOWN; offset++) {
    const day = addDays(today, offset);
    if (!isSunday(day)) {
      days.push(day);
    }
  }
  return days;
}

function dayChip(day: string) {
  const date = new Date(`${day}T12:00:00Z`);
  return {
    weekday: date.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }),
    date: date.getUTCDate(),
    month: date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }),
  };
}

function officeHour(iso: string) {
  return Number(
    new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", hourCycle: "h23", timeZone: OFFICE_TIME_ZONE }),
  );
}

// Book a meeting with a division: pick a day, a free time, and how to meet
export default function AppointmentForm(props: Props) {
  const today = useMemo(() => officeDay(new Date()), []);
  const days = useMemo(() => nextWorkingDays(today), [today]);

  const [division, setDivision] = useState<string>(props.defaultDivision ?? "");
  const [mode, setMode] = useState<string>("IN_PERSON");
  const [day, setDay] = useState(days[0]);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [startAt, setStartAt] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState<{ reference: string; startAt: string } | null>(null);

  const services = DIVISION_LIST.find((item) => item.key == division)?.services ?? [];

  const loadSlots = useCallback(async () => {
    if (!division || !day) {
      setSlots(null);
      return;
    }
    setLoadingSlots(true);
    setSlotError("");
    const result = await apiRequest<{ data?: AppointmentSlots }>(
      "GET",
      `/api/appointments/slots?division=${division}&date=${day}`,
    );
    setLoadingSlots(false);
    if (result.ok && result.data.data) {
      setSlots(result.data.data.slots);
    } else {
      setSlots([]);
      setSlotError(result.data.message ?? "Could not load the free times.");
    }
  }, [division, day]);

  useEffect(() => {
    setStartAt("");
    loadSlots();
  }, [loadSlots]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!startAt) {
      setError("Please choose a time.");
      return;
    }
    setSending(true);

    const form = new FormData(event.currentTarget);
    const value = (name: string) => {
      const text = String(form.get(name) ?? "").trim();
      return text == "" ? undefined : text;
    };

    const result = await apiRequest<{ reference?: string }>("POST", "/api/appointments", {
      division: division,
      serviceType: value("serviceType"),
      subject: value("subject"),
      message: value("message"),
      mode: mode,
      startAt: startAt,
      firstName: value("firstName"),
      lastName: value("lastName"),
      companyName: value("companyName"),
      email: value("email"),
      phone: value("phone"),
      country: value("country"),
      enquiryId: props.enquiryId,
      website: value("website"), // honeypot
    });

    setSending(false);
    if (result.ok) {
      setBooked({ reference: result.data.reference ?? "", startAt: startAt });
    } else {
      setError(result.data.message ?? "Could not book the appointment.");
      if (result.status == 409) {
        loadSlots(); // someone took that time - show what is still free
      }
    }
  }

  if (booked) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-600 text-2xl text-white">
          ✓
        </span>
        <p className="mt-4 text-lg font-semibold text-emerald-900">Your appointment request is in.</p>
        <p className="mt-2 text-emerald-900">
          {formatOfficeDay(booked.startAt)} at <strong>{formatOfficeClock(booked.startAt)}</strong> (Sri Lanka time)
        </p>
        {booked.reference ? (
          <p className="mt-2 text-sm text-emerald-800">
            Reference <span className="font-mono font-semibold">{booked.reference}</span>
          </p>
        ) : null}
        <p className="mx-auto mt-4 max-w-md text-sm text-emerald-800">
          We will email you as soon as our team confirms the time. The confirmation has a button to add it to
          your Google Calendar.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {props.signedIn ? (
            <Link href="/account/appointments" className="btn-navy">
              View my appointments
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setBooked(null);
              loadSlots();
            }}
            className="btn-outline"
          >
            Book another time
          </button>
        </div>
      </div>
    );
  }

  const morning = (slots ?? []).filter((slot) => officeHour(slot) < 12);
  const afternoon = (slots ?? []).filter((slot) => officeHour(slot) >= 12);
  const lastDay = addDays(today, MAX_DAYS_AHEAD);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* 1. What about */}
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 flex items-center gap-3 text-lg font-semibold text-navy-900">
          <Step number={1} /> What is it about?
        </legend>
        <div>
          <label className="label" htmlFor="division">Division *</label>
          <select
            id="division"
            className="input"
            required
            value={division}
            onChange={(event) => setDivision(event.target.value)}
          >
            <option value="">Choose a division...</option>
            {DIVISION_LIST.map((item) => (
              <option key={item.key} value={item.key}>{item.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="serviceType">Service</label>
          <select
            id="serviceType"
            name="serviceType"
            className="input"
            defaultValue={props.defaultService ?? ""}
            key={division}
            disabled={services.length == 0}
          >
            <option value="">General advice</option>
            {services.map((service) => (
              <option key={service.value} value={service.value}>{service.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="subject">Topic *</label>
          <input
            id="subject"
            name="subject"
            required
            minLength={3}
            maxLength={200}
            className="input"
            defaultValue={props.defaultSubject}
            placeholder="e.g. Visa for a family trip to Japan"
          />
        </div>
        <div className="sm:col-span-2">
          <span className="label">How would you like to meet? *</span>
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Meeting type">
            {APPOINTMENT_MODES.map((item) => {
              const active = mode == item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(item.value)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-gold-500 bg-gold-100/60 ring-2 ring-gold-500/20"
                      : "border-slate-200 bg-white hover:border-gold-500/50"
                  }`}
                >
                  <span className="block text-sm font-semibold text-navy-900">{item.label}</span>
                  <span className="block text-xs text-slate-600">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>

      {/* 2. When */}
      <fieldset>
        <legend className="mb-1 flex items-center gap-3 text-lg font-semibold text-navy-900">
          <Step number={2} /> Choose a day and time
        </legend>
        <p className="mb-4 text-sm text-slate-600">
          Times are Sri Lanka time. Monday to Saturday, 9:00 - 17:00, 30 minutes each.
        </p>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="listbox" aria-label="Day">
          {days.map((item) => {
            const chip = dayChip(item);
            const active = item == day;
            return (
              <button
                key={item}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => setDay(item)}
                className={`flex w-16 shrink-0 flex-col items-center rounded-xl border py-2 transition ${
                  active
                    ? "border-navy-900 bg-navy-900 text-gold-400"
                    : "border-slate-200 bg-white text-navy-900 hover:border-gold-500/50"
                }`}
              >
                <span className="text-[0.7rem] uppercase opacity-75">{chip.weekday}</span>
                <span className="text-xl font-semibold leading-tight">{chip.date}</span>
                <span className="text-[0.7rem] opacity-75">{chip.month}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor="otherDay" className="text-slate-600">Another date:</label>
          <input
            id="otherDay"
            type="date"
            min={today}
            max={lastDay}
            value={day}
            onChange={(event) => event.target.value && setDay(event.target.value)}
            className="input w-auto py-1.5"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-navy-50/60 p-4" aria-live="polite">
          {!division ? (
            <p className="text-sm text-slate-600">Choose a division first to see the free times.</p>
          ) : loadingSlots ? (
            <p className="text-sm text-slate-600">Checking free times...</p>
          ) : slotError ? (
            <p className="text-sm text-red-700">{slotError}</p>
          ) : isSunday(day) ? (
            <p className="text-sm text-slate-600">We are closed on Sundays. Please choose another day.</p>
          ) : slots && slots.length == 0 ? (
            <p className="text-sm text-slate-600">No free times on {formatOfficeDay(`${day}T12:00:00Z`)}. Please try another day.</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-navy-900">{formatOfficeDay(`${day}T12:00:00Z`)}</p>
              {[
                { label: "Morning", items: morning },
                { label: "Afternoon", items: afternoon },
              ]
                .filter((group) => group.items.length > 0)
                .map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">{group.label}</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                      {group.items.map((slot) => {
                        const active = slot == startAt;
                        return (
                          <button
                            key={slot}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setStartAt(slot)}
                            className={`rounded-lg border py-2 text-sm font-semibold transition ${
                              active
                                ? "border-gold-500 bg-gold-500 text-navy-950"
                                : "border-slate-200 bg-white text-navy-900 shadow-[0_2px_0_#dbe3ee] hover:border-gold-400"
                            }`}
                          >
                            {formatOfficeClock(slot)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </fieldset>

      {/* 3. Who */}
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 flex items-center gap-3 text-lg font-semibold text-navy-900">
          <Step number={3} /> Your details
        </legend>
        <div>
          <label className="label" htmlFor="firstName">First name *</label>
          <input id="firstName" name="firstName" required maxLength={100} autoComplete="given-name" className="input" defaultValue={props.prefill?.firstName} />
        </div>
        <div>
          <label className="label" htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" maxLength={100} autoComplete="family-name" className="input" defaultValue={props.prefill?.lastName} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" defaultValue={props.prefill?.email} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone / WhatsApp{mode == "PHONE" ? " *" : ""}</label>
          <input id="phone" name="phone" type="tel" required={mode == "PHONE"} maxLength={30} autoComplete="tel" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="companyName">Company</label>
          <input id="companyName" name="companyName" maxLength={200} autoComplete="organization" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="country">Country</label>
          <input id="country" name="country" maxLength={100} autoComplete="country-name" className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="message">Anything we should prepare?</label>
          <textarea
            id="message"
            name="message"
            maxLength={5000}
            rows={4}
            className="input"
            placeholder="Travel dates, items you are interested in, questions..."
          />
        </div>

        {/* honeypot: hidden from people, bots fill it in */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={sending || !startAt} className="btn-gold w-full sm:w-auto">
          {sending ? "Booking..." : "Request appointment"}
        </button>
        {startAt ? (
          <p className="text-sm text-slate-600">
            {formatOfficeDay(startAt)}, <strong>{formatOfficeClock(startAt)}</strong>
          </p>
        ) : (
          <p className="text-sm text-slate-500">Choose a time to continue.</p>
        )}
      </div>
    </form>
  );
}

function Step({ number }: { number: number }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-900 text-sm font-bold text-gold-400">
      {number}
    </span>
  );
}
