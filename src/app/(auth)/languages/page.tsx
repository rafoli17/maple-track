import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq, inArray, desc } from "drizzle-orm";
import { profiles, languageTests, immigrationPlans } from "@/db/schema";
import { LanguagesClient } from "./languages-client";
import { resolveHouseholdId } from "@/lib/resolve-household";

export default async function LanguagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = await resolveHouseholdId(session.user);
  if (!householdId) redirect("/onboarding");

  let householdProfiles: any[] = [];
  let tests: any[] = [];
  let plans: any[] = [];

  try {
    householdProfiles = await db.query.profiles.findMany({
      where: eq(profiles.householdId, householdId),
      with: { user: true },
    });

    const profileIds = householdProfiles.map((p: any) => p.id);
    if (profileIds.length > 0) {
      tests = await db.query.languageTests.findMany({
        where: inArray(languageTests.profileId, profileIds),
        orderBy: [desc(languageTests.createdAt)],
      });
    }

    // Fetch plans to show target CLB per program
    plans = await db.query.immigrationPlans.findMany({
      where: eq(immigrationPlans.householdId, householdId),
      with: { program: true },
      orderBy: (p, { asc }) => [asc(p.priority)],
    });
  } catch {
    // DB error
  }

  return (
    <LanguagesClient
      profiles={householdProfiles}
      tests={tests}
      plans={plans}
    />
  );
}
