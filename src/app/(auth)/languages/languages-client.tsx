"use client";

import {
  Languages,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Idiomas</h1>
        <p className="text-sm text-foreground-muted">
          Acompanhe testes de idioma e scores de cada membro do household.
        </p>
      </div>

      {profiles.length > 0 ? (
        profiles.map((profile: any) => {
          const profileTests = tests.filter(
            (t: any) => t.profileId === profile.id
          );

          return (
            <div
              key={profile.id}
              className="rounded-xl border border-border bg-card p-6"
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
                        className="rounded-lg border border-border bg-surface p-4"
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
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border text-sm text-foreground-dim">
                  Nenhum teste de idioma registrado.
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
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
