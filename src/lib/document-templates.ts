// ════════════════════════════════════════════
// Document Templates — Required docs per program
// ════════════════════════════════════════════

export interface DocumentTemplate {
  name: string;
  type: string;
  description: string;
  validityMonths?: number;
  perPerson: boolean;
}

const commonDocs: DocumentTemplate[] = [
  { name: "Passaporte", type: "PASSPORT", description: "Passaporte válido com pelo menos 1 ano de validade", validityMonths: 120, perPerson: true },
  { name: "Certidão de Nascimento", type: "BIRTH_CERTIFICATE", description: "Certidão de nascimento com tradução juramentada", perPerson: true },
  { name: "Certidão de Casamento", type: "MARRIAGE_CERTIFICATE", description: "Certidão de casamento ou união estável traduzida", perPerson: false },
  { name: "Fotos 2x2", type: "PHOTOS", description: "Fotos no padrão canadense para imigração", perPerson: true },
];

const expressEntryDocs: DocumentTemplate[] = [
  ...commonDocs,
  { name: "Diploma / Certificado", type: "DIPLOMA", description: "Diploma da maior escolaridade", perPerson: true },
  { name: "Histórico Escolar", type: "TRANSCRIPT", description: "Histórico escolar oficial", perPerson: true },
  { name: "ECA (WES)", type: "ECA", description: "Educational Credential Assessment via WES", validityMonths: 60, perPerson: true },
  { name: "Resultado IELTS/CELPIP", type: "IELTS_RESULT", description: "Resultado do teste de inglês", validityMonths: 24, perPerson: true },
  { name: "Certidão de Antecedentes", type: "POLICE_CLEARANCE", description: "Police clearance de todos os países onde morou 6+ meses", validityMonths: 12, perPerson: true },
  { name: "Exame Médico (IME)", type: "MEDICAL_EXAM", description: "Exame médico com painel médico designado pelo IRCC", validityMonths: 12, perPerson: true },
  { name: "Proof of Funds", type: "PROOF_OF_FUNDS", description: "Extratos bancários dos últimos 6 meses", perPerson: false },
  { name: "Carta de Emprego", type: "EMPLOYMENT_LETTER", description: "Carta do empregador confirmando cargo e tempo", perPerson: true },
  { name: "Cartas de Referência", type: "REFERENCE_LETTER", description: "Reference letters de empregadores anteriores", perPerson: true },
];

const spousalDocs: DocumentTemplate[] = [
  ...commonDocs,
  { name: "Provas de Relacionamento", type: "OTHER", description: "Fotos juntos, viagens, mensagens, contas conjuntas", perPerson: false },
  { name: "Certidão de Antecedentes", type: "POLICE_CLEARANCE", description: "Police clearance", validityMonths: 12, perPerson: true },
  { name: "Exame Médico (IME)", type: "MEDICAL_EXAM", description: "Exame médico", validityMonths: 12, perPerson: true },
  { name: "Proof of Funds do Sponsor", type: "PROOF_OF_FUNDS", description: "Comprovação financeira do sponsor", perPerson: false },
];

const templates: Record<string, DocumentTemplate[]> = {
  EXPRESS_ENTRY_FSWP: expressEntryDocs,
  EXPRESS_ENTRY_CEC: expressEntryDocs,
  EXPRESS_ENTRY_FST: expressEntryDocs,
  EXPRESS_ENTRY_HEALTHCARE: expressEntryDocs,
  EXPRESS_ENTRY_STEM: expressEntryDocs,
  PNP_ONTARIO: expressEntryDocs,
  PNP_BC: expressEntryDocs,
  PNP_ALBERTA: expressEntryDocs,
  SPOUSAL_INLAND: spousalDocs,
  SPOUSAL_OUTLAND: spousalDocs,
  RCIP: expressEntryDocs,
  AIP: expressEntryDocs,
  STUDY_PGWP: expressEntryDocs,
};

export function getDocumentChecklist(programCode: string): DocumentTemplate[] {
  return templates[programCode] || expressEntryDocs;
}
