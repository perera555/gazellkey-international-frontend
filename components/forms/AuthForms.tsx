"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

const STAFF_ROLES = ["STAFF", "FINANCE", "ADMIN"];

// Only follow same-site paths after login ("/x", never "//evil.com")
function safeNext(next: string | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
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
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
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
    // sign in straight away
    const login = await apiRequest("POST", "/api/auth/login", {
      email: form.get("email"),
      password: form.get("password"),
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
        <input id="password" name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="confirm">Confirm password</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className="input" />
      </div>
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2" role="alert">{error}</p> : null}
      <button type="submit" disabled={sending} className="btn-navy w-full sm:col-span-2">
        {sending ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-slate-600 sm:col-span-2">
        Already registered? <Link href="/login" className="font-medium text-navy-800 underline">Sign in</Link>
      </p>
    </form>
  );
}

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await apiRequest("POST", "/api/auth/logout");
        router.push("/");
        router.refresh();
      }}
    >
      Sign out
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
        <input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="newPassword">New password</label>
        <input id="newPassword" name="newPassword" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="confirm">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className="input" />
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
