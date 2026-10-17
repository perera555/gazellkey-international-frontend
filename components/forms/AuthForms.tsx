"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import PasswordInput from "@/components/forms/PasswordInput";

const STAFF_ROLES = ["STAFF", "FINANCE", "ADMIN"];

// Only follow same-site paths after login ("/x", never "//evil.com")
function safeNext(next: string | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

// "Continue with Google": a normal link (full page visit), because Google
// takes over the page. /api/auth/google is forwarded to the backend.
export function GoogleButton({ next, label = "Continue with Google" }: { next?: string; label?: string }) {
  const href = `/api/auth/google${next ? `?next=${encodeURIComponent(safeNext(next))}` : ""}`;
  return (
    <>
      <a
        href={href}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
      >
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        {label}
      </a>
      <div className="my-5 flex items-center gap-3 text-xs font-medium tracking-wide text-slate-400 uppercase">
        <span className="h-px flex-1 bg-slate-200" />
        or with email
        <span className="h-px flex-1 bg-slate-200" />
      </div>
    </>
  );
}

export function LoginForm({ next, adminUrl }: { next?: string; adminUrl: string }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await apiRequest<{ user?: { role: string } }>("POST", "/api/auth/login", {
      email: form.get("email"),
      password: form.get("password"),
      remember: form.get("remember") == "on",
    });
    if (!result.ok) {
      setSending(false);
      setError(result.data.message ?? "Login failed.");
      return;
    }
    // Staff work in the separate admin portal
    if (result.data.user && STAFF_ROLES.includes(result.data.user.role)) {
      window.location.href = adminUrl;
      return;
    }
    router.replace(safeNext(next));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <GoogleButton next={next} />
      <div>
        <label className="label" htmlFor="email">Email</label>
        {/* "username" tells browsers this is the login name to save with the password */}
        <input id="email" name="email" type="email" required autoComplete="username" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <PasswordInput id="password" name="password" required autoComplete="current-password" />
      </div>
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
        <input id="remember" name="remember" type="checkbox" className="h-4 w-4 accent-navy-900" />
        Remember me for 30 days
      </label>
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p> : null}
      <button type="submit" disabled={sending} className="btn-navy w-full">
        {sending ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-slate-600">
        New here?{" "}
        <Link href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"} className="font-medium text-navy-800 underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    if (form.get("password") != form.get("confirm")) {
      setError("Passwords do not match.");
      return;
    }
    setSending(true);
    const phone = String(form.get("phone") ?? "").trim();
    const result = await apiRequest("POST", "/api/auth/register", {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      phone: phone || undefined,
      password: form.get("password"),
    });
    if (!result.ok) {
      setSending(false);
      setError(result.data.message ?? "Sign-up failed.");
      return;
    }
    // sign in straight away, and stay signed in (as with "Remember me")
    const login = await apiRequest("POST", "/api/auth/login", {
      email: form.get("email"),
      password: form.get("password"),
      remember: true,
    });
    if (!login.ok) {
      router.push("/login");
      return;
    }
    router.replace(safeNext(next));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <GoogleButton next={next} label="Sign up with Google" />
      </div>
      <div>
        <label className="label" htmlFor="firstName">First name</label>
        <input id="firstName" name="firstName" required maxLength={50} autoComplete="given-name" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="lastName">Last name</label>
        <input id="lastName" name="lastName" required maxLength={50} autoComplete="family-name" className="input" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" maxLength={20} autoComplete="tel" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <PasswordInput id="password" name="password" required minLength={8} maxLength={72} autoComplete="new-password" />
      </div>
      <div>
        <label className="label" htmlFor="confirm">Confirm password</label>
        <PasswordInput id="confirm" name="confirm" required minLength={8} maxLength={72} autoComplete="new-password" />
      </div>
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2" role="alert">{error}</p> : null}
      <button type="submit" disabled={sending} className="btn-navy w-full sm:col-span-2">
        {sending ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-slate-600 sm:col-span-2">
        Already registered?{" "}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-medium text-navy-800 underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function LogoutButton({
  className = "",
  redirectTo = "/",
  label = "Sign out",
}: {
  className?: string;
  redirectTo?: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await apiRequest("POST", "/api/auth/logout");
        router.push(redirectTo);
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}

// Customer changes their own password (PUT /api/auth/password)
export function ChangePasswordForm() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (form.get("newPassword") != form.get("confirm")) {
      setMessage({ ok: false, text: "New passwords do not match." });
      return;
    }
    setSending(true);
    const result = await apiRequest("PUT", "/api/auth/password", {
      currentPassword: form.get("currentPassword"),
      newPassword: form.get("newPassword"),
    });
    setSending(false);
    setMessage({
      ok: result.ok,
      text: result.data.message ?? (result.ok ? "Password changed." : "Could not change password."),
    });
    if (result.ok) {
      formElement.reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm space-y-4">
      <div>
        <label className="label" htmlFor="currentPassword">Current password</label>
        <PasswordInput id="currentPassword" name="currentPassword" required autoComplete="current-password" />
      </div>
      <div>
        <label className="label" htmlFor="newPassword">New password</label>
        <PasswordInput id="newPassword" name="newPassword" required minLength={8} maxLength={72} autoComplete="new-password" />
      </div>
      <div>
        <label className="label" htmlFor="confirm">Confirm new password</label>
        <PasswordInput id="confirm" name="confirm" required minLength={8} maxLength={72} autoComplete="new-password" />
      </div>
      {message ? (
        <p
          role="alert"
          className={`rounded-lg px-3 py-2 text-sm ${message.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </p>
      ) : null}
      <button type="submit" disabled={sending} className="btn-navy">
        {sending ? "Saving..." : "Change password"}
      </button>
    </form>
  );
}
