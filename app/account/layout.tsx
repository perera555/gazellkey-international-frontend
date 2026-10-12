import type { Metadata } from "next";
import AccountNav from "@/components/account/AccountNav";
import { LogoutButton } from "@/components/forms/AuthForms";
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
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">Signed in as</p>
            <p className="truncate font-semibold text-navy-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <AccountNav />
          <LogoutButton className="hidden px-3 text-sm text-slate-600 hover:text-navy-900 lg:block" />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
