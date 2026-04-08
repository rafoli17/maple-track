// ════════════════════════════════════════════
// Macro Journey — Universal Immigration Milestones
// The 9 macro milestones every immigrant passes through,
// regardless of which program they choose.
// ════════════════════════════════════════════

export type MacroMilestoneId =
  | "research"
  | "language_tests"
  | "eca"
  | "submission"
  | "approval"
  | "visa"
  | "landing"
  | "pr"
  | "citizenship";

export type MilestoneStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";

export interface MacroMilestone {
  id: MacroMilestoneId;
  order: number;
  name: string;
  description: string;
  icon: string;
}

export interface MacroMilestoneWithStatus extends MacroMilestone {
  status: MilestoneStatus;
  completedSteps: number;
  totalSteps: number;
  /** Extra progress from B/C plans (only populated when primaryOnly=true) */
  bonusCompleted: number;
  bonusTotal: number;
  /** Micro steps grouped under this milestone */
  steps: MicroStep[];
}

export interface MicroStep {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  actionUrl: string | null;
  planPriority: string;
  planName: string;
  assignedTo: string | null;
}

export const MACRO_MILESTONES: MacroMilestone[] = [
  {
    id: "research",
    order: 0,
    name: "Pesquisa e Preparacao",
    description: "Analisar programas, calcular score e decidir o caminho",
    icon: "Search",
  },
  {
    id: "language_tests",
    order: 1,
    name: "Testes de Idioma",
    description: "IELTS, CELPIP ou TEF — agendar, estudar e realizar",
    icon: "Languages",
  },
  {
    id: "eca",
    order: 2,
    name: "Avaliacao de Credenciais",
    description: "ECA via WES/IQAS + traducoes juramentadas",
    icon: "GraduationCap",
  },
  {
    id: "submission",
    order: 3,
    name: "Submissao do Perfil",
    description: "Criar perfil no Express Entry ou submeter aplicacao",
    icon: "Send",
  },
  {
    id: "approval",
    order: 4,
    name: "Convite / Aprovacao",
    description: "Receber ITA ou endorsement provincial",
    icon: "PartyPopper",
  },
  {
    id: "visa",
    order: 5,
    name: "Obtencao do Visto",
    description: "Documentos finais, exame medico, biometrics e COPR",
    icon: "Stamp",
  },
  {
    id: "landing",
    order: 6,
    name: "Landing no Canada",
    description: "Chegada, SIN, PR Card e primeiros passos",
    icon: "Plane",
  },
  {
    id: "pr",
    order: 7,
    name: "Residencia Permanente",
    description: "Moradia, trabalho, health card — estabelecimento",
    icon: "Home",
  },
  {
    id: "citizenship",
    order: 8,
    name: "Cidadania Canadense",
    description: "Apos ~3 anos como PR, solicitar cidadania",
    icon: "Flag",
  },
];

// ════════════════════════════════════════════
// Progress Computation
// ════════════════════════════════════════════

interface PhaseWithSteps {
  id: string;
  macroMilestoneId: string | null;
  status: string;
  steps: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    actionUrl: string | null;
    assignedTo: string | null;
  }[];
  plan: {
    priority: string;
    program: {
      name: string;
    } | null;
  };
}

/**
 * Compute macro progress.
 * @param primaryOnly — when true, progress % uses only PRIMARY plan steps.
 *   All steps (A/B/C) are still returned in `steps` for display,
 *   but `completedSteps` and `totalSteps` reflect only PRIMARY.
 */
export function computeMacroProgress(
  allPhases: PhaseWithSteps[],
  primaryOnly = false
): MacroMilestoneWithStatus[] {
  return MACRO_MILESTONES.map((milestone) => {
    // Find all phases across all plans mapped to this milestone
    const relatedPhases = allPhases.filter(
      (p) => p.macroMilestoneId === milestone.id
    );

    // Flatten all steps from related phases
    const allSteps: MicroStep[] = relatedPhases.flatMap((phase) =>
      (phase.steps || []).map((step) => ({
        id: step.id,
        title: step.title,
        description: step.description,
        status: step.status,
        priority: step.priority,
        actionUrl: step.actionUrl,
        planPriority: phase.plan?.priority || "PRIMARY",
        planName: phase.plan?.program?.name || "Plano",
        assignedTo: step.assignedTo || null,
      }))
    );

    // For progress calculation, use only PRIMARY steps when primaryOnly=true
    const progressSteps = primaryOnly
      ? allSteps.filter((s) => s.planPriority === "PRIMARY")
      : allSteps;

    const completedSteps = progressSteps.filter((s) => s.status === "DONE").length;
    const totalSteps = progressSteps.length;

    // Bonus: extra steps completed from B/C plans
    const bonusCompleted = primaryOnly
      ? allSteps.filter((s) => s.planPriority !== "PRIMARY" && s.status === "DONE").length
      : 0;
    const bonusTotal = primaryOnly
      ? allSteps.filter((s) => s.planPriority !== "PRIMARY").length
      : 0;

    // Derive milestone status from PRIMARY steps only
    let status: MilestoneStatus = "NOT_STARTED";
    if (totalSteps > 0) {
      if (completedSteps === totalSteps) {
        status = "COMPLETED";
      } else if (completedSteps > 0 || relatedPhases.some((p) => p.status === "IN_PROGRESS")) {
        status = "IN_PROGRESS";
      }
    }

    // Sort steps: PRIMARY first, then SECONDARY, then TERTIARY
    const priorityOrder: Record<string, number> = {
      PRIMARY: 0,
      SECONDARY: 1,
      TERTIARY: 2,
    };
    allSteps.sort(
      (a, b) =>
        (priorityOrder[a.planPriority] ?? 9) -
        (priorityOrder[b.planPriority] ?? 9)
    );

    return {
      ...milestone,
      status,
      completedSteps,
      totalSteps,
      bonusCompleted,
      bonusTotal,
      steps: allSteps,
    };
  });
}

/**
 * Get the current milestone (first IN_PROGRESS, or first NOT_STARTED if none in progress)
 */
export function getCurrentMilestoneIndex(
  milestones: MacroMilestoneWithStatus[]
): number {
  const inProgress = milestones.findIndex((m) => m.status === "IN_PROGRESS");
  if (inProgress >= 0) return inProgress;

  const notStarted = milestones.findIndex((m) => m.status === "NOT_STARTED");
  if (notStarted >= 0) return notStarted;

  return milestones.length - 1; // All done
}
