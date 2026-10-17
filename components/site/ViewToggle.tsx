import Link from "next/link";

export type ListView = "grid" | "list";

// ?view=list shows a catalogue as a table; anything else as photo cards
export function listView(value: string | string[] | undefined): ListView {
  return value == "list" ? "list" : "grid";
}

// "Grid | List" switch. Keeps the other filters in the link, so it works
// without JavaScript and the choice survives paging.
export default function ViewToggle({
  basePath,
  searchParams,
  current,
}: {
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
  current: ListView;
}) {
  const href = (view: ListView) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value == "string" && value != "" && key != "view") query.set(key, value);
    }
    if (view == "list") query.set("view", "list");
    return `${basePath}${query.size ? `?${query}` : ""}`;
  };

  const button = (view: ListView, label: string, icon: string) => (
    <Link
      href={href(view)}
      scroll={false}
      aria-current={current == view ? "true" : undefined}
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        current == view ? "bg-navy-900 text-white shadow-sm" : "text-slate-600 hover:text-navy-950"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d={icon} />
      </svg>
      {label}
    </Link>
  );

  return (
    <div className="inline-flex shrink-0 rounded-full border border-slate-200 bg-white p-1" role="group" aria-label="Show as">
      {button("grid", "Grid", "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z")}
      {button("list", "List", "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01")}
    </div>
  );
}
