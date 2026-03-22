import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { immigrationPrograms } from "@/db/schema";
import { CompareClient } from "./compare-client";

export default async function CompareProgramsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let programs: any[] = [];
  try {
    programs = await db.query.immigrationPrograms.findMany({
      where: eq(immigrationPrograms.isActive, true),
    });
  } catch {
    // DB error
  }

  return <CompareClient programs={programs} />;
}
