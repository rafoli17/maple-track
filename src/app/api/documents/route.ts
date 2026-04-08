import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { documents, profiles } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { documentCreateSchema } from "@/lib/validations";
import { resolveHouseholdId } from "@/lib/resolve-household";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const householdId = await resolveHouseholdId(session.user);
    if (!householdId) {
      return NextResponse.json({ error: "No household" }, { status: 404 });
    }

    // Get all profiles in the household
    const householdProfiles = await db.query.profiles.findMany({
      where: eq(profiles.householdId, householdId),
    });
    const profileIds = householdProfiles.map((p) => p.id);

    if (profileIds.length === 0) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    let docs;
    if (planId) {
      docs = await db
        .select()
        .from(documents)
        .where(
          and(
            inArray(documents.profileId, profileIds),
            eq(documents.immigrationPlanId, planId)
          )
        );
    } else {
      docs = await db
        .select()
        .from(documents)
        .where(inArray(documents.profileId, profileIds));
    }

    return NextResponse.json(docs);
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error);
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

    const body = await request.json();
    const parsed = documentCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // If profileId is provided and belongs to same household, use it
    let targetProfileId = profile.id;
    if (data.profileId && data.profileId !== profile.id) {
      const targetProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, data.profileId),
      });
      if (targetProfile && targetProfile.householdId === profile.householdId) {
        targetProfileId = data.profileId;
      }
    }

    const [doc] = await db
      .insert(documents)
      .values({
        profileId: targetProfileId,
        name: data.name,
        type: data.type,
        status: data.status,
        issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        notes: data.notes,
        immigrationPlanId: data.immigrationPlanId,
        originalLanguage: data.originalLanguage,
        translationRequired: data.translationRequired ?? false,
        translationCompleted: data.translationCompleted ?? false,
      })
      .returning();

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
