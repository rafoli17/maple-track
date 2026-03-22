import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { journeyPhases, immigrationPlans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.householdId) {
      return NextResponse.json(
        { error: "No household found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    const plan = await db.query.immigrationPlans.findFirst({
      where: eq(immigrationPlans.id, planId),
    });

    if (!plan || plan.householdId !== session.user.householdId) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const phases = await db.query.journeyPhases.findMany({
      where: eq(journeyPhases.immigrationPlanId, planId),
      with: {
        steps: {
          orderBy: (steps, { asc }) => [asc(steps.order)],
          with: {
            assignee: true,
          },
        },
      },
      orderBy: (phases, { asc }) => [asc(phases.order)],
    });

    return NextResponse.json({ plan, phases });
  } catch (error) {
    console.error("[JOURNEY_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
