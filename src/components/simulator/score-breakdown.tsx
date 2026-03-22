"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Section {
  label: string;
  value: number;
  max: number;
  color: string;
}

interface ScoreBreakdownProps {
  sections?: Section[];
  className?: string;
}

const defaultSections: Section[] = [
  { label: "Capital Humano", value: 260, max: 500, color: "bg-primary" },
  { label: "Conjuge", value: 20, max: 40, color: "bg-info" },
  { label: "Transferencia de Habilidades", value: 50, max: 100, color: "bg-warning" },
  { label: "Pontos Adicionais", value: 0, max: 600, color: "bg-success" },
];

export function ScoreBreakdown({
  sections = defaultSections,
  className,
}: ScoreBreakdownProps) {
  const total = sections.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Detalhamento do Score
        </h3>
        <span className="text-xl font-bold text-foreground">{total}</span>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const pct = (section.value / section.max) * 100;

          return (
            <div key={section.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">
                  {section.label}
                </span>
                <span className="text-foreground-muted">
                  {section.value}/{section.max}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                <motion.div
                  className={cn("h-full rounded-full", section.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
