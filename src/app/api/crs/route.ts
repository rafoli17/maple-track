import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { crsScores, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { resolveHouseholdId } from "@/lib/resolve-household";
import { checkCRSAchievements } from "@/lib/achievements";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const scores = await db
      .select()
      .from(crsScores)
      .where(eq(crsScores.profileId, profile.id))
      .orderBy(desc(crsScores.calculatedAt));

    return NextResponse.json(scores);
  } catch (error) {
    console.error("[CRS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Accept pre-calculated scores from the simulator client
    const body = await request.json().catch(() => null);

    if (!body || typeof body.totalScore !== "number") {
      return NextResponse.json(
        { error: "Missing score data. Send totalScore, coreScore, etc." },
        { status: 400 }
      );
    }

    const [score] = await db
      .insert(crsScores)
      .values({
        profileId: profile.id,
        totalScore: body.totalScore,
        coreScore: body.coreScore ?? 0,
        spouseScore: body.spouseScore ?? 0,
        skillTransferScore: body.skillTransferScore ?? 0,
        additionalScore: body.additionalScore ?? 0,
        breakdown: body.breakdown ?? {},
      })
      .returning();

    // Check CRS achievements
    if (profile.householdId) {
      try {
        await checkCRSAchievements(profile.householdId, body.totalScore);
      } catch (e) {
        console.error("[CRS_ACHIEVEMENT]", e);
      }
    }

    return NextResponse.json(score, { status: 201 });
  } catch (error) {
    console.error("[CRS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
