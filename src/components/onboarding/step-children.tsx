"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface StepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

interface Child {
  name: string;
  birthDate: string;
}

export function StepChildren({ data, onUpdate }: StepProps) {
  const children = ((data.children as Child[]) || []) as Child[];

  const addChild = () => {
    onUpdate({ children: [...children, { name: "", birthDate: "" }] });
  };

  const removeChild = (index: number) => {
    onUpdate({ children: children.filter((_, i) => i !== index) });
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const updated = children.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    onUpdate({ children: updated });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Filhos Dependentes
      </h2>

      {children.length === 0 && (
        <p className="mb-4 text-sm text-foreground-muted">
          Nenhum filho adicionado. Clique no botao abaixo para adicionar.
        </p>
      )}

      <div className="space-y-4">
        {children.map((child, index) => (
          <div
            key={index}
            className="flex items-end gap-3 rounded-lg border border-border/50 bg-surface p-4"
          >
            <div className="flex-1 space-y-2">
              <Label htmlFor={`childName${index}`}>Nome</Label>
              <Input
                id={`childName${index}`}
                placeholder="Nome do filho(a)"
                value={child.name}
                onChange={(e) => updateChild(index, "name", e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor={`childBirth${index}`}>Data de Nascimento</Label>
              <Input
                id={`childBirth${index}`}
                type="date"
                value={child.birthDate}
                onChange={(e) =>
                  updateChild(index, "birthDate", e.target.value)
                }
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeChild(index)}
              className="shrink-0 text-error hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button variant="outline" onClick={addChild} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Filho(a)
        </Button>
      </div>
    </div>
  );
}
