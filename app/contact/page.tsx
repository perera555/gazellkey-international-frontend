import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/forms/EnquiryForm";
import PageHero from "@/components/site/PageHero";
import { isDivision } from "@/lib/divisions";
import { param } from "@/lib/format";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Contact / Enquiry" };

const STEPS = [
  "You get an email with your enquiry reference.",
  "A specialist from the right division contacts you.",
  "We send a quotation you can accept online.",
];

// /contact?division=GEMS pre-selects a division. The home page search also
// sends ?service=, ?subject= and ?message= so flight and hotel requests arrive filled in.
export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const params = await searchParams;
  const division = param(params.division);
  const user = await getSessionUser();

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="How can we help?"
        text="One form for every division. We reply to every enquiry, usually within one working day."
        image="/images/travel-plane.jpg"
      />

      <section className="bg-linear-to-b from-navy-50 to-white">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-6 text-slate-700">
            <div>
              <h2 className="heading-display text-2xl">What happens next?</h2>
              <ol className="mt-6 space-y-5">
                {STEPS.map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-b from-gold-400 to-gold-500 font-extrabold text-navy-950 shadow-[0_4px_0_var(--color-gold-600)]">
                      {index + 1}
                    </span>
                    <span className="pt-2 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card p-5">
              <h2 className="font-semibold text-navy-900">Already a customer?</h2>
              <p className="mt-2 text-sm">
                Sign in to see your enquiries, quotations, orders and documents in your account.
              </p>
              <Link href="/login" className="btn-outline btn-sm mt-4">Sign in</Link>
            </div>
          </div>
          <div id="enquiry" className="card scroll-mt-36 p-6 sm:p-8">
            <EnquiryForm
              defaultDivision={isDivision(division) ? division : undefined}
              defaultService={param(params.service)}
              defaultSubject={param(params.subject)}
              defaultMessage={param(params.message)}
              showCompany
              prefill={user ?? undefined}
            />
          </div>
        </div>
      </section>
    </>
  );
}
