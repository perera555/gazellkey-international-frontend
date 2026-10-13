// Gold stars for a rating. Partial values (4.5) fill part of a star.
export default function Stars({
  rating,
  size = 18,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, rating - (star - 1)));
        return <Star key={star} size={size} fill={fill} />;
      })}
    </span>
  );
}

const STAR_PATH =
  "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z";

export function Star({ size = 18, fill = 1 }: { size?: number; fill?: number }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 24 24" className="absolute inset-0 text-slate-200">
        <path d={STAR_PATH} fill="currentColor" />
      </svg>
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
        <svg width={size} height={size} viewBox="0 0 24 24" className="text-gold-500 drop-shadow-[0_1px_1px_rgba(168,132,28,0.35)]">
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      </span>
    </span>
  );
}
