import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { languageTests, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { languageTestCreateSchema } from "@/lib/validations";
import { resolveHouseholdId } from "@/lib/resolve-household";

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

    const tests = await db
      .select()
      .from(languageTests)
      .where(eq(languageTests.profileId, profile.id));

    return NextResponse.json(tests);
  } catch (error) {
    console.error("[LANGUAGES_GET]", error);
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
      return NextResponse.json({ error: "No household" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = languageTestCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Determine which profile to use
    let targetProfileId: string;

    if (data.profileId) {
      // Verify the target profile belongs to the same household
      const targetProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, data.profileId),
      });
      if (!targetProfile || targetProfile.householdId !== householdId) {
        return NextResponse.json(
          { error: "Profile not in household" },
          { status: 403 }
        );
      }
      targetProfileId = data.profileId;
    } else {
      // Default to the logged-in user's profile
      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, session.user.id),
      });
      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }
      targetProfileId = profile.id;
    }

    const [test] = await db
      .insert(languageTests)
      .values({
        profileId: targetProfileId,
        testType: data.testType,
        speaking: data.speaking?.toString(),
        listening: data.listening?.toString(),
        reading: data.reading?.toString(),
        writing: data.writing?.toString(),
        testDate: data.testDate ? new Date(data.testDate) : undefined,
        status: data.status,
      })
      .returning();

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error("[LANGUAGES_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
