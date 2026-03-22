"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface StepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function StepExperience({ data, onUpdate }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Experiencia Profissional
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nocCode">Codigo NOC</Label>
          <Input
            id="nocCode"
            placeholder="Ex: 21232"
            value={(data.nocCode as string) || ""}
            onChange={(e) => onUpdate({ nocCode: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Cargo Atual</Label>
          <Input
            id="jobTitle"
            placeholder="Ex: Desenvolvedor de Software"
            value={(data.jobTitle as string) || ""}
            onChange={(e) => onUpdate({ jobTitle: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="foreignExperience">
            Anos de Experiencia no Exterior
          </Label>
          <Select
            id="foreignExperience"
            value={(data.foreignExperience as string) || ""}
            onChange={(e) => onUpdate({ foreignExperience: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="none">Nenhuma</option>
            <option value="1">1 ano</option>
            <option value="2">2 anos</option>
            <option value="3">3 anos ou mais</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="canadianExperience">
            Anos de Experiencia no Canada
          </Label>
          <Select
            id="canadianExperience"
            value={(data.canadianExperience as string) || ""}
            onChange={(e) => onUpdate({ canadianExperience: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="none">Nenhuma</option>
            <option value="1">1 ano</option>
            <option value="2">2 anos</option>
            <option value="3">3 anos</option>
            <option value="4">4 anos</option>
            <option value="5">5 anos ou mais</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hasLmia">Possui LMIA/Oferta de emprego?</Label>
          <Select
            id="hasLmia"
            value={(data.hasLmia as string) || ""}
            onChange={(e) => onUpdate({ hasLmia: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="no">Nao</option>
            <option value="yes_00">Sim - NOC TEER 0 ou 1</option>
            <option value="yes_other">Sim - Outro NOC</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
