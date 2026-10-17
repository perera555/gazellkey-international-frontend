import Link from "next/link";
import { ReactNode } from "react";

export type ListColumn<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  align?: "right";
  mono?: boolean; // codes such as SKU, shown in a fixed-width font
};

// Catalogue "List" view: a table on tablets and computers, small cards on
// phones. The first column is the item name, with a photo, linking to the item.
export default function ListTable<T extends { id: string }>({
  rows,
  href,
  image,
  title,
  subtitle,
  columns,
  nameHeader = "Name",
}: {
  nameHeader?: string;
  rows: T[];
  href: (row: T) => string;
  image: (row: T) => string;
  title: (row: T) => string;
  subtitle?: (row: T) => ReactNode;
  columns: ListColumn<T>[];
}) {
  return (
    <>
      <div className="card hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-navy-900 text-left text-xs font-semibold tracking-wide text-white/80 uppercase">
            <tr>
              <th scope="col" className="px-5 py-3.5">{nameHeader}</th>
              {columns.map((column) => (
                <th key={column.header} scope="col" className={`px-4 py-3.5 ${column.align == "right" ? "text-right" : ""}`}>
                  {column.header}
                </th>
              ))}
              <th scope="col" className="px-5 py-3.5"><span className="sr-only">View</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="align-middle transition hover:bg-gold-100/30">
                <td className="px-5 py-3.5">
                  <div className="flex min-w-56 items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image(row)} alt="" className="h-12 w-16 shrink-0 rounded-lg bg-navy-50 object-cover" />
                    <div>
                      <Link href={href(row)} className="font-semibold text-navy-950 hover:text-gold-600 hover:underline">
                        {title(row)}
                      </Link>
                      {subtitle ? <div className="text-xs text-slate-500">{subtitle(row)}</div> : null}
                    </div>
                  </div>
                </td>
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={`px-4 py-3.5 ${column.align == "right" ? "text-right font-semibold whitespace-nowrap text-navy-900" : "text-slate-700"} ${
                      column.mono ? "font-mono text-xs whitespace-nowrap text-navy-800" : ""
                    }`}
                  >
                    {column.cell(row)}
                  </td>
                ))}
                <td className="px-5 py-3.5 text-right">
                  <Link href={href(row)} className="btn-outline btn-sm">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* phones */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="card p-4">
            <div className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image(row)} alt="" className="h-14 w-16 shrink-0 rounded-lg bg-navy-50 object-cover" />
              <div className="min-w-0">
                <Link href={href(row)} className="font-semibold text-navy-950">{title(row)}</Link>
                {subtitle ? <div className="text-xs text-slate-500">{subtitle(row)}</div> : null}
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1 text-sm">
              {columns.map((column) => (
                <div key={column.header} className="contents">
                  <dt className="text-slate-500">{column.header}</dt>
                  <dd className={column.mono ? "font-mono text-xs text-navy-800" : column.align == "right" ? "font-semibold text-navy-900" : "text-slate-700"}>
                    {column.cell(row)}
                  </dd>
                </div>
              ))}
            </dl>
            <Link href={href(row)} className="btn-outline btn-sm mt-3">View</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
