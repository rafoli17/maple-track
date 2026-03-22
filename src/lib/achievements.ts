// ════════════════════════════════════════════
// Gamification — Achievements, XP, Levels
// ════════════════════════════════════════════

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "MILESTONE" | "STREAK" | "COMPLETION" | "SCORE";
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: "first_step", name: "Primeiro Passo", description: "Completou o onboarding", icon: "🎯", type: "MILESTONE" },
  { id: "organized", name: "Organizado", description: "Todos os documentos de uma fase concluídos", icon: "📋", type: "COMPLETION" },
  { id: "polyglot", name: "Poliglota", description: "Score de idioma atingiu a meta do programa", icon: "🗣️", type: "SCORE" },
  { id: "rising", name: "Em Ascensão", description: "CRS subiu em relação ao último cálculo", icon: "📈", type: "SCORE" },
  { id: "plan_set", name: "Plano Traçado", description: "Definiu Plano A, B e C", icon: "✈️", type: "MILESTONE" },
  { id: "phase_done", name: "Fase Completa", description: "Completou uma fase inteira da jornada", icon: "⭐", type: "COMPLETION" },
  { id: "streak_7", name: "Streak de 7", description: "7 dias seguidos atualizando o progresso", icon: "🔥", type: "STREAK" },
  { id: "halfway", name: "Metade do Caminho", description: "50% da jornada concluída", icon: "🏆", type: "MILESTONE" },
  { id: "pr_approved", name: "PR Approved!", description: "Permanent Residence aprovado", icon: "🍁", type: "MILESTONE" },
  { id: "citizen", name: "Cidadão Canadense", description: "Cidadania obtida!", icon: "🇨🇦", type: "MILESTONE" },
];

export const XP_VALUES = {
  stepCompleted: 50,
  documentSubmitted: 30,
  languageTestDone: 100,
  phaseCompleted: 200,
  onboardingDone: 150,
  crsCalculated: 25,
  planCreated: 75,
};

export interface Level {
  name: string;
  minXP: number;
  maxXP: number;
}

export const LEVELS: Level[] = [
  { name: "Explorador", minXP: 0, maxXP: 500 },
  { name: "Planejador", minXP: 500, maxXP: 1500 },
  { name: "Aplicante", minXP: 1500, maxXP: 3500 },
  { name: "Residente", minXP: 3500, maxXP: 7000 },
  { name: "Cidadão", minXP: 7000, maxXP: Infinity },
];

export function getLevel(xp: number): Level {
  return LEVELS.find((l) => xp >= l.minXP && xp < l.maxXP) || LEVELS[0];
}

export function getLevelProgress(xp: number): number {
  const level = getLevel(xp);
  if (level.maxXP === Infinity) return 100;
  const range = level.maxXP - level.minXP;
  return Math.round(((xp - level.minXP) / range) * 100);
}
