// ════════════════════════════════════════════
// Auto-Achievement System
// Checks and unlocks achievements based on real user actions
// ════════════════════════════════════════════

import { db } from "@/db";
import {
  achievements,
  journeyPhases,
  immigrationPlans,
  documents,
  languageTests,
  profiles,
  crsScores,
  journeySteps,
} from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";

// ════════════════════════════════════════════
// XP VALUES
// ════════════════════════════════════════════
export const XP_VALUES: Record<string, number> = {
  first_step: 50,
  five_steps: 100,
  ten_steps: 150,
  halfway: 200,
  plan_a_complete: 500,
  milestone_complete: 150,
  first_document: 30,
  five_documents: 100,
  ten_documents: 200,
  all_docs_ready: 300,
  first_language_test: 75,
  language_completed: 150,
  clb7_all_skills: 250,
  crs_400: 100,
  crs_450: 200,
  crs_500: 300,
  first_plan: 75,
  plan_comparison: 100,
  profile_complete: 50,
  family_added: 75,
  onboarding_done: 150,
  default: 50,
};

// ════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════
interface AchievementDef {
  type: "MILESTONE" | "STREAK" | "COMPLETION" | "SCORE";
  name: string;
  description: string;
  icon: string;
  key: string;
  xp?: number;
  category?: string;
}

interface UnlockedResult {
  name: string;
  key: string;
  xp: number;
  isNew: boolean;
}

// ════════════════════════════════════════════
// PREDEFINED ACHIEVEMENTS (for display even when locked)
// ════════════════════════════════════════════
export const ACHIEVEMENT_DEFINITIONS: AchievementDef[] = [
  // ── ONBOARDING & PROFILE ──
  {
    type: "MILESTONE",
    name: "Primeiro Passo",
    description: "Complete a primeira etapa da jornada",
    icon: "rocket",
    key: "first_step",
    category: "Jornada",
  },
  {
    type: "MILESTONE",
    name: "Perfil Completo",
    description: "Preencha todas as informacoes do perfil",
    icon: "user-check",
    key: "profile_complete",
    category: "Onboarding",
  },
  {
    type: "MILESTONE",
    name: "Familia Unida",
    description: "Adicione um conjuge ao household",
    icon: "users",
    key: "family_added",
    category: "Onboarding",
  },

  // ── JOURNEY PROGRESS ──
  {
    type: "MILESTONE",
    name: "Em Ritmo",
    description: "Complete 5 etapas da jornada",
    icon: "flame",
    key: "five_steps",
    category: "Jornada",
  },
  {
    type: "MILESTONE",
    name: "Consistencia",
    description: "Complete 10 etapas da jornada",
    icon: "star",
    key: "ten_steps",
    category: "Jornada",
  },
  {
    type: "MILESTONE",
    name: "Metade do Caminho",
    description: "Complete 50% do plano principal",
    icon: "trophy",
    key: "halfway",
    category: "Jornada",
  },
  {
    type: "COMPLETION",
    name: "Jornada Completa",
    description: "Complete 100% do plano principal",
    icon: "crown",
    key: "plan_a_complete",
    category: "Jornada",
  },

  // ── DOCUMENTS ──
  {
    type: "MILESTONE",
    name: "Documentado",
    description: "Submeta seu primeiro documento",
    icon: "file-text",
    key: "first_document",
    category: "Documentos",
  },
  {
    type: "MILESTONE",
    name: "Organizado",
    description: "Submeta 5 documentos",
    icon: "folder-check",
    key: "five_documents",
    category: "Documentos",
  },
  {
    type: "COMPLETION",
    name: "Arquivo Completo",
    description: "Submeta 10 documentos",
    icon: "archive",
    key: "ten_documents",
    category: "Documentos",
  },

  // ── LANGUAGE ──
  {
    type: "MILESTONE",
    name: "Poliglota",
    description: "Registre seu primeiro teste de idioma",
    icon: "globe",
    key: "first_language_test",
    category: "Idiomas",
  },
  {
    type: "COMPLETION",
    name: "Teste Completo",
    description: "Complete um teste de idioma com resultado",
    icon: "check-circle",
    key: "language_completed",
    category: "Idiomas",
  },
  {
    type: "SCORE",
    name: "CLB 7+ Total",
    description: "Alcance CLB 7+ em todas as habilidades",
    icon: "award",
    key: "clb7_all_skills",
    category: "Idiomas",
  },

  // ── CRS SCORE ──
  {
    type: "SCORE",
    name: "Score Alto",
    description: "Alcance CRS 400+",
    icon: "trending-up",
    key: "crs_400",
    category: "CRS",
  },
  {
    type: "SCORE",
    name: "Score Excelente",
    description: "Alcance CRS 450+",
    icon: "trending-up",
    key: "crs_450",
    category: "CRS",
  },
  {
    type: "SCORE",
    name: "Score Elite",
    description: "Alcance CRS 500+",
    icon: "trending-up",
    key: "crs_500",
    category: "CRS",
  },

  // ── PLANS ──
  {
    type: "MILESTONE",
    name: "Planejador",
    description: "Crie seu primeiro plano de imigracao",
    icon: "map",
    key: "first_plan",
    category: "Planos",
  },
  {
    type: "MILESTONE",
    name: "Explorador",
    description: "Compare 2 ou mais programas",
    icon: "compass",
    key: "plan_comparison",
    category: "Planos",
  },
];

