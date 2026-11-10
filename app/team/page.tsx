import type { Metadata } from "next";
import { PersonCard, TeamMember } from "@/components/site/LeadershipSection";
import PageHero from "@/components/site/PageHero";
import { apiGet } from "@/lib/api";
import { humanize } from "@/lib/format";
import { getDictionary } from "@/lib/i18n-server";
import { PAGE_WORDS } from "@/lib/i18n-pages";

export const metadata: Metadata = {
  title: "Our team",
  description: "Directors, shareholders, managers and team members of Gazellekey International, with their positions and contact details.",
};

// Our team: everyone staff add in the admin (Website > Directors, managers & team),
// in four groups. Each person shows once, in their highest group.
// Phone numbers are shown for managers only (the API removes the others).
export default async function TeamPage() {
  const [result, { lang }] = await Promise.all([apiGet<TeamMember[]>("/api/team?view=public&pageSize=100"), getDictionary()]);
  const w = PAGE_WORDS[lang].leadership;
  const names = PAGE_WORDS[lang].divisionNames as Record<string, string>;
  const divisionName = (key: string) => names[key] ?? humanize(key);
  const people = result.ok ? result.data : [];

  const has = (person: TeamMember, role: TeamMember["roles"][number]) => person.roles.includes(role);
  const groups = [
    { title: w.directors, people: people.filter((person) => has(person, "DIRECTOR")) },
    { title: w.shareholders, people: people.filter((person) => has(person, "SHAREHOLDER") && !has(person, "DIRECTOR")) },
    { title: w.managers, people: people.filter((person) => has(person, "MANAGER") && !has(person, "DIRECTOR") && !has(person, "SHAREHOLDER")) },
    { title: w.team, people: people.filter((person) => has(person, "TEAM") && !has(person, "DIRECTOR") && !has(person, "SHAREHOLDER") && !has(person, "MANAGER")) },
  ].filter((group) => group.people.length > 0);

  return (
    <>
      <PageHero eyebrow={w.eyebrowTeam} title={w.titleTeam} text={w.textTeam} image="/images/travel-sigiriya.jpg" />

      <div className="container-page py-16">
        {groups.length == 0 ? (
          <p className="card px-6 py-12 text-center text-slate-600">{w.emptyTeam}</p>
        ) : (
          groups.map((group) => (
            <section key={group.title} className="mb-14 last:mb-0">
              <h2 className="heading-display text-2xl sm:text-3xl">{group.title}</h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.people.map((person) => (
                  <PersonCard key={person.id} person={person} showPhone roleNames={w.roles} divisionName={divisionName} large />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </>
  );
}
