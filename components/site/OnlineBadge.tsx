// Small green "Online" pill shown next to the signed-in person's name
export default function OnlineBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ${className}`}>
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Online
    </span>
  );
}