// ════════════════════════════════════════════
// CORE UNLOCK FUNCTION
// ════════════════════════════════════════════
async function unlockIfNew(
  householdId: string,
  def: AchievementDef,
  existingAchievements: any[]
): Promise<UnlockedResult | null> {
  const alreadyExists = existingAchievements.some(
    (a) => (a.metadata as any)?.key === def.key
  );
  if (alreadyExists) return null;

  const xp = def.xp || XP_VALUES[def.key] || XP_VALUES.default;

  try {
    const [created] = await db
      .insert(achievements)
      .values({
        householdId,
        type: def.type,
        name: def.name,
        description: def.description,
        icon: def.icon,
        unlockedAt: new Date(),
        metadata: { key: def.key, xp, category: def.category || "Geral" },
      })
      .returning();

    return created ? { name: created.name, key: def.key, xp, isNew: true } : null;
  } catch (error) {
    console.error(`[ACHIEVEMENT_UNLOCK] Failed to unlock ${def.key}:`, error);
    return null;
  }
}

// ════════════════════════════════════════════
// CHECK: STEP / JOURNEY ACHIEVEMENTS
// ════════════════════════════════════════════
export async function checkStepAchievements(
  householdId: string
): Promise<string[]> {
  const results = await checkStepAchievementsFull(householdId);
  return results.map((r) => r.name);
}

export async function checkStepAchievementsDetailed(
  householdId: string
): Promise<UnlockedResult[]> {
  return checkStepAchievementsFull(householdId);
}

