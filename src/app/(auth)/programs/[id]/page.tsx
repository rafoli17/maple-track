import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { immigrationPrograms } from "@/db/schema";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Target,
  DollarSign,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import { AddToPlanButton } from "./add-to-plan-button";

interface ProgramDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  let program: any = null;
  try {
    program = await db.query.immigrationPrograms.findFirst({
      where: eq(immigrationPrograms.id, id),
    });
  } catch {
    // DB error
  }

  if (!program) {
    notFound();
  }

  const requirements = (program.requirements as any) || {};

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back link */}
      <Link
        href="/programs"
        className="inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos Programas
      </Link>

      {/* Header */}
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {program.category}
            </span>
            <h1 className="text-2xl font-bold text-foreground">
              {program.name}
            </h1>
            <p className="mt-1 text-sm text-foreground-dim">
              Codigo: {program.code}
            </p>
          </div>
        </div>
        <p className="text-foreground-muted">
          {program.description || "Sem descricao disponivel."}
        </p>
      </div>

      {/* Key stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <Clock className="mx-auto mb-2 h-6 w-6 text-info" />
          <p className="text-2xl font-bold text-foreground">
            {program.processingTimeMonths || "--"}
          </p>
          <p className="text-xs text-foreground-dim">meses de processamento</p>
        </div>
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <Target className="mx-auto mb-2 h-6 w-6 text-primary" />
          <p className="text-2xl font-bold text-foreground">
            {program.minimumCRS || "N/A"}
          </p>
          <p className="text-xs text-foreground-dim">CRS minimo</p>
        </div>
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <DollarSign className="mx-auto mb-2 h-6 w-6 text-success" />
          <p className="text-2xl font-bold text-foreground">
            {program.minimumFunds ? `$${program.minimumFunds}` : "N/A"}
          </p>
          <p className="text-xs text-foreground-dim">fundos minimos (CAD)</p>
        </div>
      </div>

      {/* Requirements */}
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
          <BookOpen className="h-5 w-5 text-foreground-muted" />
          Requisitos
        </h2>
        {Object.keys(requirements).length > 0 ? (
          <ul className="space-y-2">
            {Object.entries(requirements).map(([key, value]) => (
              <li key={key} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {key}:
                  </span>{" "}
                  <span className="text-sm text-foreground-muted">
                    {String(value)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-foreground-dim">
            Requisitos detalhados serao adicionados em breve.
          </p>
        )}
      </div>

      {/* CLB requirement */}
      {program.minimumCLB && (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-foreground">
            Requisito de Idioma
          </h2>
          <p className="text-sm text-foreground-muted">
            CLB minimo necessario:{" "}
            <span className="font-bold text-foreground">
              {program.minimumCLB}
            </span>
          </p>
        </div>
      )}

      {/* Action */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <AddToPlanButton programId={program.id} />
        <Link
          href="/simulator"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:shadow-md"
        >
          <Target className="h-4 w-4" />
          Simular meu CRS
        </Link>
      </div>
    </div>
  );
}
