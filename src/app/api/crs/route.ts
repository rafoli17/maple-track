import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { crsScores, profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { calculateCRS } from "@/lib/crs-calculator";

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

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
      with: {
        languageTests: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const completedTest = profile.languageTests.find(
      (t) => t.status === "COMPLETED"
    );

    const age = profile.dateOfBirth
      ? Math.floor(
          (Date.now() - new Date(profile.dateOfBirth).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
      : 30;

    const firstLanguage = completedTest
      ? {
          speaking: Number(completedTest.speaking) || 0,
          listening: Number(completedTest.listening) || 0,
          reading: Number(completedTest.reading) || 0,
          writing: Number(completedTest.writing) || 0,
        }
      : { speaking: 0, listening: 0, reading: 0, writing: 0 };

    const maritalStatus =
      profile.maritalStatus === "married" ||
      profile.maritalStatus === "common_law"
        ? ("married_or_common_law" as const)
        : ("single" as const);

    const crsResult = calculateCRS({
      age,
      educationLevel: profile.educationLevel || "HIGH_SCHOOL",
      firstLanguage,
      canadianExperienceYears: profile.canadianExperienceYears || 0,
      foreignExperienceYears: profile.yearsOfExperience || 0,
      maritalStatus,
      canadianEducation: profile.canadianEducation || false,
    });

    const breakdown: Record<string, number> = {};
    for (const [key, value] of Object.entries(crsResult)) {
      if (typeof value === "number") {
        breakdown[key] = value;
      }
    }

    const [score] = await db
      .insert(crsScores)
      .values({
        profileId: profile.id,
        totalScore: crsResult.total,
        coreScore: crsResult.subtotalCoreHumanCapital,
        spouseScore: crsResult.subtotalSpouse,
        skillTransferScore: crsResult.subtotalSkillTransfer,
        additionalScore: crsResult.subtotalAdditional,
        breakdown,
      })
      .returning();

    return NextResponse.json(score, { status: 201 });
  } catch (error) {
    console.error("[CRS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
