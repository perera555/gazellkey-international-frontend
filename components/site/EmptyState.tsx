import Link from "next/link";

export default function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="card px-6 py-12 text-center">
      <h3 className="font-semibold text-navy-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{text}</p>
      {action ? (
        <Link href={action.href} className="btn-navy mt-6">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
