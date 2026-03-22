# BUILD INSTRUCTIONS — MapleTrack
## Sistema de Imigração para o Canadá

---

## PRÉ-REQUISITOS

Ferramentas já instaladas e configuradas:

| Ferramenta | Status | Detalhe |
|---|---|---|
| **Node.js** v24 | ✅ | Instalado |
| **npm** v11 | ✅ | Instalado |
| **Git** v2+ | ✅ | Instalado |
| **GitHub** | ✅ | Repo `rafoli17/maple-track` criado e pushed |
| **Vercel** | ✅ | Projeto importado, aguardando deploy |
| **Neon** | ✅ | Banco `maple-track` criado, connection string no `.env.local` |
| **Resend** | ✅ | API key `maple-track` criada e no `.env.local` |
| **Stripe** | ⏳ | Configurar depois (futuro — monetização) |
| **Google Cloud Console** | ⏳ | Configurar OAuth para login |

Contas ativas:
- [GitHub](https://github.com/rafoli17/maple-track) — repositório de código
- [Vercel](https://vercel.com) — hosting (login com GitHub)
- [Neon](https://neon.tech) — banco PostgreSQL (projeto `maple-track`)
- [Google Cloud Console](https://console.cloud.google.com) — OAuth
- [Resend](https://resend.com) — envio de emails
- [Stripe](https://dashboard.stripe.com) — pagamentos (futuro)

---

## ETAPAS DE BUILD (ordem obrigatória)

### ETAPA 0 — INFRAESTRUTURA ✅ (JÁ FEITO)

1. ✅ Repositório criado no GitHub (`rafoli17/maple-track`)
2. ✅ Projeto Next.js criado com TypeScript, Tailwind, App Router
3. ✅ Banco PostgreSQL criado no Neon
4. ✅ Dependências instaladas (drizzle, next-auth, resend, framer-motion, etc.)
5. ✅ `.env.local` configurado com DATABASE_URL, RESEND_API_KEY, NEXTAUTH_SECRET
6. ⏳ Vercel importado — deploy será feito após primeiro push com código funcional

> **Resultado:** Repo no GitHub com código, banco Neon conectado, Vercel pronto para deploy automático.

### ETAPA 1 — SCHEMA DO BANCO (Drizzle ORM)

Criar o schema em `src/db/schema.ts` com as entidades do sistema de imigração:

**Entidades de Auth:**
- **User**: id, name, email, image, emailVerified, role (enum: APPLICANT), householdId, createdAt, updatedAt
- **Account, Session, VerificationToken**: padrão Auth.js / Drizzle adapter
- **Household**: id, name, createdAt — agrupa o casal (Rafael + Luana no mesmo household)

**Entidades do Produto — Imigração:**

- **Profile** (perfil individual de cada cônjuge):
  - id, odUse, householdId
  - firstName, lastName, dateOfBirth, nationality, currentCountry
  - educationLevel (enum: HIGH_SCHOOL / BACHELORS / MASTERS / PHD / TECHNICAL)
  - fieldOfStudy, yearsOfExperience, currentOccupation, nocCode
  - canadianExperienceYears, canadianEducation (boolean)
  - maritalStatus, hasChildren, numberOfChildren
  - fundsAvailable (decimal)
  - isPrimaryApplicant (boolean)
  - createdAt, updatedAt

- **LanguageTest** (testes de idioma — IELTS, CELPIP, TEF):
  - id, profileId
  - testType (enum: IELTS_GENERAL / IELTS_ACADEMIC / CELPIP / TEF / TCF)
  - speaking, listening, reading, writing (decimal scores)
  - overallScore, clbEquivalent
  - testDate, expiryDate (2 anos após testDate)
  - status (enum: PLANNED / SCHEDULED / COMPLETED / EXPIRED)
  - targetSpeaking, targetListening, targetReading, targetWriting (metas por programa)
  - createdAt

- **CRSScore** (histórico de scores calculados):
  - id, profileId
  - totalScore, coreScore, spouseScore, skillTransferScore, additionalScore
  - breakdown (JSON — detalhamento completo)
  - calculatedAt
  - notes

- **ImmigrationProgram** (programas disponíveis):
  - id, name, code (ex: EXPRESS_ENTRY_CEC, PNP_ONTARIO, SPOUSAL, etc.)
  - category (enum: EXPRESS_ENTRY / PNP / FAMILY / PILOT / STUDY)
  - description, requirements (JSON), processingTimeMonths
  - minimumCLB, minimumCRS, minimumFunds
  - isActive (boolean)
  - lastUpdated

- **ImmigrationPlan** (plano escolhido pelo casal — A, B ou C):
  - id, householdId, programId
  - priority (enum: PRIMARY / SECONDARY / TERTIARY)
  - status (enum: RESEARCHING / PREPARING / APPLIED / PROCESSING / APPROVED / REJECTED / ON_HOLD)
  - startedAt, targetDate, completedAt
  - notes
  - createdAt, updatedAt

- **JourneyPhase** (fases macro da jornada):
  - id, immigrationPlanId
  - phaseNumber, name, description
  - status (enum: NOT_STARTED / IN_PROGRESS / COMPLETED / BLOCKED)
  - estimatedDurationDays, startedAt, completedAt
  - order

- **JourneyStep** (micro-etapas dentro de cada fase):
  - id, journeyPhaseId, immigrationPlanId
  - title, description, instructions
  - status (enum: TODO / IN_PROGRESS / DONE / BLOCKED / SKIPPED)
  - dueDate, completedAt
  - assignedTo (profileId — Rafael ou Luana)
  - priority (enum: LOW / MEDIUM / HIGH / CRITICAL)
  - order
  - parentStepId (para sub-etapas)
  - createdAt

- **Document** (documentos necessários):
  - id, profileId, immigrationPlanId
  - name, type (enum: PASSPORT / BIRTH_CERTIFICATE / MARRIAGE_CERTIFICATE / DIPLOMA / TRANSCRIPT / ECA / IELTS_RESULT / CELPIP_RESULT / POLICE_CLEARANCE / MEDICAL_EXAM / PROOF_OF_FUNDS / EMPLOYMENT_LETTER / REFERENCE_LETTER / PHOTOS / OTHER)
  - status (enum: NOT_STARTED / GATHERING / SUBMITTED / APPROVED / EXPIRED / NEEDS_UPDATE)
  - issueDate, expiryDate
  - fileUrl (opcional — upload futuro)
  - notes
  - requiredForPrograms (array de program codes)
  - createdAt, updatedAt

- **Notification** (alertas e lembretes):
  - id, householdId, userId
  - type (enum: DOCUMENT_EXPIRING / STEP_DUE / SCORE_UPDATE / PROGRAM_CHANGE / MILESTONE / REMINDER)
  - title, message
  - isRead (boolean), readAt
  - link (deeplink para ação)
  - scheduledFor, createdAt

- **Achievement** (gamificação):
  - id, householdId
  - type (enum: MILESTONE / STREAK / COMPLETION / SCORE)
  - name, description, icon
  - unlockedAt
  - metadata (JSON — dados extras)

Também criar o Design System (Single Source of Truth):

`design-system/tokens.ts` — Fonte única de design tokens:
* Definir objeto tipado `DesignTokens` com: colors, sidebar, radius, spacing, typography
* Paleta "Aurora Boreal": Slate deep (base #020617/#0F172A) + Teal Primary (#0D9488/#14B8A6) + Maple Red accent (#E11D48) + Sky Blue info (#38BDF8) + Emerald success (#10B981) + Amber warning (#F59E0B)
* Tipografia: Inter (body) + clash/display para headings
* Exportar tokens e tipo `DesignTokens`

`design-system/utils.ts` — Helpers de conversão:
* `tokenKeyToCssVar(key)` — converte camelCase para CSS var
* `sidebarKeyToCssVar(key)` — converte para sidebar CSS var

`design-system/generate-css.ts` — Gerador de CSS:
* Importa `tokens.ts` e gera bloco `:root {}` no `globals.css` entre marcadores de comentário
* Preserva todo conteúdo fora do `:root`
* Flag `--check` para CI

`package.json` — Adicionar scripts:
* `"tokens": "tsx design-system/generate-css.ts"`
* `"tokens:check": "tsx design-system/generate-css.ts --check"`

**REGRA:** Nunca usar hex hardcoded nos componentes. Sempre usar tokens semânticos Tailwind (`bg-primary`, `text-foreground`, etc).

### ETAPA 2 — AUTENTICAÇÃO (Auth.js v5)

- Google OAuth (Google Cloud Console)
- Email Magic Link via Resend (alternativa)
- Primeiro login → cria User + Profile + Household automaticamente
- Segundo membro do household (cônjuge) → convite por email com link para join no mesmo household
- Middleware protegendo rotas `/dashboard/*`, `/app/*`, `/settings/*`
- Página customizada `/login` com design moderno (maple leaf theme)
- Após login → onboarding wizard se perfil não estiver completo

**Fluxo de acesso do casal:**
1. Rafael faz login → cria Household "Guimarães" → cria Profile dele
2. Rafael convida Luana por email → Luana faz login → entra no mesmo Household → cria Profile dela
3. Ambos veem o mesmo dashboard, mesmos planos, mas cada um tem seu perfil e tarefas atribuídas

### ETAPA 3 — ONBOARDING WIZARD (Primeira experiência)

Fluxo step-by-step pós-primeiro-login (8-10 telas):

1. **Boas-vindas** — "Vamos começar sua jornada para o Canadá"
2. **Perfil pessoal** — Nome, data de nascimento, nacionalidade
3. **Educação** — Nível, área, instituição
4. **Experiência profissional** — Ocupação atual, NOC code, anos de experiência (Canadá e exterior)
5. **Idiomas** — Testes já feitos? Scores? Se não, planejando qual?
6. **Cônjuge** — Convidar cônjuge para o household (email)
7. **Situação financeira** — Fundos disponíveis para imigração (proof of funds)
8. **Filhos** — Tem filhos? Quantos? Idades?
9. **Preferências** — Províncias de interesse? Aceita cidade rural? Fala francês?
10. **Resultado** — Cálculo de CRS, programas recomendados, sugestão de Plano A/B/C

> **Progress bar** visível em todas as telas do onboarding. Cada step com animação de transição (Framer Motion).

### ETAPA 4 — DASHBOARD DO CASAL (Tela principal)

Layout: Sidebar + Main content

**Sidebar:**
- Logo MapleTrack (maple leaf)
- Navegação principal:
  - Dashboard (visão geral)
  - Meus Planos (A/B/C)
  - Jornada (Journey Map)
  - Documentos
  - Idiomas
  - Simulador CRS
  - Conquistas
  - Configurações
- Toggle entre perfis (Rafael ↔ Luana) com avatares
- Indicador de progresso geral (% da jornada)

**Dashboard — Cards principais:**
1. **Progress Ring** — % geral da jornada do plano principal (animado)
2. **Próximas 3 ações** — Tarefas mais urgentes com deadline
3. **Score CRS** — Score atual de cada cônjuge lado a lado
4. **Plano ativo** — Card do programa principal com status e timeline
5. **Documentos pendentes** — Contagem e urgência
6. **Idioma** — Score atual vs score necessário (barra de progresso)
7. **Alertas** — Documentos vencendo, prazos chegando
8. **Conquistas recentes** — Último achievement desbloqueado

**Design:**
- Duo-first: sempre mostrar dados de Rafael E Luana lado a lado
- Cores por status: verde (concluído), azul (em andamento), cinza (pendente), vermelho (atrasado/vencido), amber (atenção)
- Animações com Framer Motion em cards, progress bars, transições
- Totalmente responsivo (mobile-first)

### ETAPA 5 — SELEÇÃO DE PROGRAMAS E PLANOS A/B/C

**Tela de Programas Disponíveis:**
- Lista de todos os programas canadenses de imigração (dados seedados)
- Filtro por: categoria (Express Entry, PNP, Family, etc.), elegibilidade do casal, tempo de processamento
- Card de cada programa com: nome, tempo estimado, CRS mínimo, requisitos principais, match % com perfil do casal
- Botão "Ver detalhes" → tela com requisitos completos vs perfil do casal

**Programas a seedar (dados reais IRCC Março/2026):**
- Express Entry — Federal Skilled Worker (FSWP)
- Express Entry — Canadian Experience Class (CEC)
- Express Entry — Federal Skilled Trades (FST)
- Express Entry — Category-Based (Healthcare, STEM, Trades, Defence, Innovation)
- PNP — Ontario Immigrant Nominee Program (OINP)
- PNP — British Columbia PNP (BC PNP)
- PNP — Alberta Advantage Immigration Program (AAIP)
- Spousal Sponsorship (Inland)
- Spousal Sponsorship (Outland)
- RCIP (Rural Community Immigration Pilot)
- FCIP (Francophone Community Immigration Pilot)
- Study Permit → PGWP → PR pathway
- Atlantic Immigration Program (AIP)

**Tela de Planos do Casal:**
- 3 slots: Plano A (principal), Plano B (secundário), Plano C (terciário)
- Drag & drop para reordenar prioridade
- Cada plano mostra: programa, status, timeline, próximo passo
- Botão para trocar programa de qualquer plano a qualquer momento
- Comparador side-by-side de até 3 programas

### ETAPA 6 — JOURNEY MAP (Tracker de Jornada)

**Visualização:**
- Timeline vertical interativa com todas as fases macro
- Cada fase expande para mostrar micro-etapas (steps)
- Status visual por cor: concluído (verde), em andamento (azul), pendente (cinza), bloqueado (vermelho)
- Cada step com: título, descrição, atribuição (Rafael ou Luana), due date, checkbox de conclusão
- Estimated dates baseadas nos processing times reais do IRCC

**Fases macro padrão (template por programa):**
Para Express Entry:
1. Pesquisa e Decisão (1-2 meses)
2. Análise de Perfil e Elegibilidade (2-4 semanas)
3. Preparação de Requisitos — IELTS, ECA, documentos (2-6 meses)
4. Criação do Express Entry Profile (1-2 semanas)
5. Aguardar ITA — Invitation to Apply (variável)
6. Submissão da Aplicação Completa (60 dias após ITA)
7. Processing e Aguardo — medical, biometrics, background (7 meses)
8. Confirmação de PR e Landing (1-3 meses)
9. Estabelecimento no Canadá (contínuo)
10. Cidadania Canadense (3+ anos após landing)

**Cada fase gera automaticamente micro-steps.** Exemplo para "Preparação de Requisitos":
- [ ] Agendar IELTS/CELPIP (Rafael)
- [ ] Agendar IELTS/CELPIP (Luana)
- [ ] Estudar para teste — meta: CLB 7+ (Rafael)
- [ ] Estudar para teste — meta: CLB 7+ (Luana)
- [ ] Fazer o teste (Rafael)
- [ ] Fazer o teste (Luana)
- [ ] Solicitar ECA via WES (Rafael)
- [ ] Solicitar ECA via WES (Luana)
- [ ] Traduzir documentos — certidões, diplomas
- [ ] Reunir cartas de emprego
- [ ] Juntar proof of funds

**Interatividade:**
- Clicar em step → modal com detalhes, instruções, links úteis
- Marcar step como concluído → animação de celebração + achievement check
- Steps atrasados → highlight vermelho + notificação
- Progresso da fase atualiza automaticamente ao completar steps

### ETAPA 7 — GESTÃO DE DOCUMENTOS

**Tela de Documentos:**
- Agrupados por: pessoa (Rafael / Luana) e por programa/plano
- Card de cada documento com: nome, tipo, status (badge colorido), data de emissão, data de vencimento
- Barra de progresso: X de Y documentos prontos
- Filtro por: status, pessoa, programa
- Sorting por: urgência (vencendo primeiro), status, nome

**Status de documentos:**
- 🔴 Não iniciado
- 🟡 Em obtenção
- 🔵 Enviado
- 🟢 Aprovado
- ⚫ Vencido
- 🟠 Precisa atualizar

**Alertas automáticos:**
- IELTS/CELPIP vencendo em 90/60/30/7 dias → notificação
- ECA vencendo em 6 meses → notificação
- Passaporte vencendo em 1 ano → notificação
- Documento necessário para próxima fase → notificação

**Template de documentos por programa** (seedado):
Ao selecionar um programa, o sistema automaticamente cria a checklist de documentos necessários para cada cônjuge.

### ETAPA 8 — TRACKING DE IDIOMAS

**Tela de Idiomas:**
- Card por pessoa (Rafael / Luana) com:
  - Teste atual: tipo (IELTS/CELPIP/TEF), data, status
  - Scores atuais: Speaking, Listening, Reading, Writing + CLB equivalente
  - Scores necessários: meta por programa selecionado (Plano A/B/C)
  - Gap visual: barra de progresso mostrando score atual vs meta
  - Status do teste: Planejado → Agendado → Realizado → Vencido

**Benchmarks por programa (seedados):**
- Express Entry FSWP: CLB 7 mínimo (IELTS 6.0 cada banda)
- Express Entry CEC: CLB 7 (NOC TEER 0,1) ou CLB 5 (NOC TEER 2,3)
- PNP varia por província
- Spousal: CLB 4 mínimo recomendado
- Pontos extras CRS: CLB 9+ = máximo de pontos de idioma

**Funcionalidades:**
- Registrar múltiplos testes (histórico)
- Comparar evolução entre testes
- Simulação: "se eu tirar X no speaking, meu CRS sobe para Y"
- Countdown até vencimento do teste (2 anos de validade)

### ETAPA 9 — SIMULADOR DE CRS

**Calculadora interativa:**
- Formulário com todas as variáveis do CRS:
  - Idade, educação, idioma (1o e 2o), experiência (CA e exterior)
  - Estado civil, perfil do cônjuge (idioma, educação, experiência)
  - Oferta de emprego, nomination provincial, irmão/irmã no Canadá
- Score total calculado em tempo real conforme muda inputs
- Breakdown visual: Core (max 460/500) + Spouse (max 40) + Skill Transfer (max 100) + Additional (max 600)
- Linha de corte do último draw do Express Entry para comparação
- Simulador "What if": ajustar variáveis e ver impacto no score
- Comparação lado a lado: Rafael como principal vs Luana como principal → quem dá score maior?

**Dados reais (seedar):**
- Tabela de pontos CRS oficial do IRCC
- Últimos draws com CRS mínimo e número de ITAs
- Processing times por programa (atualizar periodicamente)

### ETAPA 10 — SISTEMA DE GAMIFICAÇÃO

**Conquistas (Achievements):**
- 🎯 "Primeiro Passo" — Completou o onboarding
- 📋 "Organizado" — Todos os documentos de uma fase concluídos
- 🗣️ "Poliglota" — Score de idioma atingiu a meta do programa
- 📈 "Em Ascensão" — CRS subiu em relação ao último cálculo
- ✈️ "Plano Traçado" — Definiu Plano A, B e C
- ⭐ "Fase Completa" — Completou uma fase inteira da jornada
- 🔥 "Streak de 7" — 7 dias seguidos atualizando o progresso
- 🏆 "Metade do Caminho" — 50% da jornada concluída
- 🍁 "PR Approved!" — Marco final: Permanent Residence aprovado
- 🇨🇦 "Cidadão Canadense" — Marco final: Cidadania obtida

**Barra de XP / Nível:**
- Cada step concluído = XP
- Cada documento enviado = XP
- Cada teste de idioma feito = XP
- Levels: Explorador → Planejador → Aplicante → Residente → Cidadão

**Streak:**
- Contador de dias consecutivos de atividade
- Visual tipo "GitHub contributions" com calendar heatmap
- Motivação: "Você está há X dias investindo no seu futuro!"

### ETAPA 11 — NOTIFICAÇÕES E ALERTAS

**Tipos de notificação:**
1. 📄 Documento vencendo (90/60/30/7 dias antes)
2. ⏰ Prazo de step chegando (7/3/1 dia antes)
3. 📊 Novo draw do Express Entry (com CRS mínimo)
4. ⚖️ Mudança em lei/programa de imigração
5. 🏆 Achievement desbloqueado
6. 📌 Lembrete de atividade (se ficar X dias sem acessar)

**Canais:**
- In-app (centro de notificações na sidebar)
- Email via Resend (digest diário ou alertas críticos)

### ETAPA 12 — STORYBOOK (Design System Wired)

1. Instalar Storybook: `npx storybook@latest init`
2. Configurar `.storybook/preview.ts` para importar `globals.css` e usar tokens de `design-system/tokens.ts` nos backgrounds
3. Criar stories para Design Tokens:
   * `stories/design-tokens/Colors.stories.tsx` — Grid visual de todas as cores importadas de `tokens.ts`
   * `stories/design-tokens/Typography.stories.tsx` — Escala tipográfica importada de `tokens.typography`
   * `stories/design-tokens/Spacing.stories.tsx` — Barras visuais importadas de `tokens.spacing`
4. Criar stories para cada componente UI base (Button, Card, Input, Badge, Dialog, Select, Tabs)
5. Criar stories para componentes do produto:
   * `stories/components/ProgressRing.stories.tsx`
   * `stories/components/CRSComparison.stories.tsx`
   * `stories/components/PlanCard.stories.tsx`
   * `stories/components/StepItem.stories.tsx`
   * `stories/components/DocumentCard.stories.tsx`
   * `stories/components/ScoreGapBar.stories.tsx`
   * `stories/components/AchievementCard.stories.tsx`
   * `stories/components/StreakCounter.stories.tsx`
   * `stories/components/ProfileSwitcher.stories.tsx`
6. Todas as stories DEVEM importar tokens de `design-system/tokens.ts` — isso garante que mudanças nos tokens propagam automaticamente

**REGRA WIRED:** Editar `tokens.ts` → rodar `npm run tokens` → mudanças refletem no produto E no Storybook.

### ETAPA 13 — CONFIGURAÇÃO FINAL

- `.env.example` completo com todas as variáveis
- `.gitignore` (incluindo `.env.local`)
- `README.md` com setup passo a passo
- Seeds de dados (programas de imigração, fases template, documentos por programa, tabela CRS)

Verificação do Design System:
* Rodar `npm run tokens:check` para verificar sincronização
* Verificar zero hex hardcoded nos componentes
* Testar responsividade em mobile (375px), tablet (768px) e desktop (1440px)
* Adicionar `npm run tokens:check` no CI/CD pipeline

### ETAPA 14 — LANDING PAGE (BÔNUS — DEPOIS DA EXPERIÊNCIA LOGADA)

> **Prioridade baixa.** Só implementar DEPOIS que toda a experiência logada (Etapas 1-13) estiver funcionando. O foco do MVP é a experiência do casal logado, não aquisição de usuários.

Seções: Hero → Problema → Solução → Features → Como Funciona → CTA → Footer

**Hero:**
- Headline: "Seu GPS para imigrar para o Canadá"
- Subtítulo: "O primeiro sistema que guia casais e famílias em cada etapa — da análise de perfil até a cidadania canadense."
- CTA: "Começar minha jornada" → /login
- Visual: ilustração/mockup do dashboard com maple leaf elements

**Problema:**
- "Você sabe que quer ir para o Canadá. Mas não sabe por onde começar, nem em que etapa está, nem qual programa é melhor para vocês."

**Solução:**
- "MapleTrack organiza toda a jornada de imigração do seu casal em um único lugar, com próximos passos claros e prazos que você não vai perder."

**Features (6 cards):**
1. Avaliação de Score CRS — Saiba exatamente onde cada um está
2. Planos A, B e C — Escolha os melhores caminhos e mude quando precisar
3. Journey Map — Veja toda a jornada, do primeiro passo à cidadania
4. Gestão de Documentos — Nunca mais perca um prazo ou entregue doc vencido
5. Tracking de Idiomas — Acompanhe scores e saiba quanto falta
6. Gamificação — Se motive com conquistas e streaks

**Screenshots:** Tirar screenshots reais do app logado e usar na landing page.

---

## STACK OBRIGATÓRIA

| Tecnologia | Função |
|---|---|
| Next.js 14+ (App Router) | Framework full-stack |
| TypeScript strict | Tipagem |
| Tailwind CSS 4 | Estilização |
| Framer Motion | Animações e transições |
| TanStack Query | Data fetching client |
| Drizzle ORM | ORM + migrations (PostgreSQL/Neon) |
| Zod | Validação |
| Auth.js v5 (NextAuth) | Autenticação |
| shadcn/ui | Componentes UI base |
| Lucide Icons | Iconografia |
| Recharts | Gráficos e visualizações |
| Resend | Emails transacionais |
| Sonner | Toast notifications |
| Storybook 10 | Design System documentation & testing |
| design-system/tokens.ts | Design tokens single source of truth |

## HOSPEDAGEM

| Serviço | Função | Tier |
|---|---|---|
| Vercel | App hosting | Free |
| Neon | PostgreSQL | Free |
| Resend | Emails | Free (3k/mês) |
| Stripe | Pagamentos | Futuro |

## ESTRUTURA DE PASTAS

```
maple-track/
├── app/
│   ├── (public)/                    # Rotas públicas
│   │   ├── page.tsx                 # Landing page
│   │   └── login/page.tsx           # Login
│   ├── (auth)/                      # Rotas protegidas
│   │   ├── dashboard/page.tsx       # Dashboard do casal
│   │   ├── onboarding/             # Wizard de onboarding (steps)
│   │   ├── programs/               # Catálogo de programas
│   │   │   ├── page.tsx            # Lista de programas
│   │   │   ├── [id]/page.tsx       # Detalhe do programa
│   │   │   └── compare/page.tsx    # Comparador side-by-side
│   │   ├── plans/                  # Planos A/B/C do casal
│   │   │   └── page.tsx
│   │   ├── journey/               # Journey Map
│   │   │   ├── page.tsx           # Timeline visual
│   │   │   └── [phaseId]/page.tsx # Fase expandida com steps
│   │   ├── documents/             # Gestão de documentos
│   │   │   └── page.tsx
│   │   ├── languages/             # Tracking de idiomas
│   │   │   └── page.tsx
│   │   ├── simulator/             # CRS Calculator
│   │   │   └── page.tsx
│   │   ├── achievements/          # Gamificação
│   │   │   └── page.tsx
│   │   ├── notifications/         # Centro de notificações
│   │   │   └── page.tsx
│   │   └── settings/              # Configurações
│   │       ├── page.tsx           # Perfil
│   │       ├── household/page.tsx # Gerenciar household/cônjuge
│   │       └── billing/page.tsx   # Futuro — assinatura
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── profile/route.ts
│   │   ├── household/route.ts
│   │   ├── programs/route.ts
│   │   ├── plans/route.ts
│   │   ├── journey/route.ts
│   │   ├── documents/route.ts
│   │   ├── languages/route.ts
│   │   ├── crs/route.ts
│   │   ├── achievements/route.ts
│   │   └── notifications/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                        # shadcn/ui base components
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── profile-switcher.tsx   # Toggle Rafael ↔ Luana
│   │   └── mobile-nav.tsx
│   ├── dashboard/
│   │   ├── progress-ring.tsx
│   │   ├── next-actions.tsx
│   │   ├── crs-comparison.tsx
│   │   ├── plan-card.tsx
│   │   └── alerts-card.tsx
│   ├── onboarding/
│   │   ├── wizard-container.tsx
│   │   ├── step-personal.tsx
│   │   ├── step-education.tsx
│   │   ├── step-experience.tsx
│   │   ├── step-language.tsx
│   │   ├── step-spouse.tsx
│   │   ├── step-finances.tsx
│   │   ├── step-children.tsx
│   │   ├── step-preferences.tsx
│   │   └── step-results.tsx
│   ├── journey/
│   │   ├── timeline.tsx
│   │   ├── phase-card.tsx
│   │   ├── step-item.tsx
│   │   └── step-modal.tsx
│   ├── programs/
│   │   ├── program-card.tsx
│   │   ├── program-detail.tsx
│   │   ├── eligibility-badge.tsx
│   │   └── compare-table.tsx
│   ├── documents/
│   │   ├── document-card.tsx
│   │   ├── document-checklist.tsx
│   │   └── expiry-alert.tsx
│   ├── languages/
│   │   ├── score-card.tsx
│   │   ├── score-gap-bar.tsx
│   │   └── test-history.tsx
│   ├── simulator/
│   │   ├── crs-calculator.tsx
│   │   ├── score-breakdown.tsx
│   │   └── what-if-slider.tsx
│   ├── gamification/
│   │   ├── achievement-card.tsx
│   │   ├── xp-bar.tsx
│   │   ├── streak-counter.tsx
│   │   └── celebration-modal.tsx
│   └── notifications/
│       ├── notification-center.tsx
│       └── notification-item.tsx
├── lib/
│   ├── auth.ts                    # Auth.js config
│   ├── db.ts                      # Drizzle + Neon connection
│   ├── email.ts                   # Resend helpers
│   ├── validations.ts             # Zod schemas
│   ├── crs-calculator.ts          # Lógica de cálculo CRS
│   ├── program-matcher.ts         # Matching perfil → programas
│   ├── journey-templates.ts       # Templates de fases/steps por programa
│   ├── document-templates.ts      # Templates de docs por programa
│   └── achievements.ts            # Lógica de gamificação
├── hooks/
│   ├── use-household.ts
│   ├── use-profile.ts
│   ├── use-journey.ts
│   ├── use-documents.ts
│   └── use-achievements.ts
├── types/
│   └── index.ts
├── db/
│   ├── schema.ts                  # Drizzle schema
│   ├── migrations/
│   └── seed.ts                    # Seed de programas, fases, docs templates
├── design-system/
│   ├── tokens.ts                  # Source of truth for all design tokens
│   ├── utils.ts                   # Token conversion helpers
│   └── generate-css.ts            # CSS generator script
├── stories/
│   ├── design-tokens/             # Colors, Typography, Spacing stories
│   ├── ui/                        # UI component stories (Button, Card, etc.)
│   └── components/                # Product component stories
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── public/
│   ├── maple-leaf.svg
│   └── screenshots/
├── .env.local                     # ✅ Já configurado
├── .env.example
├── middleware.ts
├── next.config.ts
├── drizzle.config.ts
├── FRAMING.md                     # ✅ Já criado
├── BUILD-INSTRUCTIONS.md          # Este arquivo
└── package.json
```

---

## VARIÁVEIS DE AMBIENTE

```env
# Database (Neon) ✅ Configurado
DATABASE_URL=postgresql://...

# Auth.js v5
AUTH_SECRET=                       # ✅ Configurado (NEXTAUTH_SECRET)
AUTH_GOOGLE_ID=                    # ⏳ Google Cloud Console
AUTH_GOOGLE_SECRET=                # ⏳ Google Cloud Console

# Resend ✅ Configurado
RESEND_API_KEY=re_...

# Stripe (futuro)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PRO=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## DECISÕES E AJUSTES

1. **Drizzle ORM (não Prisma)** — Já instalado no projeto. Mais leve, melhor DX com TypeScript, compatível com Neon serverless.
2. **Framer Motion obrigatório** — Animações são requisito do produto. Toda transição, progress bar e celebração deve ter motion.
3. **Duo-first design** — Toda UI pensada para casal. Avatares duplos, dados lado a lado, atribuição de tarefas por pessoa.
4. **Gamificação no core** — Não é feature secundária. Achievements e streaks são parte essencial da motivação.
5. **Seeds com dados reais** — Programas de imigração, CRS table, processing times baseados em dados IRCC Março/2026.
6. **Mobile-first responsivo** — O casal vai acessar do celular frequentemente. Toda tela deve funcionar em 375px.
7. **Sem Stripe no MVP** — Foco é na experiência da família. Pagamentos serão implementados quando decidir escalar.
8. **Storybook incluído** — Design System wired com Storybook. Stories importam tokens de `design-system/tokens.ts`, garantindo que mudanças nos tokens propagam para produto e documentação simultaneamente.
9. **Journey templates por programa** — Ao selecionar um programa, o sistema gera automaticamente as fases e steps baseado em templates predefinidos.
10. **Idioma da interface: Português (BR)** — Interface principal em PT-BR. Termos técnicos de imigração mantidos em inglês (CRS, ITA, PR, COPR, etc.).
11. **Sonner para toasts** — shadcn/ui toast foi depreciado.
12. **Auth.js v5 env vars** — Usa `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.
13. **Middleware leve** — NÃO importar Auth.js no middleware. Checar cookie diretamente para respeitar limite de 1MB do Edge do Vercel free.

---

## [MEU PRODUTO]

```
Nome do produto: MapleTrack
Tagline: "Seu GPS para imigrar para o Canadá"
Subtítulo: "O primeiro sistema que guia casais e famílias em cada etapa — da análise de perfil até a cidadania canadense."

Usuários:
- Rafael Guimarães (builder + aplicante)
- Luana (cônjuge + aplicante)

Features principais:
1. Avaliação de Score CRS — calculadora personalizada para cada cônjuge
2. Seleção de Programas + Planos A/B/C — recomendação e priorização
3. Journey Map — tracker visual de toda a jornada macro/micro
4. Gestão de Documentos — checklist por programa com alertas de vencimento
5. Tracking de Idiomas — scores, metas por programa, gap visual
6. Sistema de Gamificação — achievements, XP, streaks, levels
7. Simulador CRS — "what if" interativo com comparação entre cônjuges
8. Notificações inteligentes — prazos, documentos, draws, mudanças de lei

Entidades do banco: (listadas na ETAPA 1)

Planos (futuro):
- FREE: acesso limitado (quiz + recomendação básica)
- FAMILY (R$49/mês): acesso total para household de até 2 adultos + filhos
- Agora: tudo liberado para a família (MVP pessoal)

Paleta: "Aurora Boreal" 🌌 (Dark-mode first, inspirada nas Northern Lights do Canadá)
- Background: Slate 950 (#020617)
- Surface: Slate 900 (#0F172A)
- Card: Slate 800 (#1E293B)
- Border: Slate 700 (#334155)
- Primary (Teal): (#0D9488) — ações, navegação ativa, progresso
- Primary Light: (#14B8A6) — hover, gradients
- Maple Accent (Rose): (#E11D48) — urgência, alertas, identidade canadense
- Info / Links (Sky): (#38BDF8) — links, dados informativos
- Success (Emerald): (#10B981) — concluído, aprovado
- Warning (Amber): (#F59E0B) — prazos, atenção
- Text: (#F1F5F9) — texto principal
- Text Muted: (#94A3B8) — labels, subtítulos
- Text Dim: (#64748B) — placeholders, metadata

Tipografia:
- Body: Inter
- Headings: Cal Sans ou Clash Display
- Monospace: JetBrains Mono (scores, códigos)
```

---

> **STATUS: AGUARDANDO COMANDO DO RAFAEL PARA INICIAR DESENVOLVIMENTO**
>
> Quando Rafael disser "pode começar", seguir as etapas na ordem:
>
> **Core (experiência logada — PRIORIDADE):**
> 1 (Schema) → 2 (Auth) → 3 (Onboarding) → 4 (Dashboard) → 5 (Programas/Planos) → 6 (Journey Map) → 7 (Documentos) → 8 (Idiomas) → 9 (Simulador CRS) → 10 (Gamificação) → 11 (Notificações)
>
> **Polish:**
> 12 (Storybook) → 13 (Config Final)
>
> **Bônus (depois de tudo funcionando):**
> 14 (Landing Page)
