import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  immigrationPlans,
  immigrationPrograms,
  journeyPhases,
  journeySteps,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { planCreateSchema } from "@/lib/validations";
import { z } from "zod/v4";
import { getJourneyTemplate } from "@/lib/journey-templates";
import { resolveHouseholdId } from "@/lib/resolve-household";

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

    const householdId = await resolveHouseholdId(session.user);
    if (!householdId) {
      return NextResponse.json(
        { error: "No household found" },
        { status: 404 }
      );
    }

    const plans = await db.query.immigrationPlans.findMany({
      where: eq(immigrationPlans.householdId, householdId),
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

    const householdId = await resolveHouseholdId(session.user);
    if (!householdId) {
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

    // Fetch the program to get its code for template lookup
    const program = await db.query.immigrationPrograms.findFirst({
      where: eq(immigrationPrograms.id, programId),
    });

    if (!program) {
      return NextResponse.json(
        { error: "Program not found" },
        { status: 404 }
      );
    }

    const [plan] = await db
      .insert(immigrationPlans)
      .values({
        householdId,
        programId,
        priority,
        notes,
        startedAt: new Date(),
      })
      .returning();

    // Auto-generate journey phases and steps from template
    const template = getJourneyTemplate(program.code);

    for (let phaseIndex = 0; phaseIndex < template.length; phaseIndex++) {
      const phaseTemplate = template[phaseIndex];

      const [phase] = await db
        .insert(journeyPhases)
        .values({
          immigrationPlanId: plan.id,
          phaseNumber: phaseIndex + 1,
          name: phaseTemplate.name,
          description: phaseTemplate.description,
          estimatedDurationDays: phaseTemplate.estimatedDurationDays,
          order: phaseIndex,
          macroMilestoneId: phaseTemplate.macroMilestoneId,
        })
        .returning();

      // Create steps for this phase
      for (
        let stepIndex = 0;
        stepIndex < phaseTemplate.steps.length;
        stepIndex++
      ) {
        const stepTemplate = phaseTemplate.steps[stepIndex];
        await db.insert(journeySteps).values({
          journeyPhaseId: phase.id,
          immigrationPlanId: plan.id,
          title: stepTemplate.title,
          description: stepTemplate.description,
          instructions: stepTemplate.instructions || null,
          priority: stepTemplate.priority,
          order: stepIndex,
          actionUrl: stepTemplate.actionUrl || null,
        });
      }
    }

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

    const householdId = await resolveHouseholdId(session.user);
    if (!householdId) {
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

    if (!existingPlan || existingPlan.householdId !== householdId) {
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
