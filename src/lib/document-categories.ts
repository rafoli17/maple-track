/**
 * Document Categories & Intelligence System
 *
 * Maps document types to immigration journey categories,
 * computes readiness per category, and generates smart alerts.
 */

// ════════════════════════════════════════════════════════════════
// Category definitions
// ════════════════════════════════════════════════════════════════

export type DocumentCategory =
  | "IDENTITY"
  | "EDUCATION"
  | "LANGUAGE"
  | "PROFESSIONAL"
  | "FINANCIAL"
  | "LEGAL_MEDICAL"
  | "IMMIGRATION_FORMS"
  | "TRANSLATIONS"
  | "SUPPORTING";

export interface CategoryDefinition {
  id: DocumentCategory;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class
  bgColor: string;
  expectedTypes: string[]; // document types that belong here
  journeyStage: string; // related macro milestone
}

export const DOCUMENT_CATEGORIES: CategoryDefinition[] = [
  {
    id: "IDENTITY",
    name: "Identidade Pessoal",
    description: "Passaportes, certidoes e documentos de identificacao",
    icon: "UserCheck",
    color: "text-primary",
    bgColor: "bg-primary/10",
    expectedTypes: ["PASSPORT", "BIRTH_CERTIFICATE", "MARRIAGE_CERTIFICATE"],
    journeyStage: "submission",
  },
  {
    id: "EDUCATION",
    name: "Educacao",
    description: "Diplomas, historicos e avaliacao de credenciais",
    icon: "GraduationCap",
    color: "text-accent",
    bgColor: "bg-accent/10",
    expectedTypes: ["DIPLOMA", "TRANSCRIPT", "ECA"],
    journeyStage: "eca",
  },
  {
    id: "LANGUAGE",
    name: "Testes de Idioma",
    description: "Resultados IELTS, CELPIP e TEF",
    icon: "Languages",
    color: "text-info",
    bgColor: "bg-info/10",
    expectedTypes: ["IELTS_RESULT", "CELPIP_RESULT", "TEF_RESULT"],
    journeyStage: "language_tests",
  },
  {
    id: "PROFESSIONAL",
    name: "Experiencia Profissional",
    description: "Cartas de emprego e referencias",
    icon: "Briefcase",
    color: "text-success",
    bgColor: "bg-success/10",
    expectedTypes: ["EMPLOYMENT_LETTER", "REFERENCE_LETTER"],
    journeyStage: "submission",
  },
  {
    id: "FINANCIAL",
    name: "Comprovantes Financeiros",
    description: "Proof of funds e extratos",
    icon: "DollarSign",
    color: "text-warning",
    bgColor: "bg-warning/10",
    expectedTypes: ["PROOF_OF_FUNDS"],
    journeyStage: "submission",
  },
  {
    id: "LEGAL_MEDICAL",
    name: "Legal e Medico",
    description: "Antecedentes criminais e exames medicos",
    icon: "Shield",
    color: "text-error",
    bgColor: "bg-error/10",
    expectedTypes: ["POLICE_CLEARANCE", "MEDICAL_EXAM"],
    journeyStage: "visa",
  },
  {
    id: "SUPPORTING",
    name: "Evidencias de Apoio",
    description: "Fotos e outros documentos complementares",
    icon: "Paperclip",
    color: "text-foreground-muted",
    bgColor: "bg-surface",
    expectedTypes: ["PHOTOS", "OTHER"],
    journeyStage: "submission",
  },
];

// ════════════════════════════════════════════════════════════════
// Type → Category mapping
// ════════════════════════════════════════════════════════════════

const TYPE_TO_CATEGORY: Record<string, DocumentCategory> = {};
for (const cat of DOCUMENT_CATEGORIES) {
  for (const t of cat.expectedTypes) {
    TYPE_TO_CATEGORY[t] = cat.id;
  }
}

export function getCategoryForType(type: string): DocumentCategory {
  return TYPE_TO_CATEGORY[type] || "SUPPORTING";
}

export function getCategoryDef(id: DocumentCategory): CategoryDefinition {
  return DOCUMENT_CATEGORIES.find((c) => c.id === id) || DOCUMENT_CATEGORIES[DOCUMENT_CATEGORIES.length - 1];
}