async function checkStepAchievementsFull(
  householdId: string
): Promise<UnlockedResult[]> {
  const newlyUnlocked: UnlockedResult[] = [];

  const existing = await db.query.achievements.findMany({
    where: eq(achievements.householdId, householdId),
  });

  const plans = await db.query.immigrationPlans.findMany({
    where: eq(immigrationPlans.householdId, householdId),
  });
  const planIds = plans.map((p) => p.id);
  if (planIds.length === 0) return newlyUnlocked;

  const phases = await db.query.journeyPhases.findMany({
    where: inArray(journeyPhases.immigrationPlanId, planIds),
    with: { steps: true, plan: true },
  });

  const allSteps = phases.flatMap((p) => p.steps);
  const doneSteps = allSteps.filter((s) => s.status === "DONE");
  const primaryPhases = phases.filter((p) => p.plan?.priority === "PRIMARY");
  const primarySteps = primaryPhases.flatMap((p) => p.steps);
  const primaryDoneSteps = primarySteps.filter((s) => s.status === "DONE");

  // ── FIRST STEP ──
  if (doneSteps.length >= 1) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Primeiro Passo",
        description: "Completou a primeira etapa da jornada",
        icon: "rocket",
        key: "first_step",
        category: "Jornada",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── 5 STEPS ──
  if (doneSteps.length >= 5) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Em Ritmo",
        description: "5 etapas concluidas",
        icon: "flame",
        key: "five_steps",
        category: "Jornada",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── 10 STEPS ──
  if (doneSteps.length >= 10) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Consistencia",
        description: "10 etapas concluidas",
        icon: "star",
        key: "ten_steps",
        category: "Jornada",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── HALFWAY (50% of primary) ──
  if (
    primarySteps.length > 0 &&
    primaryDoneSteps.length >= primarySteps.length / 2
  ) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Metade do Caminho",
        description: "50% do plano principal concluido",
        icon: "trophy",
        key: "halfway",
        category: "Jornada",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── MILESTONE COMPLETED (by macroMilestoneId, primary only) ──
  const milestoneGroups = new Map<
    string,
    { total: number; done: number; name: string }
  >();
  for (const phase of primaryPhases) {
    const mid = phase.macroMilestoneId || "unknown";
    const ex = milestoneGroups.get(mid) || {
      total: 0,
      done: 0,
      name: phase.name,
    };
    ex.total += phase.steps.length;
    ex.done += phase.steps.filter((s) => s.status === "DONE").length;
    milestoneGroups.set(mid, ex);
  }

  for (const [milestoneId, data] of milestoneGroups) {
    if (data.total > 0 && data.done === data.total) {
      const r = await unlockIfNew(
        householdId,
        {
          type: "COMPLETION",
          name: `Fase concluida: ${data.name}`,
          description: `Todas as etapas de "${data.name}" foram completadas`,
          icon: "check-circle",
          key: `milestone_${milestoneId}`,
          category: "Jornada",
        },
        existing
      );
      if (r) newlyUnlocked.push(r);
    }
  }

  // ── ALL PRIMARY DONE ──
  if (
    primarySteps.length > 0 &&
    primaryDoneSteps.length === primarySteps.length
  ) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "COMPLETION",
        name: "Jornada Completa",
        description: "Todas as etapas do plano principal foram concluidas",
        icon: "crown",
        key: "plan_a_complete",
        category: "Jornada",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  return newlyUnlocked;
}

// ════════════════════════════════════════════
// CHECK: DOCUMENT ACHIEVEMENTS
// ════════════════════════════════════════════
async function checkDocumentAchievements(
  householdId: string
): Promise<UnlockedResult[]> {
  const newlyUnlocked: UnlockedResult[] = [];

  const existing = await db.query.achievements.findMany({
    where: eq(achievements.householdId, householdId),
  });

  // Get all profiles in household
  const householdProfiles = await db.query.profiles.findMany({
    where: eq(profiles.householdId, householdId),
  });
  const profileIds = householdProfiles.map((p) => p.id);
  if (profileIds.length === 0) return newlyUnlocked;

  const allDocs = await db.query.documents.findMany({
    where: inArray(documents.profileId, profileIds),
  });

  const submittedDocs = allDocs.filter(
    (d) => d.status !== "NOT_STARTED"
  );

  // ── FIRST DOCUMENT ──
  if (submittedDocs.length >= 1) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Documentado",
        description: "Submeteu o primeiro documento",
        icon: "file-text",
        key: "first_document",
        category: "Documentos",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── 5 DOCUMENTS ──
  if (submittedDocs.length >= 5) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Organizado",
        description: "5 documentos submetidos",
        icon: "folder-check",
        key: "five_documents",
        category: "Documentos",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── 10 DOCUMENTS ──
  if (submittedDocs.length >= 10) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "COMPLETION",
        name: "Arquivo Completo",
        description: "10 documentos submetidos",
        icon: "archive",
        key: "ten_documents",
        category: "Documentos",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  return newlyUnlocked;
}

