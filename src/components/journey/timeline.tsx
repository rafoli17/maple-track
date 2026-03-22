"use client";

import { cn } from "@/lib/utils";

type PhaseStatus = "completed" | "in_progress" | "not_started" | "blocked";

interface Phase {
  id: string;
  name: string;
  status: PhaseStatus;
  stepsCompleted: number;
  stepsTotal: number;
}

interface TimelineProps {
  phases: Phase[];
  className?: string;
}

const statusColors: Record<PhaseStatus, string> = {
  completed: "bg-success border-success",
  in_progress: "bg-primary border-primary",
  not_started: "bg-muted border-border",
  blocked: "bg-error border-error",
};

const statusTextColors: Record<PhaseStatus, string> = {
  completed: "text-success",
  in_progress: "text-primary",
  not_started: "text-foreground-muted",
  blocked: "text-error",
};

const statusLabels: Record<PhaseStatus, string> = {
  completed: "Concluido",
  in_progress: "Em andamento",
  not_started: "Pendente",
  blocked: "Bloqueado",
};

export function Timeline({ phases, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {phases.map((phase, index) => {
        const isLast = index === phases.length - 1;

        return (
          <div key={phase.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />
            )}

            {/* Dot */}
            <div
              className={cn(
                "relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2",
                statusColors[phase.status]
              )}
            />

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">
                {phase.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    statusTextColors[phase.status]
                  )}
                >
                  {statusLabels[phase.status]}
                </span>
                <span className="text-xs text-foreground-dim">
                  {phase.stepsCompleted}/{phase.stepsTotal} passos
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
