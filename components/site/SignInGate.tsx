import Link from "next/link";
import { RegisterForm } from "@/components/forms/AuthForms";

// Shown instead of a booking form to visitors without an account: register
// here (or sign in), then come straight back to `returnTo`.
// "compact" = just the two buttons, for narrow side columns.
export default function SignInGate({
  title,
  text,
  returnTo,
  compact = false,
}: {
  title: string;
  text: string;
  returnTo: string;
  compact?: boolean;
}) {
  const next = encodeURIComponent(returnTo);
  return (
    <div>
      <p role="status" className="mb-5 rounded-lg border border-gold-400/40 bg-gold-100px-3 py-2 text-sm font-medium text-navy-900">
        Please{" "}
        <Link href={`/login?next=${next}`} className="underline">sign in</Link>
        {" "}or{" "}
        <Link href={`/register?next=${next}`} className="underline">register</Link>
        {" "}first to continue.
      </p>
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-900 text-gold-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" />
        </svg>
      </span>
      <h2 className="mt-4 text-xl font-bold tracking-tight text-navy-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
        {["Free, takes under a minute", "Track bookings, quotes and payments", "Your details are filled in for you next time"].map((point) => (
          <li key={point} className="flex gap-2">
            <span className="text-gold-500" aria-hidden="true">✓</span>
            {point}
          </li>
        ))}
      </ul>

      {compact ? (
        <div className="mt-6 grid gap-3">
          <Link href={`/register?next=${next}`} className="btn-gold w-full">Create an account</Link>
          <Link href={`/login?next=${next}`} className="btn-outline w-full">I already have an account</Link>
        </div>
      ) : (
        <div className="mt-6 border-t border-slate-200 pt-6">
          <RegisterForm next={returnTo} />
        </div>
      )}
    </div>
  );
}
