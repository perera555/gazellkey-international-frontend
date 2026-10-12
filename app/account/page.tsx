import Link from "next/link";
import AccountTable, { AccountHeading } from "@/components/account/AccountTable";
import ErrorNote from "@/components/site/ErrorNote";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { formatDate, formatMoney } from "@/lib/format";
import { requireCustomer } from "@/lib/session";
import { MyEnquiry, MyOrder, MyQuotation } from "@/lib/types";

export default async function AccountOverviewPage() {
  const user = await requireCustomer("/account");
  const [enquiries, quotations, orders] = await Promise.all([
    apiGetMine<MyEnquiry[]>("/api/me/enquiries?pageSize=5", "/account"),
    apiGetMine<MyQuotation[]>("/api/me/quotations?pageSize=50", "/account"),
    apiGetMine<MyOrder[]>("/api/me/orders?pageSize=50", "/account"),
  ]);

  const awaitingReply = quotations.ok ? quotations.data.filter((q) => q.status == "SENT") : [];
  const activeOrders = orders.ok
    ? orders.data.filter((o) => o.status != "COMPLETED" && o.status != "CANCELLED")
    : [];

  return (
    <>
      <AccountHeading title={`Welcome, ${user.firstName}`} text="Everything you have with Gazellekey, in one place." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Enquiries" value={enquiries.ok ? enquiries.pagination?.totalCount ?? enquiries.data.length : "-"} href="/account/enquiries" />
        <Stat label="Quotes awaiting your reply" value={awaitingReply.length} href="/account/quotations" highlight={awaitingReply.length > 0} />
        <Stat label="Active orders & bookings" value={activeOrders.length} href="/account/orders" />
      </div>

      {awaitingReply.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-gold-400 bg-gold-100 p-5">
          <h2 className="font-semibold text-navy-900">Quotations waiting for you</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {awaitingReply.map((quotation) => (
              <li key={quotation.id} className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  <span className="font-mono font-semibold">{quotation.reference}</span> ·{" "}
                  {formatMoney(quotation.total, quotation.currency)} · valid until {formatDate(quotation.validUntil)}
                </span>
                <Link href={`/account/quotations#${quotation.id}`} className="btn-navy btn-sm">
                  Review
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-10 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-navy-900">Recent enquiries</h2>
        <Link href="/contact" className="text-sm font-semibold text-navy-700 hover:underline">
          New enquiry →
        </Link>
      </div>
      <div className="mt-4">
        {!enquiries.ok ? (
          <ErrorNote message={enquiries.message} />
        ) : (
          <AccountTable
            rows={enquiries.data}
            empty="You have not sent any enquiries yet."
            columns={[
              { header: "Reference", cell: (row) => <span className="font-mono">{row.reference}</span> },
              { header: "Subject", cell: (row) => row.subject },
              { header: "Division", cell: (row) => DIVISIONS[row.division]?.name ?? row.division },
              { header: "Status", cell: (row) => <StatusBadge value={row.status} /> },
              { header: "Date", cell: (row) => formatDate(row.createdAt), className: "whitespace-nowrap" },
            ]}
          />
        )}
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  href,
  highlight = false,
}: {
  label: string;
  value: number | string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`card p-5 transition hover:shadow-md ${highlight ? "border-gold-400 ring-1 ring-gold-400" : ""}`}
    >
      <p className="text-3xl font-semibold text-navy-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </Link>
  );
}
