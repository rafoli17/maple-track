"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  SkipForward,
  User,
  Calendar,
} from "lucide-react";

interface PhaseDetailClientProps {
  phase: any;
  steps: any[];
}

const stepStatusConfig: Record<string, { icon: any; color: string; label: string }> = {
  DONE: { icon: CheckCircle2, color: "text-success", label: "Concluido" },
  IN_PROGRESS: { icon: Clock, color: "text-info", label: "Em Andamento" },
  TODO: { icon: Circle, color: "text-foreground-dim", label: "A Fazer" },
  BLOCKED: { icon: Lock, color: "text-error", label: "Bloqueado" },
  SKIPPED: { icon: SkipForward, color: "text-foreground-dim", label: "Pulado" },
};

const priorityColors: Record<string, string> = {
  CRITICAL: "bg-error/10 text-error",
  HIGH: "bg-warning/10 text-warning",
  MEDIUM: "bg-info/10 text-info",
  LOW: "bg-surface text-foreground-dim",
};

export function PhaseDetailClient({ phase, steps }: PhaseDetailClientProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const completedCount = steps.filter((s: any) => s.status === "DONE").length;
  const progress =
    steps.length > 0
      ? Math.round((completedCount / steps.length) * 100)
      : 0;

  const toggleStep = async (stepId: string, currentStatus: string) => {
    setUpdatingId(stepId);
    try {
      const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";
      await fetch(`/api/journey/steps/${stepId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch {
      // Error handling
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back link */}
      <Link
        href="/journey"
        className="inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar a Jornada
      </Link>

      {/* Phase header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-1 text-xs text-foreground-dim">
          Fase {phase.phaseNumber || ""}
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          {phase.name}
        </h1>
        {phase.description && (
          <p className="mb-4 text-sm text-foreground-muted">
            {phase.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-2 flex items-center justify-between text-xs text-foreground-dim">
          <span>
            {completedCount}/{steps.length} etapas concluidas
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-border">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {phase.estimatedDurationDays && (
          <p className="mt-3 text-xs text-foreground-dim">
            Estimativa: {phase.estimatedDurationDays} dias
          </p>
        )}
      </div>

      {/* Steps list */}
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-foreground">Etapas</h2>
        {steps.length > 0 ? (
          <ul className="space-y-2">
            {steps.map((step: any) => {
              const config =
                stepStatusConfig[step.status] || stepStatusConfig.TODO;
              const StatusIcon = config.icon;
              const isUpdating = updatingId === step.id;
              const isDone = step.status === "DONE";

              return (
                <li
                  key={step.id}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleStep(step.id, step.status)}
                      disabled={isUpdating || step.status === "BLOCKED"}
                      className="mt-0.5 shrink-0 disabled:opacity-50"
                    >
                      <StatusIcon
                        className={`h-5 w-5 ${config.color} ${
                          isUpdating ? "animate-pulse" : ""
                        }`}
                      />
                    </button>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isDone
                            ? "text-foreground-dim line-through"
                            : "text-foreground"
                        }`}
                      >
                        {step.title}
                      </p>
                      {step.description && (
                        <p className="mt-0.5 text-xs text-foreground-muted">
                          {step.description}
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {step.priority && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                              priorityColors[step.priority] || ""
                            }`}
                          >
                            {step.priority}
                          </span>
                        )}
                        {step.assignedTo && (
                          <span className="flex items-center gap-1 text-[10px] text-foreground-dim">
                            <User className="h-3 w-3" />
                            Atribuido
                          </span>
                        )}
                        {step.dueDate && (
                          <span className="flex items-center gap-1 text-[10px] text-foreground-dim">
                            <Calendar className="h-3 w-3" />
                            {new Date(step.dueDate).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-xl border border-border bg-card text-sm text-foreground-dim">
            Nenhuma etapa criada para esta fase.
          </div>
        )}
      </div>
    </div>
  );
}
