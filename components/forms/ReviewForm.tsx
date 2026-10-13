"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "@/components/site/Stars";
import { apiRequest } from "@/lib/api-client";
import { Division } from "@/lib/types";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

// Signed-in customer writes a review (POST /api/reviews). It appears at once.
export default function ReviewForm({
  division = "TRAVEL",
  tourId,
  tourTitle,
}: {
  division?: Division;
  tourId?: string;
  tourTitle?: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (rating == 0) {
      setError("Please choose a star rating.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const value = (name: string) => {
      const text = String(form.get(name) ?? "").trim();
      return text == "" ? undefined : text;
    };
    const month = value("tripDate"); // "2026-08"

    setSending(true);
    const result = await apiRequest("POST", "/api/reviews", {
      division: division,
      tourId: tourId,
      rating: rating,
      title: value("title"),
      body: value("body"),
      tripDate: month ? `${month}-01` : undefined,
      website: value("website"), // honeypot
    });
    setSending(false);

    if (!result.ok) {
      setError(result.data.message ?? "Could not post your review.");
      return;
    }
    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-900">Thank you for your review!</p>
        <p className="mt-1 text-sm text-emerald-800">It is now live on our website.</p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {tourTitle ? <p className="text-sm text-slate-600">Your review of <strong>{tourTitle}</strong></p> : null}
      <div>
        <span className="label">Your rating *</span>
        <div className="flex items-center gap-3">
          <div className="flex gap-1" role="radiogroup" aria-label="Star rating" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating == star}
                aria-label={`${star} star${star > 1 ? "s" : ""} - ${LABELS[star]}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                className="rounded-md p-0.5 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-gold-500"
              >
                <Star size={32} fill={star <= shown ? 1 : 0} />
              </button>
            ))}
          </div>
          <span className="text-sm font-semibold text-navy-900">{LABELS[shown]}</span>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="review-title">Headline</label>
        <input id="review-title" name="title" maxLength={120} className="input" placeholder="e.g. A perfect family holiday" />
      </div>
      <div>
        <label className="label" htmlFor="review-body">Your review *</label>
        <textarea
          id="review-body"
          name="body"
          required
          minLength={10}
          maxLength={3000}
          rows={4}
          className="input"
          placeholder="What did you enjoy? How was our team?"
        />
      </div>
      <div className="sm:w-56">
        <label className="label" htmlFor="review-trip">When did you travel?</label>
        <input id="review-trip" name="tripDate" type="month" className="input" />
      </div>

      {/* honeypot: hidden from people, bots fill it in */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="review-website">Website</label>
        <input id="review-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={sending} className="btn-gold">
        {sending ? "Posting..." : "Post review"}
      </button>
    </form>
  );
}