// ════════════════════════════════════════════
// CHECK: LANGUAGE ACHIEVEMENTS
// ════════════════════════════════════════════
async function checkLanguageAchievements(
  householdId: string
): Promise<UnlockedResult[]> {
  const newlyUnlocked: UnlockedResult[] = [];

  const existing = await db.query.achievements.findMany({
    where: eq(achievements.householdId, householdId),
  });

  const householdProfiles = await db.query.profiles.findMany({
    where: eq(profiles.householdId, householdId),
  });
  const profileIds = householdProfiles.map((p) => p.id);
  if (profileIds.length === 0) return newlyUnlocked;

  const allTests = await db.query.languageTests.findMany({
    where: inArray(languageTests.profileId, profileIds),
  });

  // ── FIRST LANGUAGE TEST ──
  if (allTests.length >= 1) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Poliglota",
        description: "Registrou o primeiro teste de idioma",
        icon: "globe",
        key: "first_language_test",
        category: "Idiomas",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── COMPLETED LANGUAGE TEST ──
  const completedTests = allTests.filter((t) => t.status === "COMPLETED");
  if (completedTests.length >= 1) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "COMPLETION",
        name: "Teste Completo",
        description: "Completou um teste de idioma com resultado",
        icon: "check-circle",
        key: "language_completed",
        category: "Idiomas",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── CLB 7+ ALL SKILLS ──
  const hasClb7Plus = completedTests.some(
    (t) => t.clbEquivalent && t.clbEquivalent >= 7
  );
  if (hasClb7Plus) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "SCORE",
        name: "CLB 7+ Total",
        description: "Alcancou CLB 7+ em todas as habilidades",
        icon: "award",
        key: "clb7_all_skills",
        category: "Idiomas",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  return newlyUnlocked;
}

// ════════════════════════════════════════════
// CHECK: CRS ACHIEVEMENTS
// ════════════════════════════════════════════
export async function checkCRSAchievements(
  householdId: string,
  totalScore: number
): Promise<string[]> {
  const results = await checkCRSAchievementsFull(householdId, totalScore);
  return results.map((r) => r.name);
}

async function checkCRSAchievementsFull(
  householdId: string,
  totalScore?: number
): Promise<UnlockedResult[]> {
  const newlyUnlocked: UnlockedResult[] = [];

  const existing = await db.query.achievements.findMany({
    where: eq(achievements.householdId, householdId),
  });

  // If no score provided, look up the latest
  let score = totalScore;
  if (score === undefined) {
    const householdProfiles = await db.query.profiles.findMany({
      where: eq(profiles.householdId, householdId),
    });
    const primaryProfile = householdProfiles.find((p) => p.isPrimaryApplicant) || householdProfiles[0];
    if (primaryProfile) {
      const latestCrs = await db.query.crsScores.findFirst({
        where: eq(crsScores.profileId, primaryProfile.id),
        orderBy: [desc(crsScores.calculatedAt)],
      });
      score = latestCrs?.totalScore;
    }
  }

  if (!score) return newlyUnlocked;

  const thresholds = [
    {
      score: 400,
      name: "Score Alto",
      desc: "Score CRS acima de 400",
      key: "crs_400",
    },
    {
      score: 450,
      name: "Score Excelente",
      desc: "Score CRS acima de 450",
      key: "crs_450",
    },
    {
      score: 500,
      name: "Score Elite",
      desc: "Score CRS acima de 500",
      key: "crs_500",
    },
  ];

  for (const t of thresholds) {
    if (score >= t.score) {
      const r = await unlockIfNew(
        householdId,
        {
          type: "SCORE",
          name: t.name,
          description: t.desc,
          icon: "trending-up",
          key: t.key,
          category: "CRS",
        },
        existing
      );
      if (r) newlyUnlocked.push(r);
    }
  }

  return newlyUnlocked;
}

