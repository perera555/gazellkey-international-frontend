import type { Metadata } from "next";
import Link from "next/link";
import ApplyJobButton from "@/components/jobs/ApplyJobButton";
import HeroJobPicker from "@/components/jobs/HeroJobPicker";
import JobApplyWizard from "@/components/jobs/JobApplyWizard";
import JourneyTimeline from "@/components/jobs/JourneyTimeline";
import LanguageSwitcher from "@/components/jobs/LanguageSwitcher";
import EnquirySection from "@/components/site/EnquirySection";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import { apiGetBody, toQuery } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { param } from "@/lib/format";
import { Dict, fill, interviewModeLabel } from "@/lib/i18n";
import { DATE_LOCALES, getDictionary } from "@/lib/i18n-server";
import {
  formatDeadline,
  formatInterviewTime,
  JobFilters,
  jobPlace,
  JobVacancy,
  JOURNEY,
  salaryLabel,
} from "@/lib/jobs";
import { getSessionUser, isStaff } from "@/lib/session";
import { COMPANY, WHATSAPP_NUMBER } from "@/lib/social";
import { Pagination as PageInfo } from "@/lib/types";

export const metadata: Metadata = {
  title: "Work visa - overseas jobs from Sri Lanka",
  description:
    "Work visa jobs in the Middle East and around the world - UAE, Qatar, Saudi Arabia, Kuwait, Oman, Japan, Europe and more. See salaries and interview dates and apply online with Gazellekey International.",
  keywords: ["work visa", "overseas jobs", "jobs abroad", "foreign jobs Sri Lanka", "Middle East jobs", "Dubai jobs", "Qatar jobs", "Gazellekey International"],
  alternates: { canonical: "/jobs" },
};

type Body = { data: JobVacancy[]; filters: JobFilters; pagination: PageInfo };

// "Age 21 - 35" in the visitor's language
function ageText(t: Dict, job: Pick<JobVacancy, "ageMin" | "ageMax">) {
  if (job.ageMin != null && job.ageMax != null) return `${t.age} ${job.ageMin} - ${job.ageMax}`;
  if (job.ageMin != null) return `${t.age} ${job.ageMin}+`;
  if (job.ageMax != null) return `${t.age} ${job.ageMax}-`;
  return "";
}

// Builds a /jobs link that keeps the other filters
function jobsHref(current: Record<string, string | undefined>, change: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...current, ...change, pageNumber: undefined })) {
    if (value) query.set(key, value);
  }
  const text = query.toString();
  return text ? `/jobs?${text}#browse` : "/jobs#browse";
}

