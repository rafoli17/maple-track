import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { resolveHouseholdId } from "@/lib/resolve-household";
import { syncAllAchievements, ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements";
import { AchievementsClient } from "./achievements-client";

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = await resolveHouseholdId(
    session.user as { id: string; householdId?: string | null }
  );

  let syncResult = {
    newlyUnlocked: [] as any[],
    all: [] as any[],
    totalXP: 0,
    level: 1,
    xpInLevel: 0,
    xpForNextLevel: 500,
  };

  if (householdId) {
    try {
      // Sync triggers ALL achievement checks — retroactively unlocks anything missed
      syncResult = await syncAllAchievements(householdId);
    } catch (e) {
      console.error("[ACHIEVEMENTS_PAGE]", e);
    }
  }

  return (
    <AchievementsClient
      achievements={syncResult.all}
      totalXP={syncResult.totalXP}
      level={syncResult.level}
      xpInLevel={syncResult.xpInLevel}
      xpForNextLevel={syncResult.xpForNextLevel}
      newlyUnlocked={syncResult.newlyUnlocked}
      definitions={ACHIEVEMENT_DEFINITIONS}
    />
  );
}
