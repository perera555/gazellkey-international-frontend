import Link from "next/link";

type Chip = { href: string; label: string; active: boolean };

// Row of pill filter chips; the active one is filled gold
export function ChipNav({ chips }: { chips: Chip[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.href}
          href={chip.href}
          aria-current={chip.active ? "page" : undefined}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            chip.active
              ? "border-gold-500 bg-gold-500 text-navy-950 shadow-[0_8px_18px_-10px_rgba(212,166,74,0.9)]"
              : "border-slate-200 bg-white text-slate-600 hover:border-gold-500/60 hover:text-navy-950"
          }`}
        >
          {chip.label}
        </Link>
      ))}
    </div>
  );
}

// Simple filter links: ?type=NEW_VEHICLE etc. Works without JavaScript.
export default function FilterTabs({
  basePath,
  param,
  options,
  current,
}: {
  basePath: string;
  param: string;
  options: { value: string; label: string }[];
  current?: string;
  color?: string;
}) {
  const all = [{ value: "", label: "All" }, ...options];
  return (
    <ChipNav
      chips={all.map((option) => ({
        href: option.value ? `${basePath}?${param}=${option.value}` : basePath,
        label: option.label,
        active: (current ?? "") == option.value,
      }))}
    />
  );
}
