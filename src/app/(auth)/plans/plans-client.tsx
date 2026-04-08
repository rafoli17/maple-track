"use client";

import Link from "next/link";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lock,
  MapPin,
  Calendar,
  Target,
} from "lucide-react";

interface PlansClientProps {
  plans: any[];
}

const priorityConfig: Record<string, {
  label: string;
  desc: string;
  color: string;
  border: string;
  badge: string;
  accent: string;
}> = {
  PRIMARY: {
    label: "Plano A",
    desc: "Caminho principal",
    color: "bg-primary/[0.04]",
    border: "border-primary/20",
    badge: "bg-primary/10 text-primary",
    accent: "text-primary",
  },
  SECONDARY: {
    label: "Plano B",
    desc: "Complementar ao Plano A",
    color: "bg-accent/[0.04]",
    border: "border-accent/20",
    badge: "bg-accent/10 text-accent",
    accent: "text-accent",
  },
  TERTIARY: {
    label: "Plano C",
    desc: "Alternativa caso A e B falhem",
    color: "bg-warning/[0.04]",
    border: "border-warning/20",
    badge: "bg-warning/10 text-warning",
    accent: "text-warning",
  },
};

const statusConfig: Record<string, { icon: any; label: string; color: string }> = {
  RESEARCHING: { icon: Clock, label: "Pesquisando", color: "text-foreground-muted" },
  PREPARING: { icon: TrendingUp, label: "Preparando", color: "text-info" },
  APPLIED: { icon: CheckCircle2, label: "Aplicado", color: "text-success" },
  PROCESSING: { icon: Clock, label: "Processando", color: "text-info" },
  APPROVED: { icon: CheckCircle2, label: "Aprovado", color: "text-success" },
  REJECTED: { icon: AlertTriangle, label: "Rejeitado", color: "text-error" },
  ON_HOLD: { icon: AlertTriangle, label: "Em Espera", color: "text-warning" },
};

export function PlansClient({ plans }: PlansClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meus Planos</h1>
        <p className="text-sm text-foreground-muted">
          Seus caminhos de imigracao para o Canada
        </p>
      </div>

      {/* Plans grid */}
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan: any) => {
          const cfg = priorityConfig[plan.priority] || priorityConfig.PRIMARY;
          const sc = statusConfig[plan.status] || statusConfig.RESEARCHING;
          const StatusIcon = sc.icon;
          const program = plan.program;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border ${cfg.border} ${cfg.color} bg-white p-4 sm:p-5 shadow-sm`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${cfg.badge}`}>
                  {cfg.label}
                </span>
                <span className={`flex items-center gap-1 text-xs font-medium ${sc.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {sc.label}
                </span>
              </div>

              {/* Program name */}
              <h2 className="text-base font-bold text-foreground mb-1">
                {program?.name || "Programa"}
              </h2>
              <p className="text-xs text-foreground-dim mb-4">
                {cfg.desc}
              </p>

              {/* Program details */}
              <div className="space-y-2.5 mb-4">
                {program?.processingTimeMonths && (
                  <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <Calendar className="h-3.5 w-3.5 text-foreground-dim" />
                    <span>Processamento: ~{program.processingTimeMonths} meses</span>
                  </div>
                )}
                {program?.minimumCLB && (
                  <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <Target className="h-3.5 w-3.5 text-foreground-dim" />
                    <span>CLB minimo: {program.minimumCLB}</span>
                  </div>
                )}
                {program?.minimumCRS && (
                  <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <TrendingUp className="h-3.5 w-3.5 text-foreground-dim" />
                    <span>CRS minimo: {program.minimumCRS}</span>
                  </div>
                )}
                {program?.minimumFunds && (
                  <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <MapPin className="h-3.5 w-3.5 text-foreground-dim" />
                    <span>Fundos: CAD ${Number(program.minimumFunds).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <Link
                  href="/journey"
                  className={`inline-flex items-center gap-1 text-xs font-semibold ${cfg.accent} hover:opacity-80 transition-opacity`}
                >
                  Ver jornada
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <button
                  disabled
                  className="inline-flex items-center gap-1 text-[10px] text-foreground-dim cursor-not-allowed"
                  title="Em breve"
                >
                  <Lock className="h-3 w-3" />
                  Alterar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info card */}
      <div className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">Estrategia Multi-Plano</h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              O <strong>Plano A (AIP)</strong> e seu caminho principal via Atlantic Immigration Program.
              O <strong>Plano B (Express Entry)</strong> complementa o A — pontos CRS e idioma servem para ambos.
              O <strong>Plano C (Study)</strong> e uma alternativa separada caso os planos A e B nao avancem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
