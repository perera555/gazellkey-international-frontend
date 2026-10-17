import type { Metadata } from "next";
import Link from "next/link";
import AppointmentForm from "@/components/forms/AppointmentForm";
import PageHero from "@/components/site/PageHero";
import SignInGate from "@/components/site/SignInGate";
import { isDivision } from "@/lib/divisions";
import { param } from "@/lib/format";
import { getSessionUser, isStaff } from "@/lib/session";

export const metadata: Metadata = {
  title: "Book an appointment",
  description: "Book an office visit, phone call or video call with a Gazellekey specialist.",
};

const STEPS = [
  "Pick a division, a free time and how you would like to meet.",
  "Our team confirms the time by email - usually within a few hours.",
  "Add it to your Google Calendar with one click and we will see you then.",
];

// /appointments?division=TRAVEL&service=VISA&subject=...&enquiry=<id>
// pre-fills the form (division pages and the account link here).
export default async function AppointmentsPage({ searchParams }: PageProps<"/appointments">) {
  const params = await searchParams;
  const division = param(params.division);
  const user = await getSessionUser();
  const customer = user && !isStaff(user) ? user : null;

  // after registering / signing in, come back here with the same choices
  const query = new URLSearchParams();
  for (const key of ["division", "service", "subject", "enquiry"]) {
    const value = param(params[key]);
    if (value) query.set(key, value);
  }
  const returnTo = `/appointments${query.size > 0 ? `?${query}` : ""}#book`;

  return (
    <>
      <PageHero
        eyebrow="Appointments"
        title="Talk to a specialist"
        text="Book a time to visit our office, or let us call you by phone or video. It is free and there is no obligation."
        image="/images/events-conference.jpg"
      />

      <section className="bg-linear-to-b from-navy-50 to-white">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-6 text-slate-700">
            <div>
              <h2 className="heading-display text-2xl">How it works</h2>
              <ol className="mt-6 space-y-5">
                {STEPS.map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-900 font-bold text-gold-400">
                      {index + 1}
                    </span>
                    <span className="pt-2 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card p-5">
              <h2 className="font-semibold text-navy-900">Opening hours</h2>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-slate-500">Mon - Sat</dt>
                <dd>9:00 - 17:00</dd>
                <dt className="text-slate-500">Sunday</dt>
                <dd>Closed</dd>
              </dl>
              <p className="mt-3 text-xs text-slate-500">All times are Sri Lanka time (GMT+5:30).</p>
            </div>
            <div className="card p-5">
              <h2 className="font-semibold text-navy-900">Just a quick question?</h2>
              <p className="mt-2 text-sm">Send us an enquiry instead and we will reply by email.</p>
              <Link href="/contact" className="btn-outline btn-sm mt-4">Send an enquiry</Link>
            </div>
          </div>
          <div id="book" className="card scroll-mt-36 p-6 sm:p-8">
            {user == null ? (
              <SignInGate
                title="Create your free account to book"
                text="Bookings are kept in your account, so you can see, change or cancel them any time."
                returnTo={returnTo}
              />
            ) : (
              <AppointmentForm
                defaultDivision={isDivision(division) ? division : undefined}
                defaultService={param(params.service)}
                defaultSubject={param(params.subject)}
                enquiryId={customer ? param(params.enquiry) : undefined}
                prefill={customer ?? undefined}
                signedIn={customer != null}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
