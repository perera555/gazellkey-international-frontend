import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import JobApplyForm from "@/components/jobs/JobApplyForm";
import LanguageSwitcher from "@/components/jobs/LanguageSwitcher";
import { fill, interviewModeLabel, interviewModeText } from "@/lib/i18n";
import { DATE_LOCALES, getDictionary } from "@/lib/i18n-server";
import ShareButtons from "@/components/site/ShareButtons";
import { apiGet, apiGetItem } from "@/lib/api";
import {
  ageLabel,
  formatDeadline,
  formatInterviewTime,
  jobPlace,
  JobVacancy,
  MyJobApplication,
  salaryLabel,
} from "@/lib/jobs";
import { getSessionUser, isStaff } from "@/lib/session";
import { SITE_URL } from "@/lib/social";

export async function generateMetadata({ params }: PageProps<"/jobs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = await apiGetItem<JobVacancy>(`/api/jobs/vacancies/${encodeURIComponent(slug)}`);
  return {
    title: `${job.title} - ${job.country} | Work visa`,
    alternates: { canonical: `/jobs/${job.slug}` },
    description: `${job.title} job in ${jobPlace(job)}. ${salaryLabel(job)}. ${job.visaType ?? "Work visa"} arranged by Gazellekey International. Apply online.`,
  };
}

// Google job search (schema.org JobPosting): lets the job appear in Google's
// job listings. https://developers.google.com/search/docs/appearance/structured-data/job-posting
function jobPostingData(job: JobVacancy) {
  const list = (title: string, items: string[]) => (items.length ? `<p><b>${title}</b></p><ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>` : "");
  const salary =
    job.salaryMin != null || job.salaryMax != null
      ? {
          "@type": "MonetaryAmount",
          currency: job.salaryCurrency,
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salaryMin != null ? Number(job.salaryMin) : undefined,
            maxValue: job.salaryMax != null ? Number(job.salaryMax) : undefined,
            unitText: job.salaryPeriod.toUpperCase() == "MONTH" ? "MONTH" : job.salaryPeriod.toUpperCase(),
          },
        }
      : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description:
      `<p>${job.description}</p>` + list("Requirements", job.requirements) + list("Benefits", job.benefits) + list("Documents", job.documentsNeeded),
    identifier: { "@type": "PropertyValue", name: "Gazellekey International", value: job.reference },
    datePosted: job.createdAt,
    validThrough: job.deadline ? `${job.deadline.slice(0, 10)}T23:59:59+05:30` : undefined,
    employmentType: "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: job.employer || "Gazellekey International", sameAs: SITE_URL, logo: `${SITE_URL}/icon.svg` },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.city || undefined, addressCountry: job.country },
    },
    applicantLocationRequirements: { "@type": "Country", name: "Sri Lanka" },
    baseSalary: salary,
    totalJobOpenings: job.positions,
    directApply: true,
    url: `${SITE_URL}/jobs/${job.slug}`,
  };
}

