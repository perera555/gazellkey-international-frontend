import type { Metadata } from "next";
import { AccountHeading } from "@/components/account/AccountTable";
import QuotationActions from "@/components/forms/QuotationActions";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine, toQuery } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { formatDate, formatMoney } from "@/lib/format";
import { MyQuotation } from "@/lib/types";

export const metadata: Metadata = { title: "Quotations" };

export default async function MyQuotationsPage({ searchParams }: PageProps<"/account/quotations">) {
  const params = await searchParams;
  const quotations = await apiGetMine<MyQuotation[]>(
    `/api/me/quotations${toQuery(params, ["pageNumber"], { pageSize: "10" })}`,
    "/account/quotations",
  );

  return (
    <>
      <AccountHeading
        title="My quotations"
        text="Accept a quotation to confirm your booking or order, or ask us for changes."
      />
      {!quotations.ok ? (
        <ErrorNote message={quotations.message} />
      ) : quotations.data.length == 0 ? (
        <p className="card px-6 py-10 text-center text-sm text-slate-600">
          No quotations yet. We send one after reviewing your enquiry.
        </p>
      ) : (
        <div className="space-y-6">
          {quotations.data.map((quotation) => (
            <QuotationCard key={quotation.id} quotation={quotation} />
          ))}
          <Pagination pagination={quotations.pagination} basePath="/account/quotations" searchParams={params} />
        </div>
      )}
    </>
  );
}

function QuotationCard({ quotation }: { quotation: MyQuotation }) {
  const money = (value: string) => formatMoney(value, quotation.currency);
  const expired = new Date(quotation.validUntil) < new Date();
  const canAnswer = quotation.status == "SENT" && !expired;

  return (
    <article id={quotation.id} className="card scroll-mt-24 overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-navy-50 px-5 py-4">
        <div>
          <p className="font-mono font-semibold text-navy-900">{quotation.reference}</p>
          <p className="text-xs text-slate-500">
            {DIVISIONS[quotation.division]?.name} · issued {formatDate(quotation.createdAt)} · valid until{" "}
            {formatDate(quotation.validUntil)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge value={quotation.status == "SENT" && expired ? "EXPIRED" : quotation.status} />
          {/* PDF comes from the backend through the /api rewrite (login cookie included) */}
          <a href={`/api/quotations/${quotation.id}/pdf?download=1`} className="btn-outline btn-sm">
            ↓ Download PDF
          </a>
        </div>
      </header>

      <div className="overflow-x-auto px-5 py-4">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-slate-500 uppercase">
            <tr>
              <th className="py-2 font-semibold">Item</th>
              <th className="py-2 text-right font-semibold">Qty</th>
              <th className="py-2 text-right font-semibold">Unit price</th>
              <th className="py-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotation.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2 pr-4">{item.description}</td>
                <td className="py-2 text-right whitespace-nowrap">
                  {Number(item.quantity)} {item.unit}
                </td>
                <td className="py-2 text-right whitespace-nowrap">{money(item.unitPrice)}</td>
                <td className="py-2 text-right whitespace-nowrap">{money(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="text-right">
            {Number(quotation.discount) > 0 ? (
              <TotalRow label="Discount" value={`- ${money(quotation.discount)}`} />
            ) : null}
            {Number(quotation.tax) > 0 ? <TotalRow label="Tax" value={money(quotation.tax)} /> : null}
            <TotalRow label="Total" value={money(quotation.total)} strong />
          </tfoot>
        </table>
      </div>

      {quotation.shippingTerms || quotation.terms || quotation.notes ? (
        <div className="space-y-2 border-t border-slate-100 px-5 py-4 text-sm text-slate-600">
          {quotation.shippingTerms ? <p><strong>Shipping terms:</strong> {quotation.shippingTerms}</p> : null}
          {quotation.notes ? <p className="whitespace-pre-line">{quotation.notes}</p> : null}
          {quotation.terms ? <p className="whitespace-pre-line text-xs">{quotation.terms}</p> : null}
        </div>
      ) : null}

      {canAnswer ? (
        <div className="border-t border-slate-100 px-5 py-4">
          <QuotationActions quotationId={quotation.id} />
        </div>
      ) : null}
    </article>
  );
}

function TotalRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <tr>
      <td colSpan={3} className={`pt-2 pr-4 ${strong ? "font-semibold text-navy-900" : "text-slate-500"}`}>
        {label}
      </td>
      <td className={`pt-2 whitespace-nowrap ${strong ? "font-semibold text-navy-900" : ""}`}>{value}</td>
    </tr>
  );
}
