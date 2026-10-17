import { NextRequest, NextResponse } from "next/server";

// Name of the cookie the backend sets on login (utils/authentication.ts)
const LOGIN_COOKIE = "login-token";

// Anyone can browse the website. Only the customer area needs an account:
// visitors without a login cookie go to the sign-in page, then come back.
// Booking / enquiry forms on public pages show a sign-in gate instead
// (components/site/SignInGate.tsx). This is an optimistic cookie check; the
// real check happens in app/account/layout.tsx and in every backend route.
export function proxy(request: NextRequest) {
  if (request.cookies.has(LOGIN_COOKIE)) {
    return NextResponse.next();
  }
  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/account/:path*"],
};
