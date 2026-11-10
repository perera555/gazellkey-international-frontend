import Avatar from "@/components/site/Avatar";
import { formatDate } from "@/lib/format";

export type MembershipTier = "BLUE" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

// Card names, lowest first
export const CARD_NAMES: Record<MembershipTier, string> = {
  BLUE: "Blue Card",
  BRONZE: "Bronze Card",
  SILVER: "Silver Card",
  GOLD: "Gold Card",
  PLATINUM: "Platinum Card",
};

// The card face of each tier
const TIER_STYLE: Record<MembershipTier, { card: string; accent: string }> = {
  BLUE: {
    card: "bg-linear-to-br from-sky-600 via-blue-700 to-navy-950 ring-1 ring-sky-300/40",
    accent: "text-sky-200",
  },
  BRONZE: {
    card: "bg-linear-to-br from-amber-700 via-orange-900 to-stone-900 ring-1 ring-amber-500/50",
    accent: "text-amber-200",
  },
  SILVER: {
    card: "bg-linear-to-br from-slate-400 via-slate-600 to-slate-800 ring-1 ring-slate-200/60",
    accent: "text-slate-100",
  },
  GOLD: {
    card: "bg-linear-to-br from-gold-500 via-amber-700 to-navy-950 ring-1 ring-gold-400/70",
    accent: "text-gold-100",
  },
  PLATINUM: {
    card: "bg-linear-to-br from-zinc-300 via-zinc-600 to-black ring-2 ring-zinc-200/80",
    accent: "text-white",
  },
};

// The customer's membership card (My account > Membership), with their
// profile photo (initials when they have none) and membership number
export default function MembershipCard({
  memberName,
  cardNumber,
  tier,
  points,
  joinedAt,
  firstName,
  lastName,
  photoUrl,
}: {
  memberName: string;
  cardNumber: string;
  tier: MembershipTier;
  points: number;
  joinedAt: string;
  firstName: string;
  lastName?: string;
  photoUrl?: string | null;
}) {
  const style = TIER_STYLE[tier];
  const cardName = CARD_NAMES[tier];
  return (
    <div
      className={`relative aspect-[1.586] w-full max-w-md overflow-hidden rounded-2xl p-6 text-white shadow-[0_24px_48px_-20px_rgba(6,11,26,0.9)] ${style.card}`}
      aria-label={`Gazellekey ${cardName} for ${memberName}, ${points} points`}
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gold-400/10" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.25em] text-white/60 uppercase">Gazellekey International</p>
            <p className={`mt-0.5 text-sm font-semibold tracking-wide uppercase ${style.accent}`}>{cardName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl leading-none font-bold">{points.toLocaleString()}</p>
            <p className="text-[0.65rem] tracking-widest text-white/60 uppercase">points</p>
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-[0.6rem] tracking-widest text-white/50 uppercase">Membership No.</p>
          <p className="font-mono text-lg tracking-[0.18em] sm:text-xl">{cardNumber}</p>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar firstName={firstName} lastName={lastName} photoUrl={photoUrl} size={52} className="shrink-0 ring-2 ring-gold-400/70" />
            <div className="min-w-0">
              <p className="text-[0.6rem] tracking-widest text-white/50 uppercase">Member</p>
              <p className="truncate text-base font-semibold uppercase sm:text-lg">{memberName}</p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[0.6rem] tracking-widest text-white/50 uppercase">Since</p>
            <p className="text-sm font-medium">{formatDate(joinedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
