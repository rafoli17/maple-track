"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Languages,
  GraduationCap,
  Users,
  Send,
  PartyPopper,
  Stamp,
  Plane,
  Home,
  Flag,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Circle,
  ChevronRight,
  Lock,
  TrendingUp,
  X,
  Lightbulb,
  AlertTriangle,
  FileText,
  Clock,
  Info,
  Link2,
  User,
} from "lucide-react";
import type { MacroMilestoneWithStatus, MicroStep } from "@/lib/macro-journey";
import { getCurrentMilestoneIndex } from "@/lib/macro-journey";
import { getStepGuidance, type StepGuidance } from "@/lib/step-guidance";
import { useCelebration } from "@/components/gamification/achievement-celebration-provider";

const ICON_MAP: Record<string, any> = {
  Search, Languages, GraduationCap, Send, PartyPopper, Stamp, Plane, Home, Flag,
};

const PLAN_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  PRIMARY: { bg: "bg-primary/10", text: "text-primary", label: "Plano A" },
  SECONDARY: { bg: "bg-accent/10", text: "text-accent", label: "Plano B" },
  TERTIARY: { bg: "bg-warning/10", text: "text-warning", label: "Plano C" },
};

interface JourneyClientProps {
  allPlans: any[];
  macroMilestones: MacroMilestoneWithStatus[];
  profiles?: any[];
}

