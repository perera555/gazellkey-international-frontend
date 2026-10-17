import type { Metadata } from "next";
import Link from "next/link";
import ClearPurchased from "@/components/shop/ClearPurchased";
import ErrorNote from "@/components/site/ErrorNote";
import PageHero from "@/components/site/PageHero";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine } from "@/lib/api";
import { cartKey } from "@/lib/cart";
import { DIVISIONS } from "@/lib/divisions";
import CopyValue from "@/components/shop/CopyValue";
import { formatDate, formatMoney, param } from "@/lib/format";
import { BankTransferDetails, CheckoutResult } from "@/lib/types";

export const metadata: Metadata = { title: "Thank you" };

// After checkout: /checkout/success?checkout=CHK-2026-00001
// (PayHere and Stripe send the customer back here; bank transfer comes
// straight here and shows our bank details)
export default async function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const checkout = param((await searchParams).checkout) ?? "";
  const thisPage = `/checkout/success?checkout=${encodeURIComponent(checkout)}`;
  const result = await apiGetMine<CheckoutResult>(
    `/api/shop/checkout?checkout=${encodeURIComponent(checkout)}`,
    thisPage,
  );

  const heading = !result.ok
    ? "Checkout"
    : result.data.status == "PAID"
      ? "Thank you for your order"
      : result.data.bankTransfer
        ? "Order placed - please transfer the payment"
        : result.data.status == "PENDING"
          ? "We are confirming your payment"
          : "Payment not completed";

  return (
    <>
      <PageHero eyebrow="Online shop" title={heading} />
      <div className="bg-[#f8f9fb]">
        <div className="container-page max-w-3xl space-y-6 py-12">
          {!result.ok ? (
            <ErrorNote message={result.message} />
          ) : (
            <Result result={result.data} thisPage={thisPage} />
          )}
        </div>
      </div>
    </>
  );
}

function Result({ result, thisPage }: { result: CheckoutResult; thisPage: string }) {
  const purchased = result.orders.flatMap((order) =>
    order.items
      .filter((item) => item.itemType && item.itemId)
      .map((item) => cartKey({ itemType: item.itemType!, itemId: item.itemId! })),
  );
  const bank = result.bankTransfer;

  return (
    <>
      {/* the order is placed: bought items leave the cart */}
      {result.status == "PAID" || bank ? <ClearPurchased keys={purchased} /> : null}

      {bank ? <BankTransferBox result={result} bank={bank} /> : null}

      <div className="card p-6">
        {result.status == "PAID" ? (
          <p className="text-slate-700">
            We received your payment of{" "}
            <strong className="text-navy-900">{formatMoney(result.total, result.currency)}</strong>. A
            confirmation email is on its way and our team will contact you about delivery.
          </p>
        ) : bank ? (
          <p className="text-slate-700">
            We have emailed you these bank details too. Your items are held for you until{" "}
            <strong className="text-navy-900">{formatDate(bank.payBefore)}</strong>. When the money
            arrives we confirm your order and your receipt is ready under Payments.
          </p>
        ) : result.status == "PENDING" ? (
          <p className="text-slate-700">
            We are still waiting for the payment provider to confirm your payment. This usually takes
            a few seconds.{" "}
            <a href={thisPage} className="font-semibold underline">
              Refresh this page
            </a>{" "}
            to check again.
          </p>
        ) : (
          <p className="text-slate-700">
            The payment was not completed, so nothing was charged and the items are available
            again. You can <Link href="/cart" className="font-semibold underline">try again from your cart</Link>.
          </p>
        )}
      </div>

      {result.orders.map((order) => (
        <article key={order.id} className="card overflow-hidden">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-navy-50 px-5 py-4">
            <div>
              <p className="font-mono font-semibold text-navy-900">{order.reference}</p>
              <p className="text-xs text-slate-500">{DIVISIONS[order.division]?.name}</p>
            </div>
            <StatusBadge value={order.status} />
          </header>
          <ul className="divide-y divide-slate-100 px-5 text-sm">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-4 py-2.5">
                <span>
                  {item.description}{" "}
                  <span className="text-slate-500">
                    × {Number(item.quantity)} {item.unit}
                  </span>
                </span>
                <span className="whitespace-nowrap">{formatMoney(item.lineTotal, order.currency)}</span>
              </li>
            ))}
          </ul>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
            <p className="font-semibold text-navy-900">Total {formatMoney(order.total, order.currency)}</p>
            {order.paymentStatus == "PAID" ? (
              <a href={`/api/payments/${order.paymentId}/receipt?download=1`} className="btn-outline btn-sm">
                Download receipt (PDF)
              </a>
            ) : null}
          </footer>
        </article>
      ))}

      <div className="flex flex-wrap gap-3">
        <Link href="/account/orders" className="btn-gold">View my orders</Link>
        <Link href="/account/payments" className="btn-outline">Payments & receipts</Link>
      </div>
    </>
  );
}

// Our bank account, each detail on its own line with a Copy button
function BankTransferBox({ result, bank }: { result: CheckoutResult; bank: BankTransferDetails }) {
  const rows: [string, string | null][] = [
    ["Account name", bank.accountName],
    ["Account number", bank.accountNumber],
    ["Bank", bank.bankName],
    ["Branch", bank.branch],
    ["SWIFT / BIC code (transfers from abroad)", bank.swiftCode],
    ["Bank address", bank.bankAddress],
  ];

  return (
    <section className="card overflow-hidden">
      <span className="block h-1.5 bg-gold-500" />
      <div className="p-6">
        <h2 className="text-lg font-bold text-navy-900">Bank transfer details</h2>
        <div className="mt-4 grid gap-3 rounded-xl bg-navy-50 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">Amount to pay</p>
            <p className="text-2xl font-bold text-navy-900">{formatMoney(result.total, result.currency)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Pay before</p>
            <p className="text-lg font-semibold text-navy-900">{formatDate(bank.payBefore)}</p>
          </div>
        </div>

        <dl className="mt-4 divide-y divide-slate-100">
          {rows
            .filter((row): row is [string, string] => Boolean(row[1]))
            .map(([label, value]) => (
              <CopyValue key={label} label={label} value={value} />
            ))}
          <CopyValue label="Payment reference (write this on the transfer)" value={result.checkoutReference} />
        </dl>

        {bank.note ? <p className="mt-4 text-sm whitespace-pre-line text-slate-700">{bank.note}</p> : null}
        <p className="mt-4 rounded-lg border border-gold-400/40 bg-gold-100 px-3 py-2 text-sm text-navy-900">
          Please use the payment reference above so we can match your transfer. International
          transfers can take 2-5 working days; bank charges are paid by the sender.
        </p>
      </div>
    </section>
  );
}
