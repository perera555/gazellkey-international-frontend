import { ReactNode } from "react";

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

// Simple table for the account lists; scrolls sideways on small screens
export default function AccountTable<T extends { id: string }>({
  rows,
  columns,
  empty,
}: {
  rows: T[];
  columns: Column<T>[];
  empty: string;
}) {
  if (rows.length == 0) {
    return <p className="card px-6 py-10 text-center text-sm text-slate-600">{empty}</p>;
  }
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-navy-50 text-xs tracking-wide text-slate-600 uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column.header} scope="col" className={`px-4 py-3 font-semibold ${column.className ?? ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.header} className={`px-4 py-3 align-top ${column.className ?? ""}`}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AccountHeading({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mb-6">
      <h1 className="heading-display text-3xl">{title}</h1>
      {text ? <p className="mt-1 text-sm text-slate-600">{text}</p> : null}
    </div>
  );
}
