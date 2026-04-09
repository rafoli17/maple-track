"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Search,
  Languages,
  GraduationCap,
  Send,
  PartyPopper,
  Stamp,
  Plane,
  Home,
  Flag,
  Circle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Users,
  Trophy,
  FileText,
  Bell,
} from "lucide-react";
import {
  ResearchStageIllustration,
  LanguageStageIllustration,
  EcaStageIllustration,
  SubmissionStageIllustration,
  ApprovalStageIllustration,
  VisaStageIllustration,
  LandingStageIllustration,
  PrStageIllustration,
  CitizenshipStageIllustration,
} from "@/components/illustrations/stages";
import type { MacroMilestoneWithStatus, MacroMilestoneId } from "@/lib/macro-journey";
import { getCurrentMilestoneIndex } from "@/lib/macro-journey";

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

// ─────────────────────────────────────────────
// Stage → illustration + tagline
// ─────────────────────────────────────────────
const STAGE_CONFIG: Record<
  MacroMilestoneId,
  { Illustration: React.FC<{ className?: string; width?: number }>; tagline: string; Icon: any }
> = {
  research: { Illustration: ResearchStageIllustration, tagline: "Hora de pesquisar e mapear seu caminho", Icon: Search },
  language_tests: { Illustration: LanguageStageIllustration, tagline: "Foque no idioma — sua maior alavanca de score", Icon: Languages },
  eca: { Illustration: EcaStageIllustration, tagline: "Reúna diplomas e envie para avaliação", Icon: GraduationCap },
  submission: { Illustration: SubmissionStageIllustration, tagline: "Hora de submeter — voce esta quase la", Icon: Send },
  approval: { Illustration: ApprovalStageIllustration, tagline: "Aguarde o convite — continue afiando seu CRS", Icon: PartyPopper },
  visa: { Illustration: VisaStageIllustration, tagline: "Documentos finais e exames medicos", Icon: Stamp },
  landing: { Illustration: LandingStageIllustration, tagline: "Prepare a mala — o Canada espera por voce", Icon: Plane },
  pr: { Illustration: PrStageIllustration, tagline: "Estabeleca-se com calma e estrategia", Icon: Home },
  citizenship: { Illustration: CitizenshipStageIllustration, tagline: "O ultimo passo: cidadao canadense", Icon: Flag },
};

