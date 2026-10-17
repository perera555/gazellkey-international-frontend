import Link from "next/link";
import { apiGet } from "@/lib/api";
import { formatDate, priceLabel } from "@/lib/format";
import { Tour } from "@/lib/types";

// The four great places (Sathara Maha Sthana) and the other sacred sites of the tour
const GREAT_PLACES = [
  { name: "Lumbini", text: "Birth of the Buddha", country: "Nepal" },
  { name: "Bodh Gaya", text: "The Enlightenment", country: "India" },
  { name: "Sarnath", text: "The First Sermon", country: "India" },
  { name: "Kushinagar", text: "The Parinibbana", country: "India" },
];
const OTHER_SITES = ["Rajgir", "Nalanda", "Vaishali", "Kesariya", "Kapilavastu", "Sravasti (Jetavanaramaya)", "Varanasi", "Delhi"];

// "Dambadiva pilgrimage" block on the Travel page. Lists every published tour
// whose title or destination says Dambadiva (staff add more in the admin portal).
export default async function DambadivaSection() {
  const result = await apiGet<Tour[]>("/api/travel/tours?search=dambadiva&pageSize=6&status=PUBLISHED");
  const tours = result.ok ? result.data : [];
  const main = tours.find((tour) => tour.durationDays == 14) ?? tours[0];
  const upcoming = (main?.departureDates ?? [])
    .filter((date) => new Date(date) >= new Date(new Date().toDateString()))
    .slice(0, 4);

  const enquiryHref = `/contact?${new URLSearchParams({
    division: "TRAVEL",
    service: "OUTBOUND_TOUR",
    subject: "Dambadiva pilgrimage - group / family booking",
  })}#enquiry`;

  return (
    <section id="dambadiva" className="relative scroll-mt-28 overflow-hidden bg-linear-to-br from-[#3b1d0a] via-navy-950 to-navy-950 py-20 text-white">
      <div className="grid-floor opacity-40" aria-hidden="true" />
      <div className="container-page relative grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow text-gold-400">Pilgrimage tours</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Dambadiva Vandana <span className="text-gold-gradient">Pilgrimage</span>
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            Worship at the sacred places of the Buddha in India and Nepal, with an experienced Sri Lankan guide,
            Sri Lankan vegetarian meals and time for pooja and meditation at every site.
          </p>

          <h3 className="mt-8 text-sm font-semibold tracking-wide text-white/60 uppercase">The four great places</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {GREAT_PLACES.map((place, index) => (
              <li key={place.name} className="glass flex items-center gap-3 rounded-2xl p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-500 font-bold text-navy-950">{index + 1}</span>
                <span>
                  <span className="block font-semibold">{place.name}</span>
                  <span className="block text-xs text-white/60">{place.text} · {place.country}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-white/60">
            Also: {OTHER_SITES.join(" · ")}
          </p>
        </div>

        <div className="space-y-4">
          {main ? (
            <div className="rounded-3xl border border-gold-500/40 bg-white p-6 text-navy-900 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-8">
              <span className="badge bg-gold-100 text-navy-900">{main.durationDays}-day package</span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-navy-950">{main.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{main.summary}</p>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-navy-50 p-3">
                  <dt className="text-xs text-slate-500">Duration</dt>
                  <dd className="font-semibold">{main.durationDays} days</dd>
                </div>
                <div className="rounded-xl bg-navy-50 p-3">
                  <dt className="text-xs text-slate-500">Price</dt>
                  <dd className="font-semibold">{priceLabel(main)}</dd>
                </div>
                {main.minGroupSize || main.maxGroupSize ? (
                  <div className="rounded-xl bg-navy-50 p-3">
                    <dt className="text-xs text-slate-500">Group size</dt>
                    <dd className="font-semibold">{[main.minGroupSize, main.maxGroupSize].filter(Boolean).join(" - ")} pilgrims</dd>
                  </div>
                ) : null}
                <div className="rounded-xl bg-navy-50 p-3">
                  <dt className="text-xs text-slate-500">Meals</dt>
                  <dd className="font-semibold">Sri Lankan vegetarian</dd>
                </div>
              </dl>
              {upcoming.length > 0 ? (
                <div className="mt-5">
                  <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Next departures</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {upcoming.map((date) => (
                      <li key={date} className="badge bg-gold-100 text-navy-900">{formatDate(date)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/travel/${main.slug}`} className="btn-gold">View {main.durationDays}-day itinerary</Link>
                <Link href={enquiryHref} className="btn-outline">Group / family booking</Link>
              </div>
            </div>
          ) : (
            <div className="glass rounded-3xl p-8">
              <h3 className="text-xl font-semibold">New pilgrimage dates coming soon</h3>
              <p className="mt-2 text-sm text-white/70">Tell us when you would like to travel and how many pilgrims are in your group.</p>
              <Link href={enquiryHref} className="btn-gold mt-5">Ask about Dambadiva tours</Link>
            </div>
          )}

          {tours.length > 1 ? (
            <ul className="space-y-2">
              {tours.filter((tour) => tour.id != main?.id).map((tour) => (
                <li key={tour.id}>
                  <Link href={`/travel/${tour.slug}`} className="glass flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm hover:border-gold-500/50">
                    <span className="font-semibold">{tour.title}</span>
                    <span className="shrink-0 text-white/60">{tour.durationDays} days · {priceLabel(tour)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
