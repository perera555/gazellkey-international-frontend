import Link from "next/link";

type Chip = { href: string; label: string; active: boolean };

// Row of raised filter chips; the active one is pressed in navy
export function ChipNav({ chips }: { chips: Chip[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.href}
          href={chip.href}
          aria-current={chip.active ? "page" : undefined}
          className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition ${
            chip.active
              ? "translate-y-0.5 border-navy-900 bg-navy-900 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)]"
              : "border-slate-200 bg-white text-navy-900 shadow-[0_3px_0_#dbe3ee] hover:-translate-y-0.5 hover:border-navy-700/40"
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
