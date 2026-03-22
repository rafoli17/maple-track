# FRAMING — MapleTrack
## Sistema de Imigração para o Canadá

---

## QUAL É O PROBLEMA?

**1. Qual é o problema que estamos tentando resolver?**
Nenhuma empresa consegue ajudar o Rafael e a Luana direito no processo de imigração. Falta clareza, acompanhamento e uma ferramenta que guie o casal de ponta a ponta.

**2. O que está quebrado ou ineficiente hoje?**
- Não há clareza do processo nem do caminho atual
- Não sabem onde estão na jornada de imigração
- Não sabem quanto falta
- Não sabem se precisam mudar de caminho ou ter outro plano
- Não sabem quem é o melhor aplicante (Rafael ou Luana)
- Não sabem onde há mais oportunidades
- Não sabem quais caminhos fazem mais sentido para o perfil do casal
- Não conhecem o próprio score (CRS)

**3. Quem é diretamente impactado por esse problema?**
A família do Rafael e da Luana diretamente, mas o problema afeta muitas outras famílias brasileiras.

**4. Onde esse problema aparece no fluxo do usuário?**
Não existe uma solução que resolva isso ainda. O problema é a ausência total de produto.

**5. Por que esse problema precisa ser atacado agora e não depois?**
As leis de imigração estão cada vez mais restritivas e fechando caminhos. Cada mês sem ação é um mês perdido.

**6. Se nada for feito, o que piora nos próximos 3–6 meses?**
A família fica cada vez mais tempo no Brasil sem avançar no processo.

**7. Se apenas uma necessidade pudesse ser resolvida, qual seria?**
Guiar o casal no caminho escolhido: mostrar como ir fazendo cada etapa, acompanhar o progresso e sempre mostrar o próximo passo.

---

## QUAL É O APETITE?

**1. Tempo de investimento:**
- [x] 1 semana (MVP core)
- [x] 2 semanas (MVP completo)

**2. Equipe disponível:**
Rafael usando Claude Code (solo builder).

---

## QUAL É A POSSÍVEL SOLUÇÃO?

**1. Ideia central (uma frase):**
Um sistema responsivo de imigração para o Canadá que guia o casal em cada micro e macro etapa até a cidadania.

**2. Concorrentes:**
Consultorias tentam resolver, mas têm sistemas fechados sem acesso para o cliente. Nenhuma ferramenta self-service existe.

**3. Requisitos essenciais (must-have):**

### Core Features
- [ ] **Avaliação de score do casal** — CRS calculator para Rafael e Luana separadamente
- [ ] **Seleção e sugestão de caminhos** — Recomendar programas rankeados por fit
- [ ] **Plano A, B e C** — Eleger caminho principal, secundário e terciário
- [ ] **Flexibilidade de planos** — Poder mudar de caminho a qualquer momento se as leis mudarem
- [ ] **Atualizado com leis de imigração** — Base de conhecimento sempre atual
- [ ] **IA que guia** — Inteligência que orienta decisões e próximos passos

### Inglês / Idiomas
- [ ] **Acompanhamento de inglês** — Nível atual, tipo de teste (IELTS/CELPIP/TEF)
- [ ] **Notas necessárias por plano** — Quanto precisa para cada programa
- [ ] **Tracking de progresso** — Mapear quando alcançou cada benchmark

### Documentos
- [ ] **Todos os documentos na plataforma** — Checklist completo por programa
- [ ] **Solicitação por plano** — Plataforma pede os docs certos para cada caminho
- [ ] **Acompanhamento de validade** — Alerta quando CELPIP/IELTS/ECA vai vencer

### Experiência
- [ ] **Gamificação** — Sistema de motivação com progresso visual
- [ ] **Acesso individual** — Rafael e Luana com login separado (mesmo household)
- [ ] **Design moderno** — Limpo, bonito, melhores práticas de UI, animações

**4. Se o prazo estourar, o inegociável é:**
Acompanhar passos micro e macro + sempre ter tarefas para cumprir (next steps claros).

**5. O que o usuário poderá fazer que hoje não consegue:**
Ser guiado em todo o processo de imigração para o Canadá.

**6. Como perceber que melhorou:**
Simplesmente podendo usar — a existência do produto já é a melhoria.

**7. Hipótese principal:**
Isso revolucionará o mundo de imigração para o Canadá, começando por este MVP para a família.

**8. Indicador de sucesso:**
Quando conseguirem usar a experiência, interagir com todos os passos e avançar nas etapas.

**9. Planos/pricing:**
Futuro: versões individuais e outros planos. Agora: foco total em família/casal.

**10. Impacto em outras áreas:**
Não — projeto greenfield.

---

## RABBIT HOLES

**O que NÃO faz parte desta iniciativa:**
- Qualquer processo não relacionado a imigração para o Canadá

---

## NO-GO'S

**Dentro do escopo:**
- Tudo que apoie o processo de imigração de uma família/casal

**Fora do escopo:**
- Tudo que não seja focado em imigração de casal/família
- Sugestões de sites, cursos, conteúdo educacional (melhorias futuras)
- Qualquer feature não essencial para a experiência agora

---

## USUÁRIOS

| Pessoa | Papel |
|--------|-------|
| **Rafael** | Principal applicant (a avaliar) / Builder |
| **Luana** | Co-applicant (a avaliar) / Primeira usuária |

---

## STACK TÉCNICA

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js + Tailwind CSS + shadcn/ui |
| Backend | Next.js API Routes |
| Database | Neon (PostgreSQL) + Drizzle ORM |
| Auth | NextAuth.js (Google OAuth) |
| Email | Resend |
| Payments | Stripe (futuro) |
| Deploy | Vercel |
| Design | Figma + Code Connect |
| AI | Claude (assistente de imigração) |

---

> **STATUS: AGUARDANDO COMANDO PARA INICIAR DESENVOLVIMENTO**
