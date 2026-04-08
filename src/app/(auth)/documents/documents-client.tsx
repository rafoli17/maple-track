"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Upload,
  Plus,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Shield,
  Info,
  Languages,
  GraduationCap,
  Briefcase,
  DollarSign,
  Paperclip,
  UserCheck,
  Users,
  Filter,
  Eye,
  Trash2,
  Calendar,
  Globe,
  BookOpen,
} from "lucide-react";
import { EmptyStateIllustration } from "@/components/illustrations";
import type {
  DocumentAlert,
  AlertLevel,
  CategoryReadiness,
  RecommendedDoc,
} from "@/lib/document-categories";

// ════════════════════════════════════════════════════════════════
// Props & Config
// ════════════════════════════════════════════════════════════════

interface DocumentsClientProps {
  allDocs: any[];
  profiles: any[];
  plans: any[];
  alerts: DocumentAlert[];
  categoryReadiness: CategoryReadiness[];
  missingDocs: { doc: RecommendedDoc; existing: number; needed: number }[];
  overallReadiness: number;
  totalDocs: number;
  readyDocs: number;
}

const statusConfig: Record<string, { icon: any; color: string; label: string; bg: string }> = {
  NOT_STARTED: { icon: Clock, color: "text-foreground-dim", label: "Nao Iniciado", bg: "bg-surface" },
  GATHERING: { icon: Clock, color: "text-info", label: "Reunindo", bg: "bg-info/10" },
  SUBMITTED: { icon: Upload, color: "text-primary", label: "Submetido", bg: "bg-primary/10" },
  APPROVED: { icon: CheckCircle2, color: "text-success", label: "Aprovado", bg: "bg-success/10" },
  EXPIRED: { icon: AlertTriangle, color: "text-error", label: "Expirado", bg: "bg-error/10" },
  NEEDS_UPDATE: { icon: AlertTriangle, color: "text-warning", label: "Atualizar", bg: "bg-warning/10" },
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

const CATEGORY_ICONS: Record<string, any> = {
  UserCheck, GraduationCap, Languages, Briefcase, DollarSign, Shield, Paperclip,
};

const alertStyles: Record<AlertLevel, { bg: string; border: string; text: string; icon: any }> = {
  INFO: { bg: "bg-info/5", border: "border-info/15", text: "text-info", icon: Info },
  ATTENTION: { bg: "bg-warning/5", border: "border-warning/15", text: "text-warning", icon: AlertTriangle },
  URGENT: { bg: "bg-error/5", border: "border-error/15", text: "text-error", icon: AlertCircle },
  EXPIRED: { bg: "bg-error/10", border: "border-error/25", text: "text-error", icon: XCircle },
};

// ════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════

export function DocumentsClient({
  allDocs,
  profiles,
  plans,
  alerts,
  categoryReadiness,
  missingDocs,
  overallReadiness,
  totalDocs,
  readyDocs,
}: DocumentsClientProps) {
  const router = useRouter();
  const profileMap = new Map(profiles.map((p: any) => [p.id, p]));

  // ── State ──
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterPerson, setFilterPerson] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(categoryReadiness.filter((c) => c.totalDocs > 0).map((c) => c.category.id))
  );
  const [editingDoc, setEditingDoc] = React.useState<any>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [showAlerts, setShowAlerts] = React.useState(true);

  const [newDoc, setNewDoc] = React.useState({
    name: "",
    type: "PASSPORT" as string,
    status: "NOT_STARTED" as string,
    notes: "",
    expiryDate: "",
    issueDate: "",
    profileId: profiles[0]?.id || "",
    originalLanguage: "Portugues",
    translationRequired: false,
    fileUrl: "",
  });
  const [uploadingFile, setUploadingFile] = React.useState(false);
  const [uploadedFileName, setUploadedFileName] = React.useState("");

  // ── Handlers ──
  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setUploadedFileName(file.name);
        return data.url;
      }
      return null;
    } catch {
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

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
          issueDate: newDoc.issueDate || undefined,
          profileId: newDoc.profileId || undefined,
          originalLanguage: newDoc.originalLanguage || undefined,
          translationRequired: newDoc.translationRequired,
        }),
      });
      if (res.ok) {
        // If a file was uploaded, attach it to the newly created doc
        const createdDoc = await res.json();
        if (newDoc.fileUrl) {
          await fetch(`/api/documents/${createdDoc.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl: newDoc.fileUrl }),
          });
        }
        setShowAddForm(false);
        setNewDoc({
          name: "", type: "PASSPORT", status: "NOT_STARTED",
          notes: "", expiryDate: "", issueDate: "",
          profileId: profiles[0]?.id || "",
          originalLanguage: "Portugues", translationRequired: false,
          fileUrl: "",
        });
        setUploadedFileName("");
        router.refresh();
      }
    } catch {
      // Error
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateDoc = async (docId: string, updates: Record<string, any>) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setEditingDoc(null);
        router.refresh();
      }
    } catch {
      // Error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setEditingDoc(null);
        router.refresh();
      }
    } catch {
      // Error
    }
  };

  // ── Filters ──
  const filteredDocs = React.useMemo(() => {
    let docs = [...allDocs];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          typeLabels[d.type]?.toLowerCase().includes(q)
      );
    }
    if (filterPerson !== "all") {
      docs = docs.filter((d) => d.profileId === filterPerson);
    }
    if (filterStatus !== "all") {
      if (filterStatus === "EXPIRING") {
        const now = new Date();
        docs = docs.filter((d) => {
          if (!d.expiryDate) return false;
          const days = Math.ceil((new Date(d.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return days > 0 && days <= 90;
        });
      } else if (filterStatus === "NEEDS_TRANSLATION") {
        docs = docs.filter((d) => d.translationRequired && !d.translationCompleted);
      } else {
        docs = docs.filter((d) => d.status === filterStatus);
      }
    }
    return docs;
  }, [allDocs, searchQuery, filterPerson, filterStatus]);

  // Stats
  const expiredCount = allDocs.filter((d) => {
    if (d.status === "EXPIRED") return true;
    if (d.expiryDate && new Date(d.expiryDate) < new Date()) return true;
    return false;
  }).length;
  const pendingTranslations = allDocs.filter(
    (d) => d.translationRequired && !d.translationCompleted
  ).length;

  const urgentAlerts = alerts.filter((a) => a.level === "URGENT" || a.level === "EXPIRED");

  return (
    <div className="space-y-5">
      {/* ══════════════════════════════════════════════════════════ */}
      {/* HEADER                                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Central de Documentos</h1>
          <p className="text-sm text-foreground-muted">
            Organize, acompanhe e prepare todos os documentos da sua jornada.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light"
        >
          <Plus className="h-4 w-4" />
          Novo Documento
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ALERTS BANNER                                              */}
      {/* ══════════════════════════════════════════════════════════ */}
      {urgentAlerts.length > 0 && showAlerts && (
        <div className="space-y-2">
          {urgentAlerts.slice(0, 3).map((alert, i) => {
            const style = alertStyles[alert.level];
            const AlertIcon = style.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl border ${style.border} ${style.bg} px-4 py-3`}
              >
                <AlertIcon className={`h-4 w-4 shrink-0 ${style.text}`} />
                <div className="min-w-0 flex-1">
                  <span className={`text-xs font-semibold ${style.text}`}>{alert.title}: </span>
                  <span className="text-xs text-foreground">{alert.message}</span>
                </div>
                {i === 0 && urgentAlerts.length > 3 && (
                  <span className="text-[10px] text-foreground-dim shrink-0">
                    +{urgentAlerts.length - 3} alertas
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* READINESS OVERVIEW                                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-border/60">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <p className="text-[11px] text-foreground-muted">Total</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{totalDocs}</p>
          <p className="text-[10px] text-foreground-dim hidden sm:block">documentos cadastrados</p>
        </div>

        <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-border/60">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
            </div>
            <p className="text-[11px] text-foreground-muted">Prontos</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-success">{readyDocs}</p>
          <div className="mt-1 h-1.5 rounded-full bg-border/40">
            <div
              className="h-1.5 rounded-full bg-success transition-all"
              style={{ width: `${overallReadiness}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-border/60">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-error/10">
              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-error" />
            </div>
            <p className="text-[11px] text-foreground-muted">Expirados</p>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${expiredCount > 0 ? "text-error" : "text-foreground"}`}>
            {expiredCount}
          </p>
          <p className="text-[10px] text-foreground-dim hidden sm:block">precisam renovacao</p>
        </div>

        <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm border border-border/60">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning" />
            </div>
            <p className="text-[11px] text-foreground-muted">Traducoes</p>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${pendingTranslations > 0 ? "text-warning" : "text-foreground"}`}>
            {pendingTranslations}
          </p>
          <p className="text-[10px] text-foreground-dim hidden sm:block">traducoes pendentes</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SEARCH & FILTERS                                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar documentos..."
            className="h-10 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
          />
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          {/* Person filter */}
          <select
            value={filterPerson}
            onChange={(e) => setFilterPerson(e.target.value)}
            className="h-10 rounded-xl border border-border bg-white px-3 text-xs text-foreground focus:border-primary focus:outline-none min-w-0 w-full sm:min-w-[120px] sm:w-auto"
          >
            <option value="all">Todos</option>
            {profiles.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.firstName || "Membro"}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 rounded-xl border border-border bg-white px-3 text-xs text-foreground focus:border-primary focus:outline-none min-w-0 w-full sm:min-w-[140px] sm:w-auto"
          >
            <option value="all">Todos os status</option>
            <option value="NOT_STARTED">Nao Iniciado</option>
            <option value="GATHERING">Reunindo</option>
            <option value="SUBMITTED">Submetido</option>
            <option value="APPROVED">Aprovado</option>
            <option value="EXPIRED">Expirado</option>
            <option value="NEEDS_UPDATE">Atualizar</option>
            <option value="EXPIRING">Expirando (90 dias)</option>
            <option value="NEEDS_TRANSLATION">Precisa Traducao</option>
          </select>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ADD DOCUMENT MODAL                                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      {showAddForm && (
        <AddDocumentModal
          profiles={profiles}
          newDoc={newDoc}
          setNewDoc={setNewDoc}
          onClose={() => { setShowAddForm(false); setUploadedFileName(""); }}
          onCreate={handleCreateDocument}
          onFileUpload={handleFileUpload}
          isCreating={isCreating}
          uploadingFile={uploadingFile}
          uploadedFileName={uploadedFileName}
          statusConfig={statusConfig}
          typeLabels={typeLabels}
        />
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CATEGORY READINESS OVERVIEW                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
        <h2 className="text-sm font-bold text-foreground mb-4">Preparo por Categoria</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {categoryReadiness.map((cr) => {
            const IconComp = CATEGORY_ICONS[cr.category.icon] || FileText;
            const hasIssues = cr.expiredDocs > 0 || cr.pendingTranslation > 0;
            return (
              <button
                key={cr.category.id}
                onClick={() => toggleCategory(cr.category.id)}
                className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all hover:shadow-sm ${
                  expandedCategories.has(cr.category.id)
                    ? "bg-surface ring-1 ring-primary/20"
                    : "bg-surface/50 hover:bg-surface"
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cr.category.bgColor}`}>
                  <IconComp className={`h-4 w-4 ${cr.category.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {cr.category.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-foreground-dim">
                      {cr.totalDocs} doc{cr.totalDocs !== 1 ? "s" : ""}
                    </span>
                    {cr.totalDocs > 0 && (
                      <div className="flex-1 h-1 rounded-full bg-border/40 max-w-[60px]">
                        <div
                          className={`h-1 rounded-full transition-all ${
                            cr.readinessPercent === 100 ? "bg-success" :
                            cr.readinessPercent > 0 ? "bg-primary" : "bg-border"
                          }`}
                          style={{ width: `${cr.readinessPercent}%` }}
                        />
                      </div>
                    )}
                    {hasIssues && (
                      <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DOCUMENTS BY CATEGORY                                      */}
      {/* ══════════════════════════════════════════════════════════ */}
      {totalDocs > 0 ? (
        <div className="space-y-3">
          {categoryReadiness.map((cr) => {
            const IconComp = CATEGORY_ICONS[cr.category.icon] || FileText;
            const isExpanded = expandedCategories.has(cr.category.id);
            const catDocs = filteredDocs.filter((d) => {
              const TYPE_TO_CAT: Record<string, string> = {
                PASSPORT: "IDENTITY", BIRTH_CERTIFICATE: "IDENTITY", MARRIAGE_CERTIFICATE: "IDENTITY",
                DIPLOMA: "EDUCATION", TRANSCRIPT: "EDUCATION", ECA: "EDUCATION",
                IELTS_RESULT: "LANGUAGE", CELPIP_RESULT: "LANGUAGE", TEF_RESULT: "LANGUAGE",
                EMPLOYMENT_LETTER: "PROFESSIONAL", REFERENCE_LETTER: "PROFESSIONAL",
                PROOF_OF_FUNDS: "FINANCIAL",
                POLICE_CLEARANCE: "LEGAL_MEDICAL", MEDICAL_EXAM: "LEGAL_MEDICAL",
                PHOTOS: "SUPPORTING", OTHER: "SUPPORTING",
              };
              return (TYPE_TO_CAT[d.type] || "SUPPORTING") === cr.category.id;
            });

            if (catDocs.length === 0 && !isExpanded) return null;

            return (
              <div key={cr.category.id} className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cr.category.id)}
                  className="flex w-full items-center gap-3 p-4 hover:bg-surface/30 transition-colors"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cr.category.bgColor}`}>
                    <IconComp className={`h-4 w-4 ${cr.category.color}`} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">{cr.category.name}</p>
                    <p className="text-[10px] text-foreground-dim">{cr.category.description}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {cr.readyDocs > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        {cr.readyDocs} pronto{cr.readyDocs !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className="rounded-full bg-surface px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-medium text-foreground-muted">
                      {catDocs.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-foreground-dim" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-foreground-dim" />
                    )}
                  </div>
                </button>

                {/* Expanded document list */}
                {isExpanded && (
                  <div className="border-t border-border/40 px-4 pb-4">
                    {catDocs.length > 0 ? (
                      <div className="space-y-2 pt-3">
                        {catDocs.map((doc: any) => {
                          const config = statusConfig[doc.status] || statusConfig.NOT_STARTED;
                          const StatusIcon = config.icon;
                          const profile = profileMap.get(doc.profileId);
                          const isExpired = doc.status === "EXPIRED" ||
                            (doc.expiryDate && new Date(doc.expiryDate) < new Date());
                          const daysLeft = doc.expiryDate
                            ? Math.ceil((new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                            : null;

                          return (
                            <div
                              key={doc.id}
                              className={`flex items-center gap-3 rounded-xl p-3 transition-all hover:shadow-sm cursor-pointer ${
                                isExpired ? "bg-error/[0.03] border border-error/10" : "bg-surface/50 hover:bg-surface"
                              }`}
                              onClick={() => setEditingDoc(editingDoc?.id === doc.id ? null : doc)}
                            >
                              {/* Status icon */}
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                                <StatusIcon className={`h-4 w-4 ${config.color}`} />
                              </div>

                              {/* Doc info */}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {doc.name || typeLabels[doc.type] || doc.type}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <span className={`text-[10px] font-medium ${config.color}`}>
                                    {config.label}
                                  </span>
                                  {doc.expiryDate && (
                                    <span className={`flex items-center gap-0.5 text-[10px] ${
                                      isExpired ? "text-error font-semibold" :
                                      daysLeft !== null && daysLeft <= 90 ? "text-warning" : "text-foreground-dim"
                                    }`}>
                                      <Calendar className="h-2.5 w-2.5" />
                                      {isExpired
                                        ? "Expirado"
                                        : daysLeft !== null && daysLeft <= 90
                                          ? `${daysLeft}d restantes`
                                          : new Date(doc.expiryDate).toLocaleDateString("pt-BR")}
                                    </span>
                                  )}
                                  {doc.translationRequired && !doc.translationCompleted && (
                                    <span className="flex items-center gap-0.5 text-[10px] text-warning">
                                      <Globe className="h-2.5 w-2.5" />
                                      Traducao pendente
                                    </span>
                                  )}
                                  {doc.translationCompleted && (
                                    <span className="flex items-center gap-0.5 text-[10px] text-success">
                                      <Globe className="h-2.5 w-2.5" />
                                      Traduzido
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Person avatar */}
                              {profile && (
                                <div className="shrink-0">
                                  {profile.user?.image ? (
                                    <img
                                      src={profile.user.image}
                                      alt={profile.firstName || ""}
                                      className="h-7 w-7 rounded-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${
                                      profile.isPrimaryApplicant ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                                    }`}>
                                      {profile.firstName?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="py-4 text-center text-xs text-foreground-dim">
                        Nenhum documento nesta categoria
                        {(searchQuery || filterPerson !== "all" || filterStatus !== "all") && " com os filtros atuais"}.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm border border-border/60">
          <EmptyStateIllustration width={130} className="mb-4" />
          <p className="mb-1 text-base font-medium text-foreground">
            Nenhum documento cadastrado
          </p>
          <p className="text-sm text-foreground-muted mb-4">
            Comece adicionando seus documentos para acompanhar o progresso.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light"
          >
            <Plus className="h-4 w-4" />
            Adicionar Primeiro Documento
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MISSING DOCUMENTS CHECKLIST                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      {missingDocs.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-1">Documentos Recomendados</h2>
          <p className="text-[10px] text-foreground-dim mb-4">
            Documentos que voce pode precisar e ainda nao foram cadastrados.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {missingDocs.slice(0, 8).map((item) => (
              <div
                key={item.doc.type}
                className="flex items-center gap-3 rounded-xl bg-surface/50 p-3 hover:bg-surface transition-colors"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                  <BookOpen className="h-3.5 w-3.5 text-warning" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">{item.doc.label}</p>
                  <p className="text-[10px] text-foreground-dim">{item.doc.description}</p>
                </div>
                <span className="text-[10px] text-foreground-dim shrink-0">
                  {item.existing}/{item.needed}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ALL ALERTS (non-urgent)                                    */}
      {/* ══════════════════════════════════════════════════════════ */}
      {alerts.filter((a) => a.level === "ATTENTION" || a.level === "INFO").length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-3">Lembretes e Atencao</h2>
          <div className="space-y-2">
            {alerts
              .filter((a) => a.level === "ATTENTION" || a.level === "INFO")
              .slice(0, 5)
              .map((alert, i) => {
                const style = alertStyles[alert.level];
                const AlertIcon = style.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl border ${style.border} ${style.bg} px-3 py-2.5`}
                  >
                    <AlertIcon className={`h-3.5 w-3.5 shrink-0 ${style.text}`} />
                    <p className="text-xs text-foreground flex-1">{alert.message}</p>
                    {alert.daysUntilExpiry && (
                      <span className={`text-[10px] font-semibold shrink-0 ${style.text}`}>
                        {alert.daysUntilExpiry}d
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* DOCUMENT DETAIL / EDIT MODAL                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      {editingDoc && (
        <DocumentDetailModal
          doc={editingDoc}
          profile={profileMap.get(editingDoc.profileId)}
          profiles={profiles}
          onClose={() => setEditingDoc(null)}
          onUpdate={handleUpdateDoc}
          onDelete={handleDeleteDoc}
          isUpdating={isUpdating}
          statusConfig={statusConfig}
          typeLabels={typeLabels}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// File Upload Drop Zone (shared)
// ════════════════════════════════════════════════════════════════

function FileDropZone({
  fileUrl,
  fileName,
  uploading,
  onFileSelect,
}: {
  fileUrl?: string;
  fileName?: string;
  uploading: boolean;
  onFileSelect: (file: File) => void;
}) {
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (fileUrl) {
    const isImage = fileUrl.match(/\.(jpg|jpeg|png|webp|heic)$/i);
    return (
      <div className="rounded-xl border border-success/20 bg-success/5 p-3">
        <div className="flex items-center gap-3">
          {isImage ? (
            <img src={fileUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground truncate">{fileName || "Arquivo anexado"}</p>
            <p className="text-[10px] text-success">Arquivo enviado com sucesso</p>
          </div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all ${
        dragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-surface/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,.heic"
        onChange={handleChange}
        className="hidden"
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-foreground-muted">Enviando arquivo...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-6 w-6 text-foreground-dim" />
          <p className="text-xs text-foreground-muted">
            Arraste um arquivo ou <span className="text-primary font-medium">clique para selecionar</span>
          </p>
          <p className="text-[10px] text-foreground-dim">PDF, JPG, PNG ou WebP (max 10MB)</p>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Add Document Modal
// ════════════════════════════════════════════════════════════════

function AddDocumentModal({
  profiles,
  newDoc,
  setNewDoc,
  onClose,
  onCreate,
  onFileUpload,
  isCreating,
  uploadingFile,
  uploadedFileName,
  statusConfig: sc,
  typeLabels: tl,
}: {
  profiles: any[];
  newDoc: any;
  setNewDoc: (doc: any) => void;
  onClose: () => void;
  onCreate: () => void;
  onFileUpload: (file: File) => Promise<string | null>;
  isCreating: boolean;
  uploadingFile: boolean;
  uploadedFileName: string;
  statusConfig: typeof statusConfig;
  typeLabels: typeof typeLabels;
}) {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleFile = async (file: File) => {
    const url = await onFileUpload(file);
    if (url) {
      setNewDoc({ ...newDoc, fileUrl: url });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-xl rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border/40 p-4 sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-foreground">Novo Documento</h3>
            <p className="text-xs text-foreground-dim">Preencha os dados e anexe o arquivo</p>
          </div>
          <button onClick={onClose} className="text-foreground-dim hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* File upload zone */}
          <FileDropZone
            fileUrl={newDoc.fileUrl}
            fileName={uploadedFileName}
            uploading={uploadingFile}
            onFileSelect={handleFile}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Nome do Documento</label>
              <input
                type="text"
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
                placeholder="Ex: Passaporte Rafael"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Tipo</label>
              <select
                value={newDoc.type}
                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {Object.entries(tl).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Responsavel</label>
              <select
                value={newDoc.profileId}
                onChange={(e) => setNewDoc({ ...newDoc, profileId: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {profiles.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Status</label>
              <select
                value={newDoc.status}
                onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {Object.entries(sc).map(([value, cfg]) => (
                  <option key={value} value={value}>{cfg.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Data de Emissao</label>
              <input
                type="date"
                value={newDoc.issueDate}
                onChange={(e) => setNewDoc({ ...newDoc, issueDate: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Data de Validade</label>
              <input
                type="date"
                value={newDoc.expiryDate}
                onChange={(e) => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Idioma Original</label>
              <select
                value={newDoc.originalLanguage}
                onChange={(e) => setNewDoc({ ...newDoc, originalLanguage: e.target.value })}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Portugues">Portugues</option>
                <option value="Ingles">Ingles</option>
                <option value="Frances">Frances</option>
                <option value="Espanhol">Espanhol</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newDoc.translationRequired}
                  onChange={(e) => setNewDoc({ ...newDoc, translationRequired: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground">Precisa de traducao juramentada</span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground-muted">Notas</label>
            <input
              type="text"
              value={newDoc.notes}
              onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none caret-primary"
              placeholder="Observacoes opcionais"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border/40 p-5">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onCreate}
            disabled={isCreating || !newDoc.name}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light disabled:opacity-50"
          >
            {isCreating ? "Salvando..." : "Salvar Documento"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Document Detail Modal
// ════════════════════════════════════════════════════════════════

function DocumentDetailModal({
  doc,
  profile,
  profiles,
  onClose,
  onUpdate,
  onDelete,
  isUpdating,
  statusConfig: sc,
  typeLabels: tl,
}: {
  doc: any;
  profile: any;
  profiles: any[];
  onClose: () => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  statusConfig: typeof statusConfig;
  typeLabels: typeof typeLabels;
}) {
  const [status, setStatus] = React.useState(doc.status);
  const [notes, setNotes] = React.useState(doc.notes || "");
  const [expiryDate, setExpiryDate] = React.useState(
    doc.expiryDate ? new Date(doc.expiryDate).toISOString().split("T")[0] : ""
  );
  const [issueDate, setIssueDate] = React.useState(
    doc.issueDate ? new Date(doc.issueDate).toISOString().split("T")[0] : ""
  );
  const [translationRequired, setTranslationRequired] = React.useState(doc.translationRequired);
  const [translationCompleted, setTranslationCompleted] = React.useState(doc.translationCompleted);
  const [usedInApplication, setUsedInApplication] = React.useState(doc.usedInApplication);
  const [fileUrl, setFileUrl] = React.useState(doc.fileUrl || "");
  const [uploadingFile, setUploadingFile] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleFileSelect = async (file: File) => {
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setFileUrl(data.url);
      }
    } catch {
      // Error
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSave = () => {
    onUpdate(doc.id, {
      status,
      notes: notes || undefined,
      expiryDate: expiryDate || undefined,
      issueDate: issueDate || undefined,
      translationRequired,
      translationCompleted,
      usedInApplication,
      fileUrl: fileUrl || undefined,
    });
  };

  const config = sc[status] || sc.NOT_STARTED;
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-lg rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border/40 p-4 sm:p-5">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
            <StatusIcon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-foreground truncate">
              {doc.name || tl[doc.type]}
            </h3>
            <p className="text-xs text-foreground-dim">
              {tl[doc.type]} &middot; {profile?.firstName || "Desconhecido"}
            </p>
          </div>
          <button onClick={onClose} className="text-foreground-dim hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* File upload/preview */}
          <FileDropZone
            fileUrl={fileUrl}
            fileName={doc.name}
            uploading={uploadingFile}
            onFileSelect={handleFileSelect}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {Object.entries(sc).map(([v, c]) => (
                  <option key={v} value={v}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Data de Emissao</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground-muted">Data de Validade</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={translationRequired}
                  onChange={(e) => setTranslationRequired(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground">Precisa traducao</span>
              </label>
              {translationRequired && (
                <label className="flex items-center gap-2 cursor-pointer ml-6">
                  <input
                    type="checkbox"
                    checked={translationCompleted}
                    onChange={(e) => setTranslationCompleted(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-success focus:ring-success"
                  />
                  <span className="text-xs text-foreground">Traducao concluida</span>
                </label>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={usedInApplication}
              onChange={(e) => setUsedInApplication(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-xs text-foreground">Ja utilizado em uma aplicacao</span>
          </label>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground-muted">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none caret-primary resize-none"
              placeholder="Observacoes sobre este documento..."
            />
          </div>

          {doc.originalLanguage && (
            <div className="flex items-center gap-2 text-xs text-foreground-dim">
              <Globe className="h-3.5 w-3.5" />
              Idioma original: {doc.originalLanguage}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/40 p-5">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-error">Confirmar exclusao?</span>
              <button
                onClick={() => onDelete(doc.id)}
                className="rounded-lg bg-error px-3 py-1.5 text-xs font-medium text-white hover:bg-error/90"
              >
                Sim, excluir
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-foreground-muted hover:text-foreground"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1 text-xs text-foreground-dim hover:text-error transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary-light disabled:opacity-50"
          >
            {isUpdating ? "Salvando..." : "Salvar Alteracoes"}
          </button>
        </div>
      </div>
    </div>
  );
}
