"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Clock, Target, ArrowRight, Filter } from "lucide-react";

interface Program {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string | null;
  processingTimeMonths: number | null;
  minimumCLB: number | null;
  minimumCRS: number | null;
  minimumFunds: string | null;
}

interface ProgramsClientProps {
  programs: Program[];
}

const categoryLabels: Record<string, string> = {
  EXPRESS_ENTRY: "Express Entry",
  PNP: "Provincial Nominee",
  FAMILY: "Familia",
  PILOT: "Piloto",
  STUDY: "Estudo",
};

export function ProgramsClient({ programs }: ProgramsClientProps) {
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("ALL");

  const categories = React.useMemo(() => {
    const cats = new Set(programs.map((p) => p.category));
    return ["ALL", ...Array.from(cats)];
  }, [programs]);

  const filtered = React.useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "ALL" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [programs, search, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Programas de Imigracao
          </h1>
          <p className="text-sm text-foreground-muted">
            Explore os programas disponiveis e encontre o ideal para voce.
          </p>
        </div>
        <Link
          href="/programs/compare"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card"
        >
          Comparar Programas
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar programa..."
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-foreground-dim focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-foreground-dim" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "ALL"
                  ? "Todas as categorias"
                  : categoryLabels[cat] || cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Programs grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((program) => (
            <Link
              key={program.id}
              href={`/programs/${program.id}`}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {categoryLabels[program.category] || program.category}
                </span>
                <ArrowRight className="h-4 w-4 text-foreground-dim transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {program.name}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm text-foreground-muted">
                {program.description || "Sem descricao disponivel."}
              </p>
              <div className="flex items-center gap-4 text-xs text-foreground-dim">
                {program.processingTimeMonths && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {program.processingTimeMonths} meses
                  </span>
                )}
                {program.minimumCRS && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    CRS {program.minimumCRS}+
                  </span>
                )}
                {program.minimumCLB && (
                  <span className="flex items-center gap-1">
                    CLB {program.minimumCLB}+
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
          <Search className="mb-3 h-10 w-10 text-foreground-dim" />
          <p className="text-sm text-foreground-muted">
            {programs.length === 0
              ? "Nenhum programa cadastrado ainda."
              : "Nenhum programa encontrado com esses filtros."}
          </p>
        </div>
      )}
    </div>
  );
}
