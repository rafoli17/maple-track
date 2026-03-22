"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Languages,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Plus,
  X,
} from "lucide-react";

interface LanguagesClientProps {
  profiles: any[];
  tests: any[];
}

const testStatusConfig: Record<string, { color: string; label: string }> = {
  PLANNED: { color: "text-foreground-dim", label: "Planejado" },
  SCHEDULED: { color: "text-info", label: "Agendado" },
  COMPLETED: { color: "text-success", label: "Concluido" },
  EXPIRED: { color: "text-error", label: "Expirado" },
};

const skills = ["speaking", "listening", "reading", "writing"] as const;

export function LanguagesClient({ profiles, tests }: LanguagesClientProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newTest, setNewTest] = React.useState({
    testType: "IELTS_GENERAL",
    status: "PLANNED" as string,
    speaking: "",
    listening: "",
    reading: "",
    writing: "",
    testDate: "",
  });

  const handleCreateTest = async () => {
    setIsCreating(true);
    try {
      const payload: Record<string, unknown> = {
        testType: newTest.testType,
        status: newTest.status,
      };
      if (newTest.speaking) payload.speaking = Number(newTest.speaking);
      if (newTest.listening) payload.listening = Number(newTest.listening);
      if (newTest.reading) payload.reading = Number(newTest.reading);
      if (newTest.writing) payload.writing = Number(newTest.writing);
      if (newTest.testDate) payload.testDate = newTest.testDate;

      const res = await fetch("/api/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewTest({ testType: "IELTS_GENERAL", status: "PLANNED", speaking: "", listening: "", reading: "", writing: "", testDate: "" });
        router.refresh();
      }
    } catch {
      // Error
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Idiomas</h1>
          <p className="text-sm text-foreground-muted">
            Acompanhe testes de idioma e scores de cada membro do household.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light"
        >
          <Plus className="h-4 w-4" />
          Adicionar Teste
        </button>
      </div>

      {/* Add test form */}
      {showAddForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Novo Teste de Idioma</h2>
            <button onClick={() => setShowAddForm(false)} className="text-foreground-dim hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Tipo de Teste</label>
              <select
                value={newTest.testType}
                onChange={(e) => setNewTest({ ...newTest, testType: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              >
                <option value="IELTS_GENERAL">IELTS General</option>
                <option value="IELTS_ACADEMIC">IELTS Academic</option>
                <option value="CELPIP">CELPIP</option>
                <option value="TEF">TEF (Frances)</option>
                <option value="TCF">TCF (Frances)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Status</label>
              <select
                value={newTest.status}
                onChange={(e) => setNewTest({ ...newTest, status: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              >
                <option value="PLANNED">Planejado</option>
                <option value="SCHEDULED">Agendado</option>
                <option value="COMPLETED">Concluido</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Speaking</label>
              <input type="number" step="0.5" min="0" max="12" value={newTest.speaking}
                onChange={(e) => setNewTest({ ...newTest, speaking: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Listening</label>
              <input type="number" step="0.5" min="0" max="12" value={newTest.listening}
                onChange={(e) => setNewTest({ ...newTest, listening: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Reading</label>
              <input type="number" step="0.5" min="0" max="12" value={newTest.reading}
                onChange={(e) => setNewTest({ ...newTest, reading: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Writing</label>
              <input type="number" step="0.5" min="0" max="12" value={newTest.writing}
                onChange={(e) => setNewTest({ ...newTest, writing: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Data do Teste</label>
              <input type="date" value={newTest.testDate}
                onChange={(e) => setNewTest({ ...newTest, testDate: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCreateTest}
              disabled={isCreating}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light disabled:opacity-50"
            >
              {isCreating ? "Salvando..." : "Salvar Teste"}
            </button>
          </div>
        </div>
      )}

      {profiles.length > 0 ? (
        profiles.map((profile: any) => {
          const profileTests = tests.filter(
            (t: any) => t.profileId === profile.id
          );

          return (
            <div
              key={profile.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              {/* Profile header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-xs text-foreground-dim">
                    {profile.isPrimaryApplicant
                      ? "Aplicante Principal"
                      : "Conjuge"}
                  </p>
                </div>
              </div>

              {profileTests.length > 0 ? (
                <div className="space-y-4">
                  {profileTests.map((test: any) => {
                    const statusCfg =
                      testStatusConfig[test.status] ||
                      testStatusConfig.PLANNED;

                    return (
                      <div
                        key={test.id}
                        className="rounded-2xl bg-surface p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Languages className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                              {test.testType}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-medium ${statusCfg.color}`}
                          >
                            {statusCfg.label}
                          </span>
                        </div>

                        {/* Score bands */}
                        {test.status === "COMPLETED" && (
                          <div className="mb-3 grid grid-cols-4 gap-2">
                            {skills.map((skill) => {
                              const score = test[skill] || 0;
                              const target =
                                test[
                                  `target${skill.charAt(0).toUpperCase() + skill.slice(1)}`
                                ] || null;
                              const meetsTarget =
                                target && score >= Number(target);

                              return (
                                <div key={skill} className="text-center">
                                  <p className="mb-1 text-[10px] capitalize text-foreground-dim">
                                    {skill}
                                  </p>
                                  <p
                                    className={`text-lg font-bold ${
                                      meetsTarget
                                        ? "text-success"
                                        : target
                                          ? "text-warning"
                                          : "text-foreground"
                                    }`}
                                  >
                                    {score}
                                  </p>
                                  {target && (
                                    <p className="text-[10px] text-foreground-dim">
                                      Meta: {target}
                                    </p>
                                  )}

                                  {/* Progress bar */}
                                  <div className="mt-1 h-1 rounded-full bg-border">
                                    <div
                                      className={`h-1 rounded-full transition-all ${
                                        meetsTarget
                                          ? "bg-success"
                                          : "bg-primary"
                                      }`}
                                      style={{
                                        width: `${Math.min((score / 9) * 100, 100)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Overall + CLB */}
                        <div className="flex items-center gap-4 text-xs text-foreground-dim">
                          {test.overallScore && (
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              Overall: {test.overallScore}
                            </span>
                          )}
                          {test.clbEquivalent && (
                            <span>CLB {test.clbEquivalent}</span>
                          )}
                          {test.testDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(test.testDate).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          )}
                          {test.expiryDate && (
                            <span
                              className={`flex items-center gap-1 ${
                                new Date(test.expiryDate) < new Date()
                                  ? "text-error"
                                  : ""
                              }`}
                            >
                              {new Date(test.expiryDate) < new Date() ? (
                                <AlertTriangle className="h-3 w-3" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                              Expira:{" "}
                              {new Date(test.expiryDate).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-2xl border-2 border-dashed border-border text-sm text-foreground-dim">
                  Nenhum teste de idioma registrado.
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <Languages className="mb-3 h-10 w-10 text-foreground-dim" />
          <p className="mb-1 text-base font-medium text-foreground">
            Nenhum perfil encontrado
          </p>
          <p className="text-sm text-foreground-muted">
            Complete o onboarding para registrar seus testes de idioma.
          </p>
        </div>
      )}
    </div>
  );
}
