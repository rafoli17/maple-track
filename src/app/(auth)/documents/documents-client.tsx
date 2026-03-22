"use client";

import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  User,
} from "lucide-react";

interface DocumentsClientProps {
  groupedDocs: Record<string, any[]>;
  profiles: any[];
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  NOT_STARTED: { icon: Clock, color: "text-foreground-dim", label: "Nao Iniciado" },
  GATHERING: { icon: Clock, color: "text-info", label: "Reunindo" },
  SUBMITTED: { icon: Upload, color: "text-primary", label: "Submetido" },
  APPROVED: { icon: CheckCircle2, color: "text-success", label: "Aprovado" },
  EXPIRED: { icon: AlertTriangle, color: "text-error", label: "Expirado" },
  NEEDS_UPDATE: { icon: AlertTriangle, color: "text-warning", label: "Atualizar" },
};

const typeLabels: Record<string, string> = {
  PASSPORT: "Passaporte",
  BIRTH_CERTIFICATE: "Certidao de Nascimento",
  MARRIAGE_CERTIFICATE: "Certidao de Casamento",
  DIPLOMA: "Diploma",
  TRANSCRIPT: "Historico Escolar",
  ECA: "ECA (Avaliacao de Credenciais)",
  IELTS_RESULT: "Resultado IELTS",
  CELPIP_RESULT: "Resultado CELPIP",
  POLICE_CLEARANCE: "Antecedentes Criminais",
  MEDICAL_EXAM: "Exame Medico",
  PROOF_OF_FUNDS: "Comprovante de Fundos",
  EMPLOYMENT_LETTER: "Carta de Emprego",
  REFERENCE_LETTER: "Carta de Referencia",
  PHOTOS: "Fotos",
  OTHER: "Outro",
};

export function DocumentsClient({ groupedDocs, profiles }: DocumentsClientProps) {
  const profileMap = new Map(profiles.map((p: any) => [p.id, p]));
  const hasDocuments = Object.values(groupedDocs).some(
    (docs) => docs.length > 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Documentos</h1>
        <p className="text-sm text-foreground-muted">
          Acompanhe todos os documentos necessarios para sua aplicacao.
        </p>
      </div>

      {/* Stats */}
      {hasDocuments && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["NOT_STARTED", "GATHERING", "SUBMITTED", "APPROVED"].map(
            (status) => {
              const config = statusConfig[status];
              const StatusIcon = config.icon;
              const count = Object.values(groupedDocs)
                .flat()
                .filter((d: any) => d.status === status).length;

              return (
                <div
                  key={status}
                  className="rounded-xl border border-border bg-card p-3 text-center"
                >
                  <StatusIcon
                    className={`mx-auto mb-1 h-5 w-5 ${config.color}`}
                  />
                  <p className="text-xl font-bold text-foreground">{count}</p>
                  <p className="text-xs text-foreground-dim">{config.label}</p>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* Documents by profile */}
      {hasDocuments ? (
        Object.entries(groupedDocs).map(([profileId, docs]) => {
          const profile = profileMap.get(profileId);
          const name = profile
            ? `${profile.firstName} ${profile.lastName}`
            : "Geral";

          return (
            <div key={profileId} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-base font-semibold text-foreground">
                  {name}
                </h2>
                <span className="rounded-md bg-surface px-2 py-0.5 text-xs text-foreground-dim">
                  {docs.length} docs
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {docs.map((doc: any) => {
                  const config =
                    statusConfig[doc.status] || statusConfig.NOT_STARTED;
                  const StatusIcon = config.icon;

                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface">
                        <FileText className="h-5 w-5 text-foreground-dim" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {doc.name || typeLabels[doc.type] || doc.type}
                        </p>
                        <div className="flex items-center gap-1">
                          <StatusIcon
                            className={`h-3 w-3 ${config.color}`}
                          />
                          <span className="text-xs text-foreground-dim">
                            {config.label}
                          </span>
                        </div>
                        {doc.expiryDate && (
                          <p className="text-[10px] text-foreground-dim">
                            Expira:{" "}
                            {new Date(doc.expiryDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
          <FileText className="mb-3 h-10 w-10 text-foreground-dim" />
          <p className="mb-1 text-base font-medium text-foreground">
            Nenhum documento cadastrado
          </p>
          <p className="text-sm text-foreground-muted">
            Os documentos necessarios aparecerao aqui quando voce selecionar um
            programa.
          </p>
        </div>
      )}
    </div>
  );
}
