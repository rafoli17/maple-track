import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { households } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { resolveHouseholdId } from "@/lib/resolve-household";

const householdUpdateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

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
    const parsed = householdUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(households)
      .set({ name: parsed.data.name })
      .where(eq(households.id, householdId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[HOUSEHOLD_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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

    const household = await db.query.households.findFirst({
      where: eq(households.id, householdId),
      with: {
        users: true,
        profiles: true,
      },
    });

    if (!household) {
      return NextResponse.json(
        { error: "Household not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(household);
  } catch (error) {
    console.error("[HOUSEHOLD_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
