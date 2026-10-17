import type { Metadata } from "next";
import { AccountHeading } from "@/components/account/AccountTable";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import StatusBadge from "@/components/site/StatusBadge";
import { apiGetMine, toQuery } from "@/lib/api";
import { DIVISIONS } from "@/lib/divisions";
import { formatDate, formatDateTime, formatMoney, humanize } from "@/lib/format";
import { MyOrder } from "@/lib/types";

export const metadata: Metadata = { title: "Orders & bookings" };

export default async function MyOrdersPage({ searchParams }: PageProps<"/account/orders">) {
  const params = await searchParams;
  const orders = await apiGetMine<MyOrder[]>(
    `/api/me/orders${toQuery(params, ["pageNumber"], { pageSize: "10" })}`,
    "/account/orders",
  );

  return (
    <>
      <AccountHeading
        title="Orders & bookings"
        text="Created when you accept a quotation or buy from our online shop. Shipments show live tracking milestones."
      />
      {!orders.ok ? (
        <ErrorNote message={orders.message} />
      ) : orders.data.length == 0 ? (
        <p className="card px-6 py-10 text-center text-sm text-slate-600">No orders or bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.data.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          <Pagination pagination={orders.pagination} basePath="/account/orders" searchParams={params} />
        </div>
      )}
    </>
  );
}

function OrderCard({ order }: { order: MyOrder }) {
  const money = (value: string) => formatMoney(value, order.currency);
  const balance = Number(order.total) - Number(order.amountPaid);

  return (
    <article className="card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-navy-50 px-5 py-4">
        <div>
          <p className="font-mono font-semibold text-navy-900">{order.reference}</p>
          <p className="text-xs text-slate-500">
            {DIVISIONS[order.division]?.name} · {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge value={order.status} />
      </header>

      <div className="px-5 py-4">
        <ul className="divide-y divide-slate-100 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 py-2">
              <span>
                {item.description}{" "}
                <span className="text-slate-500">
                  × {Number(item.quantity)} {item.unit}
                </span>
              </span>
              <span className="whitespace-nowrap">{money(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 grid gap-1 text-right text-sm">
          <div><dt className="inline text-slate-500">Total </dt><dd className="inline font-semibold">{money(order.total)}</dd></div>
          <div><dt className="inline text-slate-500">Paid </dt><dd className="inline">{money(order.amountPaid)}</dd></div>
          {balance > 0 && order.status != "CANCELLED" ? (
            <div><dt className="inline text-slate-500">Balance due </dt><dd className="inline font-semibold text-navy-900">{money(String(balance))}</dd></div>
          ) : null}
        </dl>
      </div>

      {order.shipments.map((shipment) => (
        <div key={shipment.id} className="border-t border-slate-100 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-navy-900">
              Shipment <span className="font-mono">{shipment.reference}</span>
            </h3>
            <StatusBadge value={shipment.isDelayed ? "DELAYED" : shipment.status} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {[shipment.origin, shipment.destination].filter(Boolean).join(" → ")}
            {shipment.carrier ? ` · ${shipment.carrier}` : ""}
            {shipment.trackingNumber ? ` · Tracking ${shipment.trackingNumber}` : ""}
            {shipment.expectedArrival ? ` · ETA ${formatDate(shipment.expectedArrival)}` : ""}
          </p>
          {shipment.isDelayed && shipment.delayReason ? (
            <p className="mt-2 text-sm text-red-700">Delay: {shipment.delayReason}</p>
          ) : null}
          {shipment.milestones.length > 0 ? (
            <ol className="mt-3 space-y-2 border-l-2 border-navy-100 pl-4 text-sm">
              {[...shipment.milestones]
                .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
                .map((milestone) => (
                  <li key={milestone.id}>
                    <span className="font-medium text-navy-900">{humanize(milestone.status)}</span>
                    <span className="text-slate-500">
                      {" "}· {formatDateTime(milestone.occurredAt)}
                      {milestone.location ? ` · ${milestone.location}` : ""}
                    </span>
                    {milestone.note ? <p className="text-slate-600">{milestone.note}</p> : null}
                  </li>
                ))}
            </ol>
          ) : null}
        </div>
      ))}
    </article>
  );
}
