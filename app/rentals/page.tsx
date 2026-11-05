import type { Metadata } from "next";
import ErrorNote from "@/components/site/ErrorNote";
import RentalPlanner from "@/components/rentals/RentalPlanner";
import { apiGet } from "@/lib/api";
import { DIVISION_IMAGES } from "@/lib/media";
import { getSessionUser, isStaff } from "@/lib/session";
import { RentalItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Rentals",
  description:
    "Hire wedding huts, funeral canopies, chairs, tables, decoration and sound systems for your event. Check availability for your dates and request a booking online.",
};

const OCCASIONS = [
  { title: "Weddings & homecomings", text: "Decorated huts, gold chairs, round tables, flowers and fairy lights." },
  { title: "Funerals & almsgivings", text: "White canopies and simple chairs, set up at short notice at home or the temple." },
  { title: "Parties & company events", text: "Balloon décor, sound systems, microphones, projectors and a DJ." },
];

const STEPS = [
  { title: "Pick your dates", text: "See what is free on your days." },
  { title: "Choose items", text: "Huts, chairs, tables, sound and more." },
  { title: "Send the request", text: "Nothing to pay now." },
  { title: "We confirm", text: "Our team calls you with the final price, including delivery and setup." },
];

export default async function RentalsPage() {
  const [items, user] = await Promise.all([apiGet<RentalItem[]>("/api/rentals/items?pageSize=100"), getSessionUser()]);
  const prefill = user && !isStaff(user) ? { firstName: user.firstName, lastName: user.lastName, email: user.email } : null;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(56rem 28rem at 90% -10%, rgb(242 107 33 / 0.32), transparent 60%), radial-gradient(40rem 24rem at 0% 120%, rgb(212 166 74 / 0.22), transparent 60%)",
          }}
        />
        <div className="grid-floor -z-10 opacity-40" aria-hidden="true" />
        <div className="container-page py-14 sm:py-20">
          <p className="eyebrow">Events · Rentals</p>
          <h1 className="text-3d mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            Everything for your event, <span className="text-gold-gradient">delivered and set up</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Huts and canopies, chairs, tables, decoration and sound - for weddings, funerals, almsgivings and parties anywhere in Sri Lanka.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {OCCASIONS.map((occasion) => (
              <div key={occasion.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="font-semibold text-gold-400">{occasion.title}</p>
                <p className="mt-1 text-sm text-white/70">{occasion.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ivory-200 bg-ivory-50">
        <ol className="container-page grid gap-4 py-6 sm:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-950 text-sm font-bold text-gold-400">{index + 1}</span>
              <span>
                <span className="block text-sm font-semibold text-navy-950">{step.title}</span>
                <span className="block text-xs text-slate-500">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {items.ok ? (
        items.data.length > 0 ? (
          <RentalPlanner items={items.data} fallbackImage={DIVISION_IMAGES.EVENTS} prefill={prefill} />
        ) : (
          <p className="container-page py-16 text-center text-slate-500">Our rental items will be listed here soon. Please contact us for your event.</p>
        )
      ) : (
        <div className="container-page py-12">
          <ErrorNote message={items.message} />
        </div>
      )}
    </>
  );
}
