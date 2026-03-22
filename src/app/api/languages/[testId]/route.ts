import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { languageTests, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const languageTestUpdateSchema = z.object({
  speaking: z.number().min(0).max(12).optional(),
  listening: z.number().min(0).max(12).optional(),
  reading: z.number().min(0).max(12).optional(),
  writing: z.number().min(0).max(12).optional(),
  overallScore: z.number().min(0).max(12).optional(),
  clbEquivalent: z.number().min(0).max(12).optional(),
  testDate: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z
    .enum(["PLANNED", "SCHEDULED", "COMPLETED", "EXPIRED"])
    .optional(),
  targetSpeaking: z.number().min(0).max(12).optional(),
  targetListening: z.number().min(0).max(12).optional(),
  targetReading: z.number().min(0).max(12).optional(),
  targetWriting: z.number().min(0).max(12).optional(),
});

type RouteContext = { params: Promise<{ testId: string }> };

export async function PUT(
  request: Request,
  ctx: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testId } = await ctx.params;

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const test = await db.query.languageTests.findFirst({
      where: eq(languageTests.id, testId),
    });

    if (!test || test.profileId !== profile.id) {
      return NextResponse.json(
        { error: "Language test not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = languageTestUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const updateData: Record<string, unknown> = {};

    if (data.speaking !== undefined)
      updateData.speaking = data.speaking.toString();
    if (data.listening !== undefined)
      updateData.listening = data.listening.toString();
    if (data.reading !== undefined)
      updateData.reading = data.reading.toString();
    if (data.writing !== undefined)
      updateData.writing = data.writing.toString();
    if (data.overallScore !== undefined)
      updateData.overallScore = data.overallScore.toString();
    if (data.clbEquivalent !== undefined)
      updateData.clbEquivalent = data.clbEquivalent;
    if (data.testDate !== undefined)
      updateData.testDate = new Date(data.testDate);
    if (data.expiryDate !== undefined)
      updateData.expiryDate = new Date(data.expiryDate);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.targetSpeaking !== undefined)
      updateData.targetSpeaking = data.targetSpeaking.toString();
    if (data.targetListening !== undefined)
      updateData.targetListening = data.targetListening.toString();
    if (data.targetReading !== undefined)
      updateData.targetReading = data.targetReading.toString();
    if (data.targetWriting !== undefined)
      updateData.targetWriting = data.targetWriting.toString();

    const [updated] = await db
      .update(languageTests)
      .set(updateData)
      .where(eq(languageTests.id, testId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[LANGUAGE_TEST_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testId } = await ctx.params;

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const test = await db.query.languageTests.findFirst({
      where: eq(languageTests.id, testId),
    });

    if (!test || test.profileId !== profile.id) {
      return NextResponse.json(
        { error: "Language test not found" },
        { status: 404 }
      );
    }

    await db.delete(languageTests).where(eq(languageTests.id, testId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[LANGUAGE_TEST_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
