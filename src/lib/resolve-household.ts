import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Resolve householdId from session.
 * JWT may have stale null value after onboarding,
 * so we check the DB as fallback.
 */
export async function resolveHouseholdId(
  sessionUser: { id: string; householdId?: string | null }
): Promise<string | null> {
  if (sessionUser.householdId) return sessionUser.householdId;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, sessionUser.id),
  });
  return dbUser?.householdId || null;
}
