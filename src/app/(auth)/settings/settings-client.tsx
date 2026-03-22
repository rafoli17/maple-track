"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Settings, Save, CheckCircle2 } from "lucide-react";

interface SettingsClientProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  profile: any;
}

export function SettingsClient({ user, profile }: SettingsClientProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    dateOfBirth: profile?.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
      : "",
    nationality: profile?.nationality || "",
    currentCountry: profile?.currentCountry || "",
    educationLevel: profile?.educationLevel || "",
    fieldOfStudy: profile?.fieldOfStudy || "",
    currentOccupation: profile?.currentOccupation || "",
    nocCode: profile?.nocCode || "",
    yearsOfExperience: profile?.yearsOfExperience ?? "",
    canadianExperienceYears: profile?.canadianExperienceYears ?? "",
    maritalStatus: profile?.maritalStatus || "",
    fundsAvailable: profile?.fundsAvailable || "",
  });

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const payload: Record<string, unknown> = {};
      if (form.firstName) payload.firstName = form.firstName;
      if (form.lastName) payload.lastName = form.lastName;
      if (form.dateOfBirth) payload.dateOfBirth = form.dateOfBirth;
      if (form.nationality) payload.nationality = form.nationality;
      if (form.currentCountry) payload.currentCountry = form.currentCountry;
      if (form.educationLevel) payload.educationLevel = form.educationLevel;
      if (form.fieldOfStudy) payload.fieldOfStudy = form.fieldOfStudy;
      if (form.currentOccupation) payload.currentOccupation = form.currentOccupation;
      if (form.nocCode) payload.nocCode = form.nocCode;
      if (form.yearsOfExperience !== "")
        payload.yearsOfExperience = Number(form.yearsOfExperience);
      if (form.canadianExperienceYears !== "")
        payload.canadianExperienceYears = Number(form.canadianExperienceYears);
      if (form.maritalStatus) payload.maritalStatus = form.maritalStatus;
      if (form.fundsAvailable) payload.fundsAvailable = form.fundsAvailable;

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        router.refresh();
      }
    } catch {
      // Error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-sm text-foreground-muted">
          Gerencie suas preferencias e perfil.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2 border-b border-border pb-3">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          Perfil
        </span>
        <Link
          href="/settings/household"
          className="rounded-full px-4 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface"
        >
          Household
        </Link>
      </div>

      {/* Account info (read-only) */}
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Conta
        </h2>
        <div className="flex items-center gap-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {user.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-sm text-foreground-muted flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Profile edit form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Perfil de Imigracao
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Nome</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Sobrenome</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Data de Nascimento</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Nacionalidade</label>
            <input
              type="text"
              value={form.nationality}
              onChange={(e) => updateField("nationality", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Pais Atual</label>
            <input
              type="text"
              value={form.currentCountry}
              onChange={(e) => updateField("currentCountry", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Nivel de Educacao</label>
            <select
              value={form.educationLevel}
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
            <label className="mb-1 block text-sm text-foreground-muted">Ocupacao</label>
            <input
              type="text"
              value={form.currentOccupation}
              onChange={(e) => updateField("currentOccupation", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Codigo NOC</label>
            <input
              type="text"
              value={form.nocCode}
              onChange={(e) => updateField("nocCode", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Anos de Experiencia</label>
            <input
              type="number"
              min="0"
              value={form.yearsOfExperience}
              onChange={(e) => updateField("yearsOfExperience", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Exp. Canadense (anos)</label>
            <input
              type="number"
              min="0"
              value={form.canadianExperienceYears}
              onChange={(e) => updateField("canadianExperienceYears", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Estado Civil</label>
            <select
              value={form.maritalStatus}
              onChange={(e) => updateField("maritalStatus", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
            >
              <option value="">Selecione...</option>
              <option value="single">Solteiro(a)</option>
              <option value="married">Casado(a)</option>
              <option value="common_law">Uniao Estavel</option>
              <option value="divorced">Divorciado(a)</option>
              <option value="widowed">Viuvo(a)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-foreground-muted">Fundos Disponiveis (CAD)</label>
            <input
              type="text"
              value={form.fundsAvailable}
              onChange={(e) => updateField("fundsAvailable", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              placeholder="Ex: 25000"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar Perfil"}
          </button>
          {saveSuccess && (
            <span className="flex items-center gap-1 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              Salvo com sucesso!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
