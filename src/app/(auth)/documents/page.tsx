import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { documents, profiles, immigrationPlans } from "@/db/schema";
import { DocumentsClient } from "./documents-client";
import { resolveHouseholdId } from "@/lib/resolve-household";
import {
  generateDocumentAlerts,
  computeCategoryReadiness,
  findMissingDocs,
} from "@/lib/document-categories";

export default async function DocumentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = await resolveHouseholdId(session.user);
  if (!householdId) redirect("/onboarding");

  let allDocs: any[] = [];
  let householdProfiles: any[] = [];
  let allPlans: any[] = [];

  try {
    const [profilesResult, plansResult] = await Promise.all([
      db.query.profiles.findMany({
        where: eq(profiles.householdId, householdId),
        with: { user: true },
      }),
      db.query.immigrationPlans.findMany({
        where: eq(immigrationPlans.householdId, householdId),
        with: { program: true },
      }),
    ]);

    householdProfiles = profilesResult || [];
    allPlans = plansResult || [];

    const profileIds = householdProfiles.map((p: any) => p.id);
    if (profileIds.length > 0) {
      allDocs = await db.query.documents.findMany({
        where: inArray(documents.profileId, profileIds),
      });
    }
  } catch {
    // DB error
  }

  // Compute alerts
  const alerts = generateDocumentAlerts(allDocs);

  // Compute category readiness
  const categoryReadiness = computeCategoryReadiness(allDocs);

  // Find missing recommended docs
  const missingDocs = findMissingDocs(allDocs, householdProfiles.length);

  // Overall readiness
  const totalDocs = allDocs.length;
  const readyDocs = allDocs.filter(
    (d) => d.status === "SUBMITTED" || d.status === "APPROVED"
  ).length;
  const overallReadiness = totalDocs > 0 ? Math.round((readyDocs / totalDocs) * 100) : 0;

  return (
    <DocumentsClient
      allDocs={allDocs}
      profiles={householdProfiles}
      plans={allPlans}
      alerts={alerts}
      categoryReadiness={categoryReadiness}
      missingDocs={missingDocs}
      overallReadiness={overallReadiness}
      totalDocs={totalDocs}
      readyDocs={readyDocs}
    />
  );
}
