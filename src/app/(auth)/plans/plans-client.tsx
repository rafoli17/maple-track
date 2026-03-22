"use client";

import Link from "next/link";
import {
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { EmptyStateIllustration } from "@/components/illustrations";

interface PlansClientProps {
  plans: any[];
}

const priorityLabels: Record<string, string> = {
  PRIMARY: "Plano A",
  SECONDARY: "Plano B",
  TERTIARY: "Plano C",
};

const priorityColors: Record<string, string> = {
  PRIMARY: "bg-primary/10 text-primary border-primary/30",
  SECONDARY: "bg-info/10 text-info border-info/30",
  TERTIARY: "bg-warning/10 text-warning border-warning/30",
};

const statusIcons: Record<string, any> = {
  RESEARCHING: Clock,
  PREPARING: TrendingUp,
  APPLIED: CheckCircle2,
  PROCESSING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: AlertTriangle,
  ON_HOLD: AlertTriangle,
};

const statusLabels: Record<string, string> = {
  RESEARCHING: "Pesquisando",
  PREPARING: "Preparando",
  APPLIED: "Aplicado",
  PROCESSING: "Processando",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  ON_HOLD: "Em Espera",
};

export function PlansClient({ plans }: PlansClientProps) {
  const slots = ["PRIMARY", "SECONDARY", "TERTIARY"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meus Planos</h1>
        <p className="text-sm text-foreground-muted">
          Gerencie seus planos de imigracao A, B e C.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {slots.map((priority) => {
          const plan = plans.find((p: any) => p.priority === priority);
          const StatusIcon = plan
            ? statusIcons[plan.status] || Clock
            : Plus;

          return (
            <div
              key={priority}
              className={`rounded-2xl p-6 transition-all ${
                plan
                  ? `bg-white shadow-sm hover:shadow-md ${priorityColors[priority] || ""}`
                  : "border-2 border-dashed border-border bg-surface"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">
                  {priorityLabels[priority]}
                </h2>
                {plan && (
                  <span className="flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs text-foreground-muted">
                    <StatusIcon className="h-3 w-3" />
                    {statusLabels[plan.status] || plan.status}
                  </span>
                )}
              </div>

              {plan ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {plan.program?.name || "Programa"}
                    </p>
                    <p className="text-xs text-foreground-dim">
                      {plan.program?.category || ""}
                    </p>
                  </div>

                  {plan.targetDate && (
                    <div className="rounded-xl bg-surface p-3">
                      <p className="text-xs text-foreground-dim">Meta</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(plan.targetDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}

                  {plan.notes && (
                    <p className="text-xs text-foreground-muted line-clamp-2">
                      {plan.notes}
                    </p>
                  )}

                  <Link
                    href={`/journey`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-light"
                  >
                    Ver Jornada
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <EmptyStateIllustration width={100} className="mb-2" />
                  <p className="mb-3 text-sm text-foreground-dim">
                    Slot vazio
                  </p>
                  <Link
                    href="/programs"
                    className="rounded-full bg-primary/10 px-5 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    Escolher Programa
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {plans.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-base font-bold text-foreground">
            Dica
          </h2>
          <p className="text-sm text-foreground-muted">
            Ter multiplos planos aumenta suas chances. Se o Plano A nao der
            certo, voce ja tera um Plano B preparado. Recomendamos manter pelo
            menos 2 planos ativos.
          </p>
        </div>
      )}
    </div>
  );
}
