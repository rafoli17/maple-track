import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { immigrationPlans, journeyPhases } from "@/db/schema";
import { JourneyClient } from "./journey-client";

export default async function JourneyPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = session.user.householdId;
  let activePlan: any = null;
  let phases: any[] = [];

  if (householdId) {
    try {
      activePlan = await db.query.immigrationPlans.findFirst({
        where: and(
          eq(immigrationPlans.householdId, householdId),
          eq(immigrationPlans.priority, "PRIMARY")
        ),
        with: { program: true },
      });

      if (activePlan) {
        phases = await db.query.journeyPhases.findMany({
          where: eq(journeyPhases.immigrationPlanId, activePlan.id),
          with: { steps: true },
        });
        // Sort by phase order
        phases.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      }
    } catch {
      // DB error
    }
  }

  return (
    <JourneyClient
      activePlan={activePlan}
      phases={phases}
    />
  );
}
