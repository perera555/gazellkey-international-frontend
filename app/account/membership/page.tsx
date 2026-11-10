import type { Metadata } from "next";
import Link from "next/link";
import { AccountHeading } from "@/components/account/AccountTable";
import MembershipCard, { CARD_NAMES, MembershipTier } from "@/components/account/MembershipCard";
import ErrorNote from "@/components/site/ErrorNote";
import { apiGetMine } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { requireCustomer } from "@/lib/session";

export const metadata: Metadata = { title: "My membership" };

type MyMembership = {
  id: string;
  cardNumber: string;
  memberName: string;
  tier: MembershipTier;
  pointsBalance: number;
  lifetimePoints: number;
  joinedAt: string;
  next: { tier: MembershipTier; pointsNeeded: number } | null;
  tiers: { tier: MembershipTier; fromPoints: number }[];
  transactions: { id: string; points: number; reason: string; note: string | null; createdAt: string }[];
};

const TIER_NAMES = CARD_NAMES;

const REASON_TEXT: Record<string, string> = {
  PURCHASE: "Earned",
  REFUND: "Refund",
  REDEMPTION: "Redeemed",
  ADJUSTMENT: "From Gazellekey",
};

export default async function MyMembershipPage({ searchParams }: PageProps<"/account/membership">) {
  const params = await searchParams;
  const [result, user] = await Promise.all([
    apiGetMine<MyMembership | null>("/api/me/membership", "/account/membership"),
    requireCustomer("/account/membership"),
  ]);

  if (!result.ok) {
    return (
      <>
        <AccountHeading title="My membership" text="Your Gazellekey membership card and points." />
        <ErrorNote message={result.message} />
      </>
    );
  }

  const member = result.data;
  if (member == null) {
    return (
      <>
        <AccountHeading title="My membership" text="Your Gazellekey membership card and points." />
        <div className="card px-6 py-12 text-center text-slate-600">
          Membership cards are for customer accounts. Staff accounts do not have one.
        </div>
      </>
    );
  }

  const nextFrom = member.next ? member.tiers.find((level) => level.tier == member.next?.tier)?.fromPoints ?? 0 : 0;
  const progress = member.next && nextFrom > 0 ? Math.min(100, Math.round((member.lifetimePoints / nextFrom) * 100)) : 100;

  return (
    <>
      <AccountHeading title="My membership" text="Show your card at our office, or quote your card number when you book." />

      {params.welcome ? (
        <p className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
          Welcome to Gazellekey membership, {member.memberName}! Here is your card.
        </p>
      ) : null}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,28rem)_1fr]">
        <div>
          <MembershipCard
            memberName={member.memberName}
            cardNumber={member.cardNumber}
            tier={member.tier}
            points={member.pointsBalance}
            joinedAt={member.joinedAt}
            firstName={user.firstName}
            lastName={user.lastName}
            photoUrl={user.photoUrl}
          />
          <p className="mt-3 text-sm text-slate-600">
            Membership No. <strong className="font-mono text-navy-950">{member.cardNumber}</strong>
            {" · "}
            <Link href="/account/settings" className="font-medium text-navy-800 underline">
              {user.photoUrl ? "Change your photo" : "Add your photo to the card"}
            </Link>
          </p>
        </div>

        <div className="card space-y-4 p-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Your card</p>
            <p className="heading-display mt-1 text-2xl">{TIER_NAMES[member.tier]}</p>
          </div>
          {member.next ? (
            <div>
              <div className="h-2.5 overflow-hidden rounded-full bg-navy-50" aria-hidden="true">
                <div className="h-full rounded-full bg-gold-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {member.next.pointsNeeded.toLocaleString()} more points to reach <strong>{TIER_NAMES[member.next.tier]}</strong>.
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-600">You have our highest card. Thank you for being with us!</p>
          )}
          <ul className="space-y-1.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <li>
              Earn 1 point for every US$ 1 (or LKR 300) you pay - shop and fertilizer orders, flight tickets, tours, events,
              rentals and all our other services.
            </li>
            <li>Ask our team to use your points for a discount or reward.</li>
          </ul>
          <ol className="grid grid-cols-5 gap-1.5 text-center text-[0.7rem]">
            {member.tiers.map((level) => (
              <li
                key={level.tier}
                className={`rounded-lg px-1 py-2 ${level.tier == member.tier ? "bg-navy-950 font-semibold text-gold-400" : "bg-navy-50 text-slate-600"}`}
              >
                <span className="block">{TIER_NAMES[level.tier].replace(" Card", "")}</span>
                <span className="block opacity-80">{level.fromPoints.toLocaleString()}+</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy-950">Points history</h2>
        {member.transactions.length == 0 ? (
          <div className="card mt-4 px-6 py-10 text-center text-sm text-slate-600">
            No points yet. They are added automatically when your payment is confirmed.
          </div>
        ) : (
          <ul className="card mt-4 divide-y divide-slate-100">
            {member.transactions.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                <div>
                  <p className="font-medium text-navy-900">{REASON_TEXT[entry.reason] ?? entry.reason}</p>
                  {entry.note ? <p className="text-slate-600">{entry.note}</p> : null}
                  <p className="text-xs text-slate-500">{formatDate(entry.createdAt)}</p>
                </div>
                <span className={`shrink-0 font-semibold ${entry.points > 0 ? "text-emerald-700" : "text-red-700"}`}>
                  {entry.points > 0 ? "+" : ""}
                  {entry.points.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
