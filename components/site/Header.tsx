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
      {/* Navy strip: what we do + account */}
      <div className="hidden bg-navy-950 text-xs text-white/75 sm:block">
        <div className="container-page flex h-9 items-center justify-between gap-4">
          <p className="tracking-wide">
            Travel <span className="text-gold-500">|</span> Tours <span className="text-gold-500">|</span>{" "}
            Ticketing <span className="text-gold-500">|</span> Events <span className="text-gold-500">|</span>{" "}
            Gems <span className="text-gold-500">|</span> Vehicles <span className="text-gold-500">|</span>{" "}
            Import &amp; Export
          </p>
          <Link href={accountLink.href} className="font-medium text-white hover:text-gold-400">
            {accountLink.label} →
          </Link>
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white/90 shadow-[0_10px_30px_-18px_rgba(11,37,69,0.35)] backdrop-blur-xl">
        <div className="container-page flex h-20 items-center justify-between gap-6">
          <Link href="/" aria-label="Gazellekey home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-lg px-2.5 py-2 text-sm font-medium text-navy-900 transition after:absolute after:inset-x-2.5 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gold-500 after:transition hover:text-navy-700 hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <Link href="/contact" className="btn-gold btn-sm px-4 py-2">
              Send Enquiry
            </Link>
          </div>

          <MobileNav links={links} accountLink={accountLink} />
        </div>
      </div>
    </header>
  );
}
