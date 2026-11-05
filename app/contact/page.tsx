import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/forms/EnquiryForm";
import LeadershipSection from "@/components/site/LeadershipSection";
import PageHero from "@/components/site/PageHero";
import SignInGate from "@/components/site/SignInGate";
import { isDivision } from "@/lib/divisions";
import { param } from "@/lib/format";
import { getSessionUser } from "@/lib/session";
import { getDictionary } from "@/lib/i18n-server";
import { PAGE_WORDS } from "@/lib/i18n-pages";

export const metadata: Metadata = { title: "Contact / Enquiry" };

// /contact?division=GEMS pre-selects a division. The home page search also
// sends ?service=, ?subject= and ?message= so flight and hotel requests arrive filled in.
export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const params = await searchParams;
  const division = param(params.division);
  const [user, { lang }] = await Promise.all([getSessionUser(), getDictionary()]);
  const w = PAGE_WORDS[lang].contact;

  // after registering / signing in, come back here with the same choices
  const query = new URLSearchParams();
  for (const key of ["division", "service", "subject", "message"]) {
    const value = param(params[key]);
    if (value) query.set(key, value);
  }
  const returnTo = `/contact${query.size > 0 ? `?${query}` : ""}#enquiry`;

  return (
    <>
      <PageHero
        eyebrow={w.eyebrow}
        title={w.title}
        text={w.text}
        image="/images/travel-plane.jpg"
      />

      <section className="bg-linear-to-b from-navy-50 to-ivory-100">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-6 text-slate-700">
            <div>
              <h2 className="heading-display text-2xl">{w.whatNext}</h2>
              <ol className="mt-6 space-y-5">
                {w.steps.map((step, index) => (
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
              <h2 className="font-semibold text-navy-900">{w.customer}</h2>
              <p className="mt-2 text-sm">{w.customerText}</p>
              <Link href="/login" className="btn-outline btn-sm mt-4">{w.signIn}</Link>
            </div>
            <div className="card p-5">
              <h2 className="font-semibold text-navy-900">{w.talk}</h2>
              <p className="mt-2 text-sm">{w.talkText}</p>
              <Link
                href={isDivision(division) ? `/appointments?division=${division}` : "/appointments"}
                className="btn-navy btn-sm mt-4"
              >
                {w.bookAppointment}
              </Link>
            </div>
          </div>
          <div id="enquiry" className="card scroll-mt-36 p-6 sm:p-8">
            {user == null ? (
              <SignInGate
                title={w.gateTitle}
                text={w.gateText}
                returnTo={returnTo}
              />
            ) : (
              <EnquiryForm
                defaultDivision={isDivision(division) ? division : undefined}
                defaultService={param(params.service)}
                defaultSubject={param(params.subject)}
                defaultMessage={param(params.message)}
                showCompany
                prefill={user}
              />
            )}
          </div>
        </div>
      </section>

      {/* managers (email + phone) and directors (email only) */}
      <LeadershipSection variant="contact" />
    </>
  );
}
