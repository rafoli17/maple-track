"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface CrsFormProps {
  onCalculate?: (score: number) => void;
  className?: string;
}

export function CrsForm({ onCalculate, className }: CrsFormProps) {
  const [formData, setFormData] = React.useState({
    age: "",
    education: "",
    firstLanguageCLB: "",
    secondLanguageCLB: "",
    canadianExperience: "",
    foreignExperience: "",
    certificateQualification: "no",
    provincialNomination: "no",
    jobOffer: "no",
    canadianEducation: "none",
    sibling: "no",
    frenchSkills: "no",
  });

  const [score, setScore] = React.useState<number | null>(null);

  const update = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const calculateScore = () => {
    // Simplified CRS calculation for demonstration
    let total = 0;
    const age = parseInt(formData.age) || 0;
    if (age >= 20 && age <= 29) total += 110;
    else if (age >= 30 && age <= 34) total += 100;
    else if (age >= 35 && age <= 39) total += 90;
    else if (age >= 40 && age <= 44) total += 70;
    else total += 50;

    const edMap: Record<string, number> = {
      high_school: 30,
      one_year: 90,
      two_year: 98,
      bachelors: 120,
      two_or_more: 128,
      masters: 135,
      phd: 150,
    };
    total += edMap[formData.education] || 0;

    const clb = parseInt(formData.firstLanguageCLB) || 0;
    total += Math.min(clb * 8, 136);

    const secClb = parseInt(formData.secondLanguageCLB) || 0;
    total += Math.min(secClb * 2, 24);

    const canExp = parseInt(formData.canadianExperience) || 0;
    total += Math.min(canExp * 20, 80);

    if (formData.provincialNomination === "yes") total += 600;
    if (formData.jobOffer === "yes_00") total += 200;
    else if (formData.jobOffer === "yes_other") total += 50;

    setScore(total);
    onCalculate?.(total);
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Simulador CRS
      </h2>

      <div className="space-y-6">
        {/* Section: Core Human Capital */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground-muted">
            Capital Humano
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="65"
                placeholder="Ex: 30"
                value={formData.age}
                onChange={(e) => update("age", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Educacao</Label>
              <Select
                id="education"
                value={formData.education}
                onChange={(e) => update("education", e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="high_school">Ensino Medio</option>
                <option value="one_year">Diploma (1 ano)</option>
                <option value="two_year">Diploma (2 anos)</option>
                <option value="bachelors">Bacharelado</option>
                <option value="two_or_more">Dois ou mais diplomas</option>
                <option value="masters">Mestrado</option>
                <option value="phd">Doutorado</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Section: Language */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground-muted">
            Idiomas (CLB)
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstLang">1o Idioma (CLB)</Label>
              <Input
                id="firstLang"
                type="number"
                min="0"
                max="12"
                placeholder="Ex: 9"
                value={formData.firstLanguageCLB}
                onChange={(e) => update("firstLanguageCLB", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondLang">2o Idioma (CLB)</Label>
              <Input
                id="secondLang"
                type="number"
                min="0"
                max="12"
                placeholder="Ex: 5"
                value={formData.secondLanguageCLB}
                onChange={(e) => update("secondLanguageCLB", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section: Experience */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground-muted">
            Experiencia
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="canExp">Canadense (anos)</Label>
              <Select
                id="canExp"
                value={formData.canadianExperience}
                onChange={(e) => update("canadianExperience", e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="0">Nenhuma</option>
                <option value="1">1 ano</option>
                <option value="2">2 anos</option>
                <option value="3">3 anos</option>
                <option value="4">4 anos</option>
                <option value="5">5+ anos</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="forExp">Estrangeira (anos)</Label>
              <Select
                id="forExp"
                value={formData.foreignExperience}
                onChange={(e) => update("foreignExperience", e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="0">Nenhuma</option>
                <option value="1">1 ano</option>
                <option value="2">2 anos</option>
                <option value="3">3+ anos</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Section: Additional */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground-muted">
            Pontos Adicionais
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pnp">Nomeacao Provincial (PNP)</Label>
              <Select
                id="pnp"
                value={formData.provincialNomination}
                onChange={(e) => update("provincialNomination", e.target.value)}
              >
                <option value="no">Nao</option>
                <option value="yes">Sim (+600)</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job">Oferta de Emprego</Label>
              <Select
                id="job"
                value={formData.jobOffer}
                onChange={(e) => update("jobOffer", e.target.value)}
              >
                <option value="no">Nao</option>
                <option value="yes_00">Sim - TEER 0/1 (+200)</option>
                <option value="yes_other">Sim - Outro (+50)</option>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={calculateScore} className="w-full">
          <Calculator className="mr-2 h-4 w-4" />
          Calcular CRS
        </Button>

        {score !== null && (
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <p className="text-sm text-foreground-muted">
              Sua pontuacao estimada
            </p>
            <p className="mt-1 text-4xl font-bold text-primary">{score}</p>
            <p className="mt-1 text-xs text-foreground-dim">
              pontos CRS (estimativa simplificada)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
