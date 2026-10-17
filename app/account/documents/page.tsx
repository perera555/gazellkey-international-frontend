import type { Metadata } from "next";
import AccountTable, { AccountHeading } from "@/components/account/AccountTable";
import DocumentUploadForm, { UploadTarget } from "@/components/forms/DocumentUploadForm";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import { apiFetch, apiGetMine, toQuery } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { formatDate, formatFileSize, humanize } from "@/lib/format";
import { MyAppointment, MyDocument, MyEnquiry, MyOrder } from "@/lib/types";

export const metadata: Metadata = { title: "Documents" };

export default async function MyDocumentsPage({ searchParams }: PageProps<"/account/documents">) {
  const params = await searchParams;
  const [documents, me, enquiries, appointments, orders] = await Promise.all([
    apiGetMine<MyDocument[]>(
      `/api/me/documents${toQuery(params, ["pageNumber"], { pageSize: "20" })}`,
      "/account/documents",
    ),
    apiFetch("/api/auth/me"),
    apiGetMine<MyEnquiry[]>("/api/me/enquiries?pageSize=50", "/account/documents"),
    apiGetMine<MyAppointment[]>("/api/me/appointments?pageSize=50", "/account/documents"),
    apiGetMine<MyOrder[]>("/api/me/orders?pageSize=50", "/account/documents"),
  ]);

  // where an upload can go: the customer's profile, or one of their records
  const customerId: string | undefined = me.ok ? me.body.customer?.id : undefined;
  const targets: UploadTarget[] = [
    ...(customerId ? [{ value: `CUSTOMER:${customerId}`, label: "My profile (general)" }] : []),
    ...(enquiries.ok ? enquiries.data : []).map((row) => ({
      value: `ENQUIRY:${row.id}`,
      label: `Enquiry ${row.reference} - ${row.subject}`,
    })),
    ...(appointments.ok ? appointments.data : [])
      .filter((row) => row.status != "CANCELLED")
      .map((row) => ({
        value: `APPOINTMENT:${row.id}`,
        label: `Appointment ${row.reference} - ${formatDate(row.startAt)}`,
      })),
    ...(orders.ok ? orders.data : []).map((row) => ({
      value: `ORDER:${row.id}`,
      label: `Order ${row.reference} - ${DIVISIONS[row.division].name}`,
    })),
  ];

  return (
    <>
      <AccountHeading
        title="My documents"
        text="Send us your documents, and find the tickets, itineraries, policies, invoices and certificates we have shared with you."
      />

      <section id="upload" className="card mb-8 scroll-mt-28 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-navy-900">Upload a document</h2>
        <p className="mt-1 mb-6 text-sm text-slate-600">
          Passport copies, visa papers, certificates, permits and anything else we asked you for.
        </p>
        {targets.length > 0 ? (
          <DocumentUploadForm targets={targets} />
        ) : (
          <p className="text-sm text-slate-600">Uploading is not available right now. Please try again later.</p>
        )}
      </section>

      <h2 className="mb-4 text-lg font-semibold text-navy-900">Your documents</h2>
      {!documents.ok ? (
        <ErrorNote message={documents.message} />
      ) : (
        <>
          <AccountTable
            rows={documents.data}
            empty="No documents yet. Upload one above."
            columns={[
              { header: "Document", cell: (row) => <span className="font-medium text-navy-900">{row.title}</span> },
              { header: "Type", cell: (row) => humanize(row.type) },
              { header: "Size", cell: (row) => formatFileSize(row.size), className: "whitespace-nowrap" },
              { header: "Added", cell: (row) => formatDate(row.createdAt), className: "whitespace-nowrap" },
              {
                header: "Check",
                cell: (row) =>
                  row.approval == "PENDING" ? (
                    <span className="badge bg-amber-100 text-amber-800">Waiting for approval</span>
                  ) : row.approval == "APPROVED" ? (
                    <span className="badge bg-green-100 text-green-800">Approved</span>
                  ) : row.approval == "CANCELLED" ? (
                    <>
                      <span className="badge bg-red-100 text-red-800">Not accepted</span>
                      {row.reviewNote ? <p className="mt-1 max-w-56 text-xs text-red-700">{row.reviewNote}</p> : null}
                    </>
                  ) : null,
              },
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
