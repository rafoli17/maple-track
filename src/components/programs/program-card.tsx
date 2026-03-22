"use client";

import { cn } from "@/lib/utils";
import { Clock, TrendingUp } from "lucide-react";

interface ProgramCardProps {
  name: string;
  category: string;
  matchPct: number;
  processingTime: string;
  onClick?: () => void;
  className?: string;
}

export function ProgramCard({
  name,
  category,
  matchPct,
  processingTime,
  onClick,
  className,
}: ProgramCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-card/80",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          <span className="mt-1 inline-block rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-foreground-muted">
            {category}
          </span>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-bold",
            matchPct >= 80
              ? "bg-success/10 text-success"
              : matchPct >= 60
                ? "bg-warning/10 text-warning"
                : "bg-info/10 text-info"
          )}
        >
          {matchPct}%
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-foreground-muted">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {processingTime}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Compatibilidade
        </span>
      </div>
    </button>
  );
}
