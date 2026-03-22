"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  ChevronRight,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { EmptyStateIllustration } from "@/components/illustrations";

interface JourneyClientProps {
  activePlan: any;
  phases: any[];
}

const statusConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
  COMPLETED: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  IN_PROGRESS: {
    icon: Clock,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  NOT_STARTED: {
    icon: Circle,
    color: "text-foreground-dim",
    bgColor: "bg-surface",
  },
  BLOCKED: {
    icon: Lock,
    color: "text-error",
    bgColor: "bg-error/10",
  },
};

const statusLabels: Record<string, string> = {
  COMPLETED: "Concluida",
  IN_PROGRESS: "Em Andamento",
  NOT_STARTED: "Nao Iniciada",
  BLOCKED: "Bloqueada",
};

export function JourneyClient({ activePlan, phases }: JourneyClientProps) {
  if (!activePlan) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Jornada</h1>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <EmptyStateIllustration width={130} className="mb-4" />
          <p className="mb-2 text-base font-medium text-foreground">
            Nenhum plano ativo
          </p>
          <p className="mb-4 text-sm text-foreground-muted">
            Selecione um programa de imigracao para iniciar sua jornada.
          </p>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light"
          >
            Explorar Programas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = phases.filter(
    (p: any) => p.status === "COMPLETED"
  ).length;
  const progress =
    phases.length > 0
      ? Math.round((completedCount / phases.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Jornada</h1>
          <p className="text-sm text-foreground-muted">
            {activePlan.program?.name || "Plano Ativo"} — {progress}% concluido
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-xs text-foreground-dim">
          <span>Progresso geral</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-border">
          <div
            className="h-2.5 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      {phases.length > 0 ? (
        <div className="space-y-0">
          {phases.map((phase: any, index: number) => {
            const config = statusConfig[phase.status] || statusConfig.NOT_STARTED;
            const StatusIcon = config.icon;
            const isLast = index === phases.length - 1;
            const stepsCount = phase.steps?.length || 0;
            const completedSteps =
              phase.steps?.filter((s: any) => s.status === "DONE").length || 0;

            return (
              <div key={phase.id} className="relative flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
                  >
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 bg-border" />
                  )}
                </div>

                {/* Phase content */}
                <Link
                  href={`/journey/${phase.id}`}
                  className="group mb-4 flex-1 rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs text-foreground-dim">
                          Fase {phase.phaseNumber || index + 1}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${config.bgColor} ${config.color}`}
                        >
                          {statusLabels[phase.status] || phase.status}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground">
                        {phase.name}
                      </h3>
                      {phase.description && (
                        <p className="mt-1 text-sm text-foreground-muted line-clamp-2">
                          {phase.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-foreground-dim transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>

                  {/* Steps progress */}
                  {stepsCount > 0 && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-foreground-dim">
                        <span>
                          {completedSteps}/{stepsCount} etapas
                        </span>
                        <span>
                          {Math.round((completedSteps / stepsCount) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-border">
                        <div
                          className="h-1.5 rounded-full bg-primary transition-all"
                          style={{
                            width: `${(completedSteps / stepsCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Estimated duration */}
                  {phase.estimatedDurationDays && (
                    <p className="mt-2 text-xs text-foreground-dim">
                      Estimativa: {phase.estimatedDurationDays} dias
                    </p>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <MapPin className="mb-3 h-10 w-10 text-foreground-dim" />
          <p className="text-sm text-foreground-muted">
            Nenhuma fase criada ainda para este plano.
          </p>
        </div>
      )}
    </div>
  );
}
