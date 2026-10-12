import { NextRequest, NextResponse } from "next/server";

// Name of the cookie the backend sets on login (utils/authentication.ts)
const LOGIN_COOKIE = "login-token";

// Optimistic check for the customer area only: no cookie -> login page.
// The real check happens in app/account/layout.tsx and in every backend route.
// The rest of the website is public.
export function proxy(request: NextRequest) {
  if (!request.cookies.has(LOGIN_COOKIE)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
