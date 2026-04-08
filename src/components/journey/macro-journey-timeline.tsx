"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
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
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Circle,
  Undo2,
  ChevronRight,
} from "lucide-react";
import type { MacroMilestoneWithStatus, MicroStep } from "@/lib/macro-journey";
import { getCurrentMilestoneIndex } from "@/lib/macro-journey";
import { useCelebration } from "@/components/gamification/achievement-celebration-provider";

const ICON_MAP: Record<string, any> = {
  Search,
  Languages,
  GraduationCap,
  Send,
  PartyPopper,
  Stamp,
  Plane,
  Home,
  Flag,
};

const PLAN_COLORS: Record<
  string,
  { bg: string; text: string; label: string; dot: string }
> = {
  PRIMARY: {
    bg: "bg-primary/10",
    text: "text-primary",
    label: "Plano A",
    dot: "bg-primary",
  },
  SECONDARY: {
    bg: "bg-accent/10",
    text: "text-accent",
    label: "Plano B",
    dot: "bg-accent",
  },
  TERTIARY: {
    bg: "bg-warning/10",
    text: "text-warning",
    label: "Plano C",
    dot: "bg-warning",
  },
};

const STEP_STATUS_STYLES: Record<
  string,
  { dot: string; text: string; checkBg: string; checkIcon: string }
> = {
  DONE: {
    dot: "bg-success",
    text: "line-through text-foreground-dim",
    checkBg: "bg-success text-white",
    checkIcon: "text-white",
  },
  IN_PROGRESS: {
    dot: "bg-info",
    text: "text-foreground font-medium",
    checkBg: "bg-info/10 text-info border border-info/30",
    checkIcon: "text-info",
  },
  TODO: {
    dot: "bg-border",
    text: "text-foreground",
    checkBg: "bg-surface border border-border hover:border-primary/40 hover:bg-primary/5",
    checkIcon: "text-transparent",
  },
  BLOCKED: {
    dot: "bg-error",
    text: "text-foreground-muted",
    checkBg: "bg-error/5 border border-error/20 cursor-not-allowed",
    checkIcon: "text-error/30",
  },
  SKIPPED: {
    dot: "bg-border",
    text: "line-through text-foreground-dim",
    checkBg: "bg-surface border border-border",
    checkIcon: "text-foreground-dim",
  },
};

interface MacroJourneyTimelineProps {
  milestones: MacroMilestoneWithStatus[];
  compact?: boolean;
}

