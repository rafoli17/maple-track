import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { immigrationPlans } from "@/db/schema";
import { PlansClient } from "./plans-client";
import { resolveHouseholdId } from "@/lib/resolve-household";
import { ensureDefaultPlans } from "@/lib/auto-create-plans";

export default async function PlansPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = await resolveHouseholdId(session.user);
  if (!householdId) redirect("/onboarding");

  let plans: any[] = [];

  try {
    plans = await db.query.immigrationPlans.findMany({
      where: eq(immigrationPlans.householdId, householdId),
      with: { program: true },
      orderBy: (p, { asc }) => [asc(p.priority)],
    });

    if (plans.length === 0) {
      await ensureDefaultPlans(householdId);
      plans = await db.query.immigrationPlans.findMany({
        where: eq(immigrationPlans.householdId, householdId),
        with: { program: true },
        orderBy: (p, { asc }) => [asc(p.priority)],
      });
    }
  } catch {
    // DB error
  }

  return <PlansClient plans={plans} />;
}
