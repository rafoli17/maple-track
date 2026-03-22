"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Target,
  BookOpen,
} from "lucide-react";

interface DashboardClientProps {
  userName: string;
  userImage?: string;
  hasData: boolean;
  progressPercent: number;
  activePlan: any;
  pendingSteps: any[];
  pendingDocs: any[];
  recentNotifications: any[];
  recentAchievements: any[];
  latestCRS: any;
  latestLanguageTests: any[];
  profiles: any[];
}

export function DashboardClient({
  userName,
  hasData,
  progressPercent,
  activePlan,
  pendingSteps,
  pendingDocs,
  recentNotifications,
  recentAchievements,
  latestCRS,
  latestLanguageTests,
  profiles,
}: DashboardClientProps) {
  const firstName = userName.split(" ")[0];

  // Empty state — fresh account
  if (!hasData) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Bem-vindo, {firstName}!
        </h1>
        <p className="mx-auto mb-10 max-w-md text-base text-foreground-muted">
          Comece sua jornada para o Canada configurando seu perfil e escolhendo
          um programa de imigracao.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-light hover:shadow-md active:scale-[0.98]"
          >
            Comecar Onboarding
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-surface hover:border-foreground-dim"
          >
            Explorar Programas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Ola, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Acompanhe o progresso da sua jornada para o Canada.
        </p>
      </div>

      {/* Top row — Progress + Next Actions + CRS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Progress Ring Card */}
        <div className="rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Progresso Geral
          </h2>
          <div className="flex items-center justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-36 w-36 -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="7"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${(progressPercent / 100) * 351.86} 351.86`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-3xl font-bold text-foreground">
                {progressPercent}%
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs font-medium text-foreground-dim">
            da jornada concluida
          </p>
        </div>

        {/* Next Actions Card */}
        <div className="rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              Proximas Acoes
            </h2>
            <Link
              href="/journey"
              className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
            >
              Ver todas
            </Link>
          </div>
          {pendingSteps.length > 0 ? (
            <ul className="space-y-3.5">
              {pendingSteps.map((step: any) => (
                <li key={step.id} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface">
                    <Clock className="h-3.5 w-3.5 text-foreground-muted" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {step.title}
                    </p>
                    {step.dueDate && (
                      <p className="text-xs text-foreground-dim">
                        Prazo: {new Date(step.dueDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-28 items-center justify-center text-sm text-foreground-dim">
              Nenhuma acao pendente
            </div>
          )}
        </div>

        {/* CRS Score Card */}
        <div className="rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              Score CRS
            </h2>
            <Link
              href="/simulator"
              className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
            >
              Simular
            </Link>
          </div>
          {latestCRS ? (
            <div className="text-center">
              <p className="text-5xl font-bold text-primary">
                {latestCRS.totalScore}
              </p>
              <p className="mt-1 text-xs font-medium text-foreground-dim">pontos</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-foreground-dim">Core</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    {latestCRS.coreScore || "--"}
                  </p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-foreground-dim">Conjuge</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    {latestCRS.spouseScore || "--"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                <Target className="h-7 w-7 text-foreground-dim" />
              </div>
              <p className="text-sm text-foreground-dim">
                Calcule seu score CRS
              </p>
              <Link
                href="/simulator"
                className="rounded-xl bg-primary/10 px-5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                Ir ao Simulador
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Second row — Plan + Documents + Language */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Plan Card */}
        <div className="rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              Plano Ativo
            </h2>
            <Link
              href="/plans"
              className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
            >
              Ver planos
            </Link>
          </div>
          {activePlan ? (
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {activePlan.program?.name || "Programa"}
                  </p>
                  <p className="text-xs text-foreground-dim">
                    Plano A — {activePlan.status}
                  </p>
                </div>
              </div>
              {activePlan.targetDate && (
                <p className="text-xs text-foreground-dim">
                  Meta: {new Date(activePlan.targetDate).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                <BookOpen className="h-7 w-7 text-foreground-dim" />
              </div>
              <p className="text-sm text-foreground-dim">
                Nenhum plano configurado
              </p>
              <Link
                href="/programs"
                className="rounded-xl bg-primary/10 px-5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                Escolher Programa
              </Link>
            </div>
          )}
        </div>

        {/* Documents Card */}
        <div className="rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              Documentos Pendentes
            </h2>
            <Link
              href="/documents"
              className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
            >
              Ver todos
            </Link>
          </div>
          {pendingDocs.length > 0 ? (
            <ul className="space-y-3">
              {pendingDocs.slice(0, 3).map((doc: any) => (
                <li key={doc.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                    <FileText className="h-4 w-4 text-warning" />
                  </div>
                  <span className="truncate text-sm text-foreground">
                    {doc.name}
                  </span>
                </li>
              ))}
              {pendingDocs.length > 3 && (
                <li className="text-xs font-medium text-foreground-dim">
                  +{pendingDocs.length - 3} mais
                </li>
              )}
            </ul>
          ) : (
            <div className="flex h-24 items-center justify-center gap-2 text-sm text-foreground-dim">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Tudo em dia
            </div>
          )}
        </div>

        {/* Language Score Card */}
        <div className="rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              Idiomas
            </h2>
            <Link
              href="/languages"
              className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
            >
              Detalhes
            </Link>
          </div>
          {latestLanguageTests.length > 0 ? (
            <div className="space-y-3.5">
              {latestLanguageTests.slice(0, 2).map((test: any) => (
                <div key={test.id} className="rounded-xl bg-surface p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {test.testType}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      CLB {test.clbEquivalent || "--"}
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 rounded-full bg-border/50">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-primary-light transition-all"
                      style={{
                        width: `${Math.min(((test.overallScore || 0) / 9) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                <BookOpen className="h-7 w-7 text-foreground-dim" />
              </div>
              <p className="text-sm text-foreground-dim">
                Nenhum teste registrado
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Third row — Alerts + Achievements */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Alerts Card */}
        <div className="rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              Alertas Recentes
            </h2>
            <Link
              href="/notifications"
              className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
            >
              Ver todos
            </Link>
          </div>
          {recentNotifications.length > 0 ? (
            <ul className="space-y-4">
              {recentNotifications.map((notif: any) => (
                <li key={notif.id} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {notif.title}
                    </p>
                    <p className="truncate text-xs text-foreground-dim">
                      {notif.message}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-24 items-center justify-center text-sm text-foreground-dim">
              Nenhum alerta no momento
            </div>
          )}
        </div>

        {/* Achievements Card */}
        <div className="rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              Conquistas Recentes
            </h2>
            <Link
              href="/achievements"
              className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
            >
              Ver todas
            </Link>
          </div>
          {recentAchievements.length > 0 ? (
            <ul className="space-y-4">
              {recentAchievements.map((ach: any) => (
                <li key={ach.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                    <Trophy className="h-5 w-5 text-warning" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {ach.name}
                    </p>
                    <p className="truncate text-xs text-foreground-dim">
                      {ach.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                <Trophy className="h-7 w-7 text-foreground-dim" />
              </div>
              <p className="text-sm text-foreground-dim">
                Complete etapas para desbloquear conquistas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profiles overview */}
      {profiles.length > 1 && (
        <div className="rounded-2xl border border-border/60 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Membros do Household
          </h2>
          <div className="flex flex-wrap gap-4">
            {profiles.map((profile: any) => (
              <div
                key={profile.id}
                className="flex items-center gap-3 rounded-xl bg-surface p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {profile.firstName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-xs text-foreground-dim">
                    {profile.isPrimaryApplicant
                      ? "Aplicante Principal"
                      : "Conjuge"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
