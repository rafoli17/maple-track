"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Target,
  Users,
  Zap,
  ExternalLink,
  Search,
  Languages,
  GraduationCap,
  Send,
  PartyPopper,
  Stamp,
  Plane,
  Home,
  Flag,
  Check,
  Circle,
  ChevronRight,
} from "lucide-react";
import { FamilyIllustration } from "@/components/illustrations";
import type { MacroMilestoneWithStatus } from "@/lib/macro-journey";
import { getCurrentMilestoneIndex } from "@/lib/macro-journey";

const ICON_MAP: Record<string, any> = {
  Search, Languages, GraduationCap, Send, PartyPopper, Stamp, Plane, Home, Flag,
};

interface DashboardClientProps {
  userName: string;
  userImage?: string;
  hasData: boolean;
  progressPercent: number;
  bonusCompleted?: number;
  bonusTotal?: number;
  bonusPercent?: number;
  activePlan: any;
  allPlans: any[];
  pendingSteps: any[];
  pendingDocs: any[];
  documentAlerts?: any[];
  docsReady?: number;
  docsTotal?: number;
  recentNotifications: any[];
  recentAchievements: any[];
  latestCRS: any;
  latestLanguageTests: any[];
  profiles: any[];
  awaitingSpouse?: boolean;
  macroMilestones?: MacroMilestoneWithStatus[];
  missingDocs?: any[];
}

