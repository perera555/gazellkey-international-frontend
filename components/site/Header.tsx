import Link from "next/link";
import { ADMIN_URL, getSessionUser, isStaff } from "@/lib/session";
import { DIVISION_LIST } from "@/lib/divisions";
import MobileNav from "@/components/site/MobileNav";
import Logo from "@/components/site/Logo";

export default async function Header() {
  const user = await getSessionUser();
  const accountLink = user
    ? isStaff(user)
      ? { href: ADMIN_URL, label: "Staff portal" }
      : { href: "/account", label: "My account" }
    : { href: "/login", label: "Sign in" };

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    ...DIVISION_LIST.map((division) => ({
      href: division.href,
      label: division.short,
    })),
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* Thin strip: what we do + account */}
      <div className="hidden border-b border-white/5 bg-navy-950 text-xs text-white/55 sm:block">
        <div className="container-page flex h-9 items-center justify-between gap-4">
          <p className="tracking-wide">
            Travel <span className="text-gold-500/70">|</span> Tours <span className="text-gold-500/70">|</span>{" "}
            Ticketing <span className="text-gold-500/70">|</span> Events <span className="text-gold-500/70">|</span>{" "}
            Gems <span className="text-gold-500/70">|</span> Vehicles <span className="text-gold-500/70">|</span>{" "}
            Import &amp; Export
          </p>
          <div className="flex items-center gap-5">
            <Link href="/appointments" className="font-medium text-gold-400 hover:text-white">
              Book an appointment
            </Link>
            <Link href={accountLink.href} className="font-medium text-white/85 hover:text-gold-400">
              {accountLink.label} →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-white/5 bg-navy-950/95 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <div className="container-page flex h-18 items-center justify-between gap-6">
          <Link href="/" aria-label="Gazellekey home">
            <Logo light />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-lg px-2.5 py-2 text-sm font-medium text-white/85 transition after:absolute after:inset-x-2.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold-400 after:transition hover:text-white hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <Link href="/appointments" className="btn-glass btn-sm hidden px-4 py-2 2xl:inline-flex">
              Book Appointment
            </Link>
            <Link href="/contact" className="btn-gold-outline btn-sm px-4 py-2">
              Send Enquiry
            </Link>
          </div>

          <MobileNav links={links} accountLink={accountLink} />
        </div>
      </div>
    </header>
  );
}
