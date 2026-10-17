"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SHOP_SORTS } from "@/lib/shop";

// Sort dropdown of the Shop page: changes ?sort= and goes back to page 1
export default function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function change(value: string) {
    const query = new URLSearchParams(searchParams.toString());
    query.delete("pageNumber");
    if (value == "featured") {
      query.delete("sort");
    } else {
      query.set("sort", value);
    }
    const text = query.toString();
    router.push(text ? `${pathname}?${text}` : pathname, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-slate-500">
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={current}
        onChange={(event) => change(event.target.value)}
        className="rounded-full border border-slate-200 bg-white py-2 pr-9 pl-4 text-sm font-semibold text-navy-900 shadow-sm focus:border-gold-500 focus:outline-none"
      >
        {SHOP_SORTS.map((sort) => (
          <option key={sort.value} value={sort.value}>
            {sort.label}
          </option>
        ))}
      </select>
    </label>
  );
}
