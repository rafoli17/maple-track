import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { journeyPhases } from "@/db/schema";
import { PhaseDetailClient } from "./phase-detail-client";

interface PhaseDetailPageProps {
  params: Promise<{ phaseId: string }>;
}

export default async function PhaseDetailPage({ params }: PhaseDetailPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { phaseId } = await params;

  let phase: any = null;
  try {
    phase = await db.query.journeyPhases.findFirst({
      where: eq(journeyPhases.id, phaseId),
      with: { steps: true },
    });
  } catch {
    // DB error
  }

  if (!phase) {
    notFound();
  }

  // Sort steps by order
  const steps = (phase.steps || []).sort(
    (a: any, b: any) => (a.order || 0) - (b.order || 0)
  );

  return (
    <PhaseDetailClient
      phase={phase}
      steps={steps}
    />
  );
}
