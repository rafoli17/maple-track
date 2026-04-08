import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveHouseholdId } from "@/lib/resolve-household";
import { syncAllAchievements } from "@/lib/achievements";

// GET: Sync all achievements and return full state
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const householdId = await resolveHouseholdId(session.user);
    if (!householdId) {
      return NextResponse.json(
        { error: "No household found" },
        { status: 404 }
      );
    }

    const result = await syncAllAchievements(householdId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[ACHIEVEMENTS_SYNC]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