export function DashboardClient({
  userName,
  hasData,
  progressPercent,
  bonusCompleted = 0,
  bonusTotal = 0,
  bonusPercent = 0,
  activePlan,
  allPlans,
  pendingSteps,
  pendingDocs,
  documentAlerts = [],
  docsReady = 0,
  docsTotal = 0,
  recentNotifications,
  recentAchievements,
  latestCRS,
  latestLanguageTests,
  profiles,
  awaitingSpouse,
  macroMilestones,
  missingDocs = [],
}: DashboardClientProps) {
  const firstName = userName.split(" ")[0];
  const currentIndex = macroMilestones
    ? getCurrentMilestoneIndex(macroMilestones)
    : 0;
  const currentMilestone = macroMilestones?.[currentIndex] || null;
  const nextMilestone = macroMilestones?.[currentIndex + 1] || null;
  const prevMilestone = currentIndex > 0 ? macroMilestones?.[currentIndex - 1] || null : null;

  // Find the next actionable step for "Next Best Action"
  const nextAction = pendingSteps[0] || null;

  // Contextual greeting based on time + progress
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  // Contextual subtitle based on state
  const getContextMessage = () => {
    if (progressPercent === 0) return "Hora de comecar! Seu primeiro passo esta logo abaixo.";
    if (progressPercent < 15) return `Voce esta nos primeiros passos. Foco em "${currentMilestone?.name || "pesquisa"}".`;
    if (progressPercent < 40) return `Bom ritmo! ${currentMilestone?.completedSteps || 0} etapas concluidas na fase atual.`;
    if (progressPercent < 70) return "Mais da metade da jornada percorrida. Continue firme!";
    if (progressPercent < 100) return "A reta final esta proxima. Nao desista agora!";
    return "Parabens! Toda a jornada foi concluida!";
  };

  // Build the 3 visible milestones: prev (completed), current, next
  const visibleMilestones: { milestone: MacroMilestoneWithStatus; role: "prev" | "current" | "next" }[] = [];
  if (macroMilestones && macroMilestones.length > 0) {
    if (prevMilestone) visibleMilestones.push({ milestone: prevMilestone, role: "prev" });
    if (currentMilestone) visibleMilestones.push({ milestone: currentMilestone, role: "current" });
    if (nextMilestone) visibleMilestones.push({ milestone: nextMilestone, role: "next" });
  }

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
          Comece sua jornada para o Canada configurando seu perfil.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-light hover:shadow-md active:scale-[0.98]"
        >
          Comecar Onboarding
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {greeting}, {firstName}!
        </h1>
        <p className="text-sm text-foreground-muted">
          {getContextMessage()}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 1. NEXT BEST ACTION — primary banner (FIRST)          */}
      {/* ══════════════════════════════════════════════════════ */}
      {nextAction && (
        <Link
          href={nextAction.actionUrl || "/journey"}
          className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-primary p-4 sm:p-5 text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.005] active:scale-[0.995]"
        >
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Zap className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Proxima Acao</p>
            <p className="text-sm text-white/85 truncate">{nextAction.title}</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-white/60" />
        </Link>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 2. JOURNEY — focused view: prev + current + next      */}
      {/* ══════════════════════════════════════════════════════ */}
      {visibleMilestones.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden">
          {/* Journey Header */}
          <div className="relative bg-gradient-to-r from-primary/[0.03] to-primary/[0.08] px-5 sm:px-6 pt-5 pb-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <Flag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Jornada de Imigracao
                </h2>
                <p className="text-xs text-foreground-muted mt-0.5">
                  {progressPercent === 100
                    ? "Jornada completa! Parabens!"
                    : `Etapa ${currentIndex + 1} de ${macroMilestones!.length} — ${currentMilestone?.name || "Em andamento"}`}
                </p>
              </div>
              <Link
                href="/journey"
                className="shrink-0 flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/15"
              >
                Ver detalhes
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {/* Overall progress bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-border/40 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-primary shrink-0">{progressPercent}%</span>
            </div>
          </div>

          {/* Visible milestones: prev + current + next */}
          <div className="p-4 sm:p-5">
            <div className="space-y-1">
              {visibleMilestones.map(({ milestone, role }, index) => {
                const Icon = ICON_MAP[milestone.icon] || Circle;
                const isCurrent = role === "current";
                const isCompleted = milestone.status === "COMPLETED";
                const isInProgress = milestone.status === "IN_PROGRESS";
                const isFuture = role === "next";
                const stepPct = milestone.totalSteps > 0
                  ? Math.round((milestone.completedSteps / milestone.totalSteps) * 100)
                  : 0;

                return (
                  <div key={milestone.id} className="flex gap-3 sm:gap-4">
                    {/* Vertical connector line + icon */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full transition-all z-10 ${
                          isCompleted
                            ? "bg-success text-white shadow-sm"
                            : isCurrent
                              ? "bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10"
                              : isInProgress
                                ? "bg-primary/15 text-primary border-2 border-primary/30"
                                : "bg-surface text-foreground-dim border border-border/60"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                        {isCurrent && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                          </span>
                        )}
                      </div>
                      {index < visibleMilestones.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 min-h-[16px] ${
                            isCompleted ? "bg-success" : isCurrent ? "bg-primary/25" : "bg-border/60"
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-4 min-w-0 ${index === visibleMilestones.length - 1 ? "pb-0" : ""}`}>
                      <div
                        className={`rounded-xl p-3 sm:p-3.5 transition-all ${
                          isCurrent
                            ? "bg-primary/[0.04] border border-primary/15"
                            : isCompleted
                              ? "bg-success/[0.03]"
                              : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm font-semibold truncate ${
                                  isCurrent
                                    ? "text-foreground"
                                    : isCompleted
                                      ? "text-success"
                                      : "text-foreground-dim"
                                }`}
                              >
                                {milestone.name}
                              </h3>
                              {isCompleted && (
                                <span className="shrink-0 rounded-full bg-success/10 px-1.5 py-0.5 text-[9px] font-bold text-success uppercase">
                                  Concluido
                                </span>
                              )}
                              {isCurrent && (
                                <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                                  Em andamento
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-xs mt-0.5 ${
                                isFuture ? "text-foreground-dim/60" : "text-foreground-muted"
                              }`}
                            >
                              {milestone.description}
                            </p>
                          </div>

                          {/* Step count */}
                          {milestone.totalSteps > 0 && (
                            <div className="shrink-0 text-right">
                              <p className={`text-xs font-bold ${
                                isCompleted ? "text-success" :
                                isCurrent ? "text-primary" : "text-foreground-dim"
                              }`}>
                                {milestone.completedSteps}/{milestone.totalSteps}
                              </p>
                              <p className="text-[9px] text-foreground-dim">etapas</p>
                            </div>
                          )}
                        </div>

                        {/* Progress bar for current/in-progress milestones */}
                        {(isCurrent || isInProgress) && milestone.totalSteps > 0 && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-border/40 overflow-hidden">
                              <div
                                className="h-1.5 rounded-full bg-primary transition-all duration-700"
                                style={{ width: `${stepPct}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-primary">{stepPct}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 3. THREE METRIC CARDS (THIRD)                         */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {/* Journey Progress */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-foreground-muted">Progresso Plano A</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{progressPercent}%</p>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-border/40">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {bonusCompleted > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-semibold text-accent">
                Preparo extra: +{bonusPercent}%
              </span>
              <span className="text-[10px] text-foreground-dim">
                ({bonusCompleted}/{bonusTotal} planos B/C)
              </span>
            </div>
          )}
        </div>

        {/* Current Focus */}
        <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-success/10">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-foreground-muted">Foco Atual</p>
              <p className="text-sm sm:text-base font-bold text-foreground truncate">
                {currentMilestone?.name || "Pesquisa"}
              </p>
            </div>
          </div>
          {currentMilestone && currentMilestone.totalSteps > 0 && (
            <>
              <div className="mt-3 h-2 rounded-full bg-border/40">
                <div
                  className="h-2 rounded-full bg-success transition-all"
                  style={{
                    width: `${(currentMilestone.completedSteps / currentMilestone.totalSteps) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-1.5 text-xs text-foreground-dim">
                {currentMilestone.completedSteps}/{currentMilestone.totalSteps} etapas concluidas
              </p>
            </>
          )}
        </div>

        {/* CRS Score */}
        <Link
          href="/simulator"
          className="group rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-foreground-muted">Score CRS</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {latestCRS ? latestCRS.totalScore : "--"}
              </p>
            </div>
          </div>
          {latestCRS && activePlan?.program?.minimumCRS ? (
            <p className={`mt-3 text-xs font-semibold ${
              latestCRS.totalScore >= activePlan.program.minimumCRS
                ? "text-success" : "text-error"
            }`}>
              {latestCRS.totalScore >= activePlan.program.minimumCRS
                ? "Acima do minimo do programa"
                : `Faltam ${activePlan.program.minimumCRS - latestCRS.totalScore} pts para o minimo`}
            </p>
          ) : (
            <p className="mt-3 text-xs text-foreground-dim group-hover:text-primary transition-colors">
              Calcular score no simulador →
            </p>
          )}
        </Link>
      </div>

      {/* Awaiting spouse banner */}
      {awaitingSpouse && (
        <div className="flex items-center gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15">
            <Users className="h-4 w-4 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Aguardando conjuge</p>
            <p className="text-xs text-foreground-muted">Dados combinados para score CRS da familia</p>
          </div>
          <Link href="/settings/household" className="text-xs font-semibold text-accent hover:text-accent/80">
            Reenviar convite
          </Link>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* TWO COLUMNS: Priority Tasks + Family Progress         */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-5">
        {/* Priority Tasks — wider */}
        <div className="md:col-span-3 rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Tarefas Prioritarias</h2>
            <Link href="/journey" className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
              Ver todas →
            </Link>
          </div>

          {pendingSteps.length > 0 ? (
            <ul className="space-y-2">
              {pendingSteps.map((step: any) => {
                const planColors: Record<string, string> = {
                  PRIMARY: "bg-primary/10 text-primary",
                  SECONDARY: "bg-accent/10 text-accent",
                  TERTIARY: "bg-warning/10 text-warning",
                };
                const planLabels: Record<string, string> = {
                  PRIMARY: "A", SECONDARY: "B", TERTIARY: "C",
                };

                return (
                  <li
                    key={step.id}
                    className="flex items-center gap-3 rounded-xl bg-surface/50 px-4 py-3 transition-all hover:bg-surface"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-white">
                      <Circle className="h-3 w-3 text-foreground-dim" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {step.title}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      planColors[step.planPriority] || planColors.PRIMARY
                    }`}>
                      {planLabels[step.planPriority] || "A"}
                    </span>
                    {step.actionUrl && (
                      <Link
                        href={step.actionUrl}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-24 flex-col items-center justify-center gap-1 text-center">
              <CheckCircle2 className="h-6 w-6 text-success" />
              <p className="text-sm font-semibold text-success">Tudo em dia!</p>
              <p className="text-xs text-foreground-dim">
                {currentMilestone ? `Proximo marco: ${currentMilestone.name}` : "Continue explorando a jornada"}
              </p>
            </div>
          )}
        </div>

        {/* Family Progress — narrower */}
        <div className="md:col-span-2 rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-foreground-muted" />
            Progresso Familiar
          </h2>

          <div className="space-y-3">
            {profiles.map((profile: any) => {
              const isPrimary = profile.isPrimaryApplicant;
              const imageUrl = profile.user?.image;
              const initial = profile.firstName?.charAt(0)?.toUpperCase() || "?";

              // Language scores for this person
              const profileTests = latestLanguageTests.filter((t: any) => t.profileId === profile.id);
              const latestTest = profileTests[0];
              const scores = latestTest
                ? [latestTest.speaking, latestTest.listening, latestTest.reading, latestTest.writing]
                    .filter(Boolean).map(Number)
                : [];
              const avg = scores.length > 0
                ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1)
                : null;

              // Next task assigned to this person (or unassigned)
              const personTask = pendingSteps.find(
                (s: any) => s.assignedTo === profile.id || !s.assignedTo
              );

              return (
                <div key={profile.id} className="rounded-xl bg-surface/50 p-3">
                  {/* Person header */}
                  <div className="flex items-center gap-3 mb-2">
                    {imageUrl ? (
                      <img src={imageUrl} alt={profile.firstName || ""} className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                        isPrimary ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                      }`}>{initial}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{profile.firstName || "Membro"}</p>
                      <p className="text-[10px] text-foreground-dim">{isPrimary ? "Aplicante principal" : "Conjuge"}</p>
                    </div>
                    {/* Language score badge */}
                    {avg ? (
                      <div className="text-right">
                        <p className="text-base font-bold text-primary">{avg}</p>
                        <p className="text-[9px] text-foreground-dim">{latestTest?.testType?.replace("_", " ")}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-foreground-dim italic">Sem score</span>
                    )}
                  </div>
                  {/* Mini skill bars with labels and scores */}
                  {latestTest && scores.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {(["listening", "reading", "writing", "speaking"] as const).map((skill) => {
                        const skillLabels: Record<string, string> = {
                          listening: "L",
                          reading: "R",
                          writing: "W",
                          speaking: "S",
                        };
                        const skillNames: Record<string, string> = {
                          listening: "Listening",
                          reading: "Reading",
                          writing: "Writing",
                          speaking: "Speaking",
                        };
                        const val = Number(latestTest[skill]) || 0;
                        const max = latestTest.testType?.startsWith("IELTS") ? 9 : 12;
                        const pct = Math.min((val / max) * 100, 100);
                        return (
                          <div key={skill} className="text-center">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[9px] text-foreground-dim" title={skillNames[skill]}>{skillLabels[skill]}</span>
                              <span className="text-[9px] font-semibold text-foreground">{val}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-border/40">
                              <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Next task for this person */}
                  {personTask && (
                    <div className="flex items-center gap-2 mt-1 text-[11px]">
                      <ChevronRight className="h-3 w-3 text-primary shrink-0" />
                      <span className="text-foreground-muted truncate">{personTask.title}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {profiles.length <= 1 && awaitingSpouse && (
              <div className="flex items-center gap-3 rounded-xl bg-surface/50 p-3 opacity-50">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold">?</div>
                <p className="text-sm font-medium text-foreground-muted">Aguardando conjuge</p>
              </div>
            )}
          </div>

          {/* Plans summary */}
          <div className="mt-4 pt-3 border-t border-border/40">
            <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wide mb-2">Planos ativos</p>
            <div className="space-y-1.5">
              {allPlans.slice(0, 3).map((plan: any) => {
                const colors: Record<string, string> = {
                  PRIMARY: "bg-primary", SECONDARY: "bg-accent", TERTIARY: "bg-warning",
                };
                const labels: Record<string, string> = { PRIMARY: "A", SECONDARY: "B", TERTIARY: "C" };
                return (
                  <div key={plan.id} className="flex items-center gap-2 text-xs">
                    <span className={`h-2 w-2 rounded-full ${colors[plan.priority] || "bg-border"}`} />
                    <span className="font-medium text-foreground">{labels[plan.priority] || "?"}:</span>
                    <span className="text-foreground-muted truncate">{plan.program?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTEXT CARDS — CRS, Docs                             */}
      {/* ══════════════════════════════════════════════════════ */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
        {/* CRS Detail */}
        <Link href="/simulator" className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md group">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Score CRS</h3>
            <span className="text-xs font-medium text-primary group-hover:text-primary-light transition-colors">Simular →</span>
          </div>
          {latestCRS ? (
            <>
              <p className="text-3xl font-bold text-foreground mb-2">{latestCRS.totalScore}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-surface p-2">
                  <p className="text-foreground-dim">Core</p>
                  <p className="font-bold text-foreground">{latestCRS.coreScore || "--"}</p>
                </div>
                <div className="rounded-lg bg-surface p-2">
                  <p className="text-foreground-dim">Conjuge</p>
                  <p className="font-bold text-foreground">{latestCRS.spouseScore || "--"}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <Target className="h-8 w-8 text-foreground-dim" />
              <p className="text-xs text-foreground-dim">Calcule seu score</p>
            </div>
          )}
        </Link>

        {/* Documents */}
        <Link href="/documents" className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md group">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Documentos</h3>
            <span className="text-xs font-medium text-primary group-hover:text-primary-light transition-colors">Central →</span>
          </div>
          {docsTotal > 0 || missingDocs.length > 0 ? (
            <div>
              {docsTotal > 0 && (
                <>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{docsReady}<span className="text-sm font-normal text-foreground-dim">/{docsTotal}</span></p>
                    <span className="text-[10px] text-foreground-dim">prontos</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 mb-2">
                    <div
                      className="h-1.5 rounded-full bg-success transition-all"
                      style={{ width: `${docsTotal > 0 ? Math.round((docsReady / docsTotal) * 100) : 0}%` }}
                    />
                  </div>
                </>
              )}
              {/* Priority: alerts > missing docs > pending docs */}
              {documentAlerts.length > 0 ? (
                <div className="space-y-1.5">
                  {documentAlerts.slice(0, 2).map((alert: any, i: number) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-error shrink-0" />
                      <span className="truncate text-[10px] text-foreground">{alert.message}</span>
                    </div>
                  ))}
                </div>
              ) : missingDocs.length > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-warning mb-1">Documentos pendentes:</p>
                  {missingDocs.slice(0, 3).map((item: any) => (
                    <div key={item.doc.type} className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-warning shrink-0" />
                      <span className="truncate text-[10px] text-foreground">{item.doc.label}</span>
                    </div>
                  ))}
                </div>
              ) : docsReady === docsTotal && docsTotal > 0 ? (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span className="text-xs text-success font-medium">Tudo em dia</span>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex h-16 items-center justify-center gap-2 text-sm text-foreground-dim">
              <FileText className="h-4 w-4" /> Comece a organizar
            </div>
          )}
        </Link>
      </div>

    </div>
  );
}