export default async function JobsPage({ searchParams }: PageProps<"/jobs">) {
  const params = await searchParams;
  const current = {
    region: param(params.region),
    country: param(params.country),
    category: param(params.category),
    search: param(params.search),
  };
  const apply = param(params.apply); // job chosen in the search at the top
  const { lang, t } = await getDictionary();
  const locale = DATE_LOCALES[lang];
  const interviewKinds = [
    { title: t.walkIn, text: t.walkInText },
    { title: t.byInvitation, text: t.byInvitationText },
    { title: t.employerEmbassy, text: t.employerEmbassyText },
  ];
  const [result, all, user] = await Promise.all([
    apiGetBody<Body>(
      `/api/jobs/vacancies${toQuery(params, ["region", "country", "category", "search", "pageNumber"], { pageSize: "12", view: "public" })}`,
    ),
    // every open job: the wizard, the country overview and the hero numbers
    apiGetBody<Body>("/api/jobs/vacancies?pageSize=100&view=public"),
    getSessionUser(),
  ]);
  const staff = user != null && isStaff(user);
  const candidate = user && !staff ? { firstName: user.firstName, lastName: user.lastName, email: user.email } : null;
  const allJobs = all.ok ? all.body.data : [];
  const byCountry = new Map<string, JobVacancy[]>();
  for (const job of allJobs) {
    byCountry.set(job.country, [...(byCountry.get(job.country) ?? []), job]);
  }
  const countryNames = [...byCountry.keys()].sort((a, b) => a.localeCompare(b));
  const positions = allJobs.reduce((sum, job) => sum + job.positions, 0);

  const filters = result.ok ? result.body.filters : { countries: [], categories: [] };
  const regions = [...new Set(filters.countries.map((row) => row.region))];
  const regionCount = (region: string) => filters.countries.filter((row) => row.region == region).reduce((sum, row) => sum + row.count, 0);
  const allCount = filters.countries.reduce((sum, row) => sum + row.count, 0);
  const countries = filters.countries.filter((row) => !current.region || row.region == current.region);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden bg-navy-950 pb-40 text-white">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60rem 30rem at 85% -10%, rgb(30 136 229 / 0.40), transparent 60%), radial-gradient(44rem 26rem at -5% 110%, rgb(212 166 74 / 0.28), transparent 60%), radial-gradient(30rem 20rem at 50% 50%, rgb(99 102 241 / 0.12), transparent 70%)",
          }}
        />
        <div className="grid-floor -z-10 opacity-40" aria-hidden="true" />
        <div className="container-page grid gap-10 pt-14 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <div className="mb-6">
              <LanguageSwitcher lang={lang} label={t.language} dark />
            </div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="text-3d mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              {t.heroTitle} <span className="text-gold-gradient">{t.heroTitleGold}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/70">
              {t.heroText}
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
              {[
                { value: allJobs.length, label: t.openJobs },
                { value: countryNames.length, label: t.countriesLabel },
                { value: positions, label: t.positionsLabel },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-bold text-gold-400">{stat.value}</dd>
                  <dd className="text-xs text-white/60">{stat.label}</dd>
                </div>
              ))}
            </dl>
            {/* choose a country -> its jobs -> the form opens */}
            {allJobs.length > 0 ? <HeroJobPicker t={t} jobs={allJobs} initialCountry={current.country} /> : null}
            {countryNames.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {countryNames.slice(0, 8).map((name) => (
                  <Link key={name} href={jobsHref({}, { country: name })} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 transition hover:border-gold-400 hover:text-gold-400">
                    {name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {/* journey preview: the steps, one by one */}
          <div className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:block">
            <p className="text-sm font-semibold text-gold-400">{t.journeyIn6}</p>
            <ol className="mt-4 space-y-3">
              {JOURNEY.map((step, index) => (
                <li key={step.key} className="rise flex items-center gap-3" style={{ animationDelay: `${150 + index * 120}ms` }}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">{index + 1}</span>
                  <span className="text-sm text-white/85">
                    {[t.jApply, t.jInterview, t.jSelected, t.jMedical, t.jVisa, t.jFly][index]}
                    {"optional" in step && step.optional ? <span className="ml-2 text-xs text-white/50">({t.ifNeeded})</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Apply, one step at a time ── */}
      <section className="relative z-10 -mt-32">
        <div className="container-page max-w-5xl">
          {all.ok ? (
            allJobs.length > 0 && !staff ? (
              <JobApplyWizard key={apply ?? ""} t={t} locale={locale} jobs={allJobs} prefill={candidate} initialSlug={apply} />
            ) : staff ? (
              <p className="card p-6 text-sm text-slate-600">{t.staffNote}</p>
            ) : (
              <p className="card p-6 text-slate-600">{t.comingSoon}</p>
            )
          ) : (
            <ErrorNote message={all.message} />
          )}
        </div>
      </section>

      {/* ── Journey ── */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">{t.howItWorks}</p>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl">{t.journeyTitle}</h2>
            <p className="mt-3 text-slate-600">
              {t.journeyText}
            </p>
          </div>
          <div className="mt-8">
            <JourneyTimeline t={t} />
          </div>
        </div>
      </section>

      {/* ── Jobs by country ── */}
      {byCountry.size > 0 ? (
        <section className="bg-linear-to-b from-navy-50/70 to-ivory-100 py-16">
          <div className="container-page">
            <p className="eyebrow">{t.countriesEyebrow}</p>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl">{t.jobsByCountry}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {countryNames.map((country, index) => {
                const jobs = byCountry.get(country)!;
                return (
                  <div key={country} className="rise card flex flex-col overflow-hidden" style={{ animationDelay: `${index * 60}ms` }}>
                    <div className="flex items-center justify-between gap-3 bg-linear-to-r from-navy-950 to-navy-800 px-5 py-4 text-white">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500 text-sm font-bold text-navy-950">
                          {country.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <h3 className="font-semibold">{country}</h3>
                          <p className="text-xs text-white/60">{jobs[0].region}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">{jobs.length == 1 ? t.oneJob : fill(t.jobsCount, { count: jobs.length })}</span>
                    </div>
                    <ul className="divide-y divide-slate-100 px-5">
                      {jobs.map((job) => (
                        <li key={job.id} className="flex items-center justify-between gap-3 py-3">
                          <div className="min-w-0">
                            <Link href={`/jobs/${job.slug}`} className="block truncate font-medium text-navy-900 hover:underline">{job.title}</Link>
                            <p className="truncate text-xs text-slate-500">{salaryLabel(job, t.salaryOnRequest)}</p>
                          </div>
                          <ApplyJobButton slug={job.slug} className="btn-gold btn-sm shrink-0">{t.apply}</ApplyJobButton>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Browse and filter ── */}
      <section id="browse" className="scroll-mt-28 py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{t.allJobsEyebrow}</p>
              <h2 className="heading-display mt-2 text-3xl sm:text-4xl">{t.browseTitle}</h2>
            </div>
            <nav aria-label="Regions" className="flex flex-wrap gap-2">
              <Link href={jobsHref(current, { region: undefined, country: undefined })} className={`btn-sm ${current.region ? "btn-outline" : "btn-navy"}`}>
                {t.all} ({allCount})
              </Link>
              {regions.map((region) => (
                <Link key={region} href={jobsHref(current, { region: region, country: undefined })} className={`btn-sm ${current.region == region ? "btn-navy" : "btn-outline"}`}>
                  {region} ({regionCount(region)})
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_1fr]">
            <aside className="space-y-6">
              <FilterList
                title={t.country}
                rows={countries.map((row) => ({ name: row.country, count: row.count }))}
                active={current.country}
                href={(name) => jobsHref(current, { country: current.country == name ? undefined : name })}
              />
              <FilterList
                title={t.jobType}
                rows={filters.categories.map((row) => ({ name: row.category, count: row.count }))}
                active={current.category}
                href={(name) => jobsHref(current, { category: current.category == name ? undefined : name })}
              />
            </aside>
            <div>
              {!result.ok ? (
                <ErrorNote message={result.message} />
              ) : result.body.data.length == 0 ? (
                <div className="card px-6 py-12 text-center">
                  <p className="text-slate-600">{t.noMatch}</p>
                  <Link href="/jobs#browse" className="btn-navy mt-5">{t.seeAllJobs}</Link>
                </div>
              ) : (
                <>
                  <ul className="grid gap-5 md:grid-cols-2">
                    {result.body.data.map((job) => (
                      <li key={job.id}>
                        <JobCard job={job} t={t} locale={locale} />
                      </li>
                    ))}
                  </ul>
                  <Pagination pagination={result.body.pagination} basePath="/jobs" searchParams={params} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Interviews ── */}
      <section className="bg-navy-950 py-16 text-white">
        <div className="container-page">
          <p className="eyebrow">{t.interviewsEyebrow}</p>
          <h2 className="text-3d mt-2 text-3xl sm:text-4xl">{t.interviewsTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {interviewKinds.map((kind) => (
              <div key={kind.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="font-semibold text-gold-400">{kind.title}</p>
                <p className="mt-2 text-sm text-white/70">{kind.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-14">
        <div className="container-page grid gap-4 sm:grid-cols-3">
          <ContactCard title={t.visitCall} text={COMPANY.phone ? `${COMPANY.phone}` : t.visitCallText}>
            <Link href="/contact" className="btn-outline btn-sm">{t.contactUs}</Link>
          </ContactCard>
          <ContactCard title={t.talkRecruiter} text={t.talkRecruiterText}>
            <Link href="/appointments?division=TRAVEL" className="btn-outline btn-sm">{t.bookAppointment}</Link>
          </ContactCard>
          <ContactCard title={t.cantFind} text={t.cantFindText}>
            {WHATSAPP_NUMBER ? (
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm">{t.whatsapp}</a>
            ) : (
              <a href="#enquire" className="btn-outline btn-sm">{t.sendEnquiry}</a>
            )}
          </ContactCard>
        </div>
      </section>

      <EnquirySection
        division={DIVISIONS.TRAVEL}
        heading="Work visa enquiry"
        text="Ask about a country, a job, the visa process or the documents you need. Our recruitment team replies, usually within one working day."
        returnTo="/jobs#enquire"
        defaultService="VISA"
        defaultSubject="Work visa enquiry"
      />
    </>
  );
}

function FilterList({
  title,
  rows,
  active,
  href,
}: {
  title: string;
  rows: { name: string; count: number }[];
  active?: string;
  href: (name: string) => string;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {rows.map((row) => (
          <li key={row.name}>
            <Link
              href={href(row.name)}
              className={`flex justify-between rounded-lg px-3 py-1.5 ${active == row.name ? "bg-navy-950 text-white" : "text-navy-900 hover:bg-navy-50"}`}
            >
              <span>{row.name}</span>
              <span className="opacity-60">{row.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactCard({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <p className="font-semibold text-navy-950">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function JobCard({ job, t, locale }: { job: JobVacancy; t: Dict; locale: string }) {
  const facts = [
    ageText(t, job),
    job.contractMonths ? fill(t.contractMonths, { count: job.contractMonths }) : "",
    fill(t.positionsCount, { count: job.positions }),
  ].filter(Boolean);
  return (
    <Link href={`/jobs/${job.slug}`} className="card group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {jobPlace(job)} · {job.category}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-navy-950 group-hover:underline">{job.title}</h3>
          {job.employer ? <p className="text-sm text-slate-600">{job.employer}</p> : null}
        </div>
        {job.featured ? <span className="badge bg-gold-100 text-navy-900">{t.featured}</span> : null}
      </div>
      <p className="mt-3 text-xl font-bold text-navy-950">{salaryLabel(job, t.salaryOnRequest)}</p>
      <p className="mt-1 text-xs text-slate-500">{facts.join(" · ")}</p>
      {job.benefits.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
          {job.benefits.slice(0, 3).map((benefit) => (
            <li key={benefit} className="rounded-full bg-navy-50 px-2.5 py-1 text-navy-800">{benefit}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm">
          {job.interviewMode ? (
            <span className="font-medium text-navy-800">
              {interviewModeLabel(t, job.interviewMode)}
              {job.interviewAt ? `: ${formatInterviewTime(job.interviewAt, locale)}` : ""}
            </span>
          ) : (
            <span className="text-slate-500">{t.interviewOnlyIfNeeded}</span>
          )}
          {job.deadline ? <span className="text-xs text-slate-500">{fill(t.applyBy, { date: formatDeadline(job.deadline, locale) })}</span> : null}
        </div>
      </div>
    </Link>
  );
}
