import Link from "next/link";
import { DIVISION_LIST } from "@/lib/divisions";
import Logo from "@/components/site/Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-navy-900 to-navy-950 text-white/65">
      <div className="container-page relative grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-6">
            Your trusted travel, gems and trade partner. Global services, local care.
            One platform, six business divisions - Gazellekey International (Pvt) Ltd, Sri Lanka.
          </p>
          <Link href="/contact" className="btn-gold-outline mt-6">Send an enquiry</Link>
        </div>
        <div>
          <h3 className="eyebrow">Divisions</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {DIVISION_LIST.map((division) => (
              <li key={division.key}>
                <Link href={division.href} className="transition hover:text-gold-400">
                  {division.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-gold-400">About us</Link></li>
            <li><Link href="/contact" className="hover:text-gold-400">Contact / Enquiry</Link></li>
            <li><Link href="/appointments" className="hover:text-gold-400">Book an appointment</Link></li>
            <li><Link href="/gallery" className="hover:text-gold-400">Travel gallery</Link></li>
            <li><Link href="/reviews" className="hover:text-gold-400">Customer reviews</Link></li>
            <li><Link href="/account" className="hover:text-gold-400">My account</Link></li>
            <li><Link href="/register" className="hover:text-gold-400">Create an account</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/5 py-6 text-center text-xs text-white/45">
        © {new Date().getFullYear()} Gazellekey International (Pvt) Ltd. All rights reserved.
      </div>
    </footer>
  );
}
