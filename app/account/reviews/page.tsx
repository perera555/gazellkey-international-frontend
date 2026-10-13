import type { Metadata } from "next";
import Link from "next/link";
import { AccountHeading } from "@/components/account/AccountTable";
import ReviewDelete from "@/components/forms/ReviewDelete";
import ErrorNote from "@/components/site/ErrorNote";
import Pagination from "@/components/site/Pagination";
import Stars from "@/components/site/Stars";
import { apiGetMine, toQuery } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { MyReview } from "@/lib/types";

export const metadata: Metadata = { title: "Reviews" };

export default async function MyReviewsPage({ searchParams }: PageProps<"/account/reviews">) {
  const params = await searchParams;
  const reviews = await apiGetMine<MyReview[]>(
    `/api/me/reviews${toQuery(params, ["pageNumber"], { pageSize: "20" })}`,
    "/account/reviews",
  );

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AccountHeading title="My reviews" text="Reviews you have written about your trips with us." />
        <Link href="/travel#reviews" className="btn-gold">
          Write a review
        </Link>
      </div>

      {!reviews.ok ? (
        <ErrorNote message={reviews.message} />
      ) : reviews.data.length == 0 ? (
        <div className="card px-6 py-12 text-center">
          <p className="text-slate-600">You have not written any reviews yet.</p>
          <Link href="/travel#reviews" className="btn-navy mt-5">
            Share your experience
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {reviews.data.map((review) => (
              <li key={review.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Stars rating={review.rating} />
                    {review.title ? <p className="mt-2 font-semibold text-navy-900">{review.title}</p> : null}
                  </div>
                  {review.status == "PUBLISHED" ? (
                    <span className="badge bg-green-100 text-green-800">Live on the website</span>
                  ) : (
                    <span className="badge bg-red-100 text-red-800">Removed</span>
                  )}
                </div>
                <p className="mt-2 text-sm whitespace-pre-line text-slate-700">{review.body}</p>
                {review.status == "HIDDEN" ? (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                    Our team removed this review from the website
                    {review.removedReason ? `: ${review.removedReason}` : "."}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>
                    {review.tour ? (
                      <>
                        <Link href={`/travel/${review.tour.slug}`} className="font-semibold text-navy-700 hover:underline">
                          {review.tour.title}
                        </Link>{" "}
                        ·{" "}
                      </>
                    ) : null}
                    Posted {formatDate(review.createdAt)}
                  </span>
                  <ReviewDelete reviewId={review.id} />
                </div>
              </li>
            ))}
          </ul>
          <Pagination pagination={reviews.pagination} basePath="/account/reviews" searchParams={params} />
        </>
      )}
    </>
  );
}
