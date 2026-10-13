import Image from "next/image";
import Link from "next/link";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { DivisionInfo } from "@/lib/divisions";
import { DIVISION_IMAGES } from "@/lib/media";
import { getSessionUser } from "@/lib/session";

// "Send an enquiry" block at the bottom of each division page
export default async function EnquirySection({
  division,
  heading,
  text,
  showCompany,
}: {
  division: DivisionInfo;
  heading?: string;
  text?: string;
  showCompany?: boolean;
}) {
  const user = await getSessionUser();
  return (
    <section
      id="enquire"
      className="relative scroll-mt-28 overflow-hidden bg-linear-to-br from-navy-900 via-navy-950 to-navy-950 py-20 text-white"
    >
      <div className="grid-floor opacity-50" aria-hidden="true" />
      <div className="container-page relative grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="inline-block h-px w-12 bg-gold-500" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{heading ?? "Send us an enquiry"}</h2>
          <p className="mt-3 text-white/65">
            {text ??
              "Tell us what you need. A member of our team will reply with options and a quotation."}
          </p>
          <div className="relative mt-8 hidden aspect-4/3 overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] lg:block">
            <Image src={DIVISION_IMAGES[division.key]} alt="" fill sizes="40vw" className="object-cover" />
            <span className="absolute inset-0 bg-linear-to-t from-navy-950/80 to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-sm text-white/90">
              We reply to every enquiry, usually within one working day.
            </p>
          </div>
          <div className="glass mt-6 flex flex-wrap items-center gap-3 rounded-2xl p-4">
            <p className="flex-1 text-sm text-white/75">Prefer to talk it through? Visit us or book a call.</p>
            <Link href={`/appointments?division=${division.key}`} className="btn-gold-outline btn-sm">
              Book an appointment
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/20 bg-white/85 p-6 text-navy-900 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8">
          <EnquiryForm
            division={division.key}
            services={division.services}
            showCompany={showCompany}
            prefill={user ?? undefined}
          />
        </div>
      </div>
    </section>
  );
}