// ════════════════════════════════════════════
// CHECK: PLAN ACHIEVEMENTS
// ════════════════════════════════════════════
async function checkPlanAchievements(
  householdId: string
): Promise<UnlockedResult[]> {
  const newlyUnlocked: UnlockedResult[] = [];

  const existing = await db.query.achievements.findMany({
    where: eq(achievements.householdId, householdId),
  });

  const plans = await db.query.immigrationPlans.findMany({
    where: eq(immigrationPlans.householdId, householdId),
  });

  // ── FIRST PLAN ──
  if (plans.length >= 1) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Planejador",
        description: "Criou o primeiro plano de imigracao",
        icon: "map",
        key: "first_plan",
        category: "Planos",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── PLAN COMPARISON (2+ plans) ──
  if (plans.length >= 2) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Explorador",
        description: "Comparou 2 ou mais programas",
        icon: "compass",
        key: "plan_comparison",
        category: "Planos",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  return newlyUnlocked;
}

// ════════════════════════════════════════════
// CHECK: PROFILE / ONBOARDING ACHIEVEMENTS
// ════════════════════════════════════════════
async function checkProfileAchievements(
  householdId: string
): Promise<UnlockedResult[]> {
  const newlyUnlocked: UnlockedResult[] = [];

  const existing = await db.query.achievements.findMany({
    where: eq(achievements.householdId, householdId),
  });

  const householdProfiles = await db.query.profiles.findMany({
    where: eq(profiles.householdId, householdId),
  });

  // ── FAMILY ADDED (2+ profiles) ──
  if (householdProfiles.length >= 2) {
    const r = await unlockIfNew(
      householdId,
      {
        type: "MILESTONE",
        name: "Familia Unida",
        description: "Adicionou conjuge ao household",
        icon: "users",
        key: "family_added",
        category: "Onboarding",
      },
      existing
    );
    if (r) newlyUnlocked.push(r);
  }

  // ── PROFILE COMPLETE ──
  const primaryProfile = householdProfiles.find((p) => p.isPrimaryApplicant) || householdProfiles[0];
  if (primaryProfile) {
    const isComplete =
      primaryProfile.firstName &&
      primaryProfile.lastName &&
      primaryProfile.dateOfBirth &&
      primaryProfile.nationality &&
      primaryProfile.educationLevel &&
      primaryProfile.currentCountry;

    if (isComplete) {
      const r = await unlockIfNew(
        householdId,
        {
          type: "MILESTONE",
          name: "Perfil Completo",
          description: "Preencheu todas as informacoes do perfil",
          icon: "user-check",
          key: "profile_complete",
          category: "Onboarding",
        },
        existing
      );
      if (r) newlyUnlocked.push(r);
    }
  }

  return newlyUnlocked;
}

// ════════════════════════════════════════════
// MASTER SYNC: Check ALL achievements at once
// Called when visiting achievements page to catch up
// ════════════════════════════════════════════
export async function syncAllAchievements(
  householdId: string
): Promise<{
  newlyUnlocked: UnlockedResult[];
  all: any[];
  totalXP: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
}> {
  // Run all checks in parallel
  const [stepResults, docResults, langResults, crsResults, planResults, profileResults] =
    await Promise.all([
      checkStepAchievementsFull(householdId).catch(() => [] as UnlockedResult[]),
      checkDocumentAchievements(householdId).catch(() => [] as UnlockedResult[]),
      checkLanguageAchievements(householdId).catch(() => [] as UnlockedResult[]),
      checkCRSAchievementsFull(householdId).catch(() => [] as UnlockedResult[]),
      checkPlanAchievements(householdId).catch(() => [] as UnlockedResult[]),
      checkProfileAchievements(householdId).catch(() => [] as UnlockedResult[]),
    ]);

  const newlyUnlocked = [
    ...stepResults,
    ...docResults,
    ...langResults,
    ...crsResults,
    ...planResults,
    ...profileResults,
  ];

  // Get all achievements fresh from DB
  const all = await db.query.achievements.findMany({
    where: eq(achievements.householdId, householdId),
    orderBy: [desc(achievements.unlockedAt)],
  });

  // Calculate XP from achievements
  let totalXP = 0;
  for (const ach of all) {
    const meta = ach.metadata as any;
    totalXP += meta?.xp || XP_VALUES[meta?.key] || XP_VALUES.default;
  }

  const xpPerLevel = 500;
  const level = Math.floor(totalXP / xpPerLevel) + 1;
  const xpInLevel = totalXP % xpPerLevel;

  return {
    newlyUnlocked,
    all,
    totalXP,
    level,
    xpInLevel,
    xpForNextLevel: xpPerLevel,
  };
}

