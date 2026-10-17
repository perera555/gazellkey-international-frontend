import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import PageHero from "@/components/site/PageHero";
import PrintButton from "@/components/site/PrintButton";

export const metadata: Metadata = {
  title: "User guide",
  description:
    "How to use the Gazellekey website: create an account, send enquiries, book appointments, accept quotations, shop online, pay, upload documents and more.",
};

type Section = {
  id: string;
  title: string;
  icon: string; // svg path
  intro: string;
  steps?: ReactNode[];
  tips?: string[];
  needsAccount?: boolean;
};

const SECTIONS: Section[] = [
  {
    id: "start",
    title: "Getting started",
    icon: "M12 3l9 4.5v9L12 21l-9-4.5v-9zM12 12l9-4.5M12 12v9M12 12L3 7.5",
    intro:
      "Gazellekey International brings six divisions together on one website: Travel, Events, Gems & Jewellery, Vehicles & Machinery, Import and Export. Anyone can look around - no account needed.",
    steps: [
      <>Browse tours, events, gems, vehicles and trade products, the <Link href="/gallery">gallery</Link> and <Link href="/reviews">customer reviews</Link> freely.</>,
      <>To <b>send an enquiry, book an appointment, register for an event or buy online</b>, create a free account first. The website shows you a sign-in box in those places.</>,
      <>After signing up you come straight back to the page you were on, with your choices kept.</>,
    ],
  },
  {
    id: "account",
    title: "Create an account and sign in",
    icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
    intro: "Your account keeps all your enquiries, bookings, payments and documents in one place.",
    steps: [
      <>Click <b>Create account</b> (top right), or go to <Link href="/register">Create an account</Link>.</>,
      <>Enter your name, email, phone (optional) and a password - or click <b>Sign up with Google</b> to use your Google account.</>,
      <>You are signed in straight away. Next time, use <Link href="/login">Sign in</Link> with the same email and password, or <b>Continue with Google</b>.</>,
      <>When you are signed in, your photo and a green <b>Online</b> dot appear in the top right. Click it for your account menu and <b>Sign out</b>.</>,
    ],
    tips: [
      "Used our enquiry form before you had an account? Register with the same email and we link your earlier enquiries to it.",
      "Forgot your password? Contact us and our team will help you get back in.",
    ],
  },
  {
    id: "navigate",
    title: "Finding your way around",
    icon: "M3 12h18M3 6h18M3 18h12",
    intro: "The menu at the top is the same on every page.",
    steps: [
      <><b>Divisions</b> opens a panel with all six divisions. Click one to see its services, catalogue and prices.</>,
      <>The <b>search box on the home page</b> has tabs for Flights, Tours, Hotels, Gems and Trade. Fill it in and we take you to the right list or a ready-made enquiry.</>,
      <>On a phone, tap the <b>menu button</b> (three lines, top right) to open the full menu.</>,
      <>Click any item (a tour, a gem, a vehicle ...) to open its page with photos, details, price and an enquiry box.</>,
    ],
  },
  {
    id: "enquiry",
    title: "Send an enquiry",
    icon: "M4 5h16v11H8l-4 4zM8 9h8M8 12h5",
    needsAccount: true,
    intro: "An enquiry is the quickest way to ask for a price, options or advice.",
    steps: [
      <>Use the <b>Enquire</b> / <b>Request a quote</b> box on any item page, the enquiry form at the bottom of each division page, or the <Link href="/contact">Contact</Link> page.</>,
      "Choose the service, write what you need (dates, quantities, questions) and send it.",
      "You get an email with your enquiry reference. A specialist from the right division contacts you, usually within one working day.",
      <>Follow every enquiry under <Link href="/account/enquiries">My account → Enquiries</Link>.</>,
    ],
  },
  {
    id: "appointment",
    title: "Book an appointment",
    icon: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
    needsAccount: true,
    intro: "Meet a specialist at our office, or let us call you by phone or video. It is free.",
    steps: [
      <>Open <Link href="/appointments">Book an appointment</Link> (top of every page).</>,
      "Pick the division and service, a free day and time, and how you want to meet.",
      "Our team confirms the time by email - usually within a few hours. Add it to your Google Calendar with one click.",
      <>See, or cancel, your bookings under <Link href="/account/appointments">My account → Appointments</Link>.</>,
    ],
    tips: ["All times are Sri Lanka time (GMT+5:30). We are open Monday to Saturday, 9:00 - 17:00."],
  },
  {
    id: "quotation",
    title: "Quotations: accept, decline or ask for changes",
    icon: "M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6",
    needsAccount: true,
    intro: "After an enquiry, we send you a quotation with the full price.",
    steps: [
      <>Open <Link href="/account/quotations">My account → Quotations</Link>.</>,
      <><b>Accept</b> it to confirm - we create your booking or order straight away.</>,
      <>Want something different? Write a note and click <b>Request changes</b>. We send you a new quotation.</>,
      <>Not for you? Click <b>Decline</b>.</>,
    ],
  },
  {
    id: "shop",
    title: "Buy online",
    icon: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2M10 20h.01M17 20h.01",
    needsAccount: true,
    intro: "Items with a fixed price (for example gems, parts or trade products) can be bought online.",
    steps: [
      <>On the item page, click <b>Add to cart</b>. The cart icon at the top shows how many items you have.</>,
      <>Open the <Link href="/cart">cart</Link>, check the items and fill in your <b>delivery details</b>.</>,
      <>Choose how to pay: <b>Credit / Debit card</b> (you pay on the payment provider&apos;s secure page) or <b>Bank transfer</b> (we show you our bank details).</>,
      <>Your order appears under <Link href="/account/orders">My account → Orders &amp; bookings</Link> straight away.</>,
    ],
    tips: [
      "Prices in different currencies are paid separately - the cart shows one total per currency.",
      "Card details are never entered on our website, only on the payment provider's secure page.",
      "Only customer accounts can buy online. If you see a message about a staff account, sign out and sign in with your customer account.",
    ],
  },
  {
    id: "payments",
    title: "Orders, payments and receipts",
    icon: "M3 7h18v12H3zM3 11h18M7 15h3",
    needsAccount: true,
    intro: "Every booking and purchase is listed in your account.",
    steps: [
      <><Link href="/account/orders">Orders &amp; bookings</Link> shows each order, what you have paid, and live shipping milestones for deliveries.</>,
      <><Link href="/account/payments">Payments</Link>: card payments are confirmed straight away. Bank transfers show as <b>pending</b> until our finance team confirms them.</>,
      <>Click <b>Receipt</b> next to any confirmed payment to download it.</>,
    ],
  },
  {
    id: "events",
    title: "Events and travel",
    icon: "M2 16l20-6-2-3-7 2L7 3H5l3 7-4 1-2-2H1l1 4zM2 20h20",
    needsAccount: true,
    intro: "Register for our events and follow your visa, ticket and insurance requests.",
    steps: [
      <>Open an event under <Link href="/events">Events</Link> and use the <b>Register</b> box (while registration is open).</>,
      <><Link href="/account/travel">My account → Travel &amp; events</Link> shows your event registrations, visa applications, flight tickets and travel insurance.</>,
    ],
  },
  {
    id: "documents",
    title: "Upload and download documents",
    icon: "M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3",
    needsAccount: true,
    intro: "Send us passport copies, visa papers, certificates and more - and download the documents we share with you.",
    steps: [
      <>Open <Link href="/account/documents">My account → Documents</Link>.</>,
      <>In <b>Upload a document</b>, drag a file into the box or click <b>browse</b> (PDF, JPG, PNG or WEBP, up to 10 MB - phone photos are fine).</>,
      <>Choose the <b>document type</b> and what it is <b>related to</b> (your profile, an enquiry, an appointment or an order), then click <b>Upload document</b>.</>,
      <>Passports, visa papers, certificates, permits and ownership papers are checked by our team first. The list shows <b>Waiting for approval</b>, <b>Approved</b>, or <b>Not accepted</b> with a note.</>,
      <>Tickets, itineraries, invoices and certificates we send you appear in the same list - click <b>Download</b>.</>,
    ],
    tips: ["Only you and our team can see your documents. Passport copies are restricted to authorised staff."],
  },
  {
    id: "reviews",
    title: "Write a review",
    icon: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
    needsAccount: true,
    intro: "Travelled with us? Your review helps other travellers.",
    steps: [
      <>Open a tour page, the <Link href="/travel">Travel</Link> page or <Link href="/reviews">Reviews</Link>, and click <b>Write a review</b>.</>,
      "Choose 1 to 5 stars, add a title and your story, and post it.",
      <>See and manage your reviews under <Link href="/account/reviews">My account → My reviews</Link>.</>,
    ],
  },
  {
    id: "settings",
    title: "Profile, photo and password",
    icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z",
    needsAccount: true,
    intro: "Keep your details up to date.",
    steps: [
      <>Open <Link href="/account/settings">My account → Settings</Link>.</>,
      <><b>Upload photo</b> to add a profile picture (JPG, PNG or WEBP, up to 5 MB). Click your photo to see it full size, or <b>Remove</b> it.</>,
      <>Change your password with <b>Change password</b>.</>,
      <><Link href="/account/messages">Messages</Link> keeps a copy of every email and SMS we have sent you.</>,
    ],
  },
  {
    id: "share",
    title: "Share and follow us",
    icon: "M18 8a3 3 0 1 0-3-3M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
    intro: "Found something your friends would like?",
    steps: [
      <>On any tour, event or product page, use the <b>Share</b> buttons for WhatsApp, Facebook, X and LinkedIn, or <b>copy the link</b>.</>,
      "Follow Gazellekey on social media with the icons at the bottom of every page, or chat with us using the green WhatsApp button.",
    ],
  },
];

