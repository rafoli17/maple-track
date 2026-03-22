"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface StepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function StepEducation({ data, onUpdate }: StepProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Educacao
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="educationLevel">Nivel de Escolaridade</Label>
          <Select
            id="educationLevel"
            value={(data.educationLevel as string) || ""}
            onChange={(e) => onUpdate({ educationLevel: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="high_school">Ensino Medio</option>
            <option value="one_year_diploma">Diploma (1 ano)</option>
            <option value="two_year_diploma">Diploma (2 anos)</option>
            <option value="bachelors">Bacharelado</option>
            <option value="two_or_more">Dois ou mais diplomas</option>
            <option value="masters">Mestrado</option>
            <option value="phd">Doutorado</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fieldOfStudy">Area de Estudo</Label>
          <Input
            id="fieldOfStudy"
            placeholder="Ex: Ciencia da Computacao"
            value={(data.fieldOfStudy as string) || ""}
            onChange={(e) => onUpdate({ fieldOfStudy: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">Instituicao</Label>
          <Input
            id="institution"
            placeholder="Nome da universidade/instituicao"
            value={(data.institution as string) || ""}
            onChange={(e) => onUpdate({ institution: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="graduationYear">Ano de Conclusao</Label>
          <Input
            id="graduationYear"
            type="number"
            placeholder="2020"
            value={(data.graduationYear as string) || ""}
            onChange={(e) => onUpdate({ graduationYear: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="canadianEducation">Educacao Canadense?</Label>
          <Select
            id="canadianEducation"
            value={(data.canadianEducation as string) || ""}
            onChange={(e) => onUpdate({ canadianEducation: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="none">Nenhuma</option>
            <option value="one_year">Diploma/Certificado (1 ano)</option>
            <option value="two_year">Diploma/Certificado (2 anos)</option>
            <option value="bachelors">Bacharelado</option>
            <option value="masters_or_phd">Mestrado ou Doutorado</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
