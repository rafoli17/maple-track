import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { profiles, languageTests } from "@/db/schema";
import { LanguagesClient } from "./languages-client";

export default async function LanguagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = session.user.householdId;
  let householdProfiles: any[] = [];
  let tests: any[] = [];

  if (householdId) {
    try {
      householdProfiles = await db.query.profiles.findMany({
        where: eq(profiles.householdId, householdId),
      });

      const profileIds = householdProfiles.map((p: any) => p.id);
      if (profileIds.length > 0) {
        const allTests = await db.query.languageTests.findMany({
          with: { profile: true },
        });
        tests = allTests.filter((t: any) =>
          profileIds.includes(t.profileId)
        );
      }
    } catch {
      // DB error
    }
  }

  return (
    <LanguagesClient
      profiles={householdProfiles}
      tests={tests}
    />
  );
}
