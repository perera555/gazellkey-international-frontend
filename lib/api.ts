import "server-only";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Pagination } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:3000";

export type ApiResult<T> =
  | { ok: true; data: T; pagination?: Pagination }
  | { ok: false; status: number; message: string };

// Calls a backend route from a server component, passing on the visitor's
// cookie (if any) so signed-in users get their own view. Returns the raw body.
export async function apiFetch(path: string) {
  const cookieStore = await cookies();
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status, ok: response.ok, body: body };
  } catch {
    return {
      status: 0,
      ok: false,
      body: {
        message: `Cannot reach the API at ${API_URL}. Is the backend running?`,
      },
    };
  }
}

// GET a public { data, pagination } route. Errors are returned, not thrown,
// so a page can still render with a friendly message.
export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  const { status, ok, body } = await apiFetch(path);
  if (!ok) {
    return {
      ok: false,
      status: status,
      message: body.message ?? "Something went wrong.",
    };
  }
  return { ok: true, data: body.data, pagination: body.pagination };
}

// Like apiGet, for routes that send more next to "data"
// (the star summary of /api/reviews, the countries of /api/gallery)
export async function apiGetBody<B>(
  path: string,
): Promise<{ ok: true; body: B } | { ok: false; status: number; message: string }> {
  const { status, ok, body } = await apiFetch(path);
  if (!ok) {
    return { ok: false, status: status, message: body.message ?? "Something went wrong." };
  }
  return { ok: true, body: body as B };
}

// GET one catalogue item for a detail page. 404 -> the not-found page.
export async function apiGetItem<T>(path: string): Promise<T> {
  const result = await apiGet<T>(path);
  if (!result.ok) {
    if (result.status == 404 || result.status == 400) {
      notFound();
    }
    throw new Error(result.message);
  }
  return result.data;
}

// GET a customer route (/api/me/...). A 401 sends the user to the login page.
export async function apiGetMine<T>(path: string, returnTo: string): Promise<ApiResult<T>> {
  const result = await apiGet<T>(path);
  if (!result.ok && result.status == 401) {
    redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  }
  return result;
}

// Builds "?a=1&b=2" from page search params, keeping only the given keys
export function toQuery(
  searchParams: Record<string, string | string[] | undefined>,
  keys: string[],
  extra: Record<string, string> = {},
) {
  const query = new URLSearchParams(extra);
  for (const key of keys) {
    const value = searchParams[key];
    if (typeof value == "string" && value.trim() != "") {
      query.set(key, value.trim());
    }
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}
