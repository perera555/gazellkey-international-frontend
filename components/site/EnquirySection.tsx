import Image from "next/image";
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
    <section id="enquire" className="scroll-mt-28 bg-navy-50 py-16">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="inline-block h-1 w-12 rounded-full" style={{ background: division.color }} />
          <h2 className="heading-display mt-4 text-3xl sm:text-4xl">{heading ?? "Send us an enquiry"}</h2>
          <p className="mt-3 text-slate-600">
            {text ??
              "Tell us what you need. A member of our team will reply with options and a quotation."}
          </p>
          <div className="relative mt-8 hidden aspect-4/3 overflow-hidden rounded-3xl border-4 border-white shadow-[0_30px_60px_-30px_rgba(11,37,69,0.6)] lg:block">
            <Image src={DIVISION_IMAGES[division.key]} alt="" fill sizes="40vw" className="object-cover" />
            <span className="absolute inset-0 bg-linear-to-t from-navy-950/70 to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-sm text-white">
              We reply to every enquiry, usually within one working day.
            </p>
          </div>
        </div>
        <div className="card p-6 sm:p-8">
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
