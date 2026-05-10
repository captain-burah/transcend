import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  title: string;
  description?: string;
  columns: Column<T>[];
  rows: T[];
};

export function DataTable<T>({
  title,
  description,
  columns,
  rows,
}: DataTableProps<T>) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="sticky top-0 bg-slate-50/95 backdrop-blur">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-slate-100 transition duration-150 hover:bg-amber-50/45">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-5 py-4 align-top text-sm text-slate-700">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
