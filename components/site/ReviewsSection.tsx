import Link from "next/link";
import ReviewForm from "@/components/forms/ReviewForm";
import Stars from "@/components/site/Stars";
import { apiGetBody } from "@/lib/api";
import { getSessionUser, isStaff } from "@/lib/session";
import { Division, Review, ReviewSummary } from "@/lib/types";

type ReviewsBody = { data: Review[]; summary: ReviewSummary };

// Star summary + latest reviews + "write a review" (signed-in customers).
// With tourId it shows only that tour's reviews.
export default async function ReviewsSection({
  division = "TRAVEL",
  tourId,
  tourTitle,
  heading = "What our travellers say",
  text = "Real reviews from Gazellekey customers.",
  returnTo,
  limit = 6,
}: {
  division?: Division;
  tourId?: string;
  tourTitle?: string;
  heading?: string;
  text?: string;
  returnTo: string; // page to come back to after signing in
  limit?: number;
}) {
  const scope = tourId ? `tourId=${tourId}` : `division=${division}`;
  const [result, user] = await Promise.all([
    apiGetBody<ReviewsBody>(`/api/reviews?${scope}&pageSize=${limit}`),
    getSessionUser(),
  ]);
  if (!result.ok) {
    return null; // reviews are extra - never break the page
  }
  const { data: reviews, summary } = result.body;
  const allHref = `/reviews${tourId ? `?tourId=${tourId}` : `?division=${division}`}`;

  return (
    <section id="reviews" className="reveal scroll-mt-32 bg-linear-to-b from-white to-navy-50 py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl">{heading}</h2>
            <p className="mt-3 max-w-2xl text-slate-500">{text}</p>
          </div>
          {summary.count > reviews.length ? (
            <Link href={allHref} className="btn-outline btn-sm shrink-0">
              All {summary.count} reviews
            </Link>
          ) : null}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[22rem_1fr]">
          {/* Summary + write a review */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-navy-900 to-navy-950 p-7 text-white shadow-[0_30px_60px_-30px_rgba(6,11,26,0.8)]">
              <div className="grid-floor opacity-40" aria-hidden="true" />
              <div className="relative">
                {summary.count > 0 ? (
                  <>
                    <p className="font-display text-6xl font-semibold text-gold-400">
                      {summary.average?.toFixed(1)}
                      <span className="text-2xl text-white/50"> / 5</span>
                    </p>
                    <Stars rating={summary.average ?? 0} size={22} className="mt-2" />
                    <p className="mt-2 text-sm text-white/70">
                      Based on {summary.count} review{summary.count == 1 ? "" : "s"}
                    </p>
                    <ul className="mt-6 space-y-2">
                      {summary.stars.map((row) => (
                        <li key={row.stars}>
                          <Link
                            href={`${allHref}&rating=${row.stars}`}
                            className="flex items-center gap-3 text-sm text-white/80 hover:text-white"
                          >
                            <span className="w-12 shrink-0">{row.stars} star</span>
                            <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                              <span
                                className="block h-full rounded-full bg-linear-to-r from-gold-400 to-gold-500"
                                style={{ width: `${summary.count ? (row.count / summary.count) * 100 : 0}%` }}
                              />
                            </span>
                            <span className="w-6 shrink-0 text-right text-white/60">{row.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <Stars rating={0} size={22} />
                    <p className="mt-3 font-display text-2xl">No reviews yet</p>
                    <p className="mt-1 text-sm text-white/70">Travelled with us? Be the first to share your experience.</p>
                  </>
                )}
              </div>
            </div>

            <div className="card p-6">
              {user == null ? (
                <>
                  <h3 className="font-semibold text-navy-900">Travelled with us?</h3>
                  <p className="mt-1 text-sm text-slate-600">Sign in to your account to write a review.</p>
                  <Link
                    href={`/login?next=${encodeURIComponent(`${returnTo}#reviews`)}`}
                    className="btn-gold btn-sm mt-4"
                  >
                    Sign in to review
                  </Link>
                </>
              ) : isStaff(user) ? (
                <p className="text-sm text-slate-600">
                  You are signed in as staff. Reviews are written by customers and managed in the admin portal.
                </p>
              ) : (
                <details className="group" open={summary.count == 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-navy-900">
                    Write a review
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-50 transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-4">
                    <ReviewForm division={division} tourId={tourId} tourTitle={tourTitle} />
                  </div>
                </details>
              )}
            </div>
          </aside>

          {/* Review cards */}
          {reviews.length == 0 ? (
            <div className="card grid place-items-center p-10 text-center">
              <div>
                <QuoteMark className="mx-auto h-10 w-10 text-gold-400" />
                <p className="mt-4 font-display text-2xl text-navy-900">Your story could be here</p>
                <p className="mt-2 text-sm text-slate-500">Reviews from our customers appear here as soon as they are posted.</p>
              </div>
            </div>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} showTour={!tourId} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export function ReviewCard({ review, showTour = true }: { review: Review; showTour?: boolean }) {
  const initials = review.author
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const trip = review.tripDate
    ? new Date(review.tripDate).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
    : null;

  return (
    <li className="card group relative flex flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_50px_-30px_rgba(11,37,69,0.5)]">
      <QuoteMark className="absolute top-5 right-5 h-9 w-9 text-gold-100 transition group-hover:text-gold-400/40" />
      <Stars rating={review.rating} />
      {review.title ? <h3 className="mt-3 pr-10 font-semibold text-navy-900">{review.title}</h3> : null}
      <p className="mt-2 line-clamp-6 text-sm leading-6 whitespace-pre-line text-slate-600">{review.body}</p>
      {showTour && review.tour ? (
        <Link href={`/travel/${review.tour.slug}`} className="mt-3 text-xs font-semibold text-navy-700 hover:underline">
          Tour: {review.tour.title}
        </Link>
      ) : null}
      <div className="mt-auto flex items-center gap-3 pt-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-gold-400 to-gold-600 text-sm font-bold text-navy-950 shadow-[0_3px_0_var(--color-gold-600)]">
          {initials}
        </span>
        <span className="min-w-0 text-sm">
          <span className="block font-semibold text-navy-900">{review.author}</span>
          <span className="block truncate text-xs text-slate-500">
            {[review.country, trip ? `Travelled ${trip}` : null].filter(Boolean).join(" · ") ||
              new Date(review.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </span>
        </span>
      </div>
    </li>
  );
}

function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 8c-4.4 1.6-7 5.3-7 10v6h8v-8h-4c0-2.6 1.5-4.7 4-5.8L13 8Zm13 0c-4.4 1.6-7 5.3-7 10v6h8v-8h-4c0-2.6 1.5-4.7 4-5.8L26 8Z" />
    </svg>
  );
}
