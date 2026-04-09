import { db } from "@/db";
import {
  immigrationPlans,
  journeyPhases,
  journeySteps,
  languageTests,
  profiles,
} from "@/db/schema";
import { and, eq, inArray, ne } from "drizzle-orm";

/**
 * Auto-complete journey steps related to language tests when a profile has
 * at least one language test with real scores registered.
 *
 * Matches steps inside phases mapped to the `language_tests` macro milestone
 * with titles containing keywords like "agendar", "realizar", "teste", "ielts",
 * "celpip", "tef", "idioma".
 *
 * Returns number of steps marked as DONE.
 */
export async function autoCompleteLanguageSteps(
  householdId: string,
  profileId: string
): Promise<number> {
  // 1. Does this profile already have a test with scores?
  const tests = await db
    .select()
    .from(languageTests)
    .where(eq(languageTests.profileId, profileId));

  const hasScores = tests.some(
    (t) =>
      (t.speaking && Number(t.speaking) > 0) ||
      (t.listening && Number(t.listening) > 0) ||
      (t.reading && Number(t.reading) > 0) ||
      (t.writing && Number(t.writing) > 0)
  );

  if (!hasScores) return 0;

  // 2. Find all plans for this household
  const plans = await db
    .select({ id: immigrationPlans.id })
    .from(immigrationPlans)
    .where(eq(immigrationPlans.householdId, householdId));
  if (plans.length === 0) return 0;
  const planIds = plans.map((p) => p.id);

  // 3. Find all language_tests phases in those plans
  const phases = await db
    .select({ id: journeyPhases.id })
    .from(journeyPhases)
    .where(
      and(
        inArray(journeyPhases.immigrationPlanId, planIds),
        eq(journeyPhases.macroMilestoneId, "language_tests")
      )
    );
  if (phases.length === 0) return 0;
  const phaseIds = phases.map((p) => p.id);

  // 4. Fetch candidate steps (not done, in those phases)
  const candidates = await db
    .select()
    .from(journeySteps)
    .where(
      and(
        inArray(journeySteps.journeyPhaseId, phaseIds),
        ne(journeySteps.status, "DONE")
      )
    );
  if (candidates.length === 0) return 0;

  // 5. Determine if profile is primary applicant or spouse
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, profileId),
  });
  const isPrimary = profile?.isPrimaryApplicant ?? true;

  // 6. Filter by keyword match + assignee
  const KEYWORDS = [
    "agendar",
    "realizar",
    "teste",
    "ielts",
    "celpip",
    "tef",
    "tcf",
    "idioma",
    "language",
    "score",
    "resultado",
  ];

  const toComplete = candidates.filter((step) => {
    const title = (step.title || "").toLowerCase();
    const matchesKeyword = KEYWORDS.some((k) => title.includes(k));
    if (!matchesKeyword) return false;

    // Assignee matching
    if (step.assignedTo) {
      return step.assignedTo === profileId;
    }
    // Steps without explicit assignee: only primary applicant auto-completes
    return isPrimary;
  });

  if (toComplete.length === 0) return 0;

  const ids = toComplete.map((s) => s.id);
  await db
    .update(journeySteps)
    .set({ status: "DONE", completedAt: new Date() })
    .where(inArray(journeySteps.id, ids));

  return ids.length;
}
