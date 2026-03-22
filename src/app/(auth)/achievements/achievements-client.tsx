"use client";

import {
  Trophy,
  Star,
  Flame,
  Target,
  Award,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { CelebrationIllustration } from "@/components/illustrations";

interface AchievementsClientProps {
  achievements: any[];
}

const typeIcons: Record<string, any> = {
  MILESTONE: Target,
  STREAK: Flame,
  COMPLETION: CheckCircle2,
  SCORE: Star,
};

const typeColors: Record<string, string> = {
  MILESTONE: "bg-primary/10 text-primary",
  STREAK: "bg-warning/10 text-warning",
  COMPLETION: "bg-success/10 text-success",
  SCORE: "bg-info/10 text-info",
};

// Predefined achievements that can be unlocked
const possibleAchievements = [
  { name: "Primeiro Passo", description: "Complete o onboarding", type: "MILESTONE", icon: "rocket" },
  { name: "Planejador", description: "Crie seu primeiro plano de imigracao", type: "MILESTONE", icon: "map" },
  { name: "Documentado", description: "Submeta 5 documentos", type: "COMPLETION", icon: "file" },
  { name: "Poliglota", description: "Alcance CLB 7+ em todos os skills", type: "SCORE", icon: "globe" },
  { name: "Streak de 7", description: "Acesse o app 7 dias seguidos", type: "STREAK", icon: "flame" },
  { name: "Score Alto", description: "Alcance CRS 450+", type: "SCORE", icon: "trophy" },
  { name: "Metade do Caminho", description: "Complete 50% da jornada", type: "MILESTONE", icon: "flag" },
  { name: "Familia Unida", description: "Adicione conjuge ao household", type: "MILESTONE", icon: "users" },
  { name: "Streak de 30", description: "Acesse o app 30 dias seguidos", type: "STREAK", icon: "flame" },
  { name: "Jornada Completa", description: "Complete 100% da jornada", type: "COMPLETION", icon: "star" },
  { name: "Explorador", description: "Compare 3 programas", type: "COMPLETION", icon: "compass" },
  { name: "Organizado", description: "Tenha todos os documentos aprovados", type: "COMPLETION", icon: "check" },
];

export function AchievementsClient({ achievements }: AchievementsClientProps) {
  const unlockedNames = new Set(achievements.map((a: any) => a.name));

  // XP simulation
  const totalXP = achievements.length * 100;
  const currentLevel = Math.floor(totalXP / 500) + 1;
  const xpInLevel = totalXP % 500;
  const xpForNextLevel = 500;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conquistas</h1>
          <p className="text-sm text-foreground-muted">
            Acompanhe suas conquistas e progresso na jornada.
          </p>
        </div>
        <CelebrationIllustration width={120} className="hidden sm:block sm:ml-auto shrink-0 opacity-80" />
      </div>

      {/* XP Bar + Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Nivel {currentLevel}
              </span>
            </div>
            <span className="text-xs text-foreground-dim">
              {xpInLevel}/{xpForNextLevel} XP
            </span>
          </div>
          <div className="h-3 rounded-full bg-border">
            <div
              className="h-3 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(xpInLevel / xpForNextLevel) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-foreground-dim">
            {xpForNextLevel - xpInLevel} XP para o proximo nivel
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <Trophy className="mx-auto mb-2 h-6 w-6 text-warning" />
          <p className="text-2xl font-bold text-foreground">
            {achievements.length}
          </p>
          <p className="text-xs text-foreground-dim">
            de {possibleAchievements.length} conquistas
          </p>
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {possibleAchievements.map((ach) => {
          const unlocked = unlockedNames.has(ach.name);
          const unlockedData = achievements.find(
            (a: any) => a.name === ach.name
          );
          const Icon = typeIcons[ach.type] || Trophy;
          const colorClass = typeColors[ach.type] || "bg-surface text-foreground-dim";

          return (
            <div
              key={ach.name}
              className={`rounded-2xl p-5 transition-all ${
                unlocked
                  ? "bg-white shadow-sm hover:shadow-md"
                  : "bg-surface opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    unlocked ? colorClass : "bg-surface text-foreground-dim"
                  }`}
                >
                  {unlocked ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      unlocked ? "text-foreground" : "text-foreground-dim"
                    }`}
                  >
                    {ach.name}
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {ach.description}
                  </p>
                  {unlocked && unlockedData?.unlockedAt && (
                    <p className="mt-1 text-[10px] text-foreground-dim">
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
}
