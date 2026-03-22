import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { immigrationPlans } from "@/db/schema";
import { PlansClient } from "./plans-client";

export default async function PlansPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = session.user.householdId;
  let plans: any[] = [];

  if (householdId) {
    try {
      plans = await db.query.immigrationPlans.findMany({
        where: eq(immigrationPlans.householdId, householdId),
        with: { program: true },
      });
    } catch {
      // DB error
    }
  }

  return <PlansClient plans={plans} />;
}
