import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { SessionUser } from "@/lib/types";

export const STAFF_ROLES = ["STAFF", "FINANCE", "ADMIN"];

// Staff work in the separate admin project
export const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001";

export function isStaff(user: SessionUser) {
  return STAFF_ROLES.includes(user.role);
}

// Signed-in user, read once per request from GET /api/auth/me.
// null for visitors (or when the backend is down).
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const { ok, body } = await apiFetch("/api/auth/me");
  return ok ? body.user : null;
});

// The customer area calls this. Visitors go to the login page,
// staff go to the admin portal.
export async function requireCustomer(returnTo: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (user == null) {
    redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  }
  if (isStaff(user)) {
    redirect(ADMIN_URL);
  }
  return user;
}
