import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import AccountTable, { AccountHeading } from "@/components/account/AccountTable";
import ErrorNote from "@/components/site/ErrorNote";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine } from "@/lib/api";
import { formatDate, formatDateRange, humanize } from "@/lib/format";
import { MyEventRegistration, MyTravel } from "@/lib/types";

export const metadata: Metadata = { title: "Travel & events" };

export default async function MyTravelPage() {
  const [travel, events] = await Promise.all([
    apiGetMine<MyTravel>("/api/me/travel", "/account/travel"),
    apiGetMine<MyEventRegistration[]>("/api/me/events?pageSize=50", "/account/travel"),
  ]);

  return (
    <>
      <AccountHeading title="Travel & events" text="Visa applications, flight tickets, insurance and event registrations." />

      {!travel.ok ? (
        <ErrorNote message={travel.message} />
      ) : (
        <div className="space-y-8">
          <Section title="Visa applications">
            <AccountTable
              rows={travel.data.visaCases}
              empty="No visa applications."
              columns={[
                { header: "Reference", cell: (row) => <span className="font-mono">{row.reference}</span>, className: "whitespace-nowrap" },
                { header: "Visa", cell: (row) => `${row.destinationCountry} · ${row.visaType}` },
                { header: "Stage", cell: (row) => <StatusBadge value={row.stage} /> },
                { header: "Decision", cell: (row) => row.decision ?? "-" },
                { header: "Opened", cell: (row) => formatDate(row.createdAt), className: "whitespace-nowrap" },
              ]}
            />
          </Section>

          <Section title="Flight tickets">
            <AccountTable
              rows={travel.data.tickets}
              empty="No ticket requests."
              columns={[
                { header: "Reference", cell: (row) => <span className="font-mono">{row.reference}</span>, className: "whitespace-nowrap" },
                { header: "Trip", cell: (row) => `${humanize(row.tripType)} · ${row.passengerCount} passenger${row.passengerCount == 1 ? "" : "s"}` },
                { header: "Airline / PNR", cell: (row) => [row.airline, row.pnr].filter(Boolean).join(" · ") || "-" },
                { header: "Status", cell: (row) => <StatusBadge value={row.status} /> },
                { header: "Requested", cell: (row) => formatDate(row.createdAt), className: "whitespace-nowrap" },
              ]}
            />
          </Section>

          <Section title="Travel insurance">
            <AccountTable
              rows={travel.data.insurance}
              empty="No insurance requests."
              columns={[
                { header: "Reference", cell: (row) => <span className="font-mono">{row.reference}</span>, className: "whitespace-nowrap" },
                { header: "Trip", cell: (row) => `${row.destination} · ${formatDateRange(row.startDate, row.endDate)}` },
                { header: "Policy", cell: (row) => row.policyNumber ?? "-" },
                { header: "Status", cell: (row) => <StatusBadge value={row.status} /> },
              ]}
            />
          </Section>
        </div>
      )}

      <div className="mt-8">
        <Section title="Event registrations">
          {!events.ok ? (
            <ErrorNote message={events.message} />
          ) : (
            <AccountTable
              rows={events.data}
              empty="You have not registered for any events."
              columns={[
                { header: "Reference", cell: (row) => <span className="font-mono">{row.reference}</span>, className: "whitespace-nowrap" },
                {
                  header: "Event",
                  cell: (row) => (
                    <Link href={`/events/${row.event.slug}`} className="text-navy-800 hover:underline">
                      {row.event.name}
                    </Link>
                  ),
                },
                { header: "When / where", cell: (row) => `${formatDateRange(row.event.startDate, row.event.endDate)} · ${row.event.venue}` },
                { header: "Seats", cell: (row) => row.seats },
                { header: "Status", cell: (row) => <StatusBadge value={row.status} /> },
              ]}
            />
          )}
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-navy-900">{title}</h2>
      {children}
    </section>
  );
}