// ════════════════════════════════════════════════════════════════
// Document alerts
// ════════════════════════════════════════════════════════════════

export type AlertLevel = "INFO" | "ATTENTION" | "URGENT" | "EXPIRED";

export interface DocumentAlert {
  level: AlertLevel;
  title: string;
  message: string;
  documentId?: string;
  documentName?: string;
  category: DocumentCategory;
  daysUntilExpiry?: number;
}

const ALERT_COLORS: Record<AlertLevel, { bg: string; border: string; text: string; icon: string }> = {
  INFO: { bg: "bg-info/5", border: "border-info/15", text: "text-info", icon: "Info" },
  ATTENTION: { bg: "bg-warning/5", border: "border-warning/15", text: "text-warning", icon: "AlertTriangle" },
  URGENT: { bg: "bg-error/5", border: "border-error/15", text: "text-error", icon: "AlertCircle" },
  EXPIRED: { bg: "bg-error/10", border: "border-error/25", text: "text-error", icon: "XCircle" },
};

export function getAlertStyle(level: AlertLevel) {
  return ALERT_COLORS[level];
}

/**
 * Generate smart alerts from documents.
 * Considers expiry dates, missing translations, and missing documents.
 */
export function generateDocumentAlerts(docs: any[]): DocumentAlert[] {
  const alerts: DocumentAlert[] = [];
  const now = new Date();

  for (const doc of docs) {
    const category = getCategoryForType(doc.type);

    // Expired documents
    if (doc.status === "EXPIRED" || (doc.expiryDate && new Date(doc.expiryDate) < now)) {
      alerts.push({
        level: "EXPIRED",
        title: "Documento expirado",
        message: `${doc.name} expirou e precisa ser renovado.`,
        documentId: doc.id,
        documentName: doc.name,
        category,
      });
      continue;
    }

    // Expiring soon
    if (doc.expiryDate) {
      const daysLeft = Math.ceil(
        (new Date(doc.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysLeft <= 30) {
        alerts.push({
          level: "URGENT",
          title: "Expira em breve",
          message: `${doc.name} expira em ${daysLeft} dia${daysLeft === 1 ? "" : "s"}.`,
          documentId: doc.id,
          documentName: doc.name,
          category,
          daysUntilExpiry: daysLeft,
        });
      } else if (daysLeft <= 90) {
        alerts.push({
          level: "ATTENTION",
          title: "Atencao a validade",
          message: `${doc.name} expira em ${daysLeft} dias. Planeje a renovacao.`,
          documentId: doc.id,
          documentName: doc.name,
          category,
          daysUntilExpiry: daysLeft,
        });
      } else if (daysLeft <= 180) {
        alerts.push({
          level: "INFO",
          title: "Validade futura",
          message: `${doc.name} expira em ${Math.round(daysLeft / 30)} meses.`,
          documentId: doc.id,
          documentName: doc.name,
          category,
          daysUntilExpiry: daysLeft,
        });
      }
    }

    // Missing translation
    if (doc.translationRequired && !doc.translationCompleted) {
      alerts.push({
        level: "ATTENTION",
        title: "Traducao pendente",
        message: `${doc.name} precisa de traducao juramentada.`,
        documentId: doc.id,
        documentName: doc.name,
        category,
      });
    }
  }

  // Sort by severity: EXPIRED > URGENT > ATTENTION > INFO
  const levelOrder: Record<AlertLevel, number> = { EXPIRED: 0, URGENT: 1, ATTENTION: 2, INFO: 3 };
  alerts.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);

  return alerts;
}

// ════════════════════════════════════════════════════════════════
// Category readiness
// ════════════════════════════════════════════════════════════════

export interface CategoryReadiness {
  category: CategoryDefinition;
  totalDocs: number;
  readyDocs: number; // SUBMITTED or APPROVED
  expiredDocs: number;
  pendingTranslation: number;
  readinessPercent: number;
  docs: any[];
}

export function computeCategoryReadiness(
  docs: any[],
  categories: CategoryDefinition[] = DOCUMENT_CATEGORIES
): CategoryReadiness[] {
  return categories.map((cat) => {
    const catDocs = docs.filter((d) => getCategoryForType(d.type) === cat.id);
    const readyDocs = catDocs.filter(
      (d) => d.status === "SUBMITTED" || d.status === "APPROVED"
    ).length;
    const expiredDocs = catDocs.filter((d) => {
      if (d.status === "EXPIRED") return true;
      if (d.expiryDate && new Date(d.expiryDate) < new Date()) return true;
      return false;
    }).length;
    const pendingTranslation = catDocs.filter(
      (d) => d.translationRequired && !d.translationCompleted
    ).length;

    // Readiness: approved is ideal, submitted is partial, rest counts as not ready
    const total = catDocs.length;
    const readinessPercent =
      total > 0 ? Math.round((readyDocs / total) * 100) : 0;

    return {
      category: cat,
      totalDocs: total,
      readyDocs,
      expiredDocs,
      pendingTranslation,
      readinessPercent,
      docs: catDocs,
    };
  });
}

// ════════════════════════════════════════════════════════════════
// Recommended documents checklist
// ════════════════════════════════════════════════════════════════

export interface RecommendedDoc {
  type: string;
  label: string;
  category: DocumentCategory;
  perPerson: boolean; // true = each person needs one
  description: string;
}

export const RECOMMENDED_DOCS: RecommendedDoc[] = [
  { type: "PASSPORT", label: "Passaporte", category: "IDENTITY", perPerson: true, description: "Valido por pelo menos 1 ano" },
  { type: "BIRTH_CERTIFICATE", label: "Certidao de Nascimento", category: "IDENTITY", perPerson: true, description: "Com traducao juramentada" },
  { type: "MARRIAGE_CERTIFICATE", label: "Certidao de Casamento", category: "IDENTITY", perPerson: false, description: "Se casado(a)" },
  { type: "DIPLOMA", label: "Diploma", category: "EDUCATION", perPerson: true, description: "Maior grau de escolaridade" },
  { type: "TRANSCRIPT", label: "Historico Escolar", category: "EDUCATION", perPerson: true, description: "Todas as notas e disciplinas" },
  { type: "ECA", label: "ECA (Avaliacao de Credenciais)", category: "EDUCATION", perPerson: true, description: "WES, IQAS ou equivalente" },
  { type: "IELTS_RESULT", label: "Resultado IELTS/CELPIP", category: "LANGUAGE", perPerson: true, description: "Valido por 2 anos" },
  { type: "EMPLOYMENT_LETTER", label: "Carta de Emprego", category: "PROFESSIONAL", perPerson: true, description: "Atual e anteriores" },
  { type: "REFERENCE_LETTER", label: "Carta de Referencia", category: "PROFESSIONAL", perPerson: true, description: "De empregadores anteriores" },
  { type: "PROOF_OF_FUNDS", label: "Comprovante de Fundos", category: "FINANCIAL", perPerson: false, description: "Extratos e declaracoes" },
  { type: "POLICE_CLEARANCE", label: "Antecedentes Criminais", category: "LEGAL_MEDICAL", perPerson: true, description: "De todos os paises resididos" },
  { type: "MEDICAL_EXAM", label: "Exame Medico", category: "LEGAL_MEDICAL", perPerson: true, description: "Com medico designado IRCC" },
  { type: "PHOTOS", label: "Fotos", category: "SUPPORTING", perPerson: true, description: "Padrao IRCC" },
];

/**
 * Find which recommended documents are missing for a set of profiles.
 */
export function findMissingDocs(
  existingDocs: any[],
  profileCount: number
): { doc: RecommendedDoc; existing: number; needed: number }[] {
  const missing: { doc: RecommendedDoc; existing: number; needed: number }[] = [];

  for (const rec of RECOMMENDED_DOCS) {
    const existing = existingDocs.filter((d) => d.type === rec.type).length;
    const needed = rec.perPerson ? profileCount : 1;

    if (existing < needed) {
      missing.push({ doc: rec, existing, needed });
    }
  }

  return missing;
}
