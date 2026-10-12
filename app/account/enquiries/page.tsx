import type { Metadata } from "next";
import AccountTable, { AccountHeading } from "@/components/account/AccountTable";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine, toQuery } from "@/lib/api";
import { DIVISIONS, labelOf } from "@/lib/divisions";
import { formatDate } from "@/lib/format";
import { MyEnquiry } from "@/lib/types";

export const metadata: Metadata = { title: "Enquiries" };

export default async function MyEnquiriesPage({ searchParams }: PageProps<"/account/enquiries">) {
  const params = await searchParams;
  const enquiries = await apiGetMine<MyEnquiry[]>(
    `/api/me/enquiries${toQuery(params, ["pageNumber"], { pageSize: "20" })}`,
    "/account/enquiries",
  );

  return (
    <>
      <AccountHeading title="My enquiries" />
      {!enquiries.ok ? (
        <ErrorNote message={enquiries.message} />
      ) : (
        <>
          <AccountTable
            rows={enquiries.data}
            empty="You have not sent any enquiries yet."
            columns={[
              { header: "Reference", cell: (row) => <span className="font-mono">{row.reference}</span>, className: "whitespace-nowrap" },
              { header: "Subject", cell: (row) => row.subject },
              {
                header: "Division / service",
                cell: (row) => {
                  const division = DIVISIONS[row.division];
                  return (
                    <>
                      {division?.name ?? row.division}
                      {row.serviceType ? (
                        <span className="block text-xs text-slate-500">
                          {labelOf(division?.services ?? [], row.serviceType)}
                        </span>
                      ) : null}
                    </>
                  );
                },
              },
              { header: "Status", cell: (row) => <StatusBadge value={row.status} /> },
              { header: "Date", cell: (row) => formatDate(row.createdAt), className: "whitespace-nowrap" },
            ]}
          />
          <Pagination pagination={enquiries.pagination} basePath="/account/enquiries" searchParams={params} />
        </>
      )}
    </>
  );
}
