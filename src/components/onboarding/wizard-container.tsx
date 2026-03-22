"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { StepPersonal } from "./step-personal";
import { StepEducation } from "./step-education";
import { StepExperience } from "./step-experience";
import { StepLanguage } from "./step-language";
import { StepSpouse } from "./step-spouse";
import { StepFinances } from "./step-finances";
import { StepChildren } from "./step-children";
import { StepPreferences } from "./step-preferences";
import { StepResults } from "./step-results";

const TOTAL_STEPS = 9;

const stepTitles = [
  "Dados Pessoais",
  "Educacao",
  "Experiencia Profissional",
  "Idiomas",
  "Conjuge",
  "Financas",
  "Filhos",
  "Preferencias",
  "Resultados",
];

export function WizardContainer() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [data, setData] = React.useState<Record<string, unknown>>({});
  const [direction, setDirection] = React.useState(1);

  const handleUpdate = React.useCallback(
    (stepData: Record<string, unknown>) => {
      setData((prev) => ({ ...prev, ...stepData }));
    },
    []
  );

  const handleNext = async () => {
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: currentStep, data }),
      });
    } catch {
      // continue even if save fails
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const stepComponents = [
    <StepPersonal key="personal" data={data} onUpdate={handleUpdate} />,
    <StepEducation key="education" data={data} onUpdate={handleUpdate} />,
    <StepExperience key="experience" data={data} onUpdate={handleUpdate} />,
    <StepLanguage key="language" data={data} onUpdate={handleUpdate} />,
    <StepSpouse key="spouse" data={data} onUpdate={handleUpdate} />,
    <StepFinances key="finances" data={data} onUpdate={handleUpdate} />,
    <StepChildren key="children" data={data} onUpdate={handleUpdate} />,
    <StepPreferences key="preferences" data={data} onUpdate={handleUpdate} />,
    <StepResults key="results" data={data} onUpdate={handleUpdate} />,
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      {/* Progress */}
      <div className="mb-2 flex items-center justify-between text-sm text-foreground-muted">
        <span>Passo {currentStep + 1} de {TOTAL_STEPS}</span>
        <span>{stepTitles[currentStep]}</span>
      </div>
      <Progress value={((currentStep + 1) / TOTAL_STEPS) * 100} className="mb-8" />

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ x: direction * 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -50, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {stepComponents[currentStep]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {currentStep < TOTAL_STEPS - 1 && (
          <Button onClick={handleNext}>
            Proximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
