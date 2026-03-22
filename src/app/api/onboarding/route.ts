import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles, users, languageTests, households } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  stepPersonalSchema,
  stepEducationSchema,
  stepExperienceSchema,
  stepLanguageSchema,
  stepSpouseSchema,
  stepFinancesSchema,
  stepChildrenSchema,
  stepPreferencesSchema,
} from "@/lib/validations";
import { sendHouseholdInvite } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { step, data } = body;

    if (typeof step !== "number" || !data) {
      return NextResponse.json(
        { error: "step (number) and data (object) are required" },
        { status: 400 }
      );
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

    switch (step) {
      case 1: {
        const parsed = stepPersonalSchema.safeParse(data);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Invalid data", details: parsed.error.flatten() },
            { status: 400 }
          );
        }
        await db
          .update(profiles)
          .set({
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            dateOfBirth: new Date(parsed.data.dateOfBirth),
            nationality: parsed.data.nationality,
            currentCountry: parsed.data.currentCountry,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, profile.id));
        break;
      }

      case 2: {
        const parsed = stepEducationSchema.safeParse(data);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Invalid data", details: parsed.error.flatten() },
            { status: 400 }
          );
        }
        await db
          .update(profiles)
          .set({
            educationLevel: parsed.data.educationLevel,
            fieldOfStudy: parsed.data.fieldOfStudy,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, profile.id));
        break;
      }

      case 3: {
        const parsed = stepExperienceSchema.safeParse(data);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Invalid data", details: parsed.error.flatten() },
            { status: 400 }
          );
        }
        await db
          .update(profiles)
          .set({
            currentOccupation: parsed.data.currentOccupation,
            nocCode: parsed.data.nocCode,
            yearsOfExperience: parsed.data.yearsOfExperience,
            canadianExperienceYears: parsed.data.canadianExperienceYears,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, profile.id));
        break;
      }

      case 4: {
        const parsed = stepLanguageSchema.safeParse(data);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Invalid data", details: parsed.error.flatten() },
            { status: 400 }
          );
        }
        if (parsed.data.hasTest && parsed.data.testType) {
          await db.insert(languageTests).values({
            profileId: profile.id,
            testType: parsed.data.testType,
            speaking: parsed.data.speaking?.toString(),
            listening: parsed.data.listening?.toString(),
            reading: parsed.data.reading?.toString(),
            writing: parsed.data.writing?.toString(),
            status: "COMPLETED",
          });
        }
        break;
      }

      case 5: {
        const parsed = stepSpouseSchema.safeParse(data);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Invalid data", details: parsed.error.flatten() },
            { status: 400 }
          );
        }
        if (parsed.data.inviteSpouse && parsed.data.spouseEmail) {
          await db
            .update(profiles)
            .set({
              maritalStatus: "married",
              updatedAt: new Date(),
            })
            .where(eq(profiles.id, profile.id));

          const household = await db.query.households.findFirst({
            where: eq(households.id, profile.householdId),
          });

          if (household) {
            await sendHouseholdInvite(
              parsed.data.spouseEmail,
              `${profile.firstName} ${profile.lastName}`,
              household.name
            );
          }
        }
        break;
      }

      case 6: {
        const parsed = stepFinancesSchema.safeParse(data);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Invalid data", details: parsed.error.flatten() },
            { status: 400 }
          );
        }
        await db
          .update(profiles)
          .set({
            fundsAvailable: parsed.data.fundsAvailable.toString(),
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, profile.id));
        break;
      }

      case 7: {
        const parsed = stepChildrenSchema.safeParse(data);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Invalid data", details: parsed.error.flatten() },
            { status: 400 }
          );
        }
        await db
          .update(profiles)
          .set({
            hasChildren: parsed.data.hasChildren,
            numberOfChildren: parsed.data.numberOfChildren,
            updatedAt: new Date(),
          })
          .where(eq(profiles.id, profile.id));
        break;
      }

      case 8: {
        const parsed = stepPreferencesSchema.safeParse(data);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Invalid data", details: parsed.error.flatten() },
            { status: 400 }
          );
        }
        // Preferences are noted but stored as metadata for now
        break;
      }

      default:
        return NextResponse.json(
          { error: "Invalid step number" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, step });
  } catch (error) {
    console.error("[ONBOARDING_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .update(users)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true, onboardingCompleted: true });
  } catch (error) {
    console.error("[ONBOARDING_PUT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
