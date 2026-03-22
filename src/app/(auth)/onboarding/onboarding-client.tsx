"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  Briefcase,
  Languages,
  Users,
  Wallet,
  Baby,
  MapPin,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

const steps = [
  { id: "welcome", title: "Boas-vindas", icon: Sparkles },
  { id: "personal", title: "Perfil Pessoal", icon: User },
  { id: "education", title: "Educacao", icon: GraduationCap },
  { id: "experience", title: "Experiencia", icon: Briefcase },
  { id: "languages", title: "Idiomas", icon: Languages },
  { id: "spouse", title: "Conjuge", icon: Users },
  { id: "finances", title: "Financas", icon: Wallet },
  { id: "children", title: "Filhos", icon: Baby },
  { id: "preferences", title: "Preferencias", icon: MapPin },
  { id: "result", title: "Resultado", icon: Check },
];

interface OnboardingClientProps {
  userName: string;
}

export function OnboardingClient({ userName }: OnboardingClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const buildStepData = (stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        return {
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          dateOfBirth: formData.dateOfBirth || "",
          nationality: formData.nationality || "",
          currentCountry: formData.currentCountry || "",
        };
      case 2:
        return {
          educationLevel: formData.educationLevel || "HIGH_SCHOOL",
          fieldOfStudy: formData.fieldOfStudy,
        };
      case 3:
        return {
          currentOccupation: formData.currentOccupation || "",
          nocCode: formData.nocCode,
          yearsOfExperience: Number(formData.yearsOfExperience) || 0,
          canadianExperienceYears: Number(formData.canadianExperienceYears) || 0,
        };
      case 4:
        return {
          hasTest: !!formData.languageTestType,
          testType: formData.languageTestType || undefined,
          speaking: formData.language_speaking ? Number(formData.language_speaking) : undefined,
          listening: formData.language_listening ? Number(formData.language_listening) : undefined,
          reading: formData.language_reading ? Number(formData.language_reading) : undefined,
          writing: formData.language_writing ? Number(formData.language_writing) : undefined,
        };
      case 5:
        return {
          inviteSpouse: !!(formData.maritalStatus === "MARRIED" || formData.maritalStatus === "COMMON_LAW") && !!formData.spouseEmail,
          spouseEmail: formData.spouseEmail || undefined,
        };
      case 6:
        return {
          fundsAvailable: Number(formData.fundsAvailable) || 0,
        };
      case 7:
        return {
          hasChildren: formData.hasChildren || false,
          numberOfChildren: Number(formData.numberOfChildren) || 0,
        };
      case 8:
        return {
          preferredProvinces: formData.provinces || [],
          acceptsRural: formData.acceptsRural || false,
          speaksFrench: formData.speaksFrench || false,
        };
      default:
        return {};
    }
  };

  const saveStep = async (stepIndex: number) => {
    if (stepIndex === 0 || stepIndex === 9) return; // Welcome and Result steps don't save
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: stepIndex, data: buildStepData(stepIndex) }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to save step:", err);
      }
    } catch (err) {
      console.error("Error saving step:", err);
    }
  };

  const goNext = async () => {
    if (isLast) {
      handleComplete();
    } else {
      setIsSubmitting(true);
      await saveStep(currentStep);
      setIsSubmitting(false);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "PUT",
      });
      if (!res.ok) {
        throw new Error("Failed to complete onboarding");
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-2xl py-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-foreground-dim">
          <span>
            Passo {currentStep + 1} de {steps.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-border">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="mb-8 flex justify-center gap-1.5 overflow-x-auto">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          return (
            <div
              key={s.id}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                i === currentStep
                  ? "bg-primary text-primary-foreground"
                  : i < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-card text-foreground-dim"
              }`}
            >
              {i < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <StepIcon className="h-4 w-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        {currentStep === 0 && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">
              Bem-vindo, {userName.split(" ")[0]}!
            </h2>
            <p className="text-foreground-muted">
              Vamos configurar seu perfil para identificar os melhores programas
              de imigracao para o Canada. Leva apenas alguns minutos.
            </p>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Perfil Pessoal</h2>
            <p className="text-sm text-foreground-muted">
              Informacoes basicas sobre voce.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Sobrenome
                </label>
                <input
                  type="text"
                  value={formData.lastName || ""}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  placeholder="Seu sobrenome"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Nacionalidade
                </label>
                <input
                  type="text"
                  value={formData.nationality || ""}
                  onChange={(e) => updateField("nationality", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  placeholder="Ex: Brasileira"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-foreground-muted">
                  Pais de Residencia Atual
                </label>
                <input
                  type="text"
                  value={formData.currentCountry || ""}
                  onChange={(e) => updateField("currentCountry", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  placeholder="Ex: Brasil"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Educacao</h2>
            <p className="text-sm text-foreground-muted">
              Conte-nos sobre sua formacao academica.
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Nivel de Educacao
                </label>
                <select
                  value={formData.educationLevel || ""}
                  onChange={(e) => updateField("educationLevel", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                >
                  <option value="">Selecione...</option>
                  <option value="HIGH_SCHOOL">Ensino Medio</option>
                  <option value="ONE_YEAR_DIPLOMA">Diploma 1 ano</option>
                  <option value="TWO_YEAR_DIPLOMA">Diploma 2 anos</option>
                  <option value="BACHELORS">Bacharelado</option>
                  <option value="TWO_OR_MORE_CERTIFICATES">2+ Certificados</option>
                  <option value="MASTERS">Mestrado</option>
                  <option value="PHD">Doutorado</option>
                  <option value="TECHNICAL">Tecnico</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Area de Estudo
                </label>
                <input
                  type="text"
                  value={formData.fieldOfStudy || ""}
                  onChange={(e) => updateField("fieldOfStudy", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  placeholder="Ex: Ciencia da Computacao"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="canadianEducation"
                  checked={formData.canadianEducation || false}
                  onChange={(e) =>
                    updateField("canadianEducation", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="canadianEducation"
                  className="text-sm text-foreground"
                >
                  Possuo educacao canadense
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Experiencia Profissional
            </h2>
            <p className="text-sm text-foreground-muted">
              Detalhes da sua carreira.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Ocupacao Atual
                </label>
                <input
                  type="text"
                  value={formData.currentOccupation || ""}
                  onChange={(e) =>
                    updateField("currentOccupation", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  placeholder="Ex: Engenheiro de Software"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Codigo NOC
                </label>
                <input
                  type="text"
                  value={formData.nocCode || ""}
                  onChange={(e) => updateField("nocCode", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  placeholder="Ex: 21232"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Anos de Experiencia (Total)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience || ""}
                  onChange={(e) =>
                    updateField("yearsOfExperience", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Anos de Experiencia no Canada
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.canadianExperienceYears || ""}
                  onChange={(e) =>
                    updateField("canadianExperienceYears", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Idiomas</h2>
            <p className="text-sm text-foreground-muted">
              Ja fez algum teste de idioma? Qual o score?
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Tipo de Teste
                </label>
                <select
                  value={formData.languageTestType || ""}
                  onChange={(e) =>
                    updateField("languageTestType", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                >
                  <option value="">Ainda nao fiz teste</option>
                  <option value="IELTS_GENERAL">IELTS General</option>
                  <option value="IELTS_ACADEMIC">IELTS Academic</option>
                  <option value="CELPIP">CELPIP</option>
                  <option value="TEF">TEF (Frances)</option>
                  <option value="TCF">TCF (Frances)</option>
                </select>
              </div>
              {formData.languageTestType && (
                <div className="grid grid-cols-2 gap-4">
                  {["speaking", "listening", "reading", "writing"].map(
                    (skill) => (
                      <div key={skill}>
                        <label className="mb-1 block text-sm capitalize text-foreground-muted">
                          {skill}
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="9"
                          value={formData[`language_${skill}`] || ""}
                          onChange={(e) =>
                            updateField(`language_${skill}`, e.target.value)
                          }
                          className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Conjuge</h2>
            <p className="text-sm text-foreground-muted">
              Se voce tem um(a) conjuge, convide-o(a) para o household.
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Estado Civil
                </label>
                <select
                  value={formData.maritalStatus || ""}
                  onChange={(e) =>
                    updateField("maritalStatus", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                >
                  <option value="">Selecione...</option>
                  <option value="SINGLE">Solteiro(a)</option>
                  <option value="MARRIED">Casado(a)</option>
                  <option value="COMMON_LAW">Uniao Estavel</option>
                  <option value="DIVORCED">Divorciado(a)</option>
                  <option value="WIDOWED">Viuvo(a)</option>
                </select>
              </div>
              {(formData.maritalStatus === "MARRIED" ||
                formData.maritalStatus === "COMMON_LAW") && (
                <div>
                  <label className="mb-1 block text-sm text-foreground-muted">
                    Email do Conjuge (para convite)
                  </label>
                  <input
                    type="email"
                    value={formData.spouseEmail || ""}
                    onChange={(e) =>
                      updateField("spouseEmail", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                    placeholder="email@conjuge.com"
                  />
                  <p className="mt-1 text-xs text-foreground-dim">
                    Enviaremos um convite para ele(a) entrar no mesmo household.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              Situacao Financeira
            </h2>
            <p className="text-sm text-foreground-muted">
              Fundos disponiveis para o processo de imigracao.
            </p>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">
                Fundos Disponiveis (CAD)
              </label>
              <input
                type="number"
                min="0"
                value={formData.fundsAvailable || ""}
                onChange={(e) =>
                  updateField("fundsAvailable", e.target.value)
                }
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                placeholder="Ex: 25000"
              />
              <p className="mt-1 text-xs text-foreground-dim">
                Valor em dolares canadenses para proof of funds.
              </p>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Filhos</h2>
            <p className="text-sm text-foreground-muted">
              Informacoes sobre dependentes.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasChildren"
                  checked={formData.hasChildren || false}
                  onChange={(e) =>
                    updateField("hasChildren", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="hasChildren"
                  className="text-sm text-foreground"
                >
                  Tenho filhos dependentes
                </label>
              </div>
              {formData.hasChildren && (
                <div>
                  <label className="mb-1 block text-sm text-foreground-muted">
                    Numero de Filhos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.numberOfChildren || ""}
                    onChange={(e) =>
                      updateField("numberOfChildren", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Preferencias</h2>
            <p className="text-sm text-foreground-muted">
              Suas preferencias para o Canada.
            </p>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-foreground-muted">
                  Provincias de Interesse
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Ontario",
                    "British Columbia",
                    "Alberta",
                    "Quebec",
                    "Nova Scotia",
                    "Manitoba",
                    "Saskatchewan",
                    "New Brunswick",
                  ].map((province) => (
                    <label
                      key={province}
                      className="flex items-center gap-2 rounded-lg border border-border p-2 text-sm text-foreground hover:bg-surface"
                    >
                      <input
                        type="checkbox"
                        checked={
                          formData.provinces?.includes(province) || false
                        }
                        onChange={(e) => {
                          const current = formData.provinces || [];
                          updateField(
                            "provinces",
                            e.target.checked
                              ? [...current, province]
                              : current.filter((p: string) => p !== province)
                          );
                        }}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      {province}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ruralOk"
                  checked={formData.acceptsRural || false}
                  onChange={(e) =>
                    updateField("acceptsRural", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="ruralOk" className="text-sm text-foreground">
                  Aceito cidades rurais/menores
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="speaksFrench"
                  checked={formData.speaksFrench || false}
                  onChange={(e) =>
                    updateField("speaksFrench", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="speaksFrench"
                  className="text-sm text-foreground"
                >
                  Falo frances
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 9 && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">
              Tudo pronto!
            </h2>
            <p className="text-foreground-muted">
              Seu perfil foi configurado. Agora vamos calcular seu score CRS e
              recomendar os melhores programas para voce.
            </p>
            <div className="mt-6 rounded-xl border border-border bg-surface p-4">
              <p className="text-sm text-foreground-dim">
                Ao clicar em &quot;Concluir&quot;, vamos analisar seu perfil e
                sugerir os melhores programas de imigracao.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={isFirst}
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <button
          onClick={goNext}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-light disabled:opacity-50"
        >
          {isSubmitting
            ? "Salvando..."
            : isLast
              ? "Concluir"
              : "Proximo"}
          {!isLast && !isSubmitting && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
