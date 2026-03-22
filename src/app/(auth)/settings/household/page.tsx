import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { households, profiles, users } from "@/db/schema";
import { HouseholdClient } from "./household-client";

export default async function HouseholdSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const householdId = session.user.householdId;
  let household: any = null;
  let members: any[] = [];

  if (householdId) {
    try {
      household = await db.query.households.findFirst({
        where: eq(households.id, householdId),
      });

      const householdProfiles = await db.query.profiles.findMany({
        where: eq(profiles.householdId, householdId),
      });

      members = householdProfiles;
    } catch {
      // DB error
    }
  }

  return (
    <HouseholdClient
      household={household}
      members={members}
    />
  );
}
