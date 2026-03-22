"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type PhaseStatus = "completed" | "in_progress" | "not_started" | "blocked";

interface PhaseCardProps {
  name: string;
  status: PhaseStatus;
  stepsCompleted: number;
  stepsTotal: number;
  children?: React.ReactNode;
  className?: string;
}

const statusStyles: Record<PhaseStatus, { badge: string; label: string }> = {
  completed: { badge: "bg-success/10 text-success", label: "Concluido" },
  in_progress: { badge: "bg-primary/10 text-primary", label: "Em andamento" },
  not_started: { badge: "bg-muted text-foreground-muted", label: "Pendente" },
  blocked: { badge: "bg-error/10 text-error", label: "Bloqueado" },
};

export function PhaseCard({
  name,
  status,
  stepsCompleted,
  stepsTotal,
  children,
  className,
}: PhaseCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(status === "in_progress");
  const s = statusStyles[status];
  const progress = stepsTotal > 0 ? (stepsCompleted / stepsTotal) * 100 : 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-surface"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{name}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                s.badge
              )}
            >
              {s.label}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={progress} className="flex-1" />
            <span className="shrink-0 text-xs text-foreground-muted">
              {stepsCompleted}/{stepsTotal}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-foreground-muted transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
