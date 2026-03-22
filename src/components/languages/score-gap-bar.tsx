"use client";

import { cn } from "@/lib/utils";

interface ScoreGapBarProps {
  label: string;
  current: number;
  target: number;
  max: number;
  className?: string;
}

export function ScoreGapBar({
  label,
  current,
  target,
  max,
  className,
}: ScoreGapBarProps) {
  const currentPct = (current / max) * 100;
  const targetPct = (target / max) * 100;
  const met = current >= target;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-foreground-muted">
          {current} / {target}
        </span>
      </div>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-surface">
        {/* Current bar */}
        <div
          className={cn(
            "h-full rounded-full transition-all",
            met ? "bg-success" : "bg-primary"
          )}
          style={{ width: `${Math.min(currentPct, 100)}%` }}
        />

        {/* Target marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground"
          style={{ left: `${Math.min(targetPct, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-foreground-dim">
        <span>Atual: {current}</span>
        <span>Meta: {target}</span>
      </div>
    </div>
  );
}
