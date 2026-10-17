import type { Metadata } from "next";
import Link from "next/link";
import AccountNav from "@/components/account/AccountNav";
import { LogoutButton } from "@/components/forms/AuthForms";
import Avatar from "@/components/site/Avatar";
import OnlineBadge from "@/components/site/OnlineBadge";
import { requireCustomer } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "My account", template: "%s | My account" },
  robots: { index: false, follow: false },
};

// Customer area (SRS 9.1). Every page shows only the signed-in customer's records.
export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  const user = await requireCustomer("/account");

  return (
    <div className="bg-navy-50">
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="hidden items-center gap-3 lg:flex">
            <Avatar firstName={user.firstName} lastName={user.lastName} photoUrl={user.photoUrl} size={56} online />
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Signed in as</p>
              <p className="truncate font-semibold text-navy-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
              <OnlineBadge />
            </div>
          </div>
          <AccountNav />
          <Link
            href="/guide"
            className="hidden items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-600 transition hover:border-gold-500 hover:text-navy-900 lg:flex"
          >
            <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-gold-500 text-[11px] font-bold text-navy-950">?</span>
            Need help? User guide
          </Link>
          <LogoutButton className="hidden px-3 text-sm text-slate-600 hover:text-navy-900 lg:block" />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
