// ════════════════════════════════════════════
// Journey Templates — Phases & Steps per Program
// ════════════════════════════════════════════

export interface JourneyStepTemplate {
  title: string;
  description: string;
  instructions?: string;
  estimatedDays?: number;
  assignTo: "primary" | "secondary" | "both";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface JourneyPhaseTemplate {
  name: string;
  description: string;
  estimatedDurationDays: number;
  steps: JourneyStepTemplate[];
}

export interface JourneyTemplate {
  programCode: string;
  phases: JourneyPhaseTemplate[];
}

const expressEntryTemplate: JourneyPhaseTemplate[] = [
  {
    name: "Pesquisa e Decisão",
    description: "Analisar programas e decidir o melhor caminho",
    estimatedDurationDays: 30,
    steps: [
      { title: "Pesquisar programas de imigração disponíveis", description: "Estudar Express Entry, PNPs e outros programas", assignTo: "both", priority: "HIGH" },
      { title: "Calcular CRS score inicial", description: "Usar o simulador para calcular score de cada cônjuge", assignTo: "both", priority: "HIGH" },
      { title: "Definir quem será o aplicante principal", description: "Comparar scores e decidir o melhor aplicante", assignTo: "both", priority: "HIGH" },
      { title: "Definir Planos A, B e C", description: "Eleger programas principal, secundário e terciário", assignTo: "both", priority: "MEDIUM" },
    ],
  },
  {
    name: "Análise de Perfil e Elegibilidade",
    description: "Verificar requisitos e elegibilidade para o programa",
    estimatedDurationDays: 21,
    steps: [
      { title: "Verificar elegibilidade no programa escolhido", description: "Conferir todos os requisitos mínimos", assignTo: "primary", priority: "HIGH" },
      { title: "Identificar NOC code da ocupação", description: "Encontrar o código NOC correto para sua profissão", assignTo: "both", priority: "HIGH" },
      { title: "Verificar requisito de fundos mínimos", description: "Conferir proof of funds necessário", assignTo: "primary", priority: "MEDIUM" },
    ],
  },
  {
    name: "Preparação de Requisitos",
    description: "IELTS, ECA, documentos — preparação completa",
    estimatedDurationDays: 180,
    steps: [
      { title: "Agendar IELTS/CELPIP", description: "Agendar teste de inglês", assignTo: "primary", priority: "CRITICAL" },
      { title: "Agendar IELTS/CELPIP (cônjuge)", description: "Agendar teste de inglês do cônjuge", assignTo: "secondary", priority: "HIGH" },
      { title: "Estudar para teste de inglês", description: "Meta: CLB 7+ em todas as bandas", assignTo: "primary", priority: "HIGH" },
      { title: "Estudar para teste de inglês (cônjuge)", description: "Meta: CLB 7+ em todas as bandas", assignTo: "secondary", priority: "HIGH" },
      { title: "Realizar teste de inglês", description: "Fazer o IELTS/CELPIP", assignTo: "primary", priority: "CRITICAL" },
      { title: "Realizar teste de inglês (cônjuge)", description: "Fazer o IELTS/CELPIP", assignTo: "secondary", priority: "HIGH" },
      { title: "Solicitar ECA via WES", description: "Educational Credential Assessment pelo WES", assignTo: "primary", priority: "CRITICAL", estimatedDays: 60 },
      { title: "Solicitar ECA via WES (cônjuge)", description: "ECA do cônjuge", assignTo: "secondary", priority: "HIGH", estimatedDays: 60 },
      { title: "Traduzir documentos", description: "Certidões, diplomas — tradução juramentada", assignTo: "both", priority: "HIGH" },
      { title: "Reunir cartas de emprego", description: "Reference letters dos empregadores", assignTo: "both", priority: "MEDIUM" },
      { title: "Juntar proof of funds", description: "Extratos bancários dos últimos 6 meses", assignTo: "primary", priority: "HIGH" },
    ],
  },
  {
    name: "Criação do Express Entry Profile",
    description: "Criar perfil no sistema Express Entry do IRCC",
    estimatedDurationDays: 14,
    steps: [
      { title: "Criar conta no IRCC GCKey", description: "Acessar ircc.canada.ca e criar conta", assignTo: "primary", priority: "CRITICAL" },
      { title: "Preencher Express Entry Profile", description: "Inserir todos os dados no sistema", assignTo: "primary", priority: "CRITICAL" },
      { title: "Submeter perfil no pool", description: "Entrar no pool de candidatos", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Aguardar ITA",
    description: "Invitation to Apply — aguardar convite do IRCC",
    estimatedDurationDays: 180,
    steps: [
      { title: "Monitorar draws do Express Entry", description: "Acompanhar rodadas de convites e CRS mínimo", assignTo: "primary", priority: "MEDIUM" },
      { title: "Melhorar CRS se necessário", description: "Buscar formas de aumentar o score", assignTo: "both", priority: "MEDIUM" },
      { title: "Receber ITA", description: "Invitation to Apply recebido!", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Submissão da Aplicação",
    description: "Preparar e submeter aplicação completa (60 dias após ITA)",
    estimatedDurationDays: 60,
    steps: [
      { title: "Reunir todos os documentos finais", description: "Checklist completo de documentos para submissão", assignTo: "both", priority: "CRITICAL" },
      { title: "Exame médico (IME)", description: "Agendar e realizar exame médico com médico designado", assignTo: "both", priority: "CRITICAL" },
      { title: "Certidão de antecedentes criminais", description: "Police clearance de todos os países onde morou 6+ meses", assignTo: "both", priority: "CRITICAL" },
      { title: "Pagar taxas de processamento", description: "Taxas do IRCC para aplicação", assignTo: "primary", priority: "CRITICAL" },
      { title: "Submeter aplicação completa", description: "Upload de todos os documentos e submissão", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Processamento e Aguardo",
    description: "IRCC processa a aplicação — biometrics, background check",
    estimatedDurationDays: 210,
    steps: [
      { title: "Biometrics (se solicitado)", description: "Coletar biometrics no VAC mais próximo", assignTo: "both", priority: "HIGH" },
      { title: "Aguardar background check", description: "Verificação de antecedentes pelo IRCC", assignTo: "primary", priority: "LOW" },
      { title: "Responder requests adicionais (se houver)", description: "IRCC pode solicitar documentos extras", assignTo: "both", priority: "HIGH" },
      { title: "Receber COPR (Confirmation of PR)", description: "Permanent Residence confirmada!", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Landing no Canadá",
    description: "Chegar ao Canadá e ativar status de PR",
    estimatedDurationDays: 90,
    steps: [
      { title: "Planejar mudança", description: "Organizar logística de mudança para o Canadá", assignTo: "both", priority: "HIGH" },
      { title: "Landing como Permanent Resident", description: "Entrada oficial no Canadá como PR", assignTo: "both", priority: "CRITICAL" },
      { title: "Receber PR Card", description: "Cartão de Permanent Resident chegará pelo correio", assignTo: "primary", priority: "MEDIUM" },
      { title: "Obter SIN (Social Insurance Number)", description: "Necessário para trabalhar no Canadá", assignTo: "both", priority: "HIGH" },
    ],
  },
  {
    name: "Estabelecimento",
    description: "Primeiros meses no Canadá — moradia, trabalho, adaptação",
    estimatedDurationDays: 365,
    steps: [
      { title: "Encontrar moradia", description: "Aluguel ou compra de imóvel", assignTo: "both", priority: "HIGH" },
      { title: "Abrir conta bancária", description: "Conta em banco canadense", assignTo: "both", priority: "HIGH" },
      { title: "Obter health card provincial", description: "Cartão de saúde da província", assignTo: "both", priority: "HIGH" },
      { title: "Buscar emprego", description: "Procurar trabalho na área", assignTo: "both", priority: "HIGH" },
    ],
  },
  {
    name: "Cidadania Canadense",
    description: "Após 3 anos como PR, solicitar cidadania",
    estimatedDurationDays: 1095,
    steps: [
      { title: "Completar 1095 dias de residência", description: "3 dos últimos 5 anos como PR no Canadá", assignTo: "both", priority: "MEDIUM" },
      { title: "Preparar para Citizenship Test", description: "Estudar para prova de cidadania", assignTo: "both", priority: "MEDIUM" },
      { title: "Submeter aplicação de cidadania", description: "Aplicar para cidadania canadense", assignTo: "both", priority: "HIGH" },
      { title: "Citizenship Test & Ceremony", description: "Prova e cerimônia de cidadania!", assignTo: "both", priority: "CRITICAL" },
    ],
  },
];

const spousalTemplate: JourneyPhaseTemplate[] = [
  {
    name: "Preparação da Aplicação",
    description: "Reunir documentos e preparar a aplicação de sponsorship",
    estimatedDurationDays: 60,
    steps: [
      { title: "Verificar elegibilidade do sponsor", description: "Confirmar que o sponsor atende requisitos", assignTo: "primary", priority: "CRITICAL" },
      { title: "Reunir provas de relacionamento", description: "Fotos, mensagens, viagens juntos", assignTo: "both", priority: "HIGH" },
      { title: "Certidão de casamento ou união estável", description: "Documento oficial do relacionamento", assignTo: "both", priority: "CRITICAL" },
      { title: "Preencher formulários IMM", description: "Formulários de sponsorship do IRCC", assignTo: "both", priority: "CRITICAL" },
      { title: "Exame médico", description: "IME para o aplicante", assignTo: "secondary", priority: "HIGH" },
      { title: "Certidão de antecedentes", description: "Police clearance", assignTo: "both", priority: "HIGH" },
    ],
  },
  {
    name: "Submissão e Processamento",
    description: "Enviar aplicação e aguardar processamento",
    estimatedDurationDays: 365,
    steps: [
      { title: "Submeter aplicação de sponsorship", description: "Enviar pacote completo ao IRCC", assignTo: "primary", priority: "CRITICAL" },
      { title: "Receber AOR (Acknowledgement of Receipt)", description: "Confirmação de recebimento do IRCC", assignTo: "primary", priority: "MEDIUM" },
      { title: "Aguardar processamento", description: "Tempo estimado: 12 meses", assignTo: "both", priority: "LOW" },
      { title: "Receber aprovação", description: "Sponsorship aprovado!", assignTo: "both", priority: "CRITICAL" },
    ],
  },
];

const templates: Record<string, JourneyPhaseTemplate[]> = {
  EXPRESS_ENTRY_FSWP: expressEntryTemplate,
  EXPRESS_ENTRY_CEC: expressEntryTemplate,
  EXPRESS_ENTRY_FST: expressEntryTemplate,
  EXPRESS_ENTRY_HEALTHCARE: expressEntryTemplate,
  EXPRESS_ENTRY_STEM: expressEntryTemplate,
  PNP_ONTARIO: expressEntryTemplate,
  PNP_BC: expressEntryTemplate,
  PNP_ALBERTA: expressEntryTemplate,
  SPOUSAL_INLAND: spousalTemplate,
  SPOUSAL_OUTLAND: spousalTemplate,
  RCIP: expressEntryTemplate,
  AIP: expressEntryTemplate,
  STUDY_PGWP: expressEntryTemplate,
};

export function getJourneyTemplate(programCode: string): JourneyPhaseTemplate[] {
  return templates[programCode] || expressEntryTemplate;
}
