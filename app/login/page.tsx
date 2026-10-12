import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/AuthForms";
import AuthShell from "@/components/site/AuthShell";
import { param } from "@/lib/format";
import { ADMIN_URL, getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  if (await getSessionUser()) {
    redirect("/account");
  }

  return (
    <AuthShell title="Sign in" text="Follow your enquiries, quotations, orders and documents.">
      <LoginForm next={param(params.next)} adminUrl={ADMIN_URL} />
    </AuthShell>
  );
}
