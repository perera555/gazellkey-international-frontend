import type { Metadata } from "next";
import Link from "next/link";
import { AccountHeading } from "@/components/account/AccountTable";
import AppointmentCancel from "@/components/forms/AppointmentCancel";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine, toQuery } from "@/lib/api";
import { DIVISIONS, labelOf } from "@/lib/divisions";
import { formatOfficeClock, formatOfficeDay, modeLabel } from "@/lib/format";
import { MyAppointment } from "@/lib/types";

export const metadata: Metadata = { title: "Appointments" };

export default async function MyAppointmentsPage({ searchParams }: PageProps<"/account/appointments">) {
  const params = await searchParams;
  const appointments = await apiGetMine<MyAppointment[]>(
    `/api/me/appointments${toQuery(params, ["pageNumber"], { pageSize: "20" })}`,
    "/account/appointments",
  );

  const now = Date.now();
  const isUpcoming = (row: MyAppointment) =>
    new Date(row.endAt).getTime() >= now && (row.status == "REQUESTED" || row.status == "CONFIRMED");

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AccountHeading title="My appointments" text="Office visits, phone and video calls with our team." />
        <Link href="/appointments" className="btn-gold">
          Book an appointment
        </Link>
      </div>

      {!appointments.ok ? (
        <ErrorNote message={appointments.message} />
      ) : appointments.data.length == 0 ? (
        <div className="card px-6 py-12 text-center">
          <p className="text-slate-600">You have no appointments yet.</p>
          <Link href="/appointments" className="btn-navy mt-5">
            Book your first appointment
          </Link>
        </div>
      ) : (
        <>
          {[
            { title: "Upcoming", rows: appointments.data.filter(isUpcoming).reverse() }, // soonest first
            { title: "Past and cancelled", rows: appointments.data.filter((row) => !isUpcoming(row)) },
          ]
            .filter((group) => group.rows.length > 0)
            .map((group) => (
              <section key={group.title} className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-navy-900">{group.title}</h2>
                <ul className="space-y-4">
                  {group.rows.map((row) => (
                    <AppointmentCard key={row.id} appointment={row} upcoming={isUpcoming(row)} />
                  ))}
                </ul>
              </section>
            ))}
          <Pagination pagination={appointments.pagination} basePath="/account/appointments" searchParams={params} />
        </>
      )}
    </>
  );
}

function AppointmentCard({ appointment, upcoming }: { appointment: MyAppointment; upcoming: boolean }) {
  const division = DIVISIONS[appointment.division];
  const start = new Date(appointment.startAt);

  return (
    <li className={`card overflow-hidden ${upcoming ? "" : "opacity-80"}`}>
      <div className="flex flex-col sm:flex-row">
        {/* calendar leaf */}
        <div
          className="flex shrink-0 flex-row items-center gap-3 px-5 py-4 text-white sm:w-32 sm:flex-col sm:justify-center sm:gap-0"
          style={{ background: `linear-gradient(160deg, ${division?.color ?? "#13345c"}, var(--color-navy-950))` }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase opacity-80">
            {start.toLocaleDateString("en-GB", { month: "short", timeZone: "Asia/Colombo" })}
          </span>
          <span className="font-display text-4xl leading-none font-semibold">
            {start.toLocaleDateString("en-GB", { day: "numeric", timeZone: "Asia/Colombo" })}
          </span>
          <span className="text-sm font-semibold">{formatOfficeClock(appointment.startAt)}</span>
        </div>

        <div className="flex-1 space-y-3 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-navy-900">{appointment.subject}</p>
              <p className="text-sm text-slate-600">
                {formatOfficeDay(appointment.startAt)}, {formatOfficeClock(appointment.startAt)} -{" "}
                {formatOfficeClock(appointment.endAt)} (Sri Lanka time)
              </p>
            </div>
            <StatusBadge value={appointment.status} />
          </div>

          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-slate-500">Type</dt>
              <dd>{modeLabel(appointment.mode)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Where</dt>
              <dd className="break-words">{appointment.place}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Division</dt>
              <dd>
                {division?.name ?? appointment.division}
                {appointment.serviceType ? ` · ${labelOf(division?.services ?? [], appointment.serviceType)}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Reference</dt>
              <dd className="font-mono">{appointment.reference}</dd>
            </div>
          </dl>

          {appointment.status == "REQUESTED" && upcoming ? (
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900">
              Waiting for our team to confirm this time. We will email you.
            </p>
          ) : null}
          {appointment.cancelReason ? (
            <p className="text-sm text-slate-600">Reason: {appointment.cancelReason}</p>
          ) : null}

          {upcoming ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {appointment.googleCalendarUrl ? (
                <a href={appointment.googleCalendarUrl} target="_blank" rel="noreferrer" className="btn-gold btn-sm">
                  <GoogleCalendarIcon /> Add to Google Calendar
                </a>
              ) : null}
              {appointment.mode == "VIDEO" && appointment.meetingLink ? (
                <a href={appointment.meetingLink} target="_blank" rel="noreferrer" className="btn-navy btn-sm">
                  Join video call
                </a>
              ) : null}
              <AppointmentCancel appointmentId={appointment.id} />
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function GoogleCalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
    </svg>
  );
}
