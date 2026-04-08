// ════════════════════════════════════════════
// Step Guidance — Rich content for each journey step
// Matched by step title → provides context, tips, docs, links
// ════════════════════════════════════════════

export interface StepGuidance {
  whatItIs: string;
  whyItMatters: string;
  howToDo: string[];
  tips?: string[];
  commonMistakes?: string[];
  documentsNeeded?: string[];
  externalLinks?: { label: string; url: string }[];
  estimatedDays?: number;
  dependencies?: string[];
}

// Fuzzy match: normalize title to find guidance
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const GUIDANCE_MAP: Record<string, StepGuidance> = {
  // ── RESEARCH ──
  "pesquisar programas de imigracao disponiveis": {
    whatItIs: "Analise comparativa dos programas federais e provinciais de imigracao canadense.",
    whyItMatters: "Escolher o programa certo evita meses de preparacao desnecessaria e aumenta suas chances de aprovacao.",
    howToDo: [
      "Acesse a pagina de Programas na plataforma para ver opcoes disponiveis",
      "Compare requisitos de CLB, CRS, experiencia e fundos de cada programa",
      "Considere fatores como tempo de processamento e provincia de destino",
      "Discuta com seu conjuge qual caminho faz mais sentido para a familia",
    ],
    tips: [
      "Express Entry e o mais rapido, mas exige CRS alto",
      "AIP tem CLB mais baixo e nao exige CRS, mas precisa de job offer",
      "PNPs podem dar +600 pontos de CRS se voce receber nominacao provincial",
    ],
    externalLinks: [
      { label: "IRCC - Come to Canada", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html" },
      { label: "Express Entry eligibility", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility.html" },
    ],
    estimatedDays: 7,
  },
  "calcular crs score inicial": {
    whatItIs: "Calculo do Comprehensive Ranking System score, usado no Express Entry para ranquear candidatos.",
    whyItMatters: "O CRS determina se voce recebe um convite (ITA). Scores recentes de corte ficam entre 430-520 pontos.",
    howToDo: [
      "Acesse o Simulador CRS na plataforma",
      "Preencha os dados de ambos os conjuges",
      "Compare quem tem melhor score como aplicante principal",
      "Salve o resultado para acompanhar evolucao",
    ],
    tips: [
      "O conjuge com maior score deve ser o aplicante principal",
      "Idioma vale ate 136 pontos — investir em ingles e a melhoria mais rapida",
      "Experiencia canadense vale pontos extras de skill transfer",
    ],
    estimatedDays: 1,
  },
  "definir quem sera o aplicante principal": {
    whatItIs: "Decisao estrategica de qual conjuge sera o aplicante principal no processo.",
    whyItMatters: "O aplicante principal determina os pontos de CRS, requisitos de idioma e experiencia. Escolher errado pode custar 50-100 pontos de CRS.",
    howToDo: [
      "Compare o CRS de cada conjuge no Simulador",
      "Considere quem tem melhor idioma, educacao e experiencia",
      "Avalie se ha oferta de emprego para um dos dois",
      "Faca a simulacao com cada um como principal",
    ],
    tips: [
      "Nem sempre o que ganha mais e o melhor aplicante — o CRS conta mais",
      "Se um dos dois tem CLB 9+, provavelmente deve ser o principal",
      "Podem trocar o aplicante principal ate antes da submissao",
    ],
    estimatedDays: 1,
  },
  "definir planos a b e c": {
    whatItIs: "Definicao dos caminhos migatorios principal, complementar e alternativo.",
    whyItMatters: "Ter planos alternativos evita perder tempo se o caminho principal nao funcionar.",
    howToDo: [
      "Plano A: programa com maior chance de sucesso",
      "Plano B: programa complementar (mesma preparacao serve)",
      "Plano C: rota alternativa caso A e B falhem",
      "Acesse Meus Planos para ver a configuracao atual",
    ],
    tips: [
      "AIP + Express Entry sao complementares — mesmos documentos servem para ambos",
      "Study Permit e uma rota separada — exige preparacao diferente",
    ],
    estimatedDays: 2,
  },

  // ── LANGUAGE TESTS ──
  "agendar ielts celpip": {
    whatItIs: "Agendamento do teste oficial de proficiencia em ingles aceito pelo IRCC.",
    whyItMatters: "Sem teste de idioma valido, nenhum programa de imigracao pode ser aplicado. E o primeiro requisito obrigatorio.",
    howToDo: [
      "Escolha entre IELTS General Training ou CELPIP General",
      "CELPIP e feito no computador e aceito apenas no Canada",
      "IELTS General Training e aceito globalmente",
      "Agende com 2-3 meses de antecedencia — vagas lotam rapido",
      "Registre a data na pagina de Idiomas da plataforma",
    ],
    tips: [
      "CELPIP tende a ser mais facil para quem esta acostumado com computador",
      "IELTS exige handwriting no Writing — pratique escrever a mao",
      "Faca pelo menos 3 mock tests completos antes da prova real",
      "Resultado do IELTS sai em 13 dias, CELPIP em 4-5 dias uteis",
    ],
    commonMistakes: [
      "Agendar sem estudar o suficiente — melhor adiar do que tirar nota baixa",
      "Fazer IELTS Academic em vez de General Training (IRCC so aceita GT)",
      "Nao levar documento de identidade correto no dia da prova",
    ],
    externalLinks: [
      { label: "CELPIP - Agendar teste", url: "https://www.celpip.ca/" },
      { label: "IELTS - Agendar teste", url: "https://www.ielts.org/" },
    ],
    estimatedDays: 90,
  },
  "estudar para teste de ingles": {
    whatItIs: "Preparacao intensiva para atingir o CLB necessario no teste de proficiencia.",
    whyItMatters: "Cada ponto de CLB acima de 7 vale dezenas de pontos de CRS. A diferenca entre CLB 7 e CLB 9 pode ser mais de 50 pontos de CRS.",
    howToDo: [
      "Faca um teste diagnostico para identificar seu nivel atual",
      "Foque nas habilidades mais fracas — o score mais baixo puxa o CRS para baixo",
      "Estude pelo menos 1 hora por dia, 5 dias por semana",
      "Faca mock tests semanais e registre os scores na plataforma",
      "Considere um professor particular para as habilidades mais fracas",
    ],
    tips: [
      "Writing e Speaking sao as habilidades que mais demoram para melhorar",
      "Listening melhora rapido assistindo podcasts e series em ingles",
      "Use apps como IELTS Prep, CELPIP Practice para exercicios diarios",
    ],
    estimatedDays: 90,
  },
  "realizar teste de ingles": {
    whatItIs: "Realizacao do teste oficial e registro do resultado na plataforma.",
    whyItMatters: "O resultado valido por 2 anos determina sua elegibilidade e pontuacao CRS.",
    howToDo: [
      "Chegue ao local 30 minutos antes do horario",
      "Leve documento de identidade (mesmo usado no registro)",
      "Apos receber o resultado, registre os scores na pagina de Idiomas",
      "Se o score nao atingiu a meta, agende um novo teste",
    ],
    tips: [
      "Durma bem na noite anterior — cansaco afeta Writing e Speaking",
      "No Speaking, nao decore respostas — avaliadores percebem",
      "No Writing Task 2, planeje 5 minutos antes de escrever",
    ],
    estimatedDays: 1,
  },

  // ── ECA ──
  "solicitar eca via wes": {
    whatItIs: "Educational Credential Assessment: validacao do seu diploma estrangeiro pelo padrao canadense.",
    whyItMatters: "Sem ECA, sua educacao vale zero pontos no CRS. Um ECA de bacharelado pode valer 120 pontos.",
    howToDo: [
      "Crie conta no site do WES (World Education Services)",
      "Solicite que sua universidade envie historico escolar diretamente ao WES",
      "Pague a taxa de avaliacao (~$220 CAD)",
      "Aguarde 20-60 dias para o resultado",
      "Envie traducao juramentada se os documentos nao forem em ingles",
    ],
    tips: [
      "Comece o ECA o quanto antes — demora e pode atrasar todo o processo",
      "WES e IQAS sao os mais usados — WES e mais rapido",
      "O ECA vale por 5 anos a partir da data de emissao",
    ],
    commonMistakes: [
      "Enviar documentos incompletos — WES vai pedir novamente e atrasar",
      "Nao pedir a universidade para enviar DIRETAMENTE ao WES",
      "Esquecer de incluir todas as instituicoes onde estudou",
    ],
    documentsNeeded: [
      "Diploma original ou copia autenticada",
      "Historico escolar completo",
      "Traducao juramentada (se nao for em ingles/frances)",
    ],
    externalLinks: [
      { label: "WES - Iniciar avaliacao", url: "https://www.wes.org/ca/" },
      { label: "IQAS - Alternativa ao WES", url: "https://www.alberta.ca/iqas" },
    ],
    estimatedDays: 60,
  },
  "traduzir documentos": {
    whatItIs: "Traducao juramentada (sworn translation) de todos os documentos oficiais para ingles.",
    whyItMatters: "Documentos em portugues nao sao aceitos pelo IRCC nem pelo WES. Traducoes incorretas podem resultar em rejeicao.",
    howToDo: [
      "Liste todos os documentos que precisam de traducao",
      "Encontre um tradutor juramentado certificado",
      "Solicite traducao de: certidao de nascimento, casamento, diploma, historico",
      "Guarde originais e traducoes juntos",
    ],
    documentsNeeded: [
      "Certidao de nascimento",
      "Certidao de casamento",
      "Diploma universitario",
      "Historico escolar",
      "Certidao de antecedentes criminais",
    ],
    estimatedDays: 14,
  },
  "reunir cartas de emprego": {
    whatItIs: "Reference letters oficiais dos seus empregadores, detalhando funcoes, periodo e carga horaria.",
    whyItMatters: "Cartas de emprego provam sua experiencia profissional — sem elas, seus anos de trabalho nao contam no CRS.",
    howToDo: [
      "Solicite carta a cada empregador dos ultimos 10 anos",
      "A carta deve incluir: cargo, datas, horas semanais, responsabilidades detalhadas",
      "Deve ser em papel timbrado com assinatura e contato do responsavel",
      "Se a empresa nao existe mais, use declaracao juramentada (affidavit)",
    ],
    tips: [
      "Comece a pedir agora — ex-empregadores podem demorar semanas",
      "Liste responsabilidades usando verbos de acao do NOC",
      "A carta deve listar duties que combinem com seu NOC code",
    ],
    estimatedDays: 30,
  },

  // ── AIP SPECIFIC ──
  "entender requisitos do aip": {
    whatItIs: "Estudo detalhado dos criterios de elegibilidade do Atlantic Immigration Program.",
    whyItMatters: "O AIP tem regras diferentes do Express Entry — CLB mais baixo, mas exige job offer de empregador designado.",
    howToDo: [
      "Leia os requisitos oficiais no site do IRCC",
      "CLB minimo: 5 (TEER 0/1/2/3) ou 4 (TEER 4/5)",
      "Precisa de ECA para educacao estrangeira",
      "Job offer deve ser de empregador designado (designated employer)",
      "Settlement plan obrigatorio com organizacao aprovada",
    ],
    externalLinks: [
      { label: "IRCC - Atlantic Immigration Program", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/atlantic-immigration.html" },
      { label: "Lista de empregadores designados", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/atlantic-immigration/employers.html" },
    ],
    estimatedDays: 7,
  },
  "pesquisar empregadores designados": {
    whatItIs: "Identificacao de empresas aprovadas pelo AIP que podem oferecer job offers validos.",
    whyItMatters: "Sem job offer de um empregador designado, voce nao pode aplicar pelo AIP.",
    howToDo: [
      "Consulte a lista oficial de empregadores designados no IRCC",
      "Filtre por provincia e setor de interesse",
      "Prepare seu curriculo no formato canadense",
      "Aplique diretamente ou via job boards canadenses (Indeed, LinkedIn, JobBank)",
    ],
    tips: [
      "Nova Brunswick, Nova Scotia, PEI e Newfoundland tem empregadores designados",
      "Foque em empresas do seu setor de experiencia",
      "Networking no LinkedIn com profissionais da regiao ajuda muito",
    ],
    externalLinks: [
      { label: "Job Bank Canada", url: "https://www.jobbank.gc.ca/" },
    ],
    estimatedDays: 60,
  },
  "obter job offer de empregador designado": {
    whatItIs: "Recebimento de oferta formal de emprego de um empregador aprovado pelo AIP.",
    whyItMatters: "O job offer e o requisito central do AIP — sem ele, nao ha aplicacao.",
    howToDo: [
      "Participe de entrevistas com empregadores designados",
      "Negocie termos do emprego (salario, cargo, local)",
      "O empregador deve emitir uma oferta formal em papel timbrado",
      "A oferta deve ser full-time e nao sazonal",
    ],
    estimatedDays: 90,
  },

  // ── SUBMISSION / VISA ──
  "criar conta no ircc gckey": {
    whatItIs: "Criacao de conta oficial no sistema do IRCC para submeter aplicacoes de imigracao.",
    whyItMatters: "Toda comunicacao com o IRCC acontece por essa conta. E o portal oficial do governo canadense.",
    howToDo: [
      "Acesse ircc.canada.ca e clique em Sign In",
      "Escolha GCKey (recomendado) ou Sign-In Partner (banco)",
      "Crie usuario e senha seguros",
      "Configure perguntas de seguranca",
    ],
    externalLinks: [
      { label: "IRCC Portal", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html" },
    ],
    estimatedDays: 1,
  },
  "exame medico ime": {
    whatItIs: "Immigration Medical Examination: exame medico obrigatorio com medico designado pelo IRCC.",
    whyItMatters: "Sem exame medico aprovado, a aplicacao de PR e rejeitada. O resultado vale por 12 meses.",
    howToDo: [
      "Encontre um panel physician no site do IRCC",
      "Agende consulta (pode demorar semanas em algumas cidades)",
      "Leve documentos de identidade e formularios do IRCC",
      "O medico envia resultado diretamente ao IRCC — voce nao recebe copia",
    ],
    tips: [
      "Faca o exame so quando estiver proximo de submeter — resultado expira em 12 meses",
      "Inclui exame de sangue, urina, raio-X do torax e historico medico",
    ],
    externalLinks: [
      { label: "IRCC - Find a panel physician", url: "https://secure.cic.gc.ca/pp-md/pp-list.aspx" },
    ],
    estimatedDays: 14,
  },
  "certidao de antecedentes criminais": {
    whatItIs: "Police clearance certificate de cada pais onde voce morou por 6+ meses apos os 18 anos.",
    whyItMatters: "Obrigatorio para provar que voce nao tem antecedentes criminais. Sem isso, aplicacao e rejeitada.",
    howToDo: [
      "Liste todos os paises onde morou 6+ meses apos 18 anos",
      "Solicite certidao em cada pais (pode ser feito via consulado)",
      "No Brasil: Certidao de Antecedentes da Policia Federal",
      "Traduza para ingles se necessario",
    ],
    estimatedDays: 30,
  },

  // ── LANDING ──
  "landing como permanent resident": {
    whatItIs: "Entrada oficial no Canada como Permanent Resident — ativacao do status de PR.",
    whyItMatters: "O landing e quando voce oficialmente se torna residente permanente do Canada. A partir desse dia, conta o tempo para cidadania.",
    howToDo: [
      "Tenha o COPR (Confirmation of PR) em maos",
      "Apresente COPR e passaporte na imigracao do aeroporto",
      "O oficial vai confirmar seus dados e ativar seu status",
      "Guarde todos os documentos recebidos",
    ],
    estimatedDays: 1,
  },
  "obter sin social insurance number": {
    whatItIs: "Social Insurance Number: numero de identificacao necessario para trabalhar e receber beneficios no Canada.",
    whyItMatters: "Sem SIN, voce nao pode trabalhar legalmente nem abrir conta bancaria completa.",
    howToDo: [
      "Va a um Service Canada Centre com seu COPR e passaporte",
      "O SIN e emitido na hora — guarde em local seguro",
      "Nunca compartilhe seu SIN desnecessariamente",
    ],
    estimatedDays: 1,
  },
};

export function getStepGuidance(title: string): StepGuidance | null {
  const normalized = normalizeTitle(title);

  // Direct match
  if (GUIDANCE_MAP[normalized]) {
    return GUIDANCE_MAP[normalized];
  }

  // Fuzzy match: find the closest key
  for (const [key, guidance] of Object.entries(GUIDANCE_MAP)) {
    // Check if the title contains the key or vice versa
    if (normalized.includes(key) || key.includes(normalized)) {
      return guidance;
    }
    // Check if significant words overlap (>60%)
    const keyWords = key.split(" ").filter((w) => w.length > 3);
    const titleWords = normalized.split(" ").filter((w) => w.length > 3);
    const overlap = keyWords.filter((w) => titleWords.includes(w)).length;
    if (keyWords.length > 0 && overlap / keyWords.length >= 0.6) {
      return guidance;
    }
  }

  return null;
}
