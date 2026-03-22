import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { immigrationPrograms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { ProgramCategory } from "@/types";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as ProgramCategory | null;

    let programs;

    if (category) {
      programs = await db
        .select()
        .from(immigrationPrograms)
        .where(
          and(
            eq(immigrationPrograms.isActive, true),
            eq(immigrationPrograms.category, category)
          )
        );
    } else {
      programs = await db
        .select()
        .from(immigrationPrograms)
        .where(eq(immigrationPrograms.isActive, true));
    }

    return NextResponse.json(programs);
  } catch (error) {
    console.error("[PROGRAMS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
