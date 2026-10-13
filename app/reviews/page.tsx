import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/site/EmptyState";
import ErrorNote from "@/components/site/ErrorNote";
import { ChipNav } from "@/components/site/FilterTabs";
import PageHero from "@/components/site/PageHero";
import Pagination from "@/components/site/Pagination";
import { ReviewCard } from "@/components/site/ReviewsSection";
import Stars from "@/components/site/Stars";
import { apiGetBody, toQuery } from "@/lib/api";
import { param } from "@/lib/format";
import { Pagination as PageInfo, Review, ReviewSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "Customer reviews",
  description: "What customers say about travelling with Gazellekey International.",
};

type ReviewsBody = { data: Review[]; summary: ReviewSummary; pagination: PageInfo };

const SORTS = [
  { value: "", label: "Newest" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

// /reviews?division=TRAVEL&tourId=...&rating=5&sort=highest
export default async function ReviewsPage({ searchParams }: PageProps<"/reviews">) {
  const params = await searchParams;
  const keys = ["division", "tourId", "rating", "sort"];
  const result = await apiGetBody<ReviewsBody>(
    `/api/reviews${toQuery(params, [...keys, "pageNumber"], { pageSize: "12" })}`,
  );

  // link that changes one filter and keeps the others (page back to 1)
  function hrefWith(key: string, value: string) {
    const query = new URLSearchParams();
    for (const name of keys) {
      const current = name == key ? value : param(params[name]);
      if (current) query.set(name, current);
    }
    const text = query.toString();
    return text ? `/reviews?${text}` : "/reviews";
  }

  const rating = param(params.rating) ?? "";
  const sort = param(params.sort) ?? "";

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="What our customers say"
        text="Every review is written by a signed-in Gazellekey customer."
        image="/images/travel-maldives.jpg"
      />

      <section className="bg-linear-to-b from-navy-50 to-white">
        <div className="container-page py-14">
          {!result.ok ? (
            <ErrorNote message={result.message} />
          ) : (
            <>
              <div className="card flex flex-wrap items-center justify-between gap-6 p-6">
                <div className="flex items-center gap-5">
                  <p className="font-display text-5xl font-semibold text-navy-900">
                    {result.body.summary.average?.toFixed(1) ?? "-"}
                  </p>
                  <div>
                    <Stars rating={result.body.summary.average ?? 0} size={20} />
                    <p className="mt-1 text-sm text-slate-500">
                      {result.body.summary.count} review{result.body.summary.count == 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <Link href="/travel#reviews" className="btn-gold btn-sm">
                  Write a review
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <ChipNav
                  chips={[
                    { href: hrefWith("rating", ""), label: "All stars", active: rating == "" },
                    ...[5, 4, 3, 2, 1].map((stars) => ({
                      href: hrefWith("rating", String(stars)),
                      label: `${stars} ★`,
                      active: rating == String(stars),
                    })),
                  ]}
                />
                <ChipNav
                  chips={SORTS.map((option) => ({
                    href: hrefWith("sort", option.value),
                    label: option.label,
                    active: sort == option.value,
                  }))}
                />
              </div>

              <div className="mt-8">
                {result.body.data.length == 0 ? (
                  <EmptyState title="No reviews found" text="Try another star filter." />
                ) : (
                  <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {result.body.data.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </ul>
                )}
              </div>
              <Pagination pagination={result.body.pagination} basePath="/reviews" searchParams={params} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
