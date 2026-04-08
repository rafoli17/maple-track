// ════════════════════════════════════════════
// Journey Templates — Phases & Steps per Program
// Each phase maps to a macro milestone via macroMilestoneId
// Each step can have an actionUrl to guide the user
// ════════════════════════════════════════════

import type { MacroMilestoneId } from "./macro-journey";

export interface JourneyStepTemplate {
  title: string;
  description: string;
  instructions?: string;
  estimatedDays?: number;
  assignTo: "primary" | "secondary" | "both";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  /** URL within the app to guide the user (e.g. /simulator, /languages) */
  actionUrl?: string;
}

export interface JourneyPhaseTemplate {
  name: string;
  description: string;
  estimatedDurationDays: number;
  macroMilestoneId: MacroMilestoneId;
  steps: JourneyStepTemplate[];
}

export interface JourneyTemplate {
  programCode: string;
  phases: JourneyPhaseTemplate[];
}

const expressEntryTemplate: JourneyPhaseTemplate[] = [
  {
    name: "Pesquisa e Decisao",
    description: "Analisar programas e decidir o melhor caminho",
    estimatedDurationDays: 30,
    macroMilestoneId: "research",
    steps: [
      { title: "Pesquisar programas de imigracao disponiveis", description: "Estudar Express Entry, PNPs e outros programas", assignTo: "both", priority: "HIGH", actionUrl: "/programs" },
      { title: "Calcular CRS score inicial", description: "Usar o simulador para calcular score de cada conjuge", assignTo: "both", priority: "HIGH", actionUrl: "/simulator" },
      { title: "Definir quem sera o aplicante principal", description: "Comparar scores e decidir o melhor aplicante", assignTo: "both", priority: "HIGH", actionUrl: "/simulator" },
      { title: "Definir Planos A, B e C", description: "Eleger programas principal, secundario e terciario", assignTo: "both", priority: "MEDIUM", actionUrl: "/programs" },
    ],
  },
  {
    name: "Analise de Perfil e Elegibilidade",
    description: "Verificar requisitos e elegibilidade para o programa",
    estimatedDurationDays: 21,
    macroMilestoneId: "research",
    steps: [
      { title: "Verificar elegibilidade no programa escolhido", description: "Conferir todos os requisitos minimos", assignTo: "primary", priority: "HIGH", actionUrl: "/programs" },
      { title: "Identificar NOC code da ocupacao", description: "Encontrar o codigo NOC correto para sua profissao", assignTo: "both", priority: "HIGH", actionUrl: "/settings" },
      { title: "Verificar requisito de fundos minimos", description: "Conferir proof of funds necessario", assignTo: "primary", priority: "MEDIUM" },
    ],
  },
  {
    name: "Testes de Idioma",
    description: "Agendar, estudar e realizar testes de ingles",
    estimatedDurationDays: 120,
    macroMilestoneId: "language_tests",
    steps: [
      { title: "Agendar IELTS/CELPIP", description: "Agendar teste de ingles", assignTo: "primary", priority: "CRITICAL", actionUrl: "/languages" },
      { title: "Agendar IELTS/CELPIP (conjuge)", description: "Agendar teste de ingles do conjuge", assignTo: "secondary", priority: "HIGH", actionUrl: "/languages" },
      { title: "Estudar para teste de ingles", description: "Meta: CLB 7+ em todas as bandas", assignTo: "primary", priority: "HIGH" },
      { title: "Estudar para teste de ingles (conjuge)", description: "Meta: CLB 7+ em todas as bandas", assignTo: "secondary", priority: "HIGH" },
      { title: "Realizar teste de ingles", description: "Fazer o IELTS/CELPIP e registrar resultado", assignTo: "primary", priority: "CRITICAL", actionUrl: "/languages" },
      { title: "Realizar teste de ingles (conjuge)", description: "Fazer o IELTS/CELPIP e registrar resultado", assignTo: "secondary", priority: "HIGH", actionUrl: "/languages" },
    ],
  },
  {
    name: "Avaliacao de Credenciais (ECA)",
    description: "ECA via WES, traducoes e documentos de suporte",
    estimatedDurationDays: 90,
    macroMilestoneId: "eca",
    steps: [
      { title: "Solicitar ECA via WES", description: "Educational Credential Assessment pelo WES", assignTo: "primary", priority: "CRITICAL", estimatedDays: 60, actionUrl: "/documents" },
      { title: "Solicitar ECA via WES (conjuge)", description: "ECA do conjuge", assignTo: "secondary", priority: "HIGH", estimatedDays: 60, actionUrl: "/documents" },
      { title: "Traduzir documentos", description: "Certidoes, diplomas — traducao juramentada", assignTo: "both", priority: "HIGH", actionUrl: "/documents" },
      { title: "Reunir cartas de emprego", description: "Reference letters dos empregadores", assignTo: "both", priority: "MEDIUM", actionUrl: "/documents" },
      { title: "Juntar proof of funds", description: "Extratos bancarios dos ultimos 6 meses", assignTo: "primary", priority: "HIGH", actionUrl: "/documents" },
    ],
  },
  {
    name: "Criacao do Express Entry Profile",
    description: "Criar perfil no sistema Express Entry do IRCC",
    estimatedDurationDays: 14,
    macroMilestoneId: "submission",
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
    macroMilestoneId: "approval",
    steps: [
      { title: "Monitorar draws do Express Entry", description: "Acompanhar rodadas de convites e CRS minimo", assignTo: "primary", priority: "MEDIUM", actionUrl: "/simulator" },
      { title: "Melhorar CRS se necessario", description: "Buscar formas de aumentar o score", assignTo: "both", priority: "MEDIUM", actionUrl: "/simulator" },
      { title: "Receber ITA", description: "Invitation to Apply recebido!", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Submissao da Aplicacao",
    description: "Preparar e submeter aplicacao completa (60 dias apos ITA)",
    estimatedDurationDays: 60,
    macroMilestoneId: "visa",
    steps: [
      { title: "Reunir todos os documentos finais", description: "Checklist completo de documentos para submissao", assignTo: "both", priority: "CRITICAL", actionUrl: "/documents" },
      { title: "Exame medico (IME)", description: "Agendar e realizar exame medico com medico designado", assignTo: "both", priority: "CRITICAL" },
      { title: "Certidao de antecedentes criminais", description: "Police clearance de todos os paises onde morou 6+ meses", assignTo: "both", priority: "CRITICAL", actionUrl: "/documents" },
      { title: "Pagar taxas de processamento", description: "Taxas do IRCC para aplicacao", assignTo: "primary", priority: "CRITICAL" },
      { title: "Submeter aplicacao completa", description: "Upload de todos os documentos e submissao", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Processamento e Aguardo",
    description: "IRCC processa a aplicacao — biometrics, background check",
    estimatedDurationDays: 210,
    macroMilestoneId: "visa",
    steps: [
      { title: "Biometrics (se solicitado)", description: "Coletar biometrics no VAC mais proximo", assignTo: "both", priority: "HIGH" },
      { title: "Aguardar background check", description: "Verificacao de antecedentes pelo IRCC", assignTo: "primary", priority: "LOW" },
      { title: "Responder requests adicionais (se houver)", description: "IRCC pode solicitar documentos extras", assignTo: "both", priority: "HIGH", actionUrl: "/documents" },
      { title: "Receber COPR (Confirmation of PR)", description: "Permanent Residence confirmada!", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Landing no Canada",
    description: "Chegar ao Canada e ativar status de PR",
    estimatedDurationDays: 90,
    macroMilestoneId: "landing",
    steps: [
      { title: "Planejar mudanca", description: "Organizar logistica de mudanca para o Canada", assignTo: "both", priority: "HIGH" },
      { title: "Landing como Permanent Resident", description: "Entrada oficial no Canada como PR", assignTo: "both", priority: "CRITICAL" },
      { title: "Receber PR Card", description: "Cartao de Permanent Resident chegara pelo correio", assignTo: "primary", priority: "MEDIUM" },
      { title: "Obter SIN (Social Insurance Number)", description: "Necessario para trabalhar no Canada", assignTo: "both", priority: "HIGH" },
    ],
  },
  {
    name: "Estabelecimento",
    description: "Primeiros meses no Canada — moradia, trabalho, adaptacao",
    estimatedDurationDays: 365,
    macroMilestoneId: "pr",
    steps: [
      { title: "Encontrar moradia", description: "Aluguel ou compra de imovel", assignTo: "both", priority: "HIGH" },
      { title: "Abrir conta bancaria", description: "Conta em banco canadense", assignTo: "both", priority: "HIGH" },
      { title: "Obter health card provincial", description: "Cartao de saude da provincia", assignTo: "both", priority: "HIGH" },
      { title: "Buscar emprego", description: "Procurar trabalho na area", assignTo: "both", priority: "HIGH" },
    ],
  },
  {
    name: "Cidadania Canadense",
    description: "Apos 3 anos como PR, solicitar cidadania",
    estimatedDurationDays: 1095,
    macroMilestoneId: "citizenship",
    steps: [
      { title: "Completar 1095 dias de residencia", description: "3 dos ultimos 5 anos como PR no Canada", assignTo: "both", priority: "MEDIUM" },
      { title: "Preparar para Citizenship Test", description: "Estudar para prova de cidadania", assignTo: "both", priority: "MEDIUM" },
      { title: "Submeter aplicacao de cidadania", description: "Aplicar para cidadania canadense", assignTo: "both", priority: "HIGH" },
      { title: "Citizenship Test & Ceremony", description: "Prova e cerimonia de cidadania!", assignTo: "both", priority: "CRITICAL" },
    ],
  },
];

const aipTemplate: JourneyPhaseTemplate[] = [
  {
    name: "Pesquisa e Elegibilidade AIP",
    description: "Verificar requisitos do Atlantic Immigration Program",
    estimatedDurationDays: 30,
    macroMilestoneId: "research",
    steps: [
      { title: "Entender requisitos do AIP", description: "Estudar criterios de elegibilidade do Atlantic Immigration Program", assignTo: "both", priority: "HIGH", actionUrl: "/programs" },
      { title: "Pesquisar empregadores designados", description: "Buscar employers aprovados nas provincias atlanticas", assignTo: "primary", priority: "HIGH" },
      { title: "Calcular CRS score", description: "Simular pontuacao para backup via Express Entry", assignTo: "both", priority: "MEDIUM", actionUrl: "/simulator" },
    ],
  },
  {
    name: "Testes de Idioma",
    description: "CLB 5 minimo para AIP (CLB 4 para NOC TEER 4/5)",
    estimatedDurationDays: 120,
    macroMilestoneId: "language_tests",
    steps: [
      { title: "Agendar IELTS/CELPIP", description: "AIP exige CLB 5+ (lower than Express Entry)", assignTo: "primary", priority: "CRITICAL", actionUrl: "/languages" },
      { title: "Agendar teste de idioma (conjuge)", description: "Conjuge tambem precisa de teste", assignTo: "secondary", priority: "HIGH", actionUrl: "/languages" },
      { title: "Realizar teste de idioma", description: "Completar e registrar resultado", assignTo: "primary", priority: "CRITICAL", actionUrl: "/languages" },
      { title: "Realizar teste de idioma (conjuge)", description: "Completar e registrar resultado", assignTo: "secondary", priority: "HIGH", actionUrl: "/languages" },
    ],
  },
  {
    name: "Avaliacao de Credenciais (ECA)",
    description: "ECA obrigatorio para AIP",
    estimatedDurationDays: 90,
    macroMilestoneId: "eca",
    steps: [
      { title: "Solicitar ECA via WES", description: "Educational Credential Assessment", assignTo: "primary", priority: "CRITICAL", estimatedDays: 60, actionUrl: "/documents" },
      { title: "Traduzir documentos", description: "Traducao juramentada de diplomas e certidoes", assignTo: "both", priority: "HIGH", actionUrl: "/documents" },
    ],
  },
  {
    name: "Job Offer + Endorsement",
    description: "Obter oferta de emprego e endorsement provincial",
    estimatedDurationDays: 120,
    macroMilestoneId: "submission",
    steps: [
      { title: "Obter job offer de empregador designado", description: "Empregador deve ser aprovado pelo AIP", assignTo: "primary", priority: "CRITICAL" },
      { title: "Empregador solicita endorsement", description: "Employer envia aplicacao de endorsement", assignTo: "primary", priority: "CRITICAL" },
      { title: "Settlement plan", description: "Criar plano de estabelecimento com organizacao aprovada", assignTo: "both", priority: "HIGH" },
    ],
  },
  {
    name: "Endorsement Provincial",
    description: "Aguardar aprovacao da provincia",
    estimatedDurationDays: 90,
    macroMilestoneId: "approval",
    steps: [
      { title: "Receber endorsement provincial", description: "Provincia aprova a aplicacao", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Aplicacao para PR via AIP",
    description: "Submeter aplicacao de Permanent Residence ao IRCC",
    estimatedDurationDays: 60,
    macroMilestoneId: "visa",
    steps: [
      { title: "Reunir documentos finais", description: "Checklist completo para aplicacao PR", assignTo: "both", priority: "CRITICAL", actionUrl: "/documents" },
      { title: "Exame medico (IME)", description: "Exame com medico designado pelo IRCC", assignTo: "both", priority: "CRITICAL" },
      { title: "Certidao de antecedentes", description: "Police clearance", assignTo: "both", priority: "CRITICAL", actionUrl: "/documents" },
      { title: "Submeter aplicacao ao IRCC", description: "Enviar aplicacao completa", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Processamento",
    description: "IRCC processa a aplicacao — ~6 meses",
    estimatedDurationDays: 180,
    macroMilestoneId: "visa",
    steps: [
      { title: "Biometrics", description: "Coletar biometrics se solicitado", assignTo: "both", priority: "HIGH" },
      { title: "Receber COPR", description: "Confirmacao de Permanent Residence!", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Landing no Canada",
    description: "Chegar e se estabelecer nas provincias atlanticas",
    estimatedDurationDays: 90,
    macroMilestoneId: "landing",
    steps: [
      { title: "Landing como Permanent Resident", description: "Entrada oficial no Canada", assignTo: "both", priority: "CRITICAL" },
      { title: "Obter SIN", description: "Social Insurance Number", assignTo: "both", priority: "HIGH" },
      { title: "Receber PR Card", description: "Cartao de PR", assignTo: "primary", priority: "MEDIUM" },
    ],
  },
  {
    name: "Estabelecimento",
    description: "Moradia, trabalho e adaptacao",
    estimatedDurationDays: 365,
    macroMilestoneId: "pr",
    steps: [
      { title: "Iniciar emprego com employer designado", description: "Comecar a trabalhar conforme job offer", assignTo: "primary", priority: "HIGH" },
      { title: "Encontrar moradia", description: "Aluguel ou compra", assignTo: "both", priority: "HIGH" },
      { title: "Obter health card", description: "Cartao de saude provincial", assignTo: "both", priority: "HIGH" },
    ],
  },
  {
    name: "Cidadania Canadense",
    description: "Apos 3 anos como PR",
    estimatedDurationDays: 1095,
    macroMilestoneId: "citizenship",
    steps: [
      { title: "Completar 1095 dias de residencia", description: "3 dos ultimos 5 anos no Canada", assignTo: "both", priority: "MEDIUM" },
      { title: "Citizenship Test & Ceremony", description: "Prova e cerimonia de cidadania", assignTo: "both", priority: "CRITICAL" },
    ],
  },
];

const spousalTemplate: JourneyPhaseTemplate[] = [
  {
    name: "Preparacao da Aplicacao",
    description: "Reunir documentos e preparar a aplicacao de sponsorship",
    estimatedDurationDays: 60,
    macroMilestoneId: "submission",
    steps: [
      { title: "Verificar elegibilidade do sponsor", description: "Confirmar que o sponsor atende requisitos", assignTo: "primary", priority: "CRITICAL" },
      { title: "Reunir provas de relacionamento", description: "Fotos, mensagens, viagens juntos", assignTo: "both", priority: "HIGH", actionUrl: "/documents" },
      { title: "Certidao de casamento ou uniao estavel", description: "Documento oficial do relacionamento", assignTo: "both", priority: "CRITICAL", actionUrl: "/documents" },
      { title: "Preencher formularios IMM", description: "Formularios de sponsorship do IRCC", assignTo: "both", priority: "CRITICAL" },
      { title: "Exame medico", description: "IME para o aplicante", assignTo: "secondary", priority: "HIGH" },
      { title: "Certidao de antecedentes", description: "Police clearance", assignTo: "both", priority: "HIGH", actionUrl: "/documents" },
    ],
  },
  {
    name: "Submissao e Processamento",
    description: "Enviar aplicacao e aguardar processamento",
    estimatedDurationDays: 365,
    macroMilestoneId: "visa",
    steps: [
      { title: "Submeter aplicacao de sponsorship", description: "Enviar pacote completo ao IRCC", assignTo: "primary", priority: "CRITICAL" },
      { title: "Receber AOR (Acknowledgement of Receipt)", description: "Confirmacao de recebimento do IRCC", assignTo: "primary", priority: "MEDIUM" },
      { title: "Aguardar processamento", description: "Tempo estimado: 12 meses", assignTo: "both", priority: "LOW" },
      { title: "Receber aprovacao", description: "Sponsorship aprovado!", assignTo: "both", priority: "CRITICAL" },
    ],
  },
];

const studyTemplate: JourneyPhaseTemplate[] = [
  {
    name: "Pesquisa de Instituicoes e Programas",
    description: "Pesquisar DLIs, programas academicos e requisitos",
    estimatedDurationDays: 60,
    macroMilestoneId: "research",
    steps: [
      { title: "Pesquisar DLIs (Designated Learning Institutions)", description: "Buscar instituicoes aprovadas pelo IRCC", assignTo: "primary", priority: "HIGH", actionUrl: "/programs" },
      { title: "Escolher programa academico", description: "Selecionar curso elegivel para PGWP", assignTo: "primary", priority: "HIGH" },
      { title: "Verificar custos e requisitos financeiros", description: "Tuition + proof of funds para study permit", assignTo: "both", priority: "HIGH" },
      { title: "Calcular CRS score para planejamento futuro", description: "Simular pontuacao para Express Entry pos-PGWP", assignTo: "both", priority: "MEDIUM", actionUrl: "/simulator" },
    ],
  },
  {
    name: "Testes de Idioma",
    description: "Testes de ingles para admissao e study permit",
    estimatedDurationDays: 120,
    macroMilestoneId: "language_tests",
    steps: [
      { title: "Agendar IELTS Academic", description: "IELTS Academic exigido para admissao em DLIs", assignTo: "primary", priority: "CRITICAL", actionUrl: "/languages" },
      { title: "Estudar para IELTS Academic", description: "Meta: banda 6.5+ overall", assignTo: "primary", priority: "HIGH" },
      { title: "Realizar teste de idioma", description: "Fazer o IELTS Academic e registrar resultado", assignTo: "primary", priority: "CRITICAL", actionUrl: "/languages" },
    ],
  },
  {
    name: "Admissao e LOA",
    description: "Aplicar para instituicao e obter Letter of Acceptance",
    estimatedDurationDays: 90,
    macroMilestoneId: "eca",
    steps: [
      { title: "Aplicar para instituicao(oes)", description: "Submeter aplicacao academica", assignTo: "primary", priority: "CRITICAL" },
      { title: "Receber LOA (Letter of Acceptance)", description: "Carta de aceitacao da DLI", assignTo: "primary", priority: "CRITICAL" },
      { title: "Pagar deposito/tuition", description: "Pagar valor exigido para emissao da LOA final", assignTo: "primary", priority: "HIGH" },
    ],
  },
  {
    name: "Study Permit",
    description: "Solicitar study permit ao IRCC",
    estimatedDurationDays: 90,
    macroMilestoneId: "submission",
    steps: [
      { title: "Reunir documentos para study permit", description: "LOA, proof of funds, fotos, passaporte", assignTo: "primary", priority: "CRITICAL", actionUrl: "/documents" },
      { title: "Exame medico (IME)", description: "Exame com medico designado", assignTo: "primary", priority: "HIGH" },
      { title: "Submeter aplicacao de study permit", description: "Aplicar via IRCC online", assignTo: "primary", priority: "CRITICAL" },
      { title: "Receber aprovacao do study permit", description: "Study permit aprovado!", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Estudo no Canada",
    description: "Periodo academico na DLI",
    estimatedDurationDays: 730,
    macroMilestoneId: "approval",
    steps: [
      { title: "Landing e inicio das aulas", description: "Chegar ao Canada e comecar o curso", assignTo: "primary", priority: "CRITICAL" },
      { title: "Manter status de estudante", description: "Manter matricula ativa e boas notas", assignTo: "primary", priority: "HIGH" },
      { title: "Trabalhar part-time (opcional)", description: "Ate 20h/semana off-campus durante aulas", assignTo: "primary", priority: "LOW" },
      { title: "Concluir programa academico", description: "Graduar-se com sucesso", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "PGWP (Post-Graduation Work Permit)",
    description: "Solicitar PGWP apos graduacao",
    estimatedDurationDays: 90,
    macroMilestoneId: "visa",
    steps: [
      { title: "Solicitar PGWP", description: "Aplicar dentro de 180 dias apos graduacao", assignTo: "primary", priority: "CRITICAL" },
      { title: "Receber PGWP", description: "Work permit de 1-3 anos dependendo do programa", assignTo: "primary", priority: "CRITICAL" },
      { title: "Buscar emprego qualificado", description: "NOC TEER 0/1/2/3 para Express Entry", assignTo: "primary", priority: "HIGH" },
    ],
  },
  {
    name: "Experiencia Canadense + Express Entry",
    description: "Acumular experiencia e aplicar para PR",
    estimatedDurationDays: 365,
    macroMilestoneId: "visa",
    steps: [
      { title: "Acumular 1 ano de experiencia canadense", description: "12 meses de trabalho qualificado para CEC", assignTo: "primary", priority: "CRITICAL" },
      { title: "Fazer IELTS/CELPIP (General)", description: "Teste de idioma para Express Entry", assignTo: "primary", priority: "HIGH", actionUrl: "/languages" },
      { title: "Criar perfil no Express Entry", description: "Entrar no pool com pontos de experiencia canadense", assignTo: "primary", priority: "CRITICAL", actionUrl: "/simulator" },
      { title: "Receber ITA e submeter aplicacao PR", description: "Aplicar para Permanent Residence", assignTo: "primary", priority: "CRITICAL" },
    ],
  },
  {
    name: "Landing como PR",
    description: "Transicao de work permit para Permanent Resident",
    estimatedDurationDays: 180,
    macroMilestoneId: "landing",
    steps: [
      { title: "Receber COPR", description: "Confirmacao de Permanent Residence", assignTo: "primary", priority: "CRITICAL" },
      { title: "Ativar status de PR", description: "Landing oficial como Permanent Resident", assignTo: "primary", priority: "CRITICAL" },
      { title: "Receber PR Card", description: "Cartao de PR pelo correio", assignTo: "primary", priority: "MEDIUM" },
    ],
  },
  {
    name: "Estabelecimento",
    description: "Vida como PR no Canada",
    estimatedDurationDays: 365,
    macroMilestoneId: "pr",
    steps: [
      { title: "Estabilizar carreira", description: "Crescer profissionalmente no Canada", assignTo: "both", priority: "HIGH" },
      { title: "Obter health card provincial", description: "Cartao de saude da provincia", assignTo: "both", priority: "HIGH" },
    ],
  },
  {
    name: "Cidadania Canadense",
    description: "Apos 3 anos como PR",
    estimatedDurationDays: 1095,
    macroMilestoneId: "citizenship",
    steps: [
      { title: "Completar 1095 dias de residencia", description: "3 dos ultimos 5 anos no Canada", assignTo: "both", priority: "MEDIUM" },
      { title: "Citizenship Test & Ceremony", description: "Prova e cerimonia de cidadania", assignTo: "both", priority: "CRITICAL" },
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
  AIP: aipTemplate,
  STUDY_PGWP: studyTemplate,
};

export function getJourneyTemplate(programCode: string): JourneyPhaseTemplate[] {
  return templates[programCode] || expressEntryTemplate;
}
