import { apiGet } from "@/lib/api";
import { humanize } from "@/lib/format";
import { getDictionary } from "@/lib/i18n-server";
import { PAGE_WORDS } from "@/lib/i18n-pages";

// A person from /api/team in the public view: directors and shareholders
// never have a phone number here (the API removes it), managers may.
export type TeamMember = {
  id: string;
  name: string;
  roles: ("DIRECTOR" | "SHAREHOLDER" | "MANAGER")[];
  position: string;
  division: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  photo: string | null;
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

function PersonCard({ person, showPhone, roleNames, divisionName }: { person: TeamMember; showPhone: boolean; roleNames: Record<string, string>; divisionName: (key: string) => string }) {
  const roles = person.roles.map((role) => roleNames[role] ?? humanize(role)).join(" · ");
  return (
    <li className="card flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center gap-4">
        {person.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={person.photo} alt={person.name} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
        ) : (
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-navy-950 text-xl font-bold text-gold-400" aria-hidden="true">
            {initials(person.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-navy-950">{person.name}</p>
          <p className="text-sm text-slate-600">{person.position}</p>
          <p className="text-xs font-semibold tracking-wide text-gold-600 uppercase">
            {roles}
            {person.division ? ` · ${divisionName(person.division)}` : ""}
          </p>
        </div>
      </div>
      {person.bio ? <p className="mt-4 text-sm text-slate-600">{person.bio}</p> : null}
      <div className="mt-auto space-y-1.5 pt-4 text-sm">
        {person.email ? (
          <a href={`mailto:${person.email}`} className="flex items-center gap-2 font-medium text-navy-900 hover:underline">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gold-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
            </svg>
            <span className="truncate">{person.email}</span>
          </a>
        ) : null}
        {/* phones only for managers - never for directors or shareholders */}
        {showPhone && person.phone && person.roles.includes("MANAGER") ? (
          <a href={`tel:${person.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 font-medium text-navy-900 hover:underline">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gold-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
            </svg>
            {person.phone}
          </a>
        ) : null}
      </div>
    </li>
  );
}

// "Our leadership" (About us) or "Reach our management" (Contact):
// directors & shareholders with email only, managers with email and phone.
// Renders nothing until staff add people in the admin (Website > Directors & managers).
export default async function LeadershipSection({ variant }: { variant: "about" | "contact" }) {
  const [result, { lang }] = await Promise.all([apiGet<TeamMember[]>("/api/team?view=public&pageSize=100"), getDictionary()]);
  const w = PAGE_WORDS[lang].leadership;
  const names = PAGE_WORDS[lang].divisionNames as Record<string, string>;
  const divisionName = (key: string) => names[key] ?? humanize(key);
  const people = result.ok ? result.data : [];
  if (people.length == 0) {
    return null;
  }
  const board = people.filter((person) => person.roles.includes("DIRECTOR") || (person.roles.includes("SHAREHOLDER") && !person.roles.includes("MANAGER")));
  const managers = people.filter((person) => person.roles.includes("MANAGER"));

  return (
    <section id="management" className={`scroll-mt-28 py-20 ${variant == "about" ? "bg-ivory-50" : "bg-navy-50/60"}`}>
      <div className="container-page">
        <p className="eyebrow">{variant == "about" ? w.eyebrowAbout : w.eyebrowContact}</p>
        <h2 className="heading-display mt-2 text-3xl sm:text-4xl">{variant == "about" ? w.titleAbout : w.titleContact}</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          {variant == "about" ? w.textAbout : w.textContact}
        </p>

        {managers.length > 0 ? (
          <>
            <h3 className="mt-10 text-sm font-semibold tracking-wide text-slate-500 uppercase">{w.managers}</h3>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {managers.map((person) => (
                <PersonCard key={person.id} person={person} showPhone roleNames={w.roles} divisionName={divisionName} />
              ))}
            </ul>
          </>
        ) : null}

        {board.length > 0 ? (
          <>
            <h3 className="mt-10 text-sm font-semibold tracking-wide text-slate-500 uppercase">{w.board}</h3>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {board.map((person) => (
                <PersonCard key={person.id} person={person} showPhone={false} roleNames={w.roles} divisionName={divisionName} />
              ))}
            </ul>
            {variant == "contact" ? <p className="mt-4 text-xs text-slate-500">{w.emailOnly}</p> : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