// ════════════════════════════════════════════
// REVOKE: Remove achievements no longer valid
// Called when a step is undone
// ════════════════════════════════════════════
export async function revokeInvalidStepAchievements(
  householdId: string
): Promise<string[]> {
  const revoked: string[] = [];

  try {
    const existing = await db.query.achievements.findMany({
      where: eq(achievements.householdId, householdId),
    });

    const plans = await db.query.immigrationPlans.findMany({
      where: eq(immigrationPlans.householdId, householdId),
    });
    const planIds = plans.map((p) => p.id);

    let doneCount = 0;
    let primaryStepsTotal = 0;
    let primaryStepsDone = 0;
    const completedMilestoneKeys = new Set<string>();

    if (planIds.length > 0) {
      const phases = await db.query.journeyPhases.findMany({
        where: inArray(journeyPhases.immigrationPlanId, planIds),
        with: { steps: true, plan: true },
      });

      const allSteps = phases.flatMap((p) => p.steps);
      doneCount = allSteps.filter((s) => s.status === "DONE").length;

      const primaryPhases = phases.filter((p) => p.plan?.priority === "PRIMARY");
      const primarySteps = primaryPhases.flatMap((p) => p.steps);
      primaryStepsTotal = primarySteps.length;
      primaryStepsDone = primarySteps.filter((s) => s.status === "DONE").length;

      // Check which milestones are still fully complete
      const milestoneGroups = new Map<string, { total: number; done: number }>();
      for (const phase of primaryPhases) {
        const mid = phase.macroMilestoneId || "unknown";
        const ex = milestoneGroups.get(mid) || { total: 0, done: 0 };
        ex.total += phase.steps.length;
        ex.done += phase.steps.filter((s) => s.status === "DONE").length;
        milestoneGroups.set(mid, ex);
      }
      for (const [milestoneId, data] of milestoneGroups) {
        if (data.total > 0 && data.done === data.total) {
          completedMilestoneKeys.add(`milestone_${milestoneId}`);
        }
      }
    }

    // Define which keys should be revoked based on current state
    const revokeRules: Record<string, boolean> = {
      first_step: doneCount < 1,
      five_steps: doneCount < 5,
      ten_steps: doneCount < 10,
      halfway: primaryStepsTotal === 0 || primaryStepsDone < primaryStepsTotal / 2,
      plan_a_complete: primaryStepsTotal === 0 || primaryStepsDone < primaryStepsTotal,
    };

    for (const ach of existing) {
      const key = (ach.metadata as any)?.key;
      if (!key) continue;

      let shouldRevoke = false;

      // Check static rules
      if (key in revokeRules) {
        shouldRevoke = revokeRules[key];
      }

      // Check dynamic milestone completions
      if (key.startsWith("milestone_") && !completedMilestoneKeys.has(key)) {
        shouldRevoke = true;
      }

      if (shouldRevoke) {
        await db.delete(achievements).where(eq(achievements.id, ach.id));
        revoked.push(ach.name);
      }
    }
  } catch (error) {
    console.error("[ACHIEVEMENT_REVOKE]", error);
  }

  return revoked;
}

// Legacy exports for backward compatibility
export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "MILESTONE" | "STREAK" | "COMPLETION" | "SCORE";
}