export default async function JobPage({ params }: PageProps<"/jobs/[slug]">) {
  const { slug } = await params;
  const [job, user, { lang, t }] = await Promise.all([
    apiGetItem<JobVacancy>(`/api/jobs/vacancies/${encodeURIComponent(slug)}`),
    getSessionUser(),
    getDictionary(),
  ]);
  const locale = DATE_LOCALES[lang];
  const candidate = user && !isStaff(user) ? user : null;
  // already applied? (signed-in candidates only)
  const mine = candidate ? await apiGet<MyJobApplication[]>("/api/me/jobs?pageSize=100") : null;
  const existing = mine?.ok ? mine.data.find((application) => application.vacancy.id == job.id) : undefined;

  const ages = ageLabel(job).replace(/^Age (up to )?/, (_, upTo) => (upTo ? "- " : ""));
  const facts = [
    { label: t.salary, value: salaryLabel(job, t.salaryOnRequest) },
    { label: t.country, value: jobPlace(job) },
    { label: t.positions, value: String(job.positions) },
    job.contractMonths ? { label: t.contract, value: fill(t.months, { count: job.contractMonths }) } : null,
    job.visaType ? { label: t.workVisa, value: job.visaType } : null,
    ages ? { label: t.age, value: ages } : null,
    job.gender ? { label: t.gender, value: fill(t.genderOnly, { gender: job.gender }) } : null,
    job.experienceYears ? { label: t.experienceLabel, value: fill(t.yearsPlus, { count: job.experienceYears }) } : null,
    job.deadline ? { label: t.closingDate, value: formatDeadline(job.deadline, locale) } : null,
  ].filter((fact) => fact != null);

  return (
    <>
      {job.acceptingApplications ? (
        <script
          type="application/ld+json"
          // JSON, with "<" escaped so text can never close the script tag
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingData(job)).replace(/</g, "\\u003c") }}
        />
      ) : null}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "radial-gradient(50rem 26rem at 90% -10%, rgb(30 136 229 / 0.35), transparent 60%)" }}
        />
        <div className="container-page py-12 sm:py-16">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/jobs" className="text-sm text-white/60 hover:text-gold-400">{t.allWorkVisaJobs}</Link>
            <LanguageSwitcher lang={lang} label={t.language} dark />
          </div>
          <p className="eyebrow mt-4">
            {job.region} · {job.category} · {job.reference}
          </p>
          <h1 className="text-3d mt-3 max-w-3xl text-4xl sm:text-5xl">{job.title}</h1>
          <p className="mt-3 text-lg text-white/75">
            {jobPlace(job)}
            {job.employer ? ` · ${job.employer}` : ""}
          </p>
          <p className="mt-5 text-3xl font-bold text-gold-400">{salaryLabel(job, t.salaryOnRequest)}</p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_26rem]">
        <div className="space-y-8">
          <dl className="card grid gap-x-6 gap-y-4 p-6 text-sm sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{fact.label}</dt>
                <dd className="mt-1 font-medium text-navy-950">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {/* Announced interview */}
          <section className="card border-l-4 border-l-gold-500 p-6">
            <p className="eyebrow">{t.interview}</p>
            {job.interviewMode ? (
              <>
                <h2 className="mt-1 text-xl font-semibold text-navy-950">{interviewModeLabel(t, job.interviewMode)}</h2>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold text-slate-500 uppercase">{t.dateTime}</dt>
                    <dd className="mt-1 font-medium text-navy-950">
                      {job.interviewAt ? `${formatInterviewTime(job.interviewAt, locale)} ${t.sriLankaTime}` : t.tellShortlisted}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500 uppercase">{t.place}</dt>
                    <dd className="mt-1 font-medium text-navy-950">{job.interviewPlace ?? t.weTellYou}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-sm text-slate-600">{interviewModeText(t, job.interviewMode)}</p>
                {job.interviewNotes ? <p className="mt-2 text-sm whitespace-pre-line text-slate-700">{job.interviewNotes}</p> : null}
              </>
            ) : (
              <p className="mt-1 text-slate-700">{t.interviewTba}</p>
            )}
            <p className="mt-4 text-xs text-slate-500">
              {t.afterInterview}
            </p>
          </section>

          <Block title={t.aboutJob}>
            <p className="whitespace-pre-line text-slate-700">{job.description}</p>
          </Block>
          {job.requirements.length > 0 ? <Block title={t.requirements}><Bullets items={job.requirements} /></Block> : null}
          {job.benefits.length > 0 ? <Block title={t.benefits}><Bullets items={job.benefits} tick /></Block> : null}
          {job.documentsNeeded.length > 0 ? (
            <Block title={t.documentsToBring}>
              <Bullets items={job.documentsNeeded} />
            </Block>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-500">{t.shareJob}</span>
            <ShareButtons title={`${job.title} - ${job.country} | Gazellekey International`} url={`${SITE_URL}/jobs/${job.slug}`} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6" id="apply">
            {!job.acceptingApplications ? (
              <>
                <h2 className="text-xl font-semibold text-navy-950">{t.closed}</h2>
                <p className="mt-2 text-sm text-slate-600">{t.closedText}</p>
                <Link href="/jobs" className="btn-navy mt-5 w-full">{t.seeOpenJobs}</Link>
              </>
            ) : existing ? (
              <>
                <h2 className="text-xl font-semibold text-navy-950">{t.youApplied}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {fill(t.youAppliedText, { reference: existing.reference })}
                </p>
                <Link href="/account/jobs" className="btn-gold mt-5 w-full">{t.myApplications}</Link>
              </>
            ) : user && isStaff(user) ? (
              <p className="text-sm text-slate-600">{t.staffApply}</p>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-navy-950">{t.applyForJob}</h2>
                <p className="mt-1 mb-5 text-sm text-slate-600">
                  {candidate ? t.applyIntroSignedIn : t.applyIntroGuest}
                </p>
                <JobApplyForm
                  t={t}
                  vacancyId={job.id}
                  returnTo={`/jobs/${job.slug}#apply`}
                  prefill={candidate ? { firstName: candidate.firstName, lastName: candidate.lastName, email: candidate.email } : null}
                />
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-navy-950">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Bullets({ items, tick = false }: { items: string[]; tick?: boolean }) {
  return (
    <ul className="grid gap-2 text-slate-700 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className={tick ? "text-emerald-600" : "text-gold-500"} aria-hidden="true">{tick ? "✓" : "•"}</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
