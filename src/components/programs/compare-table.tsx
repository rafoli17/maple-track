import { cn } from "@/lib/utils";

interface ProgramColumn {
  name: string;
  clb: string;
  crs: string;
  processingTime: string;
  funds: string;
  category: string;
}

interface CompareTableProps {
  programs: ProgramColumn[];
  className?: string;
}

const rows = [
  { key: "clb" as const, label: "CLB Minimo" },
  { key: "crs" as const, label: "CRS Minimo" },
  { key: "processingTime" as const, label: "Tempo de Processamento" },
  { key: "funds" as const, label: "Fundos Necessarios" },
  { key: "category" as const, label: "Categoria" },
];

export function CompareTable({ programs, className }: CompareTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="px-4 py-3 text-left text-xs font-semibold text-foreground-muted">
              Criterio
            </th>
            {programs.map((p) => (
              <th
                key={p.name}
                className="px-4 py-3 text-left text-xs font-semibold text-foreground"
              >
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.key}
              className={cn(
                "border-b border-border/50",
                i % 2 === 0 ? "bg-card" : "bg-surface"
              )}
            >
              <td className="px-4 py-3 text-xs font-medium text-foreground-muted">
                {row.label}
              </td>
              {programs.map((p) => (
                <td
                  key={p.name + row.key}
                  className="px-4 py-3 text-xs text-foreground"
                >
                  {p[row.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
