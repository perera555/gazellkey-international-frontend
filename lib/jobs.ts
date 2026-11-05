// Overseas jobs (work visas) - types and labels shared by the Work visa
// pages and My account > Job applications. Values match the backend lib/jobs.ts.

export interface JobVacancy {
  id: string;
  slug: string;
  reference: string;
  title: string;
  category: string;
  country: string;
  region: string;
  city: string | null;
  employer: string | null;
  positions: number;
  salaryMin: string | null;
  salaryMax: string | null;
  salaryCurrency: string;
  salaryPeriod: string;
  contractMonths: number | null;
  visaType: string | null;
  description: string;
  requirements: string[];
  benefits: string[];
  documentsNeeded: string[];
  ageMin: number | null;
  ageMax: number | null;
  gender: string | null;
  experienceYears: number | null;
  interviewMode: "WALK_IN" | "BY_INVITATION" | "ONLINE" | null;
  interviewAt: string | null;
  interviewPlace: string | null;
  interviewNotes: string | null;
  deadline: string | null;
  featured: boolean;
  images: string[];
  acceptingApplications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  countries: { region: string; country: string; count: number }[];
  categories: { category: string; count: number }[];
}

export interface MyJobInterview {
  id: string;
  stage: string;
  mode: "IN_PERSON" | "PHONE" | "VIDEO";
  scheduledAt: string;
  location: string | null;
  interviewer: string | null;
  instructions: string | null;
  result: string;
}

export interface MyJobApplication {
  id: string;
  reference: string;
  status: string;
  rejectReason: string | null;
  createdAt: string;
  canWithdraw: boolean;
  vacancy: {
    id: string;
    slug: string;
    reference: string;
    title: string;
    country: string;
    city: string | null;
  };
  interviews: MyJobInterview[];
  documents: { id: string; type: string; title: string; fileName: string; approval: string; createdAt: string }[];
  canAddDocuments: boolean;
}

export const INTERVIEW_MODE_LABELS: Record<string, string> = {
  WALK_IN: "Walk-in interview",
  BY_INVITATION: "Interview by invitation",
  ONLINE: "Online video interview",
};

export const INTERVIEW_MODE_TEXT: Record<string, string> = {
  WALK_IN: "Anyone who meets the requirements may come on the day with the documents below. No appointment needed.",
  BY_INVITATION: "Apply online first. Shortlisted candidates are called and emailed with their own time.",
  ONLINE: "Apply online first. Shortlisted candidates get a video link by email.",
};

export const STAGE_LABELS: Record<string, string> = {
  OFFICE: "Gazellekey interview",
  EMPLOYER: "Employer interview",
  TRADE_TEST: "Trade test",
  EMBASSY: "Embassy interview",
  MEDICAL: "Medical test",
};

export const RESULT_LABELS: Record<string, string> = {
  SCHEDULED: "Scheduled",
  PASSED: "Passed",
  FAILED: "Not passed",
  NO_SHOW: "Did not attend",
  CANCELLED: "Cancelled",
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  APPLIED: "Received",
  SHORTLISTED: "Shortlisted",
  INTERVIEWING: "Interviews",
  SELECTED: "Selected",
  MEDICAL: "Medical test",
  VISA_PROCESSING: "Visa processing",
  DEPLOYED: "Departed",
  REJECTED: "Not selected",
  WITHDRAWN: "Withdrawn",
};

// The candidate's journey. Interview and medical are optional - our team
// decides for each candidate whether they are needed.
export const JOURNEY = [
  { key: "apply", title: "Apply", text: "Choose a job and send your details and documents. No account needed." },
  { key: "interview", title: "Interview", text: "If needed, we send you the date, time and place - it shows in your account.", optional: true },
  { key: "selected", title: "Selected", text: "The employer accepts you and you receive the job offer." },
  { key: "medical", title: "Medical", text: "If the country or employer needs it, we book your medical test.", optional: true },
  { key: "visa", title: "Work visa", text: "We submit your visa and register you with the SLBFE." },
  { key: "fly", title: "Fly", text: "Collect your ticket and start your new job." },
] as const;

// How far an application has come on JOURNEY (index), from its status
const JOURNEY_INDEX: Record<string, number> = {
  APPLIED: 0,
  SHORTLISTED: 0,
  INTERVIEWING: 1,
  SELECTED: 2,
  MEDICAL: 3,
  VISA_PROCESSING: 4,
  DEPLOYED: 5,
};

export type JourneyState = "done" | "current" | "skipped" | "todo";

// One state per JOURNEY step for an application (closed ones return null)
export function journeyStates(application: Pick<MyJobApplication, "status" | "interviews">): JourneyState[] | null {
  const at = JOURNEY_INDEX[application.status];
  if (at == undefined) return null;
  const hadInterview = application.interviews.some((each) => each.stage != "MEDICAL");
  const hadMedical = application.interviews.some((each) => each.stage == "MEDICAL");
  return JOURNEY.map((step, index) => {
    if (index == at) return application.status == "DEPLOYED" ? "done" : "current";
    if (index > at) return "todo";
    if (step.key == "interview" && !hadInterview) return "skipped";
    if (step.key == "medical" && !hadMedical) return "skipped";
    return "done";
  });
}

const OFFICE_TIME_ZONE = "Asia/Colombo";

// "Sat 21 Nov 2026, 9:00 am" in Sri Lanka time
export function formatInterviewTime(value: string, locale = "en-GB") {
  return new Date(value).toLocaleString(locale, {
    timeZone: OFFICE_TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// "AED 1,500 - 2,000 / month"
export function salaryLabel(job: Pick<JobVacancy, "salaryMin" | "salaryMax" | "salaryCurrency" | "salaryPeriod">, onRequest = "Salary on request") {
  if (job.salaryMin == null && job.salaryMax == null) {
    return onRequest;
  }
  const number = (value: string) => Number(value).toLocaleString("en-LK", { maximumFractionDigits: 0 });
  const low = job.salaryMin ?? job.salaryMax!;
  const high = job.salaryMax != null && Number(job.salaryMax) != Number(low) ? ` - ${number(job.salaryMax)}` : "";
  return `${job.salaryCurrency} ${number(low)}${high} / ${job.salaryPeriod}`;
}

// "Age 21 - 35", "Age 25+", ""
export function ageLabel(job: Pick<JobVacancy, "ageMin" | "ageMax">) {
  if (job.ageMin != null && job.ageMax != null) return `Age ${job.ageMin} - ${job.ageMax}`;
  if (job.ageMin != null) return `Age ${job.ageMin}+`;
  if (job.ageMax != null) return `Age up to ${job.ageMax}`;
  return "";
}

// Deadline is a calendar day stored at 00:00 UTC
export function formatDeadline(value: string, locale = "en-GB") {
  return new Date(value).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function jobPlace(job: Pick<JobVacancy, "city" | "country">) {
  return [job.city, job.country].filter(Boolean).join(", ");
}
