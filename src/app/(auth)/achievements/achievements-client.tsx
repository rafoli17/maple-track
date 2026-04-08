"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Star,
  Flame,
  Target,
  Award,
  CheckCircle2,
  Lock,
  Rocket,
  Crown,
  TrendingUp,
  FileText,
  FolderCheck,
  Archive,
  Globe,
  Map,
  Compass,
  UserCheck,
  Users,
  Sparkles,
  Zap,
} from "lucide-react";
import { CelebrationIllustration } from "@/components/illustrations";
import { toast } from "sonner";
import { useCelebration } from "@/components/gamification/achievement-celebration-provider";

// ════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════
interface AchievementDef {
  type: "MILESTONE" | "STREAK" | "COMPLETION" | "SCORE";
  name: string;
  description: string;
  icon: string;
  key: string;
  category?: string;
}

interface UnlockedResult {
  name: string;
  key: string;
  xp: number;
  isNew: boolean;
}

interface AchievementsClientProps {
  achievements: any[];
  totalXP: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  newlyUnlocked: UnlockedResult[];
  definitions: AchievementDef[];
}

// ════════════════════════════════════════════
// ICON MAP
// ════════════════════════════════════════════
const iconMap: Record<string, any> = {
  rocket: Rocket,
  flame: Flame,
  star: Star,
  trophy: Trophy,
  crown: Crown,
  "trending-up": TrendingUp,
  "check-circle": CheckCircle2,
  "file-text": FileText,
  "folder-check": FolderCheck,
  archive: Archive,
  globe: Globe,
  award: Award,
  map: Map,
  compass: Compass,
  "user-check": UserCheck,
  users: Users,
  target: Target,
  sparkles: Sparkles,
  zap: Zap,
};

const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  Jornada: { label: "Jornada", color: "text-primary", bg: "bg-primary/10" },
  Onboarding: { label: "Onboarding", color: "text-info", bg: "bg-info/10" },
  Documentos: { label: "Documentos", color: "text-warning", bg: "bg-warning/10" },
  Idiomas: { label: "Idiomas", color: "text-success", bg: "bg-success/10" },
  CRS: { label: "CRS", color: "text-error", bg: "bg-error/10" },
  Planos: { label: "Planos", color: "text-purple-600", bg: "bg-purple-100" },
  Geral: { label: "Geral", color: "text-foreground-muted", bg: "bg-surface" },
};

