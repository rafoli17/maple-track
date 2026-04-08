import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import {
  immigrationPlans,
  immigrationPrograms,
  journeyPhases,
  journeySteps,
  profiles,
} from "@/db/schema";
import { getJourneyTemplate } from "@/lib/journey-templates";

const DEFAULT_PLANS: { code: string; priority: "PRIMARY" | "SECONDARY" | "TERTIARY" }[] = [
  { code: "AIP", priority: "PRIMARY" },
  { code: "EXPRESS_ENTRY_FSWP", priority: "SECONDARY" },
  { code: "STUDY_PGWP", priority: "TERTIARY" },
];

/**
 * Creates default plans (AIP, Express Entry FSW, Study PGWP) for a household
 * if none exist yet. Idempotent — safe to call multiple times.
 * Also assigns steps to household members based on template assignTo field.
 */
export async function ensureDefaultPlans(householdId: string) {
  const existing = await db.query.immigrationPlans.findMany({
    where: eq(immigrationPlans.householdId, householdId),
  });

  if (existing.length > 0) return;

  // Resolve household profiles for task assignment
  const householdProfiles = await db.query.profiles.findMany({
    where: eq(profiles.householdId, householdId),
  });
  const primaryProfile = householdProfiles.find((p) => p.isPrimaryApplicant);
  const secondaryProfile = householdProfiles.find((p) => !p.isPrimaryApplicant);

  const programs = await db.query.immigrationPrograms.findMany({
    where: inArray(
      immigrationPrograms.code,
      DEFAULT_PLANS.map((p) => p.code)
    ),
  });

  for (const { code, priority } of DEFAULT_PLANS) {
    const program = programs.find((p) => p.code === code);
    if (!program) continue;

    const [plan] = await db
      .insert(immigrationPlans)
      .values({
        householdId,
        programId: program.id,
        priority,
        startedAt: new Date(),
      })
      .returning();

    const template = getJourneyTemplate(program.code);

    for (let pi = 0; pi < template.length; pi++) {
      const pt = template[pi];
      const [phase] = await db
        .insert(journeyPhases)
        .values({
          immigrationPlanId: plan.id,
          phaseNumber: pi + 1,
          name: pt.name,
          description: pt.description,
          estimatedDurationDays: pt.estimatedDurationDays,
          order: pi,
          macroMilestoneId: pt.macroMilestoneId,
        })
        .returning();

      for (let si = 0; si < pt.steps.length; si++) {
        const st = pt.steps[si];
        // Resolve assignedTo from template
        let assignedTo: string | null = null;
        if (st.assignTo === "primary" && primaryProfile) {
          assignedTo = primaryProfile.id;
        } else if (st.assignTo === "secondary" && secondaryProfile) {
          assignedTo = secondaryProfile.id;
        }
        // "both" → null (shared task, no single owner)

        await db.insert(journeySteps).values({
          journeyPhaseId: phase.id,
          immigrationPlanId: plan.id,
          title: st.title,
          description: st.description,
          instructions: st.instructions || null,
          priority: st.priority,
          order: si,
          actionUrl: st.actionUrl || null,
          assignedTo,
        });
      }
    }
  }
}
