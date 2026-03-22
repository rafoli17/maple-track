import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { immigrationPlans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { planCreateSchema } from "@/lib/validations";
import { z } from "zod/v4";

const planUpdateSchema = z.object({
  planId: z.string().uuid(),
  status: z
    .enum([
      "RESEARCHING",
      "PREPARING",
      "APPLIED",
      "PROCESSING",
      "APPROVED",
      "REJECTED",
      "ON_HOLD",
    ])
    .optional(),
  priority: z.enum(["PRIMARY", "SECONDARY", "TERTIARY"]).optional(),
  notes: z.string().optional(),
});

export async function GET() {
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

    const plans = await db.query.immigrationPlans.findMany({
      where: eq(immigrationPlans.householdId, session.user.householdId),
      with: {
        program: true,
        phases: {
          with: {
            steps: true,
          },
          orderBy: (phases, { asc }) => [asc(phases.order)],
        },
      },
      orderBy: (plans, { asc }) => [asc(plans.priority)],
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("[PLANS_GET]", error);
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

    if (!session.user.householdId) {
      return NextResponse.json(
        { error: "No household found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = planCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { programId, priority, notes } = parsed.data;

    const [plan] = await db
      .insert(immigrationPlans)
      .values({
        householdId: session.user.householdId,
        programId,
        priority,
        notes,
        startedAt: new Date(),
      })
      .returning();

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("[PLANS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const body = await request.json();
    const parsed = planUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { planId, status, priority, notes } = parsed.data;

    const existingPlan = await db.query.immigrationPlans.findFirst({
      where: eq(immigrationPlans.id, planId),
    });

    if (!existingPlan || existingPlan.householdId !== session.user.householdId) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (notes !== undefined) updateData.notes = notes;

    if (status === "APPROVED" || status === "REJECTED") {
      updateData.completedAt = new Date();
    }

    const [updated] = await db
      .update(immigrationPlans)
      .set(updateData)
      .where(eq(immigrationPlans.id, planId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PLANS_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