// ════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════
export function AchievementsClient({
  achievements,
  totalXP,
  level,
  xpInLevel,
  xpForNextLevel,
  newlyUnlocked,
  definitions,
}: AchievementsClientProps) {
  const { celebrateMultiple } = useCelebration();
  const [showCelebration, setShowCelebration] = useState(false);
  const [animatedXP, setAnimatedXP] = useState(0);

  // Animate XP bar on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedXP(xpInLevel), 300);
    return () => clearTimeout(timer);
  }, [xpInLevel]);

  // Show celebration overlay for newly unlocked achievements
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      setShowCelebration(true);
      const celebrations = newlyUnlocked.map((ach) => ({
        name: ach.name,
        xp: ach.xp,
        level,
        tier: (ach.xp >= 200 ? "epic" : "normal") as "epic" | "normal",
      }));
      setTimeout(() => celebrateMultiple(celebrations), 500);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  }, [newlyUnlocked, celebrateMultiple, level]);

  const unlockedKeys = new Set(
    achievements.map((a: any) => (a.metadata as any)?.key).filter(Boolean)
  );
  const unlockedNames = new Set(achievements.map((a: any) => a.name));

  // Build the full list: predefined + dynamic (milestone completions from backend)
  const predefinedKeys = new Set(definitions.map((d) => d.key));
  const dynamicAchievements = achievements
    .filter((a: any) => {
      const key = (a.metadata as any)?.key;
      return key && !predefinedKeys.has(key);
    })
    .map((a: any) => ({
      type: a.type as AchievementDef["type"],
      name: a.name,
      description: a.description || "",
      icon: a.icon || "check-circle",
      key: (a.metadata as any)?.key || a.id,
      category: (a.metadata as any)?.category || "Jornada",
    }));

  const allAchievements = [...definitions, ...dynamicAchievements];

  // Group by category
  const categoryMap: Record<string, AchievementDef[]> = {};
  const categoryOrder: string[] = [];
  for (const ach of allAchievements) {
    const cat = ach.category || "Geral";
    if (!categoryMap[cat]) {
      categoryMap[cat] = [];
      categoryOrder.push(cat);
    }
    categoryMap[cat].push(ach);
  }

  const totalPossible = allAchievements.length;
  const totalUnlocked = achievements.length;
  const progressPercent = totalPossible > 0 ? Math.round((totalUnlocked / totalPossible) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conquistas</h1>
          <p className="text-sm text-foreground-muted">
            Acompanhe suas conquistas e progresso na jornada.
          </p>
        </div>
        <div className={`hidden sm:block sm:ml-auto shrink-0 transition-transform duration-500 ${showCelebration ? "scale-125" : "opacity-80"}`}>
          <CelebrationIllustration width={120} />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {/* Level + XP */}
        <div className="col-span-2 rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Nivel {level}</p>
                <p className="text-[11px] text-foreground-dim">{totalXP} XP total</p>
              </div>
            </div>
            <span className="text-xs font-medium text-foreground-muted">
              {animatedXP}/{xpForNextLevel} XP
            </span>
          </div>
          <div className="h-3 rounded-full bg-border/40 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000 ease-out"
              style={{ width: `${(animatedXP / xpForNextLevel) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-foreground-dim">
            {xpForNextLevel - xpInLevel} XP para o nivel {level + 1}
          </p>
        </div>

        {/* Unlocked count */}
        <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 text-center shadow-sm">
          <Trophy className="mx-auto mb-1.5 h-6 w-6 text-warning" />
          <p className="text-2xl font-bold text-foreground">{totalUnlocked}</p>
          <p className="text-[11px] text-foreground-dim">
            de {totalPossible}
          </p>
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 text-center shadow-sm">
          <Sparkles className="mx-auto mb-1.5 h-6 w-6 text-primary" />
          <p className="text-2xl font-bold text-foreground">{progressPercent}%</p>
          <p className="text-[11px] text-foreground-dim">
            completo
          </p>
        </div>
      </div>

      {/* Achievement Categories */}
      {categoryOrder.map((categoryName) => {
        const categoryAchievements = categoryMap[categoryName];
        const config = categoryConfig[categoryName] || categoryConfig.Geral;
        const unlockedInCategory = categoryAchievements.filter(
          (a) => unlockedKeys.has(a.key) || unlockedNames.has(a.name)
        ).length;

        return (
          <div key={categoryName}>
            {/* Category Header */}
            <div className="mb-3 flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${config.bg}`}>
                <Award className={`h-3.5 w-3.5 ${config.color}`} />
              </div>
              <h2 className="text-sm font-semibold text-foreground">
                {config.label}
              </h2>
              <span className="text-[11px] text-foreground-dim">
                {unlockedInCategory}/{categoryAchievements.length}
              </span>
              {unlockedInCategory === categoryAchievements.length && categoryAchievements.length > 0 && (
                <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                  COMPLETO
                </span>
              )}
            </div>

            {/* Achievement Grid */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {categoryAchievements.map((ach) => {
                const unlocked = unlockedKeys.has(ach.key) || unlockedNames.has(ach.name);
                const unlockedData = achievements.find(
                  (a: any) =>
                    (a.metadata as any)?.key === ach.key || a.name === ach.name
                );
                const Icon = iconMap[ach.icon] || Trophy;
                const isNewlyUnlocked = newlyUnlocked.some((n) => n.key === ach.key);
                const xp = unlockedData
                  ? (unlockedData.metadata as any)?.xp || 50
                  : null;

                return (
                  <div
                    key={ach.key}
                    className={`rounded-2xl border p-4 transition-all duration-300 ${
                      unlocked
                        ? `border-success/20 bg-white shadow-sm hover:shadow-md ${
                            isNewlyUnlocked ? "animate-pulse ring-2 ring-success/40" : ""
                          }`
                        : "border-border/60 bg-white/80 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                          unlocked
                            ? `${config.bg} ${config.color}`
                            : "bg-surface text-foreground-dim/50"
                        }`}
                      >
                        {unlocked ? (
                          <Icon className="h-5 w-5" />
                        ) : (
                          <Lock className="h-4 w-4 opacity-40" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={`text-sm font-medium truncate ${
                              unlocked ? "text-foreground" : "text-foreground-dim/70"
                            }`}
                          >
                            {ach.name}
                          </p>
                          {unlocked && xp && (
                            <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                              +{xp} XP
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 ${unlocked ? "text-foreground-muted" : "text-foreground-dim/60"}`}>
                          {ach.description}
                        </p>
                        {unlocked && unlockedData?.unlockedAt && (
                          <p className="mt-1 text-[10px] text-success font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Desbloqueado em{" "}
                            {new Date(unlockedData.unlockedAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {totalUnlocked === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <Target className="mx-auto mb-3 h-10 w-10 text-foreground-dim" />
          <p className="text-sm font-medium text-foreground">
            Nenhuma conquista desbloqueada ainda
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            Complete etapas da sua jornada, submeta documentos e avance no idioma
            para desbloquear conquistas e ganhar XP!
          </p>
        </div>
      )}
    </div>
  );
}
