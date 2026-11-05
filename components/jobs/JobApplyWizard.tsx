"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CHOOSE_JOB_EVENT } from "@/components/jobs/ApplyJobButton";
import JobApplyForm from "@/components/jobs/JobApplyForm";
import JourneyTimeline from "@/components/jobs/JourneyTimeline";
import { Dict, fill, interviewModeLabel } from "@/lib/i18n";
import { formatInterviewTime, jobPlace, JobVacancy, salaryLabel } from "@/lib/jobs";

type WizardJob = Pick<
  JobVacancy,
  "id" | "slug" | "title" | "category" | "country" | "region" | "city" | "salaryMin" | "salaryMax" | "salaryCurrency" | "salaryPeriod" | "interviewMode" | "interviewAt" | "featured"
>;

// Work visa page: apply one step at a time
//   1. choose a country and a job   2. details + documents   3. sent - what happens next
// Choosing a job (here, or in the search at the top: ?apply=<slug>) opens the form at once.
export default function JobApplyWizard({
  t,
  locale,
  jobs,
  prefill,
  initialSlug,
}: {
  t: Dict;
  locale: string; // dates in the visitor's language
  jobs: WizardJob[];
  prefill: { firstName: string; lastName: string; email: string } | null;
  initialSlug?: string; // the page remounts the wizard when this changes
}) {
  const countries = [...new Set(jobs.map((job) => job.country))].sort((a, b) => a.localeCompare(b));
  const preset = jobs.find((each) => each.slug == initialSlug) ?? null;
  const [step, setStep] = useState(preset ? 1 : 0);
  const [country, setCountry] = useState(preset?.country ?? "");
  const [job, setJob] = useState<WizardJob | null>(preset);
  const [reference, setReference] = useState("");
  const shown = jobs.filter((each) => country == "" || each.country == country);
  const STEPS = [t.stepChoose, t.stepDetails, t.stepSent];

  // opened with ?apply=<slug> (a shared link or a refresh): bring the form into view
  const presetId = preset?.id;
  useEffect(() => {
    if (presetId) {
      document.getElementById("apply-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [presetId]);

  // a job chosen in the search at the top or an "Apply" button on this page:
  // open the form with that job straight away (no page reload)
  useEffect(() => {
    function open(slug: string | null) {
      const chosen = jobs.find((each) => each.slug == slug);
      if (chosen == null) return;
      setJob(chosen);
      setCountry(chosen.country);
      setReference("");
      setStep(1);
      document.getElementById("apply-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const onChoose = (event: Event) => open((event as CustomEvent<string>).detail);
    window.addEventListener(CHOOSE_JOB_EVENT, onChoose);
    // a job chosen before this form was ready (the page was still loading)
    const waiting = new URLSearchParams(window.location.search).get("apply");
    if (waiting && waiting != initialSlug) {
      open(waiting);
    }
    return () => window.removeEventListener(CHOOSE_JOB_EVENT, onChoose);
  }, [jobs, initialSlug]);

  function go(next: number) {
    setStep(next);
    document.getElementById("apply-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div id="apply-wizard" className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-[0_40px_90px_-40px_rgba(6,11,26,0.45)] backdrop-blur-xl">
      {/* stepper */}
      <div className="border-b border-slate-100 bg-linear-to-r from-navy-950 to-navy-900 px-6 py-5 text-white sm:px-8">
        <ol className="flex items-center gap-2 sm:gap-4">
          {STEPS.map((label, index) => (
            <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                  index < step ? "bg-emerald-400 text-navy-950" : index == step ? "bg-gold-500 text-navy-950 ring-4 ring-gold-500/25" : "bg-white/10 text-white/60"
                }`}
              >
                {index < step ? "✓" : index + 1}
              </span>
              <span className={`hidden text-sm font-semibold sm:block ${index == step ? "text-white" : "text-white/55"}`}>{label}</span>
              {index < STEPS.length - 1 ? <span className={`h-0.5 flex-1 rounded-full ${index < step ? "bg-emerald-400" : "bg-white/15"}`} /> : null}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-white/60 sm:hidden">{fill(t.stepOf, { step: step + 1 })} · {STEPS[step]}</p>
      </div>

      <div key={step} className="rise p-6 sm:p-8">
        {step == 0 ? (
          <>
            <h2 className="heading-display text-2xl">{t.whichCountry}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["", ...countries].map((name) => (
                <button
                  key={name || "all"}
                  type="button"
                  onClick={() => setCountry(name)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    country == name ? "border-navy-950 bg-navy-950 text-white" : "border-slate-200 bg-white text-navy-900 hover:border-gold-400"
                  }`}
                >
                  {name || t.allCountries}
                  <span className="ml-1.5 opacity-60">{name ? jobs.filter((each) => each.country == name).length : jobs.length}</span>
                </button>
              ))}
            </div>

            <h3 className="mt-8 text-sm font-semibold tracking-wide text-slate-500 uppercase">{t.chooseAJob}</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {shown.map((each) => {
                const picked = job?.id == each.id;
                return (
                  <li key={each.id}>
                    <button
                      type="button"
                      onClick={() => {
                        // picking a job opens the form straight away
                        setJob(each);
                        go(1);
                      }}
                      aria-pressed={picked}
                      className={`group relative flex h-full w-full flex-col rounded-2xl border p-4 text-left transition ${
                        picked ? "border-gold-500 bg-gold-100/50 shadow-[0_0_0_3px_rgb(212_166_74/0.25)]" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-lg"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{jobPlace(each)}</span>
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs ${picked ? "border-gold-500 bg-gold-500 text-navy-950" : "border-slate-300 text-transparent"}`}>✓</span>
                      </span>
                      <span className="mt-1 text-base font-semibold text-navy-950">{each.title}</span>
                      <span className="mt-1 text-sm font-bold text-navy-800">{salaryLabel(each, t.salaryOnRequest)}</span>
                      <span className="mt-2 text-xs text-slate-500">
                        {each.interviewMode ? interviewModeLabel(t, each.interviewMode) : t.interviewIfNeeded}
                        {each.interviewAt ? ` · ${formatInterviewTime(each.interviewAt, locale)}` : ""}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">{job ? fill(t.selected, { job: `${job.title}, ${job.country}` }) : t.tapJob}</p>
              <button type="button" disabled={!job} onClick={() => go(1)} className="btn-gold disabled:cursor-not-allowed disabled:opacity-50">
                {t.continueJob}
              </button>
            </div>
          </>
        ) : step == 1 && job ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-navy-50 px-5 py-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{t.applyingFor}</p>
                <p className="text-lg font-semibold text-navy-950">{job.title}</p>
                <p className="text-sm text-slate-600">{jobPlace(job)} · {salaryLabel(job, t.salaryOnRequest)}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/jobs/${job.slug}`} className="btn-outline btn-sm">{t.jobDetails}</Link>
                <button type="button" onClick={() => go(0)} className="btn-outline btn-sm">{t.changeJob}</button>
              </div>
            </div>
            <h2 className="heading-display mb-4 text-2xl">{t.yourDetails}</h2>
            <JobApplyForm
              t={t}
              key={job.id}
              vacancyId={job.id}
              returnTo="/account/jobs"
              prefill={prefill}
              onDone={(sent) => {
                setReference(sent);
                go(2);
              }}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-700 shadow-[0_0_0_10px_rgb(16_185_129/0.08)]">✓</span>
              <h2 className="heading-display mt-4 text-2xl sm:text-3xl">{t.sentTitle}</h2>
              <p className="mt-2 max-w-lg text-slate-600">
                {job ? `${job.title}, ${job.country}. ` : ""}
                {fill(t.sentText, { reference: reference })}
              </p>
            </div>
            <h3 className="mt-8 text-center text-sm font-semibold tracking-wide text-slate-500 uppercase">{t.whatNext}</h3>
            <div className="mt-4">
              <JourneyTimeline t={t} current={0} compact />
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {prefill ? (
                <Link href="/account/jobs" className="btn-gold">{t.openMyVisa}</Link>
              ) : (
                <>
                  <Link href="/register?next=%2Faccount%2Fjobs" className="btn-gold">{t.createToFollow}</Link>
                  <Link href="/login?next=%2Faccount%2Fjobs" className="btn-outline">{t.signIn}</Link>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setJob(null);
                  setReference("");
                  go(0);
                }}
                className="btn-outline"
              >
                {t.applyAnother}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
