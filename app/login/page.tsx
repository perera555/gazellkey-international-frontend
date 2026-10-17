import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/AuthForms";
import AuthShell from "@/components/site/AuthShell";
import { param } from "@/lib/format";
import { ADMIN_URL, getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

// ?error=... from the Google sign-in (backend app/api/auth/google/callback)
const ERRORS: Record<string, string> = {
  google_cancelled: "Google sign-in was cancelled.",
  google_failed: "Google sign-in did not work. Please try again.",
  google_email: "Your Google account has no verified email address.",
  google_staff: "Staff accounts sign in with their email and password.",
  google_not_configured: "Google sign-in is not available yet. Please use your email and password.",
  account_inactive: "Your account is not active. Please contact us.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  if (await getSessionUser()) {
    redirect("/");
  }
  const errorCode = param(params.error);
  const error = errorCode ? (ERRORS[errorCode] ?? "Sign-in did not work. Please try again.") : null;

  return (
    <AuthShell
      title="Sign in"
      text="Book appointments, send enquiries and follow your quotations, orders and documents."
    >
      {error ? (
        <p role="alert" className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <LoginForm next={param(params.next)} adminUrl={ADMIN_URL} />
    </AuthShell>
  );
}
