import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, desc } from "drizzle-orm";
import { achievements } from "@/db/schema";
import { AchievementsClient } from "./achievements-client";

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = session.user.householdId;
  let householdAchievements: any[] = [];

  if (householdId) {
    try {
      householdAchievements = await db.query.achievements.findMany({
        where: eq(achievements.householdId, householdId),
        orderBy: [desc(achievements.unlockedAt)],
      });
    } catch {
      // DB error
    }
  }

  return <AchievementsClient achievements={householdAchievements} />;
}
