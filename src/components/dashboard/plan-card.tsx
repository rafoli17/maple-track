"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

interface PlanCardProps {
  programName: string;
  status: "ativo" | "pausado" | "concluido";
  progress: number;
  nextStep: string;
  className?: string;
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  ativo: { bg: "bg-success/10", text: "text-success", label: "Ativo" },
  pausado: { bg: "bg-warning/10", text: "text-warning", label: "Pausado" },
  concluido: { bg: "bg-info/10", text: "text-info", label: "Concluido" },
};

export function PlanCard({
  programName,
  status,
  progress,
  nextStep,
  className,
}: PlanCardProps) {
  const s = statusStyles[status];

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-foreground">{programName}</h3>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
            s.bg,
            s.text
          )}
        >
          {s.label}
        </span>
      </div>

      <div className="mt-4">
        <Progress value={progress} showLabel />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface p-3">
        <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
        <span className="text-sm text-foreground-muted">{nextStep}</span>
      </div>
    </div>
  );
}
