import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { journeySteps } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stepUpdateSchema } from "@/lib/validations";
import { resolveHouseholdId } from "@/lib/resolve-household";
import {
  checkStepAchievementsDetailed,
  revokeInvalidStepAchievements,
} from "@/lib/achievements";

type RouteContext = { params: Promise<{ stepId: string }> };

export async function PUT(
  request: Request,
  ctx: RouteContext
) {
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

    const { stepId } = await ctx.params;

    const body = await request.json();
    const parsed = stepUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { status } = parsed.data;

    const step = await db.query.journeySteps.findFirst({
      where: eq(journeySteps.id, stepId),
      with: {
        plan: true,
      },
    });

    if (!step || step.plan.householdId !== householdId) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { status };

    if (status === "DONE") {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }

    const [updated] = await db
      .update(journeySteps)
      .set(updateData)
      .where(eq(journeySteps.id, stepId))
      .returning();

    let newAchievements: { name: string; key: string; xp: number }[] = [];
    let revokedAchievements: string[] = [];

    if (status === "DONE") {
      try {
        const detailed = await checkStepAchievementsDetailed(householdId);
        newAchievements = detailed.map((a) => ({
          name: a.name,
          key: a.key,
          xp: a.xp,
        }));
      } catch (e) {
        console.error("[ACHIEVEMENT_CHECK]", e);
      }
    } else {
      try {
        revokedAchievements = await revokeInvalidStepAchievements(householdId);
      } catch (e) {
        console.error("[ACHIEVEMENT_REVOKE]", e);
      }
    }

    return NextResponse.json({
      ...updated,
      newAchievements,
      revokedAchievements,
    });
  } catch (error) {
    console.error("[JOURNEY_STEP_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
