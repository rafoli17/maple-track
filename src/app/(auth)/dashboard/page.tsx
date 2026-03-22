import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, and, desc } from "drizzle-orm";
import {
  profiles,
  immigrationPlans,
  notifications,
  crsScores,
  journeyPhases,
  journeySteps,
  documents,
  achievements,
  languageTests,
} from "@/db/schema";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = session.user.householdId;

  // If no household, prompt onboarding
  if (!householdId) {
    redirect("/onboarding");
  }

  // Fetch data in parallel
  let userProfiles: any[] = [];
  let activePlan: any = null;
  let recentNotifications: any[] = [];
  let latestCRS: any = null;
  let pendingSteps: any[] = [];
  let pendingDocs: any[] = [];
  let recentAchievements: any[] = [];
  let latestLanguageTests: any[] = [];
  let phases: any[] = [];

  try {
    const results = await Promise.allSettled([
      db.query.profiles.findMany({
        where: eq(profiles.householdId, householdId),
      }),
      db.query.immigrationPlans.findFirst({
        where: and(
          eq(immigrationPlans.householdId, householdId),
          eq(immigrationPlans.priority, "PRIMARY")
        ),
        with: { program: true },
      }),
      db.query.notifications.findMany({
        where: eq(notifications.householdId, householdId),
        orderBy: [desc(notifications.createdAt)],
        limit: 5,
      }),
      db.query.crsScores.findFirst({
        where: eq(
          crsScores.profileId,
          session.user.id
        ),
        orderBy: [desc(crsScores.calculatedAt)],
      }),
      db.query.journeySteps.findMany({
        where: eq(journeySteps.status, "TODO"),
        limit: 3,
        orderBy: [desc(journeySteps.createdAt)],
      }),
      db.query.documents.findMany({
        where: eq(documents.status, "NOT_STARTED"),
        limit: 5,
      }),
      db.query.achievements.findMany({
        where: eq(achievements.householdId, householdId),
        orderBy: [desc(achievements.unlockedAt)],
        limit: 3,
      }),
      db.query.languageTests.findMany({
        limit: 4,
        orderBy: [desc(languageTests.createdAt)],
      }),
      db.query.journeyPhases.findMany({
        limit: 10,
      }),
    ]);

    if (results[0].status === "fulfilled") userProfiles = results[0].value || [];
    if (results[1].status === "fulfilled") activePlan = results[1].value;
    if (results[2].status === "fulfilled") recentNotifications = results[2].value || [];
    if (results[3].status === "fulfilled") latestCRS = results[3].value;
    if (results[4].status === "fulfilled") pendingSteps = results[4].value || [];
    if (results[5].status === "fulfilled") pendingDocs = results[5].value || [];
    if (results[6].status === "fulfilled") recentAchievements = results[6].value || [];
    if (results[7].status === "fulfilled") latestLanguageTests = results[7].value || [];
    if (results[8].status === "fulfilled") phases = results[8].value || [];
  } catch {
    // If DB queries fail, show empty dashboard
  }

  // Calculate progress percentage
  const completedPhases = phases.filter((p: any) => p.status === "COMPLETED").length;
  const totalPhases = phases.length;
  const progressPercent = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  const hasData = userProfiles.length > 0 && (activePlan || pendingSteps.length > 0);

  return (
    <DashboardClient
      userName={session.user.name || "Viajante"}
      userImage={session.user.image || undefined}
      hasData={hasData}
      progressPercent={progressPercent}
      activePlan={activePlan}
      pendingSteps={pendingSteps}
      pendingDocs={pendingDocs}
      recentNotifications={recentNotifications}
      recentAchievements={recentAchievements}
      latestCRS={latestCRS}
      latestLanguageTests={latestLanguageTests}
      profiles={userProfiles}
    />
  );
}
