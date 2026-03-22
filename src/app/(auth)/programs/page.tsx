import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { immigrationPrograms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProgramsClient } from "./programs-client";

export default async function ProgramsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let programs: any[] = [];
  try {
    programs = await db.query.immigrationPrograms.findMany({
      where: eq(immigrationPrograms.isActive, true),
    });
  } catch {
    // DB may not have programs seeded yet
  }

  return <ProgramsClient programs={programs} />;
}