export function JourneyClient({ allPlans, macroMilestones, profiles = [] }: JourneyClientProps) {
  const router = useRouter();
  const { celebrateMultiple } = useCelebration();
  const currentIndex = getCurrentMilestoneIndex(macroMilestones);
  const [expandedId, setExpandedId] = React.useState<string | null>(
    macroMilestones[currentIndex]?.id || null
  );
  const [showPlanB, setShowPlanB] = React.useState(false);
  const [showPlanC, setShowPlanC] = React.useState(false);
  const [optimisticSteps, setOptimisticSteps] = React.useState<Record<string, string>>({});
  const [updatingIds, setUpdatingIds] = React.useState<Set<string>>(new Set());
  const [modalStep, setModalStep] = React.useState<MicroStep | null>(null);
  const modalGuidance = modalStep ? getStepGuidance(modalStep.title) : null;

  // ESC to close modal
  React.useEffect(() => {
    if (!modalStep) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setModalStep(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalStep]);
  const [assignFilter, setAssignFilter] = React.useState<"all" | "mine" | "spouse" | "shared">("all");

  // Determine logged-in user's profile (primary applicant)
  const myProfile = profiles.find((p: any) => p.isPrimaryApplicant);
  const spouseProfile = profiles.find((p: any) => !p.isPrimaryApplicant);

  const totalSteps = macroMilestones.reduce((s, m) => s + m.totalSteps, 0);
  const completedSteps = macroMilestones.reduce((s, m) => s + m.completedSteps, 0);
  const overallProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Bonus progress from B/C plans
  const bonusCompleted = macroMilestones.reduce((s, m) => s + m.bonusCompleted, 0);
  const bonusTotal = macroMilestones.reduce((s, m) => s + m.bonusTotal, 0);
  const bonusPercent = bonusTotal > 0 ? Math.round((bonusCompleted / bonusTotal) * 100) : 0;

  const getEffectiveStatus = (step: MicroStep) => optimisticSteps[step.id] || step.status;

  const toggleStep = async (step: MicroStep, milestoneName: string, milestoneSteps: MicroStep[]) => {
    if (step.status === "BLOCKED" || updatingIds.has(step.id)) return;

    const newStatus = step.status === "DONE" ? "TODO" : "DONE";
    const wasCompleting = newStatus === "DONE";

    setOptimisticSteps((prev) => ({ ...prev, [step.id]: newStatus }));
    setUpdatingIds((prev) => new Set(prev).add(step.id));

    const otherStepsDone = milestoneSteps
      .filter((s) => s.id !== step.id)
      .every((s) => {
        const eff = optimisticSteps[s.id] || s.status;
        return eff === "DONE" || eff === "SKIPPED";
      });
    const willComplete = wasCompleting && otherStepsDone;

    try {
      const res = await fetch(`/api/journey/steps/${step.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();

      // Check for new or revoked achievements
      const data = await res.json().catch(() => ({}));
      if (data.newAchievements?.length > 0) {
        const celebrations = data.newAchievements.map((ach: any) => ({
          name: typeof ach === "string" ? ach : ach.name,
          description: typeof ach === "string" ? undefined : undefined,
          xp: typeof ach === "object" ? ach.xp : undefined,
          tier: (typeof ach === "object" && ach.xp >= 200 ? "epic" : "normal") as "epic" | "normal",
        }));
        setTimeout(() => celebrateMultiple(celebrations), 600);
      }
      if (data.revokedAchievements?.length > 0) {
        for (const achName of data.revokedAchievements) {
          setTimeout(() => {
            toast.error(`Conquista perdida`, {
              description: `${achName}`,
              duration: 5000,
            });
          }, 800);
        }
      }

      if (willComplete) {
        // Find the next milestone name for the celebration message
        const currentIdx = macroMilestones.findIndex((m) =>
          m.steps.some((s) => s.id === step.id)
        );
        const nextMs = macroMilestones[currentIdx + 1];
        toast.success(`"${milestoneName}" concluido!`, {
          description: nextMs
            ? `Proximo foco: ${nextMs.name}. Voces estao cada vez mais perto!`
            : "Parabens! Voces avancaram na jornada.",
          duration: 6000,
        });
      } else if (wasCompleting) {
        toast("Etapa concluida", {
          description: step.title, duration: 3000,
          action: { label: "Desfazer", onClick: () => undoStep(step.id) },
        });
      } else {
        toast("Etapa reaberta", { description: step.title, duration: 2000 });
      }
      router.refresh();
    } catch {
      setOptimisticSteps((prev) => { const n = { ...prev }; delete n[step.id]; return n; });
      toast.error("Erro ao atualizar etapa");
    } finally {
      setUpdatingIds((prev) => { const n = new Set(prev); n.delete(step.id); return n; });
    }
  };

  const undoStep = async (stepId: string) => {
    setOptimisticSteps((prev) => ({ ...prev, [stepId]: "TODO" }));
    try {
      const res = await fetch(`/api/journey/steps/${stepId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "TODO" }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.revokedAchievements?.length > 0) {
        for (const achName of data.revokedAchievements) {
          setTimeout(() => {
            toast.error(`Conquista perdida`, {
              description: `${achName}`,
              duration: 5000,
            });
          }, 800);
        }
      }
      router.refresh();
    } catch {
      setOptimisticSteps((prev) => { const n = { ...prev }; delete n[stepId]; return n; });
    }
  };

  const filterByAssignment = (steps: MicroStep[]) => {
    if (assignFilter === "all") return steps;
    if (assignFilter === "mine") return steps.filter((s) => s.assignedTo === myProfile?.id || !s.assignedTo);
    if (assignFilter === "spouse") return steps.filter((s) => s.assignedTo === spouseProfile?.id || !s.assignedTo);
    if (assignFilter === "shared") return steps.filter((s) => !s.assignedTo);
    return steps;
  };

  const getVisibleSteps = (steps: MicroStep[]) => {
    // Only show PRIMARY steps by default — B and C are in collapsible sections
    const primaryOnly = steps.filter((s) => s.planPriority === "PRIMARY");
    return filterByAssignment(primaryOnly);
  };
  const getPlanBSteps = (steps: MicroStep[]) =>
    filterByAssignment(steps.filter((s) => s.planPriority === "SECONDARY"));
  const getPlanCSteps = (steps: MicroStep[]) =>
    filterByAssignment(steps.filter((s) => s.planPriority === "TERTIARY"));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Jornada de Imigracao</h1>
        <p className="text-sm text-foreground-muted">
          Todos os passos da pesquisa ate a cidadania canadense
        </p>
      </div>

      {/* Overall Progress Card — PRIMARY plan only */}
      <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">Progresso do Plano A</p>
              <p className="text-xs text-foreground-muted truncate">
                {completedSteps} de {totalSteps} etapas do caminho principal
              </p>
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-primary shrink-0">{overallProgress}%</span>
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-border/40">
          <div
            className="h-2.5 rounded-full bg-primary transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Secondary details: bonus + plans (muted) */}
        <div className="mt-4 border-t border-border/40 pt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-foreground-dim">
            {bonusCompleted > 0 && (
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5" />
                Preparo extra +{bonusPercent}%
                <span className="opacity-70">({bonusCompleted}/{bonusTotal})</span>
              </span>
            )}
            {bonusCompleted > 0 && allPlans.length > 0 && (
              <span className="text-foreground-dim/40">•</span>
            )}
            {allPlans.map((plan: any, i: number) => {
              const pc = PLAN_COLORS[plan.priority] || PLAN_COLORS.PRIMARY;
              return (
                <span key={plan.id} className="inline-flex items-center gap-1">
                  {i > 0 && <span className="text-foreground-dim/40">•</span>}
                  <span className={`font-semibold ${pc.text} opacity-70`}>{pc.label}</span>
                  <span className="truncate max-w-[100px] sm:max-w-[140px]">{plan.program?.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Status Legend + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-foreground-dim flex-wrap">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-success" /> Concluido</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Em progresso</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-border" /> Futuro</span>
        </div>

        {/* Responsibility filter */}
        {profiles.length > 1 && (
          <div className="flex items-center gap-1 rounded-xl bg-surface p-1 overflow-x-auto max-w-full">
            {[
              { key: "all" as const, label: "Todas" },
              { key: "mine" as const, label: myProfile?.firstName || "Eu" },
              { key: "spouse" as const, label: spouseProfile?.firstName || "Conjuge" },
              { key: "shared" as const, label: "Compartilhadas" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setAssignFilter(opt.key)}
                className={`rounded-lg px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  assignFilter === opt.key
                    ? "bg-white text-foreground shadow-sm"
                    : "text-foreground-dim hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {macroMilestones.map((milestone, index) => {
          const Icon = ICON_MAP[milestone.icon] || Circle;
          const isExpanded = expandedId === milestone.id;
          const isCurrent = index === currentIndex;
          const isCompleted = milestone.status === "COMPLETED";
          const isInProgress = milestone.status === "IN_PROGRESS";
          const isLocked = !isCompleted && !isInProgress && !isCurrent && index > currentIndex + 1;
          const visibleSteps = getVisibleSteps(milestone.steps);
          const planBSteps = getPlanBSteps(milestone.steps);
          const planCSteps = getPlanCSteps(milestone.steps);
          const progress = milestone.totalSteps > 0
            ? Math.round((milestone.completedSteps / milestone.totalSteps) * 100) : 0;

          return (
            <div key={milestone.id} className="relative flex gap-4 pb-2">
              {/* Vertical line */}
              {index < macroMilestones.length - 1 && (
                <div
                  className={`absolute left-[22px] top-[52px] bottom-0 w-0.5 ${
                    isCompleted ? "bg-success" : isCurrent ? "bg-primary/30" : "bg-border/60"
                  }`}
                />
              )}

              {/* Number circle */}
              <div className="relative z-10 shrink-0">
                <div
                  className={`flex h-[44px] w-[44px] items-center justify-center rounded-2xl text-sm font-bold transition-all ${
                    isCompleted
                      ? "bg-success text-white"
                      : isCurrent
                        ? "bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary/10"
                        : isInProgress
                          ? "bg-primary/15 text-primary"
                          : "bg-surface text-foreground-dim"
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                </div>
              </div>

              {/* Content card */}
              <div className="flex-1 pb-4">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                  className={`w-full text-left rounded-2xl border bg-white p-4 transition-all hover:shadow-md ${
                    isCurrent
                      ? "border-primary/20 shadow-sm"
                      : isCompleted
                        ? "border-success/20 bg-success/[0.02]"
                        : "border-border/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isCompleted ? "bg-success/10 text-success" :
                      isCurrent || isInProgress ? "bg-primary/10 text-primary" :
                      "bg-surface text-foreground-dim"
                    }`}>
                      {isLocked ? <Lock className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          isCompleted ? "text-success" :
                          isCurrent ? "text-foreground" : "text-foreground-muted"
                        }`}>
                          {milestone.name}
                        </span>
                        {isCurrent && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            ATUAL
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground-dim mt-0.5">{milestone.description}</p>
                    </div>

                    {/* Progress + chevron */}
                    <div className="flex items-center gap-3 shrink-0">
                      {milestone.totalSteps > 0 && (
                        <div className="text-right hidden sm:block">
                          <span className="text-xs font-semibold text-foreground">{progress}%</span>
                          <p className="text-[10px] text-foreground-dim">
                            {milestone.completedSteps}/{milestone.totalSteps}
                          </p>
                        </div>
                      )}
                      {isLocked ? (
                        <span className="text-[10px] text-foreground-dim italic">Bloqueado</span>
                      ) : milestone.totalSteps > 0 ? (
                        isExpanded ? <ChevronUp className="h-4 w-4 text-foreground-dim" /> :
                        <ChevronDown className="h-4 w-4 text-foreground-dim" />
                      ) : null}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {milestone.totalSteps > 0 && (
                    <div className="mt-3 h-1.5 rounded-full bg-border/40">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          isCompleted ? "bg-success" : "bg-primary"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </button>

                {/* Expanded steps */}
                {isExpanded && !isLocked && milestone.steps.length > 0 && (
                  <div className="mt-2 rounded-2xl border border-border/40 bg-surface/30 p-4">
                    <ul className="space-y-1.5">
                      {visibleSteps.map((step) => {
                        const eff = getEffectiveStatus(step);
                        const isDone = eff === "DONE";
                        const isBlocked = eff === "BLOCKED";
                        const isUpdating = updatingIds.has(step.id);
                        const planColor = PLAN_COLORS[step.planPriority] || PLAN_COLORS.PRIMARY;

                        return (
                          <li
                            key={step.id}
                            className="group flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)]"
                          >
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleStep(step, milestone.name, milestone.steps)}
                              disabled={isBlocked || isUpdating}
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all ${
                                isDone
                                  ? "bg-success text-white"
                                  : isBlocked
                                    ? "bg-error/5 border border-error/20 cursor-not-allowed"
                                    : "border border-border bg-white hover:border-primary/50 hover:bg-primary/5"
                              } ${isUpdating ? "animate-pulse" : ""}`}
                            >
                              <Check className={`h-3 w-3 transition-all ${
                                isDone ? "scale-100" : "scale-0 group-hover:scale-75 group-hover:text-primary/30"
                              }`} />
                            </button>

                            {/* Title + description */}
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm leading-snug ${
                                isDone ? "line-through text-foreground-dim" : "text-foreground"
                              }`}>
                                {step.title}
                              </p>
                              {step.description && !isDone && (
                                <p className="mt-0.5 text-xs text-foreground-dim line-clamp-1">
                                  {step.description}
                                </p>
                              )}
                            </div>

                            {/* Assignee avatar */}
                            {(() => {
                              const assignee = step.assignedTo
                                ? profiles.find((p: any) => p.id === step.assignedTo)
                                : null;
                              if (assignee) {
                                return assignee.user?.image ? (
                                  <span title={assignee.firstName || ""} className="shrink-0">
                                    <img
                                      src={assignee.user.image}
                                      alt={assignee.firstName || ""}
                                      className="h-5 w-5 rounded-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </span>
                                ) : (
                                  <span
                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[9px] font-bold text-foreground-dim shrink-0"
                                    title={assignee.firstName || ""}
                                  >
                                    {assignee.firstName?.charAt(0) || "?"}
                                  </span>
                                );
                              }
                              return !step.assignedTo ? (
                                <span title="Tarefa compartilhada"><Users className="h-3.5 w-3.5 text-foreground-dim shrink-0" /></span>
                              ) : null;
                            })()}

                            {/* Plan badge */}
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${planColor.bg} ${planColor.text}`}>
                              {planColor.label}
                            </span>

                            {/* Ver detalhes button */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setModalStep(step); }}
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                getStepGuidance(step.title)
                                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                                  : "bg-surface text-foreground-dim hover:bg-border/40"
                              }`}
                              title="Ver detalhes"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>

                            {/* Action link */}
                            {step.actionUrl && !isDone && (
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

                    {/* Plan B — collapsible */}
                    {planBSteps.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowPlanB(!showPlanB)}
                          className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                        >
                          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showPlanB ? "rotate-90" : ""}`} />
                          Plano complementar ({planBSteps.length} etapas)
                        </button>
                        {showPlanB && (
                          <ul className="mt-2 space-y-1.5 rounded-xl border border-accent/10 bg-accent/[0.02] p-3">
                            {planBSteps.map((step) => {
                              const eff = getEffectiveStatus(step);
                              const isDone = eff === "DONE";
                              return (
                                <li key={step.id} className="group flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                                  <button
                                    onClick={() => toggleStep(step, milestone.name, milestone.steps)}
                                    disabled={updatingIds.has(step.id)}
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all ${
                                      isDone ? "bg-success text-white" : "border border-border bg-white hover:border-accent/50"
                                    } ${updatingIds.has(step.id) ? "animate-pulse" : ""}`}
                                  >
                                    <Check className={`h-3 w-3 ${isDone ? "scale-100" : "scale-0"}`} />
                                  </button>
                                  <div className="min-w-0 flex-1">
                                    <p className={`text-sm ${isDone ? "line-through text-foreground-dim" : "text-foreground"}`}>
                                      {step.title}
                                    </p>
                                  </div>
                                  <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                                    Plano B
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setModalStep(step); }}
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-foreground-dim hover:bg-border/40 transition-colors"
                                    title="Ver detalhes"
                                  >
                                    <Info className="h-3.5 w-3.5" />
                                  </button>
                                  {step.actionUrl && !isDone && (
                                    <Link href={step.actionUrl} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent hover:bg-accent/20">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Plan C — collapsible */}
                    {planCSteps.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowPlanC(!showPlanC)}
                          className="flex items-center gap-1.5 text-xs font-medium text-warning hover:text-warning/80 transition-colors"
                        >
                          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showPlanC ? "rotate-90" : ""}`} />
                          Plano alternativo ({planCSteps.length} etapas)
                        </button>
                        {showPlanC && (
                          <ul className="mt-2 space-y-1.5 rounded-xl border border-warning/10 bg-warning/[0.02] p-3">
                            {planCSteps.map((step) => {
                              const eff = getEffectiveStatus(step);
                              const isDone = eff === "DONE";
                              return (
                                <li key={step.id} className="group flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                                  <button
                                    onClick={() => toggleStep(step, milestone.name, milestone.steps)}
                                    disabled={updatingIds.has(step.id)}
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all ${
                                      isDone ? "bg-success text-white" : "border border-border bg-white hover:border-warning/50"
                                    } ${updatingIds.has(step.id) ? "animate-pulse" : ""}`}
                                  >
                                    <Check className={`h-3 w-3 ${isDone ? "scale-100" : "scale-0"}`} />
                                  </button>
                                  <div className="min-w-0 flex-1">
                                    <p className={`text-sm ${isDone ? "line-through text-foreground-dim" : "text-foreground"}`}>
                                      {step.title}
                                    </p>
                                  </div>
                                  <span className="shrink-0 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
                                    Plano C
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setModalStep(step); }}
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-foreground-dim hover:bg-border/40 transition-colors"
                                    title="Ver detalhes"
                                  >
                                    <Info className="h-3.5 w-3.5" />
                                  </button>
                                  {step.actionUrl && !isDone && (
                                    <Link href={step.actionUrl} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning hover:bg-warning/20">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* STEP DETAIL MODAL — centered overlay                    */}
      {/* ══════════════════════════════════════════════════════ */}
      {modalStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[3px] animate-in fade-in duration-150"
            onClick={() => setModalStep(null)}
          />
          {/* Modal panel */}
          <div className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="shrink-0 border-b border-border/40 px-6 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-foreground leading-snug">
                    {modalStep.title}
                  </p>
                  {modalStep.description && (
                    <p className="mt-1.5 text-sm text-foreground-muted leading-relaxed">
                      {modalStep.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setModalStep(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-surface transition-colors"
                >
                  <X className="h-4 w-4 text-foreground-dim" />
                </button>
              </div>
              {/* Meta badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {(() => {
                  const pc = PLAN_COLORS[modalStep.planPriority] || PLAN_COLORS.PRIMARY;
                  return (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${pc.bg} ${pc.text}`}>
                      {pc.label}
                    </span>
                  );
                })()}
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  modalStep.status === "DONE"
                    ? "bg-success/10 text-success"
                    : modalStep.status === "BLOCKED"
                      ? "bg-error/10 text-error"
                      : "bg-surface text-foreground-muted"
                }`}>
                  {modalStep.status === "DONE" ? "Concluido" : modalStep.status === "BLOCKED" ? "Bloqueado" : "Pendente"}
                </span>
                {modalGuidance?.estimatedDays && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground-muted">
                    <Clock className="h-3 w-3" />
                    ~{modalGuidance.estimatedDays} dias
                  </span>
                )}
                {(() => {
                  const assignee = modalStep.assignedTo
                    ? profiles.find((p: any) => p.id === modalStep.assignedTo)
                    : null;
                  const label = assignee ? assignee.firstName : "Compartilhada";
                  return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground-muted">
                      <User className="h-3 w-3" />
                      {label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {modalGuidance ? (
                <>
                  {/* What it is */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-foreground-muted mb-2 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" />
                      O que e
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {modalGuidance.whatItIs}
                    </p>
                  </div>

                  {/* Why it matters */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-foreground-muted mb-2 flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5" />
                      Por que importa
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {modalGuidance.whyItMatters}
                    </p>
                  </div>

                  {/* How to do */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-foreground-muted mb-2 flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5" />
                      Como fazer
                    </h3>
                    <ol className="space-y-2">
                      {modalGuidance.howToDo.map((s, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-foreground">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tips */}
                  {modalGuidance.tips && modalGuidance.tips.length > 0 && (
                    <div className="rounded-xl bg-accent/5 border border-accent/10 p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-accent mb-2 flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5" />
                        Dicas
                      </h3>
                      <ul className="space-y-1.5">
                        {modalGuidance.tips.map((tip, i) => (
                          <li key={i} className="flex gap-2 text-sm text-foreground">
                            <span className="shrink-0 text-accent mt-1">•</span>
                            <span className="leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common mistakes */}
                  {modalGuidance.commonMistakes && modalGuidance.commonMistakes.length > 0 && (
                    <div className="rounded-xl bg-error/5 border border-error/10 p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-error mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Erros comuns
                      </h3>
                      <ul className="space-y-1.5">
                        {modalGuidance.commonMistakes.map((mistake, i) => (
                          <li key={i} className="flex gap-2 text-sm text-foreground">
                            <span className="shrink-0 text-error mt-1">•</span>
                            <span className="leading-relaxed">{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Documents needed */}
                  {modalGuidance.documentsNeeded && modalGuidance.documentsNeeded.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-foreground-muted mb-2 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        Documentos necessarios
                      </h3>
                      <ul className="space-y-1.5">
                        {modalGuidance.documentsNeeded.map((doc, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                            <FileText className="h-3.5 w-3.5 text-foreground-dim shrink-0" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* External links */}
                  {modalGuidance.externalLinks && modalGuidance.externalLinks.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wide text-foreground-muted mb-2 flex items-center gap-1.5">
                        <Link2 className="h-3.5 w-3.5" />
                        Links uteis
                      </h3>
                      <div className="space-y-1.5">
                        {modalGuidance.externalLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dependencies */}
                  {modalGuidance.dependencies && modalGuidance.dependencies.length > 0 && (
                    <div className="rounded-xl bg-warning/5 border border-warning/10 p-4">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-warning mb-2 flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5" />
                        Dependencias
                      </h3>
                      <ul className="space-y-1 text-sm text-foreground">
                        {modalGuidance.dependencies.map((dep, i) => (
                          <li key={i}>• {dep}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                /* Fallback when no guidance is mapped */
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Info className="h-10 w-10 text-foreground-dim mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Detalhes desta etapa
                  </p>
                  <p className="text-xs text-foreground-muted max-w-xs leading-relaxed">
                    {modalStep.description || "Complete esta etapa para avancar na jornada. Em breve adicionaremos orientacoes detalhadas para cada passo."}
                  </p>
                </div>
              )}
            </div>

            {/* Footer — sticky action buttons */}
            <div className="shrink-0 border-t border-border/40 px-6 py-4 bg-white flex gap-3">
              {modalStep.actionUrl && (
                <Link
                  href={modalStep.actionUrl}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-light"
                  onClick={() => setModalStep(null)}
                >
                  <ExternalLink className="h-4 w-4" />
                  Ir para a pagina
                </Link>
              )}
              <button
                onClick={() => setModalStep(null)}
                className={`inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface ${
                  modalStep.actionUrl ? "" : "flex-1"
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