export function MacroJourneyTimeline({
  milestones,
  compact = false,
}: MacroJourneyTimelineProps) {
  const router = useRouter();
  const { celebrateMultiple } = useCelebration();
  const currentIndex = getCurrentMilestoneIndex(milestones);
  const [expandedId, setExpandedId] = React.useState<string | null>(
    milestones[currentIndex]?.id || null
  );
  const [showPlanC, setShowPlanC] = React.useState(false);
  const [optimisticSteps, setOptimisticSteps] = React.useState<
    Record<string, string>
  >({});
  const [updatingIds, setUpdatingIds] = React.useState<Set<string>>(
    new Set()
  );

  const totalSteps = milestones.reduce((sum, m) => sum + m.totalSteps, 0);
  const completedSteps = milestones.reduce(
    (sum, m) => sum + m.completedSteps,
    0
  );
  const overallProgress =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Check if there are any Plan C steps
  const hasPlanC = milestones.some((m) =>
    m.steps.some((s) => s.planPriority === "TERTIARY")
  );

  const toggleStep = async (
    step: MicroStep,
    milestoneName: string,
    milestoneSteps: MicroStep[]
  ) => {
    if (step.status === "BLOCKED" || updatingIds.has(step.id)) return;

    const newStatus = step.status === "DONE" ? "TODO" : "DONE";
    const wasCompleting = newStatus === "DONE";

    // Optimistic update
    setOptimisticSteps((prev) => ({ ...prev, [step.id]: newStatus }));
    setUpdatingIds((prev) => new Set(prev).add(step.id));

    // Check if this completes the milestone
    const otherStepsDone = milestoneSteps
      .filter((s) => s.id !== step.id)
      .every((s) => {
        const effectiveStatus = optimisticSteps[s.id] || s.status;
        return effectiveStatus === "DONE" || effectiveStatus === "SKIPPED";
      });
    const willCompleteMilestone = wasCompleting && otherStepsDone;

    try {
      const res = await fetch(`/api/journey/steps/${step.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Check for achievement changes
      const data = await res.json().catch(() => ({}));
      if (data.newAchievements?.length > 0) {
        const celebrations = data.newAchievements.map((ach: any) => ({
          name: typeof ach === "string" ? ach : ach.name,
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

      // Toast feedback
      if (willCompleteMilestone) {
        toast.success(`Milestone "${milestoneName}" concluido!`, {
          description: "Parabens! Voces avancaram na jornada.",
          duration: 5000,
        });
      } else if (wasCompleting) {
        toast("Etapa concluida", {
          description: step.title,
          duration: 3000,
          action: {
            label: "Desfazer",
            onClick: () => undoStep(step.id),
          },
        });
      } else {
        toast("Etapa reaberta", {
          description: step.title,
          duration: 2000,
        });
      }

      router.refresh();
    } catch {
      // Revert optimistic update
      setOptimisticSteps((prev) => {
        const next = { ...prev };
        delete next[step.id];
        return next;
      });
      toast.error("Erro ao atualizar etapa");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(step.id);
        return next;
      });
    }
  };

  const undoStep = async (stepId: string) => {
    setOptimisticSteps((prev) => ({ ...prev, [stepId]: "TODO" }));
    try {
      const res = await fetch(`/api/journey/steps/${stepId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      setOptimisticSteps((prev) => {
        const next = { ...prev };
        delete next[stepId];
        return next;
      });
    }
  };

  const getEffectiveStatus = (step: MicroStep) =>
    optimisticSteps[step.id] || step.status;

  // Filter steps by plan visibility
  const getVisibleSteps = (steps: MicroStep[]) => {
    if (showPlanC) return steps;
    return steps.filter((s) => s.planPriority !== "TERTIARY");
  };

  const getPlanCSteps = (steps: MicroStep[]) =>
    steps.filter((s) => s.planPriority === "TERTIARY");

  return (
    <div className="rounded-2xl border border-border/60 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-border/40 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Jornada para o Canada
            </h2>
            <p className="mt-0.5 text-xs text-foreground-muted">
              {completedSteps} de {totalSteps} etapas concluidas
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">
              {overallProgress}%
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="mt-3 h-2 rounded-full bg-border/50">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Horizontal milestone dots */}
        <div className="mt-4 flex items-center justify-between">
          {milestones.map((milestone, index) => {
            const Icon = ICON_MAP[milestone.icon] || Circle;
            const isCurrent = index === currentIndex;
            const isCompleted = milestone.status === "COMPLETED";

            return (
              <React.Fragment key={milestone.id}>
                {index > 0 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      isCompleted
                        ? "bg-success"
                        : index <= currentIndex
                          ? "bg-primary/30"
                          : "bg-border"
                    }`}
                  />
                )}
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === milestone.id ? null : milestone.id
                    )
                  }
                  className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                    isCompleted
                      ? "bg-success text-white"
                      : isCurrent
                        ? "bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-primary/10"
                        : "bg-surface text-foreground-dim"
                  }`}
                  title={milestone.name}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                  {isCurrent && (
                    <span className="absolute -bottom-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-primary ring-2 ring-white" />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Expandable milestone details */}
      <div className="divide-y divide-border/30">
        {milestones.map((milestone, index) => {
          const Icon = ICON_MAP[milestone.icon] || Circle;
          const isExpanded = expandedId === milestone.id;
          const isCurrent = index === currentIndex;
          const isCompleted = milestone.status === "COMPLETED";
          const isInProgress = milestone.status === "IN_PROGRESS";
          const visibleSteps = getVisibleSteps(milestone.steps);
          const planCSteps = getPlanCSteps(milestone.steps);

          return (
            <div key={milestone.id}>
              {/* Milestone row */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : milestone.id)
                }
                className={`flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors sm:px-6 ${
                  isCurrent
                    ? "bg-primary/[0.03]"
                    : isExpanded
                      ? "bg-surface/50"
                      : "hover:bg-surface/30"
                }`}
              >
                {/* Status icon */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isCompleted
                      ? "bg-success/10 text-success"
                      : isInProgress
                        ? "bg-primary/10 text-primary"
                        : "bg-surface text-foreground-dim"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4.5 w-4.5" />
                  ) : (
                    <Icon className="h-4.5 w-4.5" />
                  )}
                </div>

                {/* Title + progress */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        isCompleted
                          ? "text-success"
                          : isCurrent
                            ? "text-foreground"
                            : "text-foreground-muted"
                      }`}
                    >
                      {milestone.name}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        ATUAL
                      </span>
                    )}
                  </div>
                  {milestone.totalSteps > 0 && (
                    <span className="text-xs text-foreground-dim">
                      {milestone.completedSteps}/{milestone.totalSteps} etapas
                    </span>
                  )}
                </div>

                {/* Progress mini-bar */}
                {milestone.totalSteps > 0 && !compact && (
                  <div className="hidden w-20 sm:block">
                    <div className="h-1.5 rounded-full bg-border/50">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          isCompleted ? "bg-success" : "bg-primary"
                        }`}
                        style={{
                          width: `${(milestone.completedSteps / milestone.totalSteps) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Chevron */}
                {milestone.totalSteps > 0 &&
                  (isExpanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-foreground-dim" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-foreground-dim" />
                  ))}
              </button>

              {/* Expanded: micro steps grouped by plan */}
              {isExpanded && milestone.steps.length > 0 && (
                <div className="border-t border-border/20 bg-surface/30 px-5 py-4 sm:px-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground-dim">
                    {milestone.description}
                  </p>

                  {/* Main steps (Plan A + Plan B) */}
                  <ul className="space-y-1.5">
                    {visibleSteps.map((step) => (
                      <StepItem
                        key={step.id}
                        step={step}
                        effectiveStatus={getEffectiveStatus(step)}
                        isUpdating={updatingIds.has(step.id)}
                        onToggle={() =>
                          toggleStep(step, milestone.name, milestone.steps)
                        }
                      />
                    ))}
                  </ul>

                  {/* Plan C — collapsible alternative path */}
                  {planCSteps.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowPlanC(!showPlanC)}
                        className="flex items-center gap-1.5 text-xs font-medium text-warning hover:text-warning/80 transition-colors"
                      >
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform ${
                            showPlanC ? "rotate-90" : ""
                          }`}
                        />
                        Plano alternativo ({planCSteps.length} etapas)
                      </button>
                      {showPlanC && (
                        <ul className="mt-2 space-y-1.5 rounded-xl border border-warning/10 bg-warning/[0.02] p-3">
                          {planCSteps.map((step) => (
                            <StepItem
                              key={step.id}
                              step={step}
                              effectiveStatus={getEffectiveStatus(step)}
                              isUpdating={updatingIds.has(step.id)}
                              onToggle={() =>
                                toggleStep(
                                  step,
                                  milestone.name,
                                  milestone.steps
                                )
                              }
                            />
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {totalSteps === 0 && (
        <div className="px-5 py-8 text-center sm:px-6">
          <p className="text-sm text-foreground-muted">
            Selecione um programa de imigracao para gerar sua jornada completa.
          </p>
          <Link
            href="/programs"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light"
          >
            Explorar Programas
          </Link>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// Step Item — individual task with checkbox
// ═══════════════════════════════════════════

interface StepItemProps {
  step: MicroStep;
  effectiveStatus: string;
  isUpdating: boolean;
  onToggle: () => void;
}

function StepItem({ step, effectiveStatus, isUpdating, onToggle }: StepItemProps) {
  const style =
    STEP_STATUS_STYLES[effectiveStatus] || STEP_STATUS_STYLES.TODO;
  const planColor = PLAN_COLORS[step.planPriority] || PLAN_COLORS.PRIMARY;
  const isDone = effectiveStatus === "DONE";
  const isBlocked = effectiveStatus === "BLOCKED";

  return (
    <li className="group flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        disabled={isBlocked || isUpdating}
        className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md transition-all ${style.checkBg} ${
          isUpdating ? "animate-pulse" : ""
        } ${!isBlocked && !isDone ? "group-hover:border-primary/50" : ""}`}
        aria-label={isDone ? "Marcar como pendente" : "Marcar como concluida"}
      >
        <Check
          className={`h-3.5 w-3.5 transition-all ${style.checkIcon} ${
            isDone ? "scale-100" : "scale-0 group-hover:scale-75 group-hover:text-primary/30"
          }`}
        />
      </button>

      {/* Step info */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-snug transition-all ${
            isDone
              ? "line-through text-foreground-dim"
              : "text-foreground"
          }`}
        >
          {step.title}
        </p>
        {step.description && !isDone && (
          <p className="mt-0.5 text-xs text-foreground-dim line-clamp-1">
            {step.description}
          </p>
        )}
      </div>

      {/* Plan badge */}
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${planColor.bg} ${planColor.text}`}
      >
        {planColor.label}
      </span>

      {/* Action link */}
      {step.actionUrl && !isDone && (
        <Link
          href={step.actionUrl}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
          title="Ir para esta secao"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      )}
    </li>
  );
}
