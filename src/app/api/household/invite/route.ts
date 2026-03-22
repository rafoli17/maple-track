import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { households, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendHouseholdInvite } from "@/lib/email";
import { z } from "zod/v4";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
});

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
    const parsed = inviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const household = await db.query.households.findFirst({
      where: eq(households.id, session.user.householdId),
    });

    if (!household) {
      return NextResponse.json(
        { error: "Household not found" },
        { status: 404 }
      );
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    const inviterName = profile
      ? `${profile.firstName} ${profile.lastName}`
      : session.user.name || "Someone";

    await sendHouseholdInvite(email, inviterName, household.name);

    return NextResponse.json({ success: true, message: "Invite sent" });
  } catch (error) {
    console.error("[HOUSEHOLD_INVITE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
