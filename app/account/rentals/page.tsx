import type { Metadata } from "next";
import Link from "next/link";
import { AccountHeading } from "@/components/account/AccountTable";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine, toQuery } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { eventTypeLabel, formatRentalDates } from "@/lib/rentals";
import { MyRental } from "@/lib/types";

export const metadata: Metadata = { title: "My rentals" };

const STATUS_TEXT: Record<string, string> = {
  REQUESTED: "Waiting for our team to confirm",
  CONFIRMED: "Confirmed - the items are reserved for you",
  DELIVERED: "Delivered",
  RETURNED: "Finished - thank you!",
  CANCELLED: "Cancelled",
};

export default async function MyRentalsPage({ searchParams }: PageProps<"/account/rentals">) {
  const params = await searchParams;
  const rentals = await apiGetMine<MyRental[]>(`/api/me/rentals${toQuery(params, ["pageNumber"], { pageSize: "20" })}`, "/account/rentals");

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AccountHeading title="My rentals" text="Huts, chairs, tables and more you requested for your events." />
        <Link href="/rentals" className="btn-gold">
          Plan an event
        </Link>
      </div>

      {!rentals.ok ? (
        <ErrorNote message={rentals.message} />
      ) : rentals.data.length == 0 ? (
        <div className="card px-6 py-12 text-center">
          <p className="text-slate-600">You have no rentals yet.</p>
          <Link href="/rentals" className="btn-navy mt-5">
            See what you can hire
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {rentals.data.map((rental) => (
              <li key={rental.id} className="card p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      {rental.reference} · {eventTypeLabel(rental.eventType)}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-navy-950">{formatRentalDates(rental.startDate, rental.endDate)}</h2>
                    <p className="text-sm text-slate-600">
                      {rental.venue}, {rental.city}
                    </p>
                  </div>
                  <StatusBadge value={rental.status} />
                </div>
                <ul className="mt-4 flex flex-wrap gap-2 text-sm">
                  {rental.items.map((item) => (
                    <li key={item.id} className="rounded-full bg-navy-50 px-3 py-1 text-navy-800">
                      {item.quantity} × {item.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-600">
                    {STATUS_TEXT[rental.status] ?? rental.status}
                    {rental.cancelReason ? ` - ${rental.cancelReason}` : ""}
                  </p>
                  <p className="text-right">
                    <span className="block text-xs text-slate-500">{rental.quotedTotal != null ? "Total" : "Estimated (items only)"}</span>
                    <span className="text-lg font-bold text-navy-950">{formatMoney(rental.quotedTotal ?? rental.estimatedTotal, rental.currency)}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Pagination pagination={rentals.pagination} basePath="/account/rentals" searchParams={params} />
        </>
      )}
    </>
  );
}
