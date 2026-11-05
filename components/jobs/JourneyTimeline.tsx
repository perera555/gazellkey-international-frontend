import { Dict } from "@/lib/i18n";
import { JOURNEY, JourneyState } from "@/lib/jobs";

const ICONS: Record<string, string> = {
  apply: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4",
  interview: "M8 10h8M8 14h5M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.3A8 8 0 1 1 21 12z",
  selected: "M20 6 9 17l-5-5",
  medical: "M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10zM12 10v4M10 12h4",
  visa: "M4 5h16v14H4zM8 9h4M8 13h8M8 16h5",
  fly: "M2 16l20-6-2-3-7 2L7 3H5l3 7-4 1-2-2H1l1 4zM2 20h20",
};

// Each step's title and text in the visitor's language
function words(t: Dict, key: string): [string, string] {
  switch (key) {
    case "apply":
      return [t.jApply, t.jApplyText];
    case "interview":
      return [t.jInterview, t.jInterviewText];
    case "selected":
      return [t.jSelected, t.jSelectedText];
    case "medical":
      return [t.jMedical, t.jMedicalText];
    case "visa":
      return [t.jVisa, t.jVisaText];
    default:
      return [t.jFly, t.jFlyText];
  }
}

// The work visa journey, one step after another.
// `states` (from journeyStates) colours a candidate's own progress; without it
// the steps are shown as an explanation, with `current` highlighted.
export default function JourneyTimeline({
  t,
  states,
  current,
  compact = false,
}: {
  t: Dict;
  states?: JourneyState[];
  current?: number;
  compact?: boolean;
}) {
  return (
    <ol className={`grid gap-3 ${compact ? "sm:grid-cols-3 lg:grid-cols-6" : "md:grid-cols-2 lg:grid-cols-3"}`}>
      {JOURNEY.map((step, index) => {
        const [title, text] = words(t, step.key);
        const state: JourneyState = states?.[index] ?? (index == current ? "current" : "todo");
        const tone =
          state == "done"
            ? "border-emerald-200 bg-emerald-50/70"
            : state == "current"
              ? "border-gold-400 bg-gold-100/60 shadow-[0_0_0_3px_rgb(212_166_74/0.18)]"
              : state == "skipped"
                ? "border-dashed border-slate-200 bg-slate-50/60 opacity-70"
                : "border-slate-200 bg-white";
        return (
          <li
            key={step.key}
            className={`rise relative flex gap-3 rounded-2xl border p-4 ${tone}`}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                state == "done" ? "bg-emerald-500 text-white" : state == "current" ? "bg-gold-500 text-navy-950" : "bg-navy-950 text-gold-400"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={state == "done" ? ICONS.selected : ICONS[step.key]} />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400">{index + 1}</span>
                <span className="text-sm font-semibold text-navy-950">{title}</span>
                {"optional" in step && step.optional ? (
                  <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-semibold text-navy-700 uppercase">{t.ifNeededBadge}</span>
                ) : null}
                {state == "skipped" ? <span className="text-[11px] text-slate-500">{t.notNeeded}</span> : null}
                {state == "current" && states ? <span className="text-[11px] font-semibold text-gold-600">{t.now}</span> : null}
              </span>
              {!compact || !states ? <span className="mt-0.5 block text-xs leading-5 text-slate-600">{text}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
