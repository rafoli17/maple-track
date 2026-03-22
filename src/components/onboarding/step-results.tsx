"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface StepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

interface RecommendedProgram {
  name: string;
  matchPct: number;
}

export function StepResults({ data }: StepProps) {
  const crsScore = (data.crsScore as number) ?? 468;

  const recommendedPrograms: RecommendedProgram[] = (data.recommendedPrograms as RecommendedProgram[]) ?? [
    { name: "Express Entry - Federal Skilled Worker", matchPct: 92 },
    { name: "Ontario Immigrant Nominee Program (OINP)", matchPct: 85 },
    { name: "BC Provincial Nominee Program (BC PNP)", matchPct: 78 },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <h2 className="mb-2 text-lg font-semibold text-foreground">
        Seu Resultado
      </h2>
      <p className="mb-8 text-sm text-foreground-muted">
        Baseado nas informacoes fornecidas
      </p>

      {/* CRS Score */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary bg-primary/10"
      >
        <div>
          <p className="text-4xl font-bold text-primary">{crsScore}</p>
          <p className="text-xs text-foreground-muted">Pontos CRS</p>
        </div>
      </motion.div>

      {/* Recommended programs */}
      <div className="mb-8 space-y-3 text-left">
        <h3 className="text-sm font-semibold text-foreground">
          Programas Recomendados
        </h3>
        {recommendedPrograms.map((program, i) => (
          <motion.div
            key={program.name}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-surface p-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-sm text-foreground">{program.name}</span>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                program.matchPct >= 80
                  ? "bg-success/10 text-success"
                  : program.matchPct >= 60
                    ? "bg-warning/10 text-warning"
                    : "bg-info/10 text-info"
              )}
            >
              {program.matchPct}%
            </span>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-foreground-muted">
        Clique em &quot;Começar Jornada&quot; abaixo para ir ao seu dashboard
      </p>
    </div>
  );
}
