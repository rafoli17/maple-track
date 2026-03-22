"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  User,
  Plus,
  X,
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
  TEF_RESULT: "Resultado TEF",
  POLICE_CLEARANCE: "Antecedentes Criminais",
  MEDICAL_EXAM: "Exame Medico",
  PROOF_OF_FUNDS: "Comprovante de Fundos",
  EMPLOYMENT_LETTER: "Carta de Emprego",
  REFERENCE_LETTER: "Carta de Referencia",
  PHOTOS: "Fotos",
  OTHER: "Outro",
};

export function DocumentsClient({ groupedDocs, profiles }: DocumentsClientProps) {
  const router = useRouter();
  const profileMap = new Map(profiles.map((p: any) => [p.id, p]));
  const hasDocuments = Object.values(groupedDocs).some(
    (docs) => docs.length > 0
  );

  const [showAddForm, setShowAddForm] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newDoc, setNewDoc] = React.useState({
    name: "",
    type: "PASSPORT" as string,
    status: "NOT_STARTED" as string,
    notes: "",
    expiryDate: "",
  });

  const handleCreateDocument = async () => {
    if (!newDoc.name) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDoc.name,
          type: newDoc.type,
          status: newDoc.status,
          notes: newDoc.notes || undefined,
          expiryDate: newDoc.expiryDate || undefined,
        }),
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewDoc({ name: "", type: "PASSPORT", status: "NOT_STARTED", notes: "", expiryDate: "" });
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
          <h1 className="text-2xl font-bold text-foreground">Documentos</h1>
          <p className="text-sm text-foreground-muted">
            Acompanhe todos os documentos necessarios para sua aplicacao.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light"
        >
          <Plus className="h-4 w-4" />
          Adicionar Documento
        </button>
      </div>

      {/* Add document form */}
      {showAddForm && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Novo Documento</h2>
            <button onClick={() => setShowAddForm(false)} className="text-foreground-dim hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Nome</label>
              <input
                type="text"
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                placeholder="Ex: Passaporte Principal"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Tipo</label>
              <select
                value={newDoc.type}
                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Status</label>
              <select
                value={newDoc.status}
                onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              >
                {Object.entries(statusConfig).map(([value, cfg]) => (
                  <option key={value} value={value}>{cfg.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-foreground-muted">Data de Validade</label>
              <input
                type="date"
                value={newDoc.expiryDate}
                onChange={(e) => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-foreground-muted">Notas</label>
              <input
                type="text"
                value={newDoc.notes}
                onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                placeholder="Observacoes opcionais"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCreateDocument}
              disabled={isCreating || !newDoc.name}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light disabled:opacity-50"
            >
              {isCreating ? "Salvando..." : "Salvar Documento"}
            </button>
          </div>
        </div>
      )}

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
                  className="rounded-2xl bg-white p-4 text-center shadow-sm"
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
                <span className="rounded-full bg-surface px-3 py-1 text-xs text-foreground-dim">
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
                      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
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
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
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
