import type { Metadata } from "next";
import AccountTable, { AccountHeading } from "@/components/account/AccountTable";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import { apiGetMine, toQuery } from "@/lib/api";
import { formatDate, formatFileSize, humanize } from "@/lib/format";
import { MyDocument } from "@/lib/types";

export const metadata: Metadata = { title: "Documents" };

export default async function MyDocumentsPage({ searchParams }: PageProps<"/account/documents">) {
  const params = await searchParams;
  const documents = await apiGetMine<MyDocument[]>(
    `/api/me/documents${toQuery(params, ["pageNumber"], { pageSize: "20" })}`,
    "/account/documents",
  );

  return (
    <>
      <AccountHeading
        title="My documents"
        text="Tickets, itineraries, policies, invoices and certificates we have shared with you."
      />
      {!documents.ok ? (
        <ErrorNote message={documents.message} />
      ) : (
        <>
          <AccountTable
            rows={documents.data}
            empty="No documents yet."
            columns={[
              { header: "Document", cell: (row) => <span className="font-medium text-navy-900">{row.title}</span> },
              { header: "Type", cell: (row) => humanize(row.type) },
              { header: "Size", cell: (row) => formatFileSize(row.size), className: "whitespace-nowrap" },
              { header: "Added", cell: (row) => formatDate(row.createdAt), className: "whitespace-nowrap" },
              {
                header: "",
                cell: (row) => (
                  // The download goes through the /api rewrite, so the login cookie is sent
                  <a href={`/api/documents/${row.id}/download`} className="btn-outline btn-sm">
                    Download
                  </a>
                ),
                className: "text-right",
              },
            ]}
          />
          <Pagination pagination={documents.pagination} basePath="/account/documents" searchParams={params} />
        </>
      )}
    </>
  );
}
