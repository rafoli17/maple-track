import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles, users, households } from "@/db/schema";
import { eq } from "drizzle-orm";
import { profileUpdateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
      with: {
        user: true,
        household: true,
        languageTests: true,
        crsScores: true,
        documents: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET]", error);
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

    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.nationality !== undefined) updateData.nationality = data.nationality;
    if (data.currentCountry !== undefined)
      updateData.currentCountry = data.currentCountry;
    if (data.educationLevel !== undefined)
      updateData.educationLevel = data.educationLevel;
    if (data.fieldOfStudy !== undefined)
      updateData.fieldOfStudy = data.fieldOfStudy;
    if (data.yearsOfExperience !== undefined)
      updateData.yearsOfExperience = data.yearsOfExperience;
    if (data.currentOccupation !== undefined)
      updateData.currentOccupation = data.currentOccupation;
    if (data.nocCode !== undefined) updateData.nocCode = data.nocCode;
    if (data.canadianExperienceYears !== undefined)
      updateData.canadianExperienceYears = data.canadianExperienceYears;
    if (data.canadianEducation !== undefined)
      updateData.canadianEducation = data.canadianEducation;
    if (data.maritalStatus !== undefined)
      updateData.maritalStatus = data.maritalStatus;
    if (data.hasChildren !== undefined) updateData.hasChildren = data.hasChildren;
    if (data.numberOfChildren !== undefined)
      updateData.numberOfChildren = data.numberOfChildren;
    if (data.fundsAvailable !== undefined)
      updateData.fundsAvailable = data.fundsAvailable;

    const [updated] = await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.id, profile.id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PROFILE_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
