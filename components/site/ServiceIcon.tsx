// Line icons for services, shown on a raised colour tile
const PATHS: Record<string, string> = {
  flight: "M2 16l20-6-2-3-7 2L7 3H5l3 7-4 1-2-2H1l1 4zM2 20h20",
  tour: "M12 3v18M5 8c2-3 5-4 7-5 2 1 5 2 7 5M4 21h16M8 12l4-4 4 4",
  gem: "M6 3h12l3 6-9 12L3 9zM3 9h18M9 3l3 18 3-18",
  event: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M4 11h16",
  vehicle: "M3 16v-4l2-5h14l2 5v4zM3 16v3h3v-3M18 16v3h3v-3M7 13h.01M17 13h.01M5 12h14",
  trade: "M3 17h18l-2 4H5zM6 17V9h12v8M9 9V5h6v4",
  visa: "M5 3h14v18H5zM9 8h6M9 12h6M9 16h3",
  insurance: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
};

export default function ServiceIcon({ name, color }: { name: keyof typeof PATHS | string; color: string }) {
  return (
    <span
      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white"
      style={{
        background: `linear-gradient(145deg, color-mix(in srgb, ${color} 75%, white), ${color})`,
        boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.4), 0 4px 0 color-mix(in srgb, ${color} 70%, black), 0 12px 20px -8px ${color}`,
      }}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={PATHS[name] ?? PATHS.trade} />
      </svg>
    </span>
  );
}
