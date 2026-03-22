"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface StepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function StepSpouse({ data, onUpdate }: StepProps) {
  const hasSpouse =
    data.maritalStatus === "married" || data.maritalStatus === "common_law";

  if (!hasSpouse) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Conjuge
        </h2>
        <p className="text-sm text-foreground-muted">
          Baseado no seu estado civil, esta etapa nao se aplica. Clique em
          &quot;Proximo&quot; para continuar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Conjuge
      </h2>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="spouseFirstName">Nome</Label>
            <Input
              id="spouseFirstName"
              placeholder="Nome do conjuge"
              value={(data.spouseFirstName as string) || ""}
              onChange={(e) => onUpdate({ spouseFirstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spouseLastName">Sobrenome</Label>
            <Input
              id="spouseLastName"
              placeholder="Sobrenome do conjuge"
              value={(data.spouseLastName as string) || ""}
              onChange={(e) => onUpdate({ spouseLastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spouseEducation">Nivel de Escolaridade</Label>
          <Select
            id="spouseEducation"
            value={(data.spouseEducation as string) || ""}
            onChange={(e) => onUpdate({ spouseEducation: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="high_school">Ensino Medio</option>
            <option value="one_year_diploma">Diploma (1 ano)</option>
            <option value="two_year_diploma">Diploma (2 anos)</option>
            <option value="bachelors">Bacharelado</option>
            <option value="masters">Mestrado</option>
            <option value="phd">Doutorado</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spouseExperience">
            Experiencia de trabalho canadense
          </Label>
          <Select
            id="spouseExperience"
            value={(data.spouseExperience as string) || ""}
            onChange={(e) => onUpdate({ spouseExperience: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="none">Nenhuma</option>
            <option value="1">1 ano</option>
            <option value="2">2 anos</option>
            <option value="3">3 anos</option>
            <option value="5">5 anos ou mais</option>
          </Select>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground-muted">
            Idioma do Conjuge (CLB)
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["Speaking", "Listening", "Reading", "Writing"] as const).map(
              (band) => (
                <div key={band} className="space-y-1">
                  <Label htmlFor={`spouse${band}`} className="text-xs">
                    {band}
                  </Label>
                  <Input
                    id={`spouse${band}`}
                    type="number"
                    min="0"
                    max="12"
                    placeholder="0"
                    value={(data[`spouseCLB${band}`] as string) || ""}
                    onChange={(e) =>
                      onUpdate({ [`spouseCLB${band}`]: e.target.value })
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
