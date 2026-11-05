import type { Metadata } from "next";
import Link from "next/link";
import { AccountHeading } from "@/components/account/AccountTable";
import JobDocumentUpload from "@/components/jobs/JobDocumentUpload";
import JourneyTimeline from "@/components/jobs/JourneyTimeline";
import LanguageSwitcher from "@/components/jobs/LanguageSwitcher";
import WithdrawApplication from "@/components/jobs/WithdrawApplication";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine, toQuery } from "@/lib/api";
import { param } from "@/lib/format";
import { Dict, fill } from "@/lib/i18n";
import { DATE_LOCALES, getDictionary } from "@/lib/i18n-server";
import { formatDeadline, formatInterviewTime, journeyStates, MyJobApplication, MyJobInterview } from "@/lib/jobs";

export const metadata: Metadata = { title: "My work visa" };

export default async function MyWorkVisaPage({ searchParams }: PageProps<"/account/jobs">) {
  const params = await searchParams;
  const applied = param(params.applied);
  const [{ lang, t }, result] = await Promise.all([
    getDictionary(),
    apiGetMine<MyJobApplication[]>(`/api/me/jobs${toQuery(params, ["pageNumber"], { pageSize: "20" })}`, "/account/jobs"),
  ]);
  const locale = DATE_LOCALES[lang];

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AccountHeading title={t.myVisaTitle} text={t.myVisaText} />
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSwitcher lang={lang} label={t.language} />
          <Link href="/jobs" className="btn-gold">{t.findJobs}</Link>
        </div>
      </div>

      {applied ? (
        <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {fill(t.receivedNotice, { reference: applied })}
        </p>
      ) : null}

      {!result.ok ? (
        <ErrorNote message={result.message} />
      ) : result.data.length == 0 ? (
        <div className="card px-6 py-12 text-center">
          <p className="text-lg font-semibold text-navy-950">{t.noApplications}</p>
          <p className="mt-1 text-slate-600">{t.noApplicationsText}</p>
          <Link href="/jobs" className="btn-gold mt-5">{t.seeJobs}</Link>
        </div>
      ) : (
        <>
          <ul className="space-y-6">
            {result.data.map((application) => (
              <ApplicationCard key={application.id} application={application} t={t} locale={locale} />
            ))}
          </ul>
          <Pagination pagination={result.pagination} basePath="/account/jobs" searchParams={params} />
        </>
      )}
    </>
  );
}

function ApplicationCard({ application, t, locale }: { application: MyJobApplication; t: Dict; locale: string }) {
  const states = journeyStates(application);
  const upcoming = application.interviews.filter((each) => each.result == "SCHEDULED");
  const past = application.interviews.filter((each) => each.result != "SCHEDULED");

  return (
    <li className="card overflow-hidden">
      {/* job header */}
      <div className="flex flex-wrap items-start justify-between gap-3 bg-linear-to-r from-navy-950 to-navy-800 px-5 py-5 text-white sm:px-6">
        <div>
          <p className="text-xs tracking-wide text-white/60 uppercase">
            {application.reference} · {fill(t.applied, { date: formatDeadline(application.createdAt, locale) })}
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            <Link href={`/jobs/${application.vacancy.slug}`} className="hover:underline">{application.vacancy.title}</Link>
          </h2>
          <p className="text-sm text-white/70">{[application.vacancy.city, application.vacancy.country].filter(Boolean).join(", ")}</p>
        </div>
        <StatusBadge value={application.status} label={t.status[application.status] ?? application.status} />
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <p className="text-sm text-slate-700">
          {t.statusText[application.status] ?? application.status}
          {application.rejectReason ? ` ${t.reason} ${application.rejectReason}` : ""}
        </p>

        {/* journey, step by step */}
        {states ? <JourneyTimeline t={t} states={states} compact /> : null}

        {/* next interview / medical */}
        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((each) => (
              <Appointment key={each.id} item={each} t={t} locale={locale} highlight />
            ))}
          </div>
        ) : null}

        {past.length > 0 ? (
          <details className="rounded-xl border border-slate-200 px-4 py-3">
            <summary className="cursor-pointer text-sm font-semibold text-navy-900">{fill(t.pastTests, { count: past.length })}</summary>
            <div className="mt-3 space-y-2">
              {past.map((each) => (
                <Appointment key={each.id} item={each} t={t} locale={locale} />
              ))}
            </div>
          </details>
        ) : null}

        {/* documents */}
        <div className="rounded-2xl bg-navy-50/60 p-4">
          <h3 className="text-sm font-semibold text-navy-950">{t.myDocuments}</h3>
          {application.documents.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {application.documents.map((document) => (
                <li key={document.id} className="rounded-full bg-white px-3 py-1 text-xs text-navy-800 ring-1 ring-slate-200">
                  {document.title.split(" - ")[0]} · <span className="text-slate-500">{t.docStatus[document.approval] ?? document.approval}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-xs text-slate-500">{t.noDocuments}</p>
          )}
          {application.canAddDocuments ? (
            <div className="mt-4">
              <JobDocumentUpload t={t} applicationId={application.id} reference={application.reference} />
            </div>
          ) : null}
        </div>

        {application.canWithdraw ? (
          <div className="flex justify-end">
            <WithdrawApplication t={t} applicationId={application.id} reference={application.reference} />
          </div>
        ) : null}
      </div>
    </li>
  );
}

function Appointment({ item, t, locale, highlight = false }: { item: MyJobInterview; t: Dict; locale: string; highlight?: boolean }) {
  const isMedical = item.stage == "MEDICAL";
  return (
    <div className={`rounded-2xl p-4 text-sm ${highlight ? "border border-gold-400 bg-gold-100/60" : "bg-slate-50"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-semibold text-navy-950">
          {highlight ? `${isMedical ? t.yourMedical : t.yourInterview} ` : ""}
          {t.stage[item.stage] ?? item.stage}
        </span>
        <StatusBadge value={item.result} label={t.result[item.result] ?? item.result} />
      </div>
      <p className={`mt-1 ${highlight ? "text-base font-semibold text-navy-900" : "text-slate-700"}`}>
        {formatInterviewTime(item.scheduledAt, locale)}{" "}
        <span className="text-xs font-normal text-slate-500">
          {t.sriLankaTime} · {t.mode[item.mode] ?? item.mode}
        </span>
      </p>
      {item.location ? (
        item.mode == "VIDEO" && /^https?:\/\//.test(item.location) ? (
          <a href={item.location} target="_blank" rel="noopener noreferrer" className="btn-navy btn-sm mt-2">{t.joinVideo}</a>
        ) : (
          <p className="text-slate-700">{item.location}</p>
        )
      ) : null}
      {item.interviewer ? (
        <p className="text-xs text-slate-500">
          {isMedical ? t.medicalCentre : t.with}: {item.interviewer}
        </p>
      ) : null}
      {item.instructions ? <p className="mt-1 whitespace-pre-line text-slate-600">{item.instructions}</p> : null}
    </div>
  );
}
