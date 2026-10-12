import type { Metadata } from "next";
import AccountTable, { AccountHeading } from "@/components/account/AccountTable";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine, toQuery } from "@/lib/api";
import { formatDate, formatMoney, humanize } from "@/lib/format";
import { MyPayment } from "@/lib/types";

export const metadata: Metadata = { title: "Payments" };

export default async function MyPaymentsPage({ searchParams }: PageProps<"/account/payments">) {
  const params = await searchParams;
  const payments = await apiGetMine<MyPayment[]>(
    `/api/me/payments${toQuery(params, ["pageNumber"], { pageSize: "20" })}`,
    "/account/payments",
  );

  return (
    <>
      <AccountHeading
        title="My payments"
        text="Bank transfers show as pending until our finance team confirms them."
      />
      {!payments.ok ? (
        <ErrorNote message={payments.message} />
      ) : (
        <>
          <AccountTable
            rows={payments.data}
            empty="No payments yet."
            columns={[
              { header: "Reference", cell: (row) => <span className="font-mono">{row.reference}</span>, className: "whitespace-nowrap" },
              { header: "Order", cell: (row) => <span className="font-mono">{row.order.reference}</span>, className: "whitespace-nowrap" },
              { header: "Amount", cell: (row) => formatMoney(row.amount, row.currency), className: "whitespace-nowrap" },
              { header: "Method", cell: (row) => humanize(row.method) },
              { header: "Status", cell: (row) => <StatusBadge value={row.status} /> },
              { header: "Date", cell: (row) => formatDate(row.paidAt ?? row.createdAt), className: "whitespace-nowrap" },
            ]}
          />
          <Pagination pagination={payments.pagination} basePath="/account/payments" searchParams={params} />
        </>
      )}
    </>
  );
}
