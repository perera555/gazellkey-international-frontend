import type { Metadata } from "next";
import { AccountHeading } from "@/components/account/AccountTable";
import { ChangePasswordForm, LogoutButton } from "@/components/forms/AuthForms";
import { requireCustomer } from "@/lib/session";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireCustomer("/account/settings");

  return (
    <>
      <AccountHeading title="Settings" />
      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="font-semibold text-navy-900">Profile</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[120px_1fr]">
            <dt className="text-slate-500">Name</dt>
            <dd>{user.firstName} {user.lastName}</dd>
            <dt className="text-slate-500">Email</dt>
            <dd>{user.email}</dd>
          </dl>
          <p className="mt-3 text-xs text-slate-500">
            To change your name or email, send us a message from the contact page.
          </p>
        </section>
        <section className="card p-6">
          <h2 className="mb-4 font-semibold text-navy-900">Change password</h2>
          <ChangePasswordForm />
        </section>
        <section className="card p-6">
          <LogoutButton className="btn-outline" />
        </section>
      </div>
    </>
  );
}
