import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/social";

// /sitemap.xml - every public page, so search engines find them all. Built from
// the live catalogue, so new tours and products appear here by themselves.

const API_URL = process.env.API_URL ?? "http://localhost:3000";

// Main pages, with how often they change and how important they are
const PAGES: [path: string, change: "daily" | "weekly" | "monthly", priority: number][] = [
  ["/", "daily", 1],
  ["/travel", "weekly", 0.9],
  ["/shop", "daily", 0.9],
  ["/rentals", "weekly", 0.9],
  ["/jobs", "daily", 0.9],
  ["/fertilizer", "weekly", 0.9],
  ["/import", "weekly", 0.8],
  ["/export", "weekly", 0.8],
  ["/gems", "weekly", 0.8],
  ["/vehicles", "weekly", 0.8],
  ["/events", "weekly", 0.8],
  ["/hotels", "weekly", 0.7],
  ["/appointments", "monthly", 0.7],
  ["/gallery", "weekly", 0.6],
  ["/reviews", "weekly", 0.6],
  ["/about", "monthly", 0.6],
  ["/team", "monthly", 0.5],
  ["/contact", "monthly", 0.6],
  ["/guide", "monthly", 0.4],
];

type Listed = { slug?: string; sku?: string; updatedAt?: string };

// All published items of one catalogue list (public API, a few pages at most)
async function listAll(path: string, key: "slug" | "sku"): Promise<{ id: string; updatedAt?: string }[]> {
  const items: { id: string; updatedAt?: string }[] = [];
  for (let page = 1; page <= 20; page++) {
    try {
      const separator = path.includes("?") ? "&" : "?";
      const response = await fetch(`${API_URL}${path}${separator}pageSize=100&pageNumber=${page}`, {
        next: { revalidate: 3600 }, // rebuilt at most once an hour
      });
      if (!response.ok) {
        break;
      }
      const body = (await response.json()) as { data: Listed[]; pagination?: { totalPages: number } };
      for (const item of body.data) {
        const id = item[key];
        if (id) {
          items.push({ id: id, updatedAt: item.updatedAt });
        }
      }
      if (!body.pagination || page >= body.pagination.totalPages) {
        break;
      }
    } catch {
      break; // API down: the sitemap still lists the main pages
    }
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lists: [base: string, path: string, key: "slug" | "sku"][] = [
    ["/travel", "/api/travel/tours", "slug"],
    ["/hotels", "/api/travel/hotels", "slug"],
    ["/events", "/api/events", "slug"],
    ["/gems", "/api/gems", "sku"],
    ["/vehicles", "/api/vehicles", "sku"],
    ["/import", "/api/trade/products?direction=IMPORT", "sku"],
    ["/export", "/api/trade/products?direction=EXPORT", "sku"],
    ["/shop", "/api/shop/products", "sku"],
    ["/jobs", "/api/jobs/vacancies?view=public", "slug"],
  ];
  const detail = await Promise.all(
    lists.map(async ([base, path, key]) =>
      (await listAll(path, key)).map((item) => ({
        url: `${SITE_URL}${base}/${encodeURIComponent(item.id)}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ),
  );

  return [
    ...PAGES.map(([path, change, priority]) => ({
      url: `${SITE_URL}${path == "/" ? "" : path}`,
      changeFrequency: change,
      priority: priority,
    })),
    ...detail.flat(),
  ];
}
