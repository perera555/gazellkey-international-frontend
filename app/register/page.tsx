import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/forms/AuthForms";
import AuthShell from "@/components/site/AuthShell";
import { param } from "@/lib/format";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const params = await searchParams;
  if (await getSessionUser()) {
    redirect("/account");
  }

  return (
    <AuthShell
      title="Create your account"
      text="Use the same email you enquired with and we will link your past enquiries."
      wide
    >
      <RegisterForm next={param(params.next)} />
    </AuthShell>
  );
}
