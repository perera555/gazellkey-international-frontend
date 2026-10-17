import Link from "next/link";
import { Pagination } from "@/lib/types";

// 1 … 4 5 [6] 7 8 … 20 - page numbers around the current page
function pageList(current: number, total: number) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const list: (number | "gap")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      list.push("gap");
    }
    list.push(page);
  });
  return list;
}

// Numbered page links that keep the current filters
export default function ShopPagination({
  pagination,
  basePath,
  searchParams,
}: {
  pagination?: Pagination;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (pagination == undefined || pagination.totalPages <= 1) {
    return null;
  }
  const { pageNumber, totalPages } = pagination;

  function href(page: number) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value == "string" && key != "pageNumber") {
        query.set(key, value);
      }
    }
    if (page > 1) {
      query.set("pageNumber", String(page));
    }
    const text = query.toString();
    return text ? `${basePath}?${text}` : basePath;
  }

  const arrow = "grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-navy-900 transition hover:border-gold-500/60";

  return (
    <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-1.5">
      {pageNumber > 1 ? (
        <Link href={href(pageNumber - 1)} className={arrow} aria-label="Previous page">
          ‹
        </Link>
      ) : null}
      {pageList(pageNumber, totalPages).map((page, index) =>
        page == "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            aria-current={page == pageNumber ? "page" : undefined}
            className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold transition ${
              page == pageNumber
                ? "bg-navy-950 text-gold-400"
                : "border border-slate-200 bg-white text-navy-900 hover:border-gold-500/60"
            }`}
          >
            {page}
          </Link>
        ),
      )}
      {pageNumber < totalPages ? (
        <Link href={href(pageNumber + 1)} className={arrow} aria-label="Next page">
          ›
        </Link>
      ) : null}
    </nav>
  );
}
