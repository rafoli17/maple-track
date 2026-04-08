import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { immigrationPlans, journeyPhases, profiles } from "@/db/schema";
import { JourneyClient } from "./journey-client";
import { computeMacroProgress } from "@/lib/macro-journey";
import { resolveHouseholdId } from "@/lib/resolve-household";
import { ensureDefaultPlans } from "@/lib/auto-create-plans";

export default async function JourneyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = await resolveHouseholdId(session.user);
  if (!householdId) redirect("/onboarding");

  let allPlans: any[] = [];
  let allPhasesWithSteps: any[] = [];
  let householdProfiles: any[] = [];

  try {
    allPlans = await db.query.immigrationPlans.findMany({
      where: eq(immigrationPlans.householdId, householdId),
      with: { program: true },
    });

    // Auto-create default plans if none exist
    if (allPlans.length === 0) {
      await ensureDefaultPlans(householdId);
      allPlans = await db.query.immigrationPlans.findMany({
        where: eq(immigrationPlans.householdId, householdId),
        with: { program: true },
      });
    }

    householdProfiles = await db.query.profiles.findMany({
      where: eq(profiles.householdId, householdId),
      with: { user: true },
    });

    const allPlanIds = allPlans.map((p: any) => p.id);
    if (allPlanIds.length > 0) {
      allPhasesWithSteps = await db.query.journeyPhases.findMany({
        where: inArray(journeyPhases.immigrationPlanId, allPlanIds),
        with: {
          steps: { orderBy: (steps: any, { asc }: any) => [asc(steps.order)] },
          plan: { with: { program: true } },
        },
        orderBy: (phases: any, { asc }: any) => [asc(phases.order)],
      });
    }
  } catch {
    // DB error
  }

  const macroMilestones = computeMacroProgress(allPhasesWithSteps, true);

  return (
    <JourneyClient
      allPlans={allPlans}
      macroMilestones={macroMilestones}
      profiles={householdProfiles}
    />
  );
}