export function DashboardClient({
  userName,
  hasData,
  progressPercent,
  pendingSteps,
  recentNotifications,
  recentAchievements,
  latestCRS,
  profiles,
  macroMilestones,
}: DashboardClientProps) {
  const firstName = userName.split(" ")[0];
  const currentIndex = macroMilestones ? getCurrentMilestoneIndex(macroMilestones) : 0;
  const currentMilestone = macroMilestones?.[currentIndex] || null;
  const nextMilestone = macroMilestones?.[currentIndex + 1] || null;
  const totalMs = macroMilestones?.length || 9;

  const stageId = (currentMilestone?.id as MacroMilestoneId) || "research";
  const stage = STAGE_CONFIG[stageId];
  const StageIllustration = stage.Illustration;
  const StageIcon = stage.Icon;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  // Top 3 actions for "Foco de hoje"
  const focusSteps = pendingSteps.slice(0, 3);

  // Phase progress in current milestone
  const currentDone = currentMilestone?.completedSteps || 0;
  const currentTotal = currentMilestone?.totalSteps || 0;
  const currentPct = currentTotal > 0 ? Math.round((currentDone / currentTotal) * 100) : 0;

  // Build "Sua semana" feed: merge achievements + notifications
  const feed: { id: string; type: "achievement" | "notification"; title: string; meta: string; icon: any; date: Date }[] = [];
  recentAchievements.forEach((a: any) => {
    feed.push({
      id: `a-${a.id}`,
      type: "achievement",
      title: a.name || "Conquista",
      meta: `+${a.xpReward || 0} XP`,
      icon: Trophy,
      date: new Date(a.unlockedAt || a.createdAt),
    });
  });
  recentNotifications.forEach((n: any) => {
    feed.push({
      id: `n-${n.id}`,
      type: "notification",
      title: n.title,
      meta: formatDay(new Date(n.createdAt)),
      icon: Bell,
      date: new Date(n.createdAt),
    });
  });
  feed.sort((a, b) => b.date.getTime() - a.date.getTime());
  const week = feed.slice(0, 7);

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
    <div className="space-y-5 sm:space-y-6">
      {/* ═══════════════════════════════════════════════════ */}
      {/* ZONA 1 — HERO CONTEXTUAL                            */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-primary p-5 text-white shadow-lg sm:p-8">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex flex-col-reverse items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {greeting}, {firstName}
            </p>
            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              Voce esta na fase de
              <br />
              <span className="text-white/95">{currentMilestone?.name || "Pesquisa"}</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/85 sm:text-base">
              {stage.tagline}
            </p>

            {currentTotal > 0 && (
              <p className="mt-4 text-xs font-semibold text-white/80">
                <span className="text-white">{currentDone}/{currentTotal}</span> etapas concluidas nesta fase
              </p>
            )}
          </div>

          {/* Illustration */}
          <div className="flex w-full justify-center md:w-auto md:flex-shrink-0">
            <StageIllustration className="h-auto w-44 sm:w-56 md:w-64" />
          </div>
        </div>

        {/* Macro stage dots */}
        <div className="relative z-10 mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 sm:gap-2">
          {macroMilestones?.map((m, i) => {
            const isCurrent = i === currentIndex;
            const isDone = m.status === "COMPLETED";
            return (
              <div
                key={m.id}
                className={`flex h-2.5 flex-1 min-w-[20px] rounded-full transition-all ${
                  isDone
                    ? "bg-white"
                    : isCurrent
                    ? "bg-white/90 ring-2 ring-white/40"
                    : "bg-white/25"
                }`}
                title={m.name}
              />
            );
          })}
        </div>
        <div className="relative z-10 mt-2 flex items-center justify-between text-[10px] font-medium text-white/70 sm:text-xs">
          <span>Inicio</span>
          <span>Fase {currentIndex + 1} de {totalMs}</span>
          <span>Cidadania</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ZONA 2 — FOCO DE HOJE                               */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="rounded-2xl border border-border/60 bg-white p-4 sm:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground sm:text-lg">Foco de hoje</h2>
            <p className="text-xs text-foreground-muted">
              {focusSteps.length > 0 ? "3 acoes para mover sua jornada" : "Tudo em dia por aqui"}
            </p>
          </div>
          <Link
            href="/journey"
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-light"
          >
            Ver tudo
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {focusSteps.length > 0 ? (
          <ul className="space-y-2">
            {focusSteps.map((step: any) => (
              <li key={step.id}>
                <Link
                  href={step.actionUrl || "/journey"}
                  className="group flex items-start gap-3 rounded-xl border border-border/40 bg-surface/30 p-3 transition-all hover:border-primary/30 hover:bg-primary/5 sm:p-4"
                >
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-foreground-dim group-hover:text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground line-clamp-2">
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="mt-0.5 text-xs text-foreground-muted line-clamp-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-foreground-dim transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl bg-surface/40 py-8 text-center">
            <CheckCircle2 className="mb-2 h-8 w-8 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Voce esta em dia!
            </p>
            <p className="mt-1 text-xs text-foreground-muted">
              Veja a jornada completa para planejar os proximos passos.
            </p>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ZONA 3 — PULSO (3 cards)                            */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {/* Progresso geral */}
        <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Progresso
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground sm:text-4xl">{progressPercent}</span>
            <span className="text-base font-semibold text-foreground-muted">%</span>
          </div>
          <p className="mt-1 text-[11px] text-foreground-dim">
            da jornada principal
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* CRS */}
        <Link
          href="/simulator"
          className="group rounded-2xl border border-border/60 bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-5"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            CRS Score
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground sm:text-4xl">
              {latestCRS?.totalScore || "—"}
            </span>
            {latestCRS?.totalScore && (
              <span className="text-xs font-semibold text-foreground-muted">pts</span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-foreground-dim">
            {latestCRS ? "ultimo calculo" : "Calcule no simulador"}
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:gap-1.5 transition-all">
            Simular
            <ChevronRight className="h-3 w-3" />
          </div>
        </Link>

        {/* Familia */}
        <Link
          href="/settings/household"
          className="group rounded-2xl border border-border/60 bg-white p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-5"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            <Users className="h-3.5 w-3.5 text-primary" />
            Familia
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground sm:text-4xl">
              {profiles.length}
            </span>
            <span className="text-xs font-semibold text-foreground-muted">
              {profiles.length === 1 ? "perfil" : "perfis"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-foreground-dim">
            no seu plano
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:gap-1.5 transition-all">
            Gerenciar
            <ChevronRight className="h-3 w-3" />
          </div>
        </Link>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ZONA 4 — SUA SEMANA                                 */}
      {/* ═══════════════════════════════════════════════════ */}
      {week.length > 0 && (
        <section className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground sm:text-lg">Sua semana</h2>
            <Link
              href="/notifications"
              className="text-xs font-semibold text-primary hover:text-primary-light"
            >
              Historico
            </Link>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {week.map((item) => {
              const Icon = item.icon;
              const isAchievement = item.type === "achievement";
              return (
                <div
                  key={item.id}
                  className={`flex w-32 shrink-0 flex-col items-center gap-2 rounded-2xl border p-3 ${
                    isAchievement
                      ? "border-primary/30 bg-primary/5"
                      : "border-border/40 bg-surface/30"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isAchievement ? "bg-primary/15" : "bg-white"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isAchievement ? "text-primary" : "text-foreground-muted"
                      }`}
                    />
                  </div>
                  <p className="text-center text-[11px] font-semibold leading-tight text-foreground line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-foreground-dim">{item.meta}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* ZONA 5 — PROXIMA FASE                               */}
      {/* ═══════════════════════════════════════════════════ */}
      {nextMilestone && (
        <Link
          href="/journey"
          className="group flex items-center gap-4 rounded-2xl border border-dashed border-border/60 bg-white p-4 transition-all hover:border-primary/40 hover:bg-primary/5 sm:p-5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <StageIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Proxima fase
            </p>
            <p className="mt-0.5 truncate text-sm font-bold text-foreground sm:text-base">
              {nextMilestone.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-foreground-muted">
              {nextMilestone.totalSteps} etapas • Veja o roadmap
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-foreground-dim transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      )}
    </div>
  );
}

function formatDay(d: Date) {
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
