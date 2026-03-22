"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, Clock, Target, DollarSign } from "lucide-react";

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

interface CompareClientProps {
  programs: Program[];
}

export function CompareClient({ programs }: CompareClientProps) {
  const [selected, setSelected] = React.useState<string[]>([]);

  const selectedPrograms = programs.filter((p) => selected.includes(p.id));

  const addProgram = (id: string) => {
    if (selected.length < 3 && !selected.includes(id)) {
      setSelected([...selected, id]);
    }
  };

  const removeProgram = (id: string) => {
    setSelected(selected.filter((s) => s !== id));
  };

  const available = programs.filter((p) => !selected.includes(p.id));

  return (
    <div className="space-y-6">
      <Link
        href="/programs"
        className="inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos Programas
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Comparar Programas
        </h1>
        <p className="text-sm text-foreground-muted">
          Selecione ate 3 programas para comparar lado a lado.
        </p>
      </div>

      {/* Program selector */}
      {selected.length < 3 && (
        <div>
          <label className="mb-1 block text-sm text-foreground-muted">
            Adicionar programa
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addProgram(e.target.value);
                e.target.value = "";
              }
            }}
            className="h-10 w-full max-w-md rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
          >
            <option value="">Selecione um programa...</option>
            {available.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Comparison table */}
      {selectedPrograms.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="border-b border-border p-3 text-left text-sm font-medium text-foreground-muted">
                  Criterio
                </th>
                {selectedPrograms.map((p) => (
                  <th
                    key={p.id}
                    className="border-b border-border p-3 text-left text-sm font-medium text-foreground"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{p.name}</span>
                      <button
                        onClick={() => removeProgram(p.id)}
                        className="shrink-0 rounded-md p-1 text-foreground-dim hover:bg-card hover:text-error"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-border p-3 text-sm text-foreground-muted">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tempo de Processamento
                  </div>
                </td>
                {selectedPrograms.map((p) => (
                  <td
                    key={p.id}
                    className="border-b border-border p-3 text-sm text-foreground"
                  >
                    {p.processingTimeMonths
                      ? `${p.processingTimeMonths} meses`
                      : "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-border p-3 text-sm text-foreground-muted">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    CRS Minimo
                  </div>
                </td>
                {selectedPrograms.map((p) => (
                  <td
                    key={p.id}
                    className="border-b border-border p-3 text-sm text-foreground"
                  >
                    {p.minimumCRS || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-border p-3 text-sm text-foreground-muted">
                  CLB Minimo
                </td>
                {selectedPrograms.map((p) => (
                  <td
                    key={p.id}
                    className="border-b border-border p-3 text-sm text-foreground"
                  >
                    {p.minimumCLB || "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-border p-3 text-sm text-foreground-muted">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Fundos Minimos
                  </div>
                </td>
                {selectedPrograms.map((p) => (
                  <td
                    key={p.id}
                    className="border-b border-border p-3 text-sm text-foreground"
                  >
                    {p.minimumFunds ? `$${p.minimumFunds}` : "N/A"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-border p-3 text-sm text-foreground-muted">
                  Categoria
                </td>
                {selectedPrograms.map((p) => (
                  <td
                    key={p.id}
                    className="border-b border-border p-3 text-sm text-foreground"
                  >
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {p.category}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-sm text-foreground-muted">
                  Descricao
                </td>
                {selectedPrograms.map((p) => (
                  <td
                    key={p.id}
                    className="p-3 text-sm text-foreground-muted"
                  >
                    {p.description || "Sem descricao."}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
          <Plus className="mb-3 h-10 w-10 text-foreground-dim" />
          <p className="text-sm text-foreground-muted">
            Selecione programas acima para comecar a comparar.
          </p>
        </div>
      )}
    </div>
  );
}
