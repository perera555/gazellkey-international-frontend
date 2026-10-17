import Link from "next/link";
import { ADMIN_URL, getSessionUser, isStaff } from "@/lib/session";
import { DIVISION_LIST } from "@/lib/divisions";
import { Division } from "@/lib/types";
import MobileNav from "@/components/site/MobileNav";
import NavBar, { NavDivision } from "@/components/site/NavBar";
import Logo from "@/components/site/Logo";
import UserMenu from "@/components/site/UserMenu";
import CartLink from "@/components/shop/CartLink";

const DIVISION_ICONS: Record<Division, string> = {
  TRAVEL: "flight",
  EVENTS: "event",
  GEMS: "gem",
  VEHICLES: "vehicle",
  IMPORT: "trade",
  EXPORT: "trade",
};

export default async function Header() {
  const user = await getSessionUser();
  const accountLink = user
    ? isStaff(user)
      ? { href: ADMIN_URL, label: "Staff portal" }
      : { href: "/account", label: "My account" }
    : { href: "/login", label: "Sign in" };

  const before = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
  ];
  const after = [
    { href: "/shop", label: "Shop" },
    { href: "/gallery", label: "Gallery", wideOnly: true },
    { href: "/reviews", label: "Reviews", wideOnly: true },
    { href: "/contact", label: "Contact" },
  ];
  const divisions: NavDivision[] = DIVISION_LIST.map((division) => ({
    href: division.href,
    label: division.short,
    name: division.name,
    tagline: division.tagline,
    color: division.color,
    icon: DIVISION_ICONS[division.key],
  }));

  return (
    <>
      {/* Visitor notice: scrolls away; only the main bar below stays on screen */}
      {user == null ? (
        <p className="bg-linear-to-r from-gold-600 via-gold-500 to-gold-600 px-4 py-2 text-center text-xs font-medium text-navy-950 print:hidden">
          Browse freely. To book an appointment, send an enquiry or register for an event, please{" "}
          <Link href="/login" className="font-semibold underline underline-offset-2">sign in</Link> or{" "}
          <Link href="/register" className="font-semibold underline underline-offset-2">register</Link> first.
        </p>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-white/10 print:hidden bg-navy-950/85 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl backdrop-saturate-150">
        <div className="container-wide flex h-20 items-center gap-6 lg:h-24 xl:gap-10 2xl:gap-14">
          {/* Logo on the far left, with room to breathe */}
          <Link href="/" aria-label="Gazellekey home" className="mr-auto shrink-0 py-2 pr-2 xl:mr-0">
            <Logo light />
          </Link>

          <div className="hidden flex-1 justify-center xl:flex">
            <NavBar before={before} after={after} divisions={divisions} />
          </div>

          <div className="flex shrink-0 items-center gap-3 xl:gap-4">
            {/* Book an appointment: main call to action on wide screens
                (smaller screens: Divisions menu and the phone menu) */}
            <Link href="/appointments" className="btn-gold-outline btn-sm hidden px-4 py-2.5 whitespace-nowrap min-[1600px]:inline-flex">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
              </svg>
              Book appointment
            </Link>
            {/* Staff portal (admin): a gold button for signed-in staff,
                a quiet lock button for everyone else */}
            {user && isStaff(user) ? (
              <a href={ADMIN_URL} className="btn-gold btn-sm hidden px-4 py-2.5 sm:inline-flex">
                Staff portal →
              </a>
            ) : (
              <a
                href={ADMIN_URL}
                aria-label="Staff portal"
                title="Staff portal"
                className="hidden h-10 items-center gap-2 rounded-full border border-white/15 px-2.5 text-sm font-medium text-white transition hover:border-gold-500/60 hover:text-gold-400 sm:flex"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <span className="hidden pr-1 min-[1760px]:inline">Staff portal</span>
              </a>
            )}
            <Link
              href="/guide"
              aria-label="User guide"
              title="User guide"
              className="flex h-10 items-center gap-2 rounded-full border border-white/15 px-2.5 text-sm font-medium text-white transition hover:border-gold-500/60 hover:text-gold-400"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.9M12 17h.01" />
              </svg>
              <span className="hidden pr-1 min-[1760px]:inline">Help</span>
            </Link>
            {user == null || !isStaff(user) ? <CartLink /> : null}
            {user ? (
              <UserMenu
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                photoUrl={user.photoUrl}
                accountLink={accountLink}
              />
            ) : (
              // Browsing is open to everyone; an account is only needed to
              // book, enquire or register for events
              <>
                <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white/85 transition hover:text-gold-400 sm:inline-flex">
                  Sign in
                </Link>
                <Link href="/register" className="btn-gold btn-sm px-5 py-2.5">Create account</Link>
              </>
            )}
            <MobileNav links={[...before, ...after]} divisions={divisions} accountLink={accountLink} />
          </div>
        </div>
      </header>
    </>
  );
}
