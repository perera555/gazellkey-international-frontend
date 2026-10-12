"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";

// FR-EVT-03 / FR-EVT-07: registration with one or more participants
export default function EventRegistrationForm({
  eventId,
  seatsLeft,
  feeLabel,
  prefill,
}: {
  eventId: string;
  seatsLeft: number | null;
  feeLabel?: string;
  prefill?: { firstName?: string; lastName?: string; email?: string };
}) {
  const router = useRouter();
  const [participants, setParticipants] = useState([""]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ reference: string; message: string } | null>(null);

  const maxSeats = seatsLeft == null ? 50 : Math.min(seatsLeft, 50);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSending(true);
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim() || undefined;

    const result = await apiRequest<{ reference: string }>(
      "POST",
      `/api/events/${eventId}/registrations`,
      {
        firstName: value("firstName"),
        lastName: value("lastName"),
        companyName: value("companyName"),
        email: value("email"),
        phone: value("phone"),
        participants: participants.map((fullName) => ({ fullName: fullName.trim() })),
        notes: value("notes"),
      },
    );
    setSending(false);
    if (result.ok) {
      setDone({ reference: result.data.reference, message: result.data.message ?? "Registered" });
      router.refresh(); // update "seats left"
    } else {
      setError(result.data.message ?? "Registration failed.");
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-900">{done.message}</p>
        <p className="mt-2 text-sm text-emerald-800">
          Reference <span className="font-mono font-semibold">{done.reference}</span>. A
          confirmation was sent to your email.
        </p>
      </div>
    );
  }

  if (seatsLeft != null && seatsLeft <= 0) {
    return (
      <p className="rounded-xl bg-slate-100 p-5 text-sm text-slate-700">
        This event is fully booked. Send us an enquiry to join the waiting list.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="firstName">First name *</label>
          <input id="firstName" name="firstName" required maxLength={100} className="input" defaultValue={prefill?.firstName} />
        </div>
        <div>
          <label className="label" htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" maxLength={100} className="input" defaultValue={prefill?.lastName} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required className="input" defaultValue={prefill?.email} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" maxLength={30} className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="companyName">Company (optional)</label>
          <input id="companyName" name="companyName" maxLength={200} className="input" />
        </div>
      </div>

      <fieldset>
        <legend className="label">
          Participants ({participants.length} seat{participants.length > 1 ? "s" : ""})
        </legend>
        <div className="space-y-2">
          {participants.map((name, index) => (
            <div key={index} className="flex gap-2">
              <input
                required
                maxLength={200}
                aria-label={`Participant ${index + 1} full name`}
                placeholder={`Participant ${index + 1} full name`}
                className="input"
                value={name}
                onChange={(event) =>
                  setParticipants(participants.map((p, i) => (i == index ? event.target.value : p)))
                }
              />
              {participants.length > 1 ? (
                <button
                  type="button"
                  className="btn-outline btn-sm"
                  onClick={() => setParticipants(participants.filter((_, i) => i != index))}
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
        </div>
        {participants.length < maxSeats ? (
          <button
            type="button"
            className="mt-2 text-sm font-medium text-navy-700 hover:underline"
            onClick={() => setParticipants([...participants, ""])}
          >
            + Add another participant
          </button>
        ) : null}
      </fieldset>

      <div>
        <label className="label" htmlFor="notes">Notes</label>
        <textarea id="notes" name="notes" rows={2} maxLength={2000} className="input" />
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
      ) : null}

      <button type="submit" disabled={sending} className="btn-gold w-full">
        {sending ? "Registering..." : `Register${feeLabel ? ` - ${feeLabel} per seat` : " (free)"}`}
      </button>
    </form>
  );
}