const FAQ: [string, ReactNode][] = [
  ["Do I need an account to look at the website?", "No. Everyone can browse. You only need a free account to send enquiries, book appointments, register for events or buy online."],
  ["Does it cost anything to create an account or book an appointment?", "No, both are free and there is no obligation."],
  ["How quickly will you reply?", "We reply to every enquiry, usually within one working day. Appointments are usually confirmed within a few hours."],
  ["Is it safe to pay by card?", "Yes. You enter your card on the payment provider's secure page - card numbers never reach our website."],
  ["My bank transfer still says pending.", "Our finance team confirms bank transfers by hand. This can take up to one working day after the money arrives."],
  ["My uploaded document says “Not accepted”.", "Read the note under it - it says what was wrong. Upload a new, clearer copy."],
  ["I cannot sign in.", <>Check your email and password, or use <b>Continue with Google</b> if you signed up with Google. Still stuck? <Link href="/contact">Contact us</Link>.</>],
];

export default function GuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Help"
        title="User guide"
        text="Everything you can do on the Gazellekey website, step by step."
        image="/images/travel-plane.jpg"
      />

      <div className="bg-[#f8f9fb]">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-[260px_1fr]">
          {/* Contents */}
          <aside className="lg:sticky lg:top-28 lg:self-start print:hidden">
            <div className="card p-5">
              <p className="eyebrow">Contents</p>
              <nav aria-label="Guide contents" className="mt-4">
                <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
                  {SECTIONS.map((section, index) => (
                    <li key={section.id} className="shrink-0">
                      <a
                        href={`#${section.id}`}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-navy-50 hover:text-navy-950"
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-50 text-[11px] font-bold text-navy-800">
                          {index + 1}
                        </span>
                        {section.title}
                      </a>
                    </li>
                  ))}
                  <li className="shrink-0">
                    <a href="#faq" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-navy-50 hover:text-navy-950">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-100 text-[11px] font-bold text-gold-600">?</span>
                      Questions &amp; answers
                    </a>
                  </li>
                </ol>
              </nav>
              <div className="mt-5 hidden border-t border-slate-100 pt-5 lg:block">
                <PrintButton />
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-400/40 bg-gold-100/60 px-5 py-4 text-sm text-navy-900">
              <p className="flex items-center gap-2">
                <AccountBadge /> means you need a free account for this part.
              </p>
              <span className="lg:hidden print:hidden"><PrintButton /></span>
            </div>

            {SECTIONS.map((section, index) => (
              <section key={section.id} id={section.id} className="card scroll-mt-28 p-6 sm:p-8 print:break-inside-avoid print:shadow-none">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy-900 text-gold-400 shadow-[0_8px_18px_-10px_rgba(6,11,26,0.8)]" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d={section.icon} />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-widest text-gold-600 uppercase">Step {index + 1}</p>
                    <h2 className="mt-0.5 text-xl font-bold tracking-tight text-navy-950 sm:text-2xl">{section.title}</h2>
                    {section.needsAccount ? <div className="mt-2"><AccountBadge /></div> : null}
                  </div>
                </div>

                <p className="mt-5 text-slate-600">{section.intro}</p>

                {section.steps ? (
                  <ol className="mt-5 space-y-3">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex gap-3.5">
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500 text-xs font-bold text-navy-950">
                          {stepIndex + 1}
                        </span>
                        <span className="pt-0.5 text-[15px] leading-7 text-slate-700 [&_a]:font-semibold [&_a]:text-navy-800 [&_a]:underline [&_a]:decoration-gold-500/60 [&_a]:underline-offset-2 [&_b]:text-navy-950">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : null}

                {section.tips ? (
                  <div className="mt-6 rounded-2xl bg-navy-50 p-4">
                    <p className="text-xs font-semibold tracking-widest text-navy-700 uppercase">Good to know</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                      {section.tips.map((tip) => (
                        <li key={tip} className="flex gap-2">
                          <span className="text-gold-600" aria-hidden="true">●</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <a href="#top" className="mt-6 inline-block text-xs font-semibold text-slate-400 hover:text-navy-800 print:hidden">
                  ↑ Back to top
                </a>
              </section>
            ))}

            {/* FAQ */}
            <section id="faq" className="card scroll-mt-28 p-6 sm:p-8">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy-950">Questions &amp; answers</h2>
              <div className="mt-6 divide-y divide-slate-100">
                {FAQ.map(([question, answer]) => (
                  <details key={question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy-900">
                      {question}
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-50 transition group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-slate-600 [&_a]:font-semibold [&_a]:underline">{answer}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Still need help */}
            <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-navy-900 to-navy-950 p-8 text-white print:hidden">
              <div className="grid-floor opacity-40" aria-hidden="true" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Still need help?</h2>
                  <p className="mt-1 text-white/70">Our team is happy to walk you through anything.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-gold">Contact us</Link>
                  <Link href="/appointments" className="btn-glass">Book a call</Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

function AccountBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-2.5 py-1 text-[11px] font-semibold text-gold-400">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      Account needed
    </span>
  );
}
