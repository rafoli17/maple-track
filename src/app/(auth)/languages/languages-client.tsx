"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Languages,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Target,
  Plus,
  X,
  Pencil,
  Clock,
  TrendingUp,
  BookOpen,
  MapPin,
} from "lucide-react";

interface LanguagesClientProps {
  profiles: any[];
  tests: any[];
  plans: any[];
}

const SKILL_LABELS: Record<string, string> = {
  speaking: "Speaking",
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
};

// Plan-based color tiers: which plan's CLB minimum does the score meet?
const PLAN_COLORS = {
  PRIMARY:   { bar: "bg-primary",  text: "text-primary"  },
  SECONDARY: { bar: "bg-accent",   text: "text-accent"   },
  TERTIARY:  { bar: "bg-warning",  text: "text-warning"  },
  NONE:      { bar: "bg-border",   text: "text-foreground-dim" },
};

const skills = ["listening", "reading", "writing", "speaking"] as const;

// CLB to IELTS/CELPIP score mapping
const CLB_TO_SCORE: Record<number, Record<string, number>> = {
  4: { IELTS: 4.0, CELPIP: 4 },
  5: { IELTS: 5.0, CELPIP: 5 },
  6: { IELTS: 5.5, CELPIP: 6 },
  7: { IELTS: 6.0, CELPIP: 7 },
  8: { IELTS: 6.5, CELPIP: 8 },
  9: { IELTS: 7.0, CELPIP: 9 },
  10: { IELTS: 7.5, CELPIP: 10 },
  11: { IELTS: 8.0, CELPIP: 11 },
  12: { IELTS: 8.5, CELPIP: 12 },
};

// Convert a skill score to CLB level based on test type
function scoreToCLB(score: number, testType: string): number {
  if (!score) return 0;
  if (testType === "CELPIP") return score; // CELPIP score = CLB directly
  // IELTS: reverse lookup from CLB_TO_SCORE
  const clbLevels = Object.entries(CLB_TO_SCORE)
    .map(([clb, scores]) => ({ clb: Number(clb), ielts: scores.IELTS }))
    .sort((a, b) => b.clb - a.clb); // highest first
  for (const { clb, ielts } of clbLevels) {
    if (score >= ielts) return clb;
  }
  return 0;
}

// Get bar/text color based on which plan's CLB minimum the score meets
// Checks from highest CLB requirement down — color = highest tier reached
function getScoreColor(
  score: number,
  testType: string,
  planTargets: { priority: string; clb: number | null }[]
): { bar: string; text: string } {
  const clb = scoreToCLB(score, testType);
  // Sort by CLB descending — check hardest requirement first
  const sorted = [...planTargets]
    .filter((p) => p.clb)
    .sort((a, b) => (b.clb || 0) - (a.clb || 0));
  for (const plan of sorted) {
    if (clb >= (plan.clb || 0)) {
      return PLAN_COLORS[plan.priority as keyof typeof PLAN_COLORS] || PLAN_COLORS.NONE;
    }
  }
  return PLAN_COLORS.NONE;
}

