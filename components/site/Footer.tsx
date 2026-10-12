import Link from "next/link";
import { DIVISION_LIST } from "@/lib/divisions";
import Logo from "@/components/site/Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/70">
      <div className="flex h-1.5">
        {DIVISION_LIST.map((division) => (
          <span key={division.key} className="flex-1" style={{ background: division.color }} />
        ))}
      </div>
      <div className="grid-floor opacity-40" aria-hidden="true" />
      <div className="container-page relative grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-6">
            Your trusted travel, gems and trade partner. Global services, local care.
            One platform, six business divisions - Gazellekey International (Pvt) Ltd, Sri Lanka.
          </p>
          <Link href="/contact" className="btn-gold mt-6">Send an enquiry</Link>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Divisions</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {DIVISION_LIST.map((division) => (
              <li key={division.key}>
                <Link href={division.href} className="flex items-center gap-2 hover:text-gold-400">
                  <span className="h-2 w-2 rounded-full" style={{ background: division.color }} />
                  {division.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-gold-400">About us</Link></li>
            <li><Link href="/contact" className="hover:text-gold-400">Contact / Enquiry</Link></li>
            <li><Link href="/account" className="hover:text-gold-400">My account</Link></li>
            <li><Link href="/register" className="hover:text-gold-400">Create an account</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} Gazellekey International (Pvt) Ltd. All rights reserved.
      </div>
    </footer>
  );
}
