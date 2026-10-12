import type { Metadata } from "next";
import { AccountHeading } from "@/components/account/AccountTable";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import { apiGetMine, toQuery } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { MyMessage } from "@/lib/types";

export const metadata: Metadata = { title: "Messages" };

// Every email / SMS we sent the customer (communication history, FR-SH-09)
export default async function MyMessagesPage({ searchParams }: PageProps<"/account/messages">) {
  const params = await searchParams;
  const messages = await apiGetMine<MyMessage[]>(
    `/api/me/messages${toQuery(params, ["pageNumber"], { pageSize: "20" })}`,
    "/account/messages",
  );

  return (
    <>
      <AccountHeading title="Messages" text="A copy of every email and SMS we have sent you." />
      {!messages.ok ? (
        <ErrorNote message={messages.message} />
      ) : messages.data.length == 0 ? (
        <p className="card px-6 py-10 text-center text-sm text-slate-600">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.data.map((message) => (
            <details key={message.id} className="card group p-5">
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-navy-900">
                  {message.subject ?? (message.channel == "SMS" ? "SMS" : "Message")}
                </span>
                <span className="text-xs text-slate-500">
                  {message.channel} · {formatDateTime(message.createdAt)}
                </span>
              </summary>
              <p className="mt-3 text-sm whitespace-pre-line text-slate-700">{message.body}</p>
            </details>
          ))}
          <Pagination pagination={messages.pagination} basePath="/account/messages" searchParams={params} />
        </div>
      )}
    </>
  );
}
