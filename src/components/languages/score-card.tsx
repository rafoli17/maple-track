import { cn } from "@/lib/utils";

interface ScoreCardProps {
  personName: string;
  testName: string;
  scores: {
    speaking: number;
    listening: number;
    reading: number;
    writing: number;
  };
  clbEquivalent?: number;
  overallScore?: number;
  className?: string;
}

const bandLabels = [
  { key: "speaking" as const, label: "S" },
  { key: "listening" as const, label: "L" },
  { key: "reading" as const, label: "R" },
  { key: "writing" as const, label: "W" },
];

export function ScoreCard({
  personName,
  testName,
  scores,
  clbEquivalent,
  overallScore,
  className,
}: ScoreCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {personName}
          </h3>
          <p className="text-xs text-foreground-muted">{testName}</p>
        </div>
        {overallScore !== undefined && (
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{overallScore}</p>
            <p className="text-[10px] text-foreground-muted uppercase">Overall</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {bandLabels.map(({ key, label }) => (
          <div
            key={key}
            className="flex flex-col items-center rounded-lg bg-surface p-2"
          >
            <span className="text-[10px] font-semibold text-foreground-muted">
              {label}
            </span>
            <span className="mt-1 text-lg font-bold text-foreground">
              {scores[key]}
            </span>
          </div>
        ))}
      </div>

      {clbEquivalent !== undefined && (
        <div className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5">
          <span className="text-xs font-medium text-primary">
            CLB {clbEquivalent}
          </span>
        </div>
      )}
    </div>
  );
}
