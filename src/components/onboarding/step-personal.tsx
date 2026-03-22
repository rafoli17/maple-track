"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface StepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function StepPersonal({ data, onUpdate }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Dados Pessoais
      </h2>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              placeholder="Seu nome"
              value={(data.firstName as string) || ""}
              onChange={(e) => onUpdate({ firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              placeholder="Seu sobrenome"
              value={(data.lastName as string) || ""}
              onChange={(e) => onUpdate({ lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de Nascimento</Label>
          <Input
            id="birthDate"
            type="date"
            value={(data.birthDate as string) || ""}
            onChange={(e) => onUpdate({ birthDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nacionalidade</Label>
          <Select
            id="nationality"
            value={(data.nationality as string) || ""}
            onChange={(e) => onUpdate({ nationality: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="BR">Brasil</option>
            <option value="PT">Portugal</option>
            <option value="OTHER">Outro</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Estado Civil</Label>
          <Select
            id="maritalStatus"
            value={(data.maritalStatus as string) || ""}
            onChange={(e) => onUpdate({ maritalStatus: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="single">Solteiro(a)</option>
            <option value="married">Casado(a)</option>
            <option value="common_law">Uniao Estavel</option>
            <option value="divorced">Divorciado(a)</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={(data.email as string) || ""}
            onChange={(e) => onUpdate({ email: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
