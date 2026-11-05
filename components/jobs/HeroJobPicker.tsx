"use client";

import { useState } from "react";
import { Dict, fill } from "@/lib/i18n";
import { chooseJob } from "@/components/jobs/ApplyJobButton";

type PickerJob = { slug: string; title: string; country: string };

// Work visa hero: choose a country -> the job list shows only that country's
// jobs -> choosing a job opens the application form (wizard step 2) at once,
// without reloading the page.
export default function HeroJobPicker({ t, jobs, initialCountry }: { t: Dict; jobs: PickerJob[]; initialCountry?: string }) {
  const countries = [...new Set(jobs.map((job) => job.country))].sort((a, b) => a.localeCompare(b));
  const [country, setCountry] = useState(initialCountry && countries.includes(initialCountry) ? initialCountry : "");
  const [picked, setPicked] = useState("");
  const shown = jobs.filter((job) => country == "" || job.country == country).sort((a, b) => a.title.localeCompare(b.title));

  function openForm(slug: string) {
    setPicked(slug);
    if (slug) {
      chooseJob(slug);
    }
  }

  return (
    <div className="mt-8 max-w-2xl rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label htmlFor="pick-country" className="mb-1 block px-1 text-xs font-semibold text-white/70">{t.pickCountry}</label>
          <select
            id="pick-country"
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              setPicked("");
            }}
            className="input bg-white text-navy-950"
          >
            <option value="">{fill(t.allCountriesCount, { count: jobs.length })}</option>
            {countries.map((name) => (
              <option key={name} value={name}>
                {name} ({jobs.filter((job) => job.country == name).length})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pick-job" className="mb-1 block px-1 text-xs font-semibold text-white/70">{t.pickJob}</label>
          <select id="pick-job" value={picked} onChange={(event) => openForm(event.target.value)} className="input bg-white text-navy-950">
            <option value="">{country ? fill(t.chooseJobIn, { country: country }) : t.chooseJob}</option>
            {shown.map((job) => (
              <option key={job.slug} value={job.slug}>
                {job.title}{country ? "" : ` - ${job.country}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      {country ? (
        <div className="mt-3 flex flex-wrap gap-2 px-1">
          {shown.map((job) => (
            <button
              key={job.slug}
              type="button"
              onClick={() => openForm(job.slug)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                picked == job.slug
                  ? "border-gold-500 bg-gold-500 text-navy-950"
                  : "border-gold-400/60 bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-navy-950"
              }`}
            >
              {job.title} - {t.applyArrow}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
