import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, and, desc, inArray } from "drizzle-orm";
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
import { computeMacroProgress, getCurrentMilestoneIndex } from "@/lib/macro-journey";
import { ensureDefaultPlans } from "@/lib/auto-create-plans";
import { autoCompleteLanguageSteps } from "@/lib/auto-complete-steps";
import { generateDocumentAlerts, findMissingDocs } from "@/lib/document-categories";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let householdId = session.user.householdId;

  // If no household but onboarding completed, try to find or create household from DB
  if (!householdId) {
    const { users: usersTable, households: householdsTable } = await import("@/db/schema");
    const dbUser = await db.query.users.findFirst({
      where: eq(usersTable.id, session.user.id),
    });

    if (dbUser?.householdId) {
      householdId = dbUser.householdId;
    } else if (dbUser?.onboardingCompleted) {
      const [household] = await db
        .insert(householdsTable)
        .values({
          name: session.user.name
            ? `Família ${session.user.name.split(" ").pop()}`
            : "Minha Família",
        })
        .returning();

      await db
        .update(usersTable)
        .set({ householdId: household.id })
        .where(eq(usersTable.id, session.user.id));

      const userProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, session.user.id),
      });
      if (userProfile && !userProfile.householdId) {
        await db
          .update(profiles)
          .set({ householdId: household.id })
          .where(eq(profiles.id, userProfile.id));
      }

      householdId = household.id;
    } else {
      redirect("/onboarding");
    }
  }

  // Get user's profile ID for CRS/language queries
  const userProfile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session.user.id),
  });
  const profileId = userProfile?.id;

  // Fetch ALL plans for the household (for macro journey)
  let allPlans: any[] = [];
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
  } catch {
    // DB error
  }

  const allPlanIds = allPlans.map((p: any) => p.id);

  // Retroactively sync language journey steps for all profiles in this household
  try {
    const householdProfiles = await db.query.profiles.findMany({
      where: eq(profiles.householdId, householdId),
    });
    for (const p of householdProfiles) {
      await autoCompleteLanguageSteps(householdId, p.id);
    }
  } catch (e) {
    console.error("[DASHBOARD] language auto-complete failed", e);
  }

  // Fetch data in parallel
  let userProfiles: any[] = [];
  let recentNotifications: any[] = [];
  let latestCRS: any = null;
  let pendingDocs: any[] = [];
  let recentAchievements: any[] = [];
  let latestLanguageTests: any[] = [];
  let allPhasesWithSteps: any[] = [];

  try {
    const results = await Promise.allSettled([
      db.query.profiles.findMany({
        where: eq(profiles.householdId, householdId),
        with: { user: true },
      }),
      db.query.notifications.findMany({
        where: eq(notifications.householdId, householdId),
        orderBy: [desc(notifications.createdAt)],
        limit: 5,
      }),
      profileId
        ? db.query.crsScores.findFirst({
            where: eq(crsScores.profileId, profileId),
            orderBy: [desc(crsScores.calculatedAt)],
          })
        : Promise.resolve(null),
      // Fetch ALL household docs for alert computation
      Promise.resolve([]), // will fetch after profiles are available
      db.query.achievements.findMany({
        where: eq(achievements.householdId, householdId),
        orderBy: [desc(achievements.unlockedAt)],
        limit: 3,
      }),
      // Fetch language tests for ALL household profiles (resolved after profiles query)
      Promise.resolve([]), // placeholder — will fetch below after profiles are available
      // Fetch ALL phases across ALL plans with steps and plan info
      allPlanIds.length > 0
        ? db.query.journeyPhases.findMany({
            where: inArray(journeyPhases.immigrationPlanId, allPlanIds),
            with: {
              steps: {
                orderBy: (steps: any, { asc }: any) => [asc(steps.order)],
              },
              plan: {
                with: { program: true },
              },
            },
            orderBy: (phases: any, { asc }: any) => [asc(phases.order)],
          })
        : Promise.resolve([]),
    ]);

    if (results[0].status === "fulfilled") userProfiles = results[0].value || [];
    if (results[1].status === "fulfilled") recentNotifications = results[1].value || [];
    if (results[2].status === "fulfilled") latestCRS = results[2].value;
    // placeholder index 3 — docs fetched below with profiles
    if (results[4].status === "fulfilled") recentAchievements = results[4].value || [];
    // placeholder index 5 — language tests fetched below
    if (results[6].status === "fulfilled") allPhasesWithSteps = results[6].value || [];

    // Fetch language tests + documents for ALL household profiles
    if (userProfiles.length > 0) {
      const allProfileIds = userProfiles.map((p: any) => p.id);
      try {
        const [testsResult, docsResult] = await Promise.all([
          db.query.languageTests.findMany({
            where: inArray(languageTests.profileId, allProfileIds),
            orderBy: [desc(languageTests.createdAt)],
          }),
          db.query.documents.findMany({
            where: inArray(documents.profileId, allProfileIds),
          }),
        ]);
        latestLanguageTests = testsResult || [];
        pendingDocs = docsResult || [];
      } catch {
        latestLanguageTests = [];
        pendingDocs = [];
      }
    }
  } catch {
    // If DB queries fail, show empty dashboard
  }

  // Compute macro journey milestones — PRIMARY plan only for progress
  const macroMilestones = computeMacroProgress(allPhasesWithSteps, true);

  // Overall progress from macro milestones (PRIMARY only)
  const totalMilestoneSteps = macroMilestones.reduce((s, m) => s + m.totalSteps, 0);
  const completedMilestoneSteps = macroMilestones.reduce((s, m) => s + m.completedSteps, 0);
  const progressPercent = totalMilestoneSteps > 0
    ? Math.round((completedMilestoneSteps / totalMilestoneSteps) * 100)
    : 0;

  // Bonus progress from B/C plans
  const bonusCompleted = macroMilestones.reduce((s, m) => s + m.bonusCompleted, 0);
  const bonusTotal = macroMilestones.reduce((s, m) => s + m.bonusTotal, 0);
  const bonusPercent = bonusTotal > 0 ? Math.round((bonusCompleted / bonusTotal) * 100) : 0;

  // Get pending steps (TODO across all plans), prioritize PRIMARY plan
  const priorityOrder: Record<string, number> = {
    PRIMARY: 0,
    SECONDARY: 1,
    TERTIARY: 2,
  };
  const pendingSteps = allPhasesWithSteps
    .flatMap((p: any) =>
      (p.steps || []).map((s: any) => ({
        ...s,
        planPriority: p.plan?.priority || "PRIMARY",
        actionUrl: s.actionUrl || null,
      }))
    )
    .filter((s: any) => s.status === "TODO")
    .sort(
      (a: any, b: any) =>
        (priorityOrder[a.planPriority] ?? 9) -
        (priorityOrder[b.planPriority] ?? 9)
    )
    .slice(0, 5);

  // Compute document alerts
  const documentAlerts = generateDocumentAlerts(pendingDocs);
  const urgentDocAlerts = documentAlerts.filter((a) => a.level === "URGENT" || a.level === "EXPIRED");
  const pendingDocsNotStarted = pendingDocs.filter((d: any) => d.status === "NOT_STARTED");
  const docsReady = pendingDocs.filter((d: any) => d.status === "SUBMITTED" || d.status === "APPROVED").length;
  const docsTotal = pendingDocs.length;
  const missingDocs = findMissingDocs(pendingDocs, userProfiles.length).slice(0, 4);

  const hasData = userProfiles.length > 0;
  const activePlan = allPlans.find((p: any) => p.priority === "PRIMARY") || null;

  // Check spouse status
  const hasSpouseProfile = userProfiles.length > 1;
  const primaryProfile = userProfiles.find((p: any) => p.isPrimaryApplicant);
  const isMarried =
    primaryProfile?.maritalStatus === "married" ||
    primaryProfile?.maritalStatus === "common_law";
  const awaitingSpouse = isMarried && !hasSpouseProfile;

  // ── Auto-generate "Prepare-se" notifications for next milestone ──
  try {
    const currentIdx = getCurrentMilestoneIndex(macroMilestones);
    const nextMs = macroMilestones[currentIdx + 1];
    if (nextMs && nextMs.status === "NOT_STARTED") {
      const prepTexts: Record<string, string> = {
        language_tests: "Comece a estudar e agende seu teste. Vagas costumam esgotar com 2-3 meses de antecedencia.",
        eca: "Solicite ECA via WES agora — leva 30-60 dias. Tambem prepare traducoes juramentadas de diplomas e certidoes.",
        submission: "Reuna todos os documentos: ECA, teste de idioma, cartas de emprego, proof of funds. Crie conta no GCKey.",
        approval: "Monitore os draws do Express Entry e continue melhorando seu CRS enquanto aguarda.",
        visa: "Prepare-se para exame medico, certidao de antecedentes e taxa de processamento.",
        landing: "Planeje logistica de mudanca: moradia temporaria, voo, documentos importantes em maos.",
        pr: "Apos o landing, priorize SIN, conta bancaria e health card.",
        citizenship: "Apos 3 anos como PR, voce pode solicitar cidadania. Estude para o Citizenship Test.",
      };
      const notifTitle = `Prepare-se: ${nextMs.name}`;
      const notifMsg = prepTexts[nextMs.id] || nextMs.description || "";

      // Check if this notification already exists (avoid duplicates)
      const existing = await db.query.notifications.findFirst({
        where: and(
          eq(notifications.householdId, householdId),
          eq(notifications.title, notifTitle),
          eq(notifications.type, "REMINDER")
        ),
      });
      if (!existing && notifMsg) {
        await db.insert(notifications).values({
          householdId,
          userId: session.user.id,
          type: "REMINDER",
          title: notifTitle,
          message: notifMsg,
          link: "/journey",
        });
      }
    }
  } catch {
    // Non-critical — don't block dashboard render
  }

  return (
    <DashboardClient
      userName={session.user.name || "Viajante"}
      userImage={session.user.image || undefined}
      hasData={hasData}
      progressPercent={progressPercent}
      bonusCompleted={bonusCompleted}
      bonusTotal={bonusTotal}
      bonusPercent={bonusPercent}
      activePlan={activePlan}
      allPlans={allPlans}
      pendingSteps={pendingSteps}
      pendingDocs={pendingDocsNotStarted.slice(0, 5)}
      documentAlerts={urgentDocAlerts.slice(0, 3)}
      docsReady={docsReady}
      docsTotal={docsTotal}
      recentNotifications={recentNotifications}
      recentAchievements={recentAchievements}
      latestCRS={latestCRS}
      latestLanguageTests={latestLanguageTests}
      profiles={userProfiles}
      awaitingSpouse={awaitingSpouse}
      macroMilestones={macroMilestones}
      missingDocs={missingDocs}
    />
  );
}
