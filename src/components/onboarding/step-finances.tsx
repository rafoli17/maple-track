"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface StepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function StepFinances({ data, onUpdate }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Financas
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="savings">Economias Disponiveis (CAD)</Label>
          <Input
            id="savings"
            type="number"
            min="0"
            placeholder="Ex: 25000"
            value={(data.savings as string) || ""}
            onChange={(e) => onUpdate({ savings: e.target.value })}
          />
          <p className="text-xs text-foreground-dim">
            Valor disponivel para comprovar fundos de estabelecimento
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyBudget">Orcamento Mensal para o Processo (BRL)</Label>
          <Input
            id="monthlyBudget"
            type="number"
            min="0"
            placeholder="Ex: 3000"
            value={(data.monthlyBudget as string) || ""}
            onChange={(e) => onUpdate({ monthlyBudget: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="investmentWillingness">
            Disponibilidade para Investimento
          </Label>
          <Select
            id="investmentWillingness"
            value={(data.investmentWillingness as string) || ""}
            onChange={(e) =>
              onUpdate({ investmentWillingness: e.target.value })
            }
          >
            <option value="">Selecione</option>
            <option value="low">Ate CAD 50.000</option>
            <option value="medium">CAD 50.000 - 200.000</option>
            <option value="high">Acima de CAD 200.000</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hasProofOfFunds">Possui comprovacao de fundos?</Label>
          <Select
            id="hasProofOfFunds"
            value={(data.hasProofOfFunds as string) || ""}
            onChange={(e) => onUpdate({ hasProofOfFunds: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="yes">Sim</option>
            <option value="no">Nao</option>
            <option value="partial">Parcialmente</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
