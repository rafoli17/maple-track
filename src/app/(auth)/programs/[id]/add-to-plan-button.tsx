"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, Loader2 } from "lucide-react";

interface AddToPlanButtonProps {
  programId: string;
}

export function AddToPlanButton({ programId }: AddToPlanButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPrioritySelect, setShowPrioritySelect] = React.useState(false);

  const handleAdd = async (priority: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId,
          priority,
          status: "RESEARCHING",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao adicionar plano");
        setIsLoading(false);
        return;
      }

      setIsAdded(true);
      setShowPrioritySelect(false);
      setTimeout(() => router.push("/plans"), 1000);
    } catch {
      setError("Erro de conexão");
      setIsLoading(false);
    }
  };

  if (isAdded) {
    return (
      <div className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-success/10 px-6 py-3 text-sm font-medium text-success shadow-sm">
        <Check className="h-4 w-4" />
        Adicionado! Redirecionando...
      </div>
    );
  }

  if (showPrioritySelect) {
    return (
      <div className="flex flex-1 flex-col gap-2">
        {error && (
          <p className="text-xs text-error">{error}</p>
        )}
        <p className="text-xs text-foreground-muted">Escolha o slot:</p>
        <div className="flex gap-2">
          {[
            { value: "PRIMARY", label: "Plano A" },
            { value: "SECONDARY", label: "Plano B" },
            { value: "TERTIARY", label: "Plano C" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAdd(opt.value)}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:shadow-md hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                opt.label
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowPrioritySelect(false)}
          className="text-xs text-foreground-dim hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowPrioritySelect(true)}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light"
    >
      <Plus className="h-4 w-4" />
      Adicionar ao Plano
    </button>
  );
}