export function LanguagesClient({ profiles, tests, plans }: LanguagesClientProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingTestId, setEditingTestId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    testType: "CELPIP",
    status: "PLANNED" as string,
    speaking: "",
    listening: "",
    reading: "",
    writing: "",
    testDate: "",
    profileId: "",
  });

  const primaryProfile = profiles.find((p: any) => p.isPrimaryApplicant);

  // Get target CLB from plans
  const planTargets = plans.map((plan: any) => ({
    name: plan.program?.name || "Programa",
    priority: plan.priority,
    clb: plan.program?.minimumCLB || null,
  })).filter((p) => p.clb);

  // Celebrate when scores meet a plan target
  const checkAndCelebrate = (payload: Record<string, unknown>) => {
    const scoreFields = ["speaking", "listening", "reading", "writing"];
    const scores = scoreFields.map((f) => Number(payload[f]) || 0).filter(Boolean);
    if (scores.length === 0) return;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const testType = String(payload.testType || formData.testType);
    const avgCLB = scoreToCLB(avg, testType);

    const planLabels: Record<string, string> = { PRIMARY: "Plano A", SECONDARY: "Plano B", TERTIARY: "Plano C" };
    const sortedTargets = [...planTargets].sort((a, b) => (b.clb || 0) - (a.clb || 0));
    for (const target of sortedTargets) {
      if (avgCLB >= (target.clb || 0)) {
        const profile = profiles.find((p: any) => p.id === formData.profileId);
        const name = profile?.firstName || "Voce";
        setTimeout(() => {
          toast.success(`${name} atingiu o requisito do ${planLabels[target.priority]}!`, {
            description: `Media CLB ${avgCLB} >= CLB ${target.clb} necessario`,
            duration: 6000,
          });
        }, 500);
        break;
      }
    }
  };

  const openAddForm = (profileId?: string) => {
    setEditingTestId(null);
    setFormData({
      testType: "CELPIP",
      status: "PLANNED",
      speaking: "", listening: "", reading: "", writing: "",
      testDate: "",
      profileId: profileId || primaryProfile?.id || "",
    });
    setShowAddForm(true);
  };

  const openEditForm = (test: any) => {
    setEditingTestId(test.id);
    setFormData({
      testType: test.testType,
      status: test.status,
      speaking: test.speaking || "",
      listening: test.listening || "",
      reading: test.reading || "",
      writing: test.writing || "",
      testDate: test.testDate ? new Date(test.testDate).toISOString().split("T")[0] : "",
      profileId: test.profileId,
    });
    setShowAddForm(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        testType: formData.testType,
        status: formData.status,
      };
      // Send scores when field has a value (including "0")
      if (formData.speaking !== "") payload.speaking = Number(formData.speaking);
      if (formData.listening !== "") payload.listening = Number(formData.listening);
      if (formData.reading !== "") payload.reading = Number(formData.reading);
      if (formData.writing !== "") payload.writing = Number(formData.writing);
      if (formData.testDate) {
        payload.testDate = formData.testDate;
      } else if (editingTestId) {
        // Explicitly clear the date when editing
        payload.testDate = null;
      }
      if (formData.profileId) payload.profileId = formData.profileId;

      if (editingTestId) {
        const res = await fetch(`/api/languages/${editingTestId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Teste atualizado");
          checkAndCelebrate(payload);
          setShowAddForm(false);
          router.refresh();
        } else {
          const err = await res.json().catch(() => ({}));
          console.error("PUT error:", err);
          toast.error(err.error || "Erro ao atualizar teste");
        }
      } else {
        const res = await fetch("/api/languages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Teste adicionado");
          checkAndCelebrate(payload);
          setShowAddForm(false);
          router.refresh();
        } else {
          const err = await res.json().catch(() => ({}));
          console.error("POST error:", err);
          toast.error(err.error || "Erro ao adicionar teste");
        }
      }
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate days until test
  const daysUntilTest = (testDate: string | null) => {
    if (!testDate) return null;
    const diff = Math.ceil((new Date(testDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  };

  // Get overall average for a test
  const getAverage = (test: any) => {
    const scores = [test.speaking, test.listening, test.reading, test.writing]
      .filter(Boolean)
      .map(Number);
    if (scores.length === 0) return null;
    return (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Preparacao de Ingles
          </h1>
          <p className="text-sm text-foreground-muted">
            Acompanhe testes CELPIP/IELTS, scores e preparacao
          </p>
        </div>
        <button
          onClick={() => openAddForm()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light"
        >
          <Plus className="h-4 w-4" />
          Adicionar Teste
        </button>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* TEST CARDS PER PERSON — Side by side            */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="grid gap-5 lg:grid-cols-2">
        {profiles.map((profile: any) => {
          const profileTests = tests.filter((t: any) => t.profileId === profile.id);
          const latestTest = profileTests[0];
          const scheduledTest = profileTests.find((t: any) =>
            t.status === "SCHEDULED" || t.status === "PLANNED"
          );
          const completedTest = profileTests.find((t: any) => t.status === "COMPLETED");
          const displayTest = completedTest || latestTest;
          const days = scheduledTest ? daysUntilTest(scheduledTest.testDate) : null;
          const isPrimary = profile.isPrimaryApplicant;

          return (
            <div key={profile.id} className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden">
              {/* Person header with test info */}
              <div className="p-4 sm:p-5 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {profile.user?.image ? (
                      <img
                        src={profile.user.image}
                        alt={profile.firstName || ""}
                        className="h-11 w-11 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                        isPrimary ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                      }`}>
                        {profile.firstName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        {profile.firstName}
                      </h2>
                      <p className="text-xs text-foreground-dim">
                        {displayTest ? displayTest.testType.replace("_", " ") : "Nenhum teste"}
                      </p>
                    </div>
                  </div>
                  {days && (
                    <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-primary/10 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-primary shrink-0">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">{days} dias para a prova</span>
                      <span className="sm:hidden">{days}d</span>
                    </div>
                  )}
                </div>

                {/* Test date card */}
                {scheduledTest?.testDate && (
                  <div className="mt-3 rounded-xl bg-primary/[0.04] border border-primary/10 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">Data da Prova</p>
                      <p className="text-sm font-bold text-foreground">
                        {new Date(scheduledTest.testDate).toLocaleDateString("pt-BR", {
                          weekday: "long", year: "numeric", month: "long", day: "numeric"
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => openEditForm(scheduledTest)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-border hover:border-primary/30 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5 text-foreground-muted" />
                    </button>
                  </div>
                )}
              </div>

              {/* Scores section */}
              <div className="p-4 sm:p-5">
                {displayTest && (displayTest.speaking || displayTest.listening || displayTest.reading || displayTest.writing) ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Target className="h-4 w-4 text-foreground-muted" />
                        Scores {displayTest.testType.replace("_", " ")}
                      </h3>
                      <button
                        onClick={() => openEditForm(displayTest)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-surface transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5 text-foreground-dim" />
                      </button>
                    </div>

                    {/* Individual skill scores with bars — colored by plan threshold */}
                    <div className="space-y-3">
                      {skills.map((skill) => {
                        const score = Number(displayTest[skill]) || 0;
                        const color = getScoreColor(score, displayTest.testType, planTargets);
                        const maxScore = displayTest.testType?.startsWith("IELTS") ? 9 : 12;
                        const pct = Math.min((score / maxScore) * 100, 100);

                        // Find the highest plan NOT yet met for gap display
                        const clb = scoreToCLB(score, displayTest.testType);
                        const unmetPlan = [...planTargets]
                          .filter((p) => p.clb && clb < p.clb)
                          .sort((a, b) => (a.clb || 0) - (b.clb || 0))[0];

                        return (
                          <div key={skill}>
                            <div className="flex items-center gap-3">
                              <span className="w-14 sm:w-20 text-xs sm:text-sm text-foreground-muted shrink-0">{SKILL_LABELS[skill]}</span>
                              <div className="flex-1 h-2.5 rounded-full bg-border/40 relative">
                                <div
                                  className={`h-2.5 rounded-full ${color.bar} transition-all`}
                                  style={{ width: `${pct}%` }}
                                />
                                {/* Target markers for each plan */}
                                {planTargets.map((pt) => {
                                  const targetScore = CLB_TO_SCORE[pt.clb]?.[displayTest.testType === "CELPIP" ? "CELPIP" : "IELTS"] || 0;
                                  const targetPct = Math.min((targetScore / maxScore) * 100, 100);
                                  const planColors: Record<string, string> = {
                                    PRIMARY: "bg-primary", SECONDARY: "bg-accent", TERTIARY: "bg-warning",
                                  };
                                  return (
                                    <div
                                      key={pt.priority}
                                      className={`absolute top-0 h-2.5 w-0.5 ${planColors[pt.priority] || "bg-border"} opacity-40`}
                                      style={{ left: `${targetPct}%` }}
                                      title={`Meta ${pt.priority === "PRIMARY" ? "A" : pt.priority === "SECONDARY" ? "B" : "C"}: ${targetScore}`}
                                    />
                                  );
                                })}
                              </div>
                              <span className={`text-base sm:text-lg font-bold w-7 sm:w-8 text-right shrink-0 ${color.text}`}>
                                {score || "-"}
                              </span>
                            </div>
                            {/* Gap hint */}
                            {unmetPlan && score > 0 && (
                              <p className="ml-[calc(3.5rem+0.75rem)] sm:ml-[calc(5rem+0.75rem)] text-[10px] text-foreground-dim mt-0.5">
                                faltam {((CLB_TO_SCORE[unmetPlan.clb]?.[displayTest.testType === "CELPIP" ? "CELPIP" : "IELTS"] || 0) - score).toFixed(1).replace(".0", "")} pts para {unmetPlan.priority === "PRIMARY" ? "Plano A" : unmetPlan.priority === "SECONDARY" ? "Plano B" : "Plano C"}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Overall Average + Plan status badges */}
                    {(() => {
                      const avg = getAverage(displayTest);
                      const avgNum = avg ? Number(avg) : 0;
                      const avgColor = avg
                        ? getScoreColor(avgNum, displayTest.testType, planTargets)
                        : PLAN_COLORS.NONE;
                      const avgCLB = avg ? scoreToCLB(avgNum, displayTest.testType) : 0;
                      return (
                        <>
                          <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">Media Geral</span>
                            <span className={`text-2xl font-bold ${avgColor.text}`}>
                              {avg || "--"}
                            </span>
                          </div>
                          {/* Plan eligibility status */}
                          {avg && planTargets.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {planTargets.map((pt) => {
                                const met = avgCLB >= (pt.clb || 0);
                                const labels: Record<string, string> = { PRIMARY: "A", SECONDARY: "B", TERTIARY: "C" };
                                return (
                                  <span
                                    key={pt.priority}
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                      met
                                        ? "bg-success/10 text-success"
                                        : "bg-error/10 text-error"
                                    }`}
                                  >
                                    {met ? <CheckCircle2 className="h-2.5 w-2.5" /> : <AlertTriangle className="h-2.5 w-2.5" />}
                                    Plano {labels[pt.priority]}: {met ? "Atingido" : `CLB ${pt.clb} necessario`}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Languages className="h-10 w-10 text-foreground-dim mb-2" />
                    <p className="text-sm text-foreground-muted mb-3">
                      Nenhum score registrado
                    </p>
                    <button
                      onClick={() => openAddForm(profile.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Adicionar teste
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* TARGET SCORES BY PROGRAM                        */}
      {/* ═══════════════════════════════════════════════ */}
      {planTargets.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Metas por Programa</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {planTargets.map((target, i) => {
              const priorityColors: Record<string, string> = {
                PRIMARY: "border-primary/20 bg-primary/[0.03]",
                SECONDARY: "border-accent/20 bg-accent/[0.03]",
                TERTIARY: "border-warning/20 bg-warning/[0.03]",
              };
              const priorityLabels: Record<string, string> = {
                PRIMARY: "Plano A", SECONDARY: "Plano B", TERTIARY: "Plano C",
              };
              const priorityTextColors: Record<string, string> = {
                PRIMARY: "text-primary", SECONDARY: "text-accent", TERTIARY: "text-warning",
              };

              // Get score range for CLB
              const clb = target.clb;
              const scoreInfo = CLB_TO_SCORE[clb];
              const scoreText = scoreInfo
                ? `IELTS ${scoreInfo.IELTS}+ / CELPIP ${scoreInfo.CELPIP}+`
                : `CLB ${clb}+`;

              return (
                <div
                  key={i}
                  className={`rounded-xl border p-4 ${priorityColors[target.priority] || ""}`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground-dim mb-1">
                    {priorityLabels[target.priority]} — CLB {clb}
                  </p>
                  <p className={`text-lg font-bold ${priorityTextColors[target.priority] || "text-foreground"}`}>
                    {scoreText}
                  </p>
                  <p className="text-xs text-foreground-dim mt-1 truncate">
                    {target.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* TEST HISTORY                                     */}
      {/* ═══════════════════════════════════════════════ */}
      {tests.length > 1 && (
        <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground-muted" />
            Historico de Testes
          </h2>
          <div className="space-y-2">
            {tests.map((test: any) => {
              const profile = profiles.find((p: any) => p.id === test.profileId);
              const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
                PLANNED: { color: "text-foreground-dim", bg: "bg-surface", label: "Planejado" },
                SCHEDULED: { color: "text-info", bg: "bg-info/10", label: "Agendado" },
                COMPLETED: { color: "text-success", bg: "bg-success/10", label: "Concluido" },
                EXPIRED: { color: "text-error", bg: "bg-error/10", label: "Expirado" },
              };
              const sc = statusConfig[test.status] || statusConfig.PLANNED;

              return (
                <div
                  key={test.id}
                  className="flex items-center gap-3 rounded-xl bg-surface/50 px-4 py-3 hover:bg-surface transition-colors cursor-pointer"
                  onClick={() => openEditForm(test)}
                >
                  {profile?.user?.image ? (
                    <img
                      src={profile.user.image}
                      alt={profile?.firstName || ""}
                      className="h-8 w-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      profile?.isPrimaryApplicant ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                    }`}>
                      {profile?.firstName?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {profile?.firstName} — {test.testType.replace("_", " ")}
                    </p>
                    {test.testDate && (
                      <p className="text-xs text-foreground-dim">
                        {new Date(test.testDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                  {getAverage(test) && (
                    <span className="text-sm font-bold text-foreground">{getAverage(test)}</span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${sc.bg} ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* ADD / EDIT TEST MODAL                            */}
      {/* ═══════════════════════════════════════════════ */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-foreground">
                  {editingTestId ? "Editar Teste" : "Novo Teste de Idioma"}
                </h2>
                <button onClick={() => setShowAddForm(false)} className="text-foreground-dim hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-foreground-muted mb-5">
                {editingTestId ? "Atualize os dados do teste" : "Registre um teste de proficiencia"}
              </p>

              {/* Person selector */}
              {!editingTestId && profiles.length > 1 && (
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-medium text-foreground">Para quem?</label>
                  <div className="flex gap-2 flex-wrap">
                    {profiles.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => setFormData({ ...formData, profileId: p.id })}
                        className={`flex-1 min-w-0 flex items-center justify-center gap-2 rounded-xl border px-3 sm:px-4 py-3 text-sm font-medium transition-all ${
                          formData.profileId === p.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground-muted hover:border-foreground-dim"
                        }`}
                      >
                        {p.user?.image ? (
                          <img
                            src={p.user.image}
                            alt={p.firstName || ""}
                            className={`h-7 w-7 rounded-full object-cover ${
                              formData.profileId === p.id ? "ring-2 ring-primary" : ""
                            }`}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            formData.profileId === p.id
                              ? "bg-primary text-white"
                              : "bg-surface text-foreground-dim"
                          }`}>
                            {p.firstName?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        )}
                        {p.firstName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Test Type Selection */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-foreground">Tipo de Teste</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "CELPIP", label: "CELPIP", desc: "Computer-based · 3 horas" },
                    { value: "IELTS_GENERAL", label: "IELTS General", desc: "Paper/Computer · 2h45" },
                    { value: "IELTS_ACADEMIC", label: "IELTS Academic", desc: "Para estudos · 2h45" },
                    { value: "TEF", label: "TEF (Frances)", desc: "Test d'evaluation" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, testType: type.value })}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        formData.testType === type.value
                          ? "border-primary bg-primary/[0.04] ring-1 ring-primary/20"
                          : "border-border hover:border-foreground-dim"
                      }`}
                    >
                      <p className="text-sm font-semibold text-foreground">{type.label}</p>
                      <p className="text-[10px] text-foreground-dim">{type.desc}</p>
                      {formData.testType === type.value && (
                        <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
                <div className="flex gap-2">
                  {[
                    { value: "PLANNED", label: "Planejado" },
                    { value: "SCHEDULED", label: "Agendado" },
                    { value: "COMPLETED", label: "Concluido" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setFormData({ ...formData, status: s.value })}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        formData.status === s.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground-muted hover:border-foreground-dim"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Date (optional) */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  <Calendar className="inline h-3.5 w-3.5 mr-1" />
                  Data da Prova
                  <span className="ml-1 text-xs font-normal text-foreground-dim">(opcional)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.testDate}
                    onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                    className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  {formData.testDate && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, testDate: "" })}
                      className="flex h-10 items-center justify-center rounded-lg border border-border px-3 text-xs font-medium text-foreground-muted hover:bg-surface hover:text-error transition-colors"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-foreground-dim">
                  Preencha apenas se ja tem data agendada ou realizada
                </p>
              </div>

              {/* Scores — always visible, scores can represent mock tests too */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-foreground">Scores</label>
                <p className="text-xs text-foreground-dim mb-3">Resultado oficial ou score de simulado</p>
                <div className="grid grid-cols-2 gap-3">
                  {skills.map((skill) => (
                    <div key={skill}>
                      <label className="mb-1 block text-xs text-foreground-muted">{SKILL_LABELS[skill]}</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="12"
                        value={formData[skill]}
                        onChange={(e) => setFormData({ ...formData, [skill]: e.target.value })}
                        placeholder="0"
                        className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements info */}
              {planTargets.length > 0 && (
                <div className="mb-5 rounded-xl bg-primary/[0.04] border border-primary/10 p-4">
                  <p className="text-sm font-semibold text-primary mb-2">Requisitos dos Seus Planos</p>
                  <ul className="space-y-1">
                    {planTargets.map((t, i) => (
                      <li key={i} className="text-xs text-foreground-muted">
                        · {t.name}: CLB {t.clb} minimo
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : editingTestId ? "Atualizar" : "Salvar Teste"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
