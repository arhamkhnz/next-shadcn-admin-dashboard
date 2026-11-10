# Planejamento — Localização (pt-BR) do shadcn-admin-sqlite

> Criado em 2026-11-09. Refere-se ao estado do repositório em d4f8a58.
> Piloto concluído: telas **Default** e **Users**, sidebar e header já traduzidos (commit 1ae140e).
> Lote A concluído: finance, crm, analytics, productivity (commit bbfdbb9).

---

## 1. Objetivo

Traduzir toda a UI do aplicativo para português do Brasil, com a regra de vocabulário acordada:

> **Mantém-se em inglês apenas o que é inglês "por senso comum"**: nomes próprios, siglas consagradas
> (`CRM`, `KPI`, `SQL`), nomes de produto/tecnologia (`shadcn`, `TanStack`, `Next.js`) e termos de
> marca/empresa nos dados mockados (`Weblabs Studio`, `Acme Inc.`, `Sandbox`).

**Fora do escopo:** rotear URLs, IDs de rotas, nomes de arquivos, presets de tema e códigos de commit.
Tradução não deve alterar comportamento, filtros, ordenação ou teclas de atalho.

---

## 2. Protocolo de tradução (cada tela, sempre na mesma ordem)

1. **Metadados** — `title` e `description` de `page.tsx` (mantém `alternates.canonical`).
2. **Chrome da tela** — títulos, descrições, botões, selects, tabs, tooltips, empty states, "Nenhum resultado.".
3. **Colunas e tabelas** — cabeçalhos, menus de dropdown, paginação, rótulos `sr-only` e `aria-label`.
4. **Dados categóricos** — status, tipos, categorias: os valores exibidos são traduzidos e os
   valores de filtro/enum devem ficar **idênticos** aos dados (o filtro usa `equalsString`).
5. **Datas** — mocks com strings pt ou "25 Jun 2024, 9:23 AM" → migrar para ISO (`2024-06-25T09:23:00`)
   e exibir com `date-fns` + locale `ptBR` (`d 'de' MMMM 'de' yyyy, HH:mm`).
6. **Formatos numéricos** — separador de milhar com ponto (`18.426 clientes`), moeda no contexto da tela.
7. **Auditoria da tela** — grep por strings visíveis em inglês restantes; aprovar exceções (nomes próprios).

### Regras técnicas fixas

- Sentinela "Todos": nos selects de filtro, `value === "Todos"` (não "All").
- Sempre traduzir `value` **e** `label` das opções de filtro juntas com os dados.
- Locale de datas: `import { ptBR } from "date-fns/locale"`; formatos sem `do`/ordinais (feios em pt-BR).
- Horários em 24h (`HH:mm`); remover sufixo AM/PM dos dados mockados.
- `aria-label`, `placeholder` e `sr-only` são texto do usuário: traduzir sempre.

---

## 3. Glossário canônico (referência para todos os lotes)

| EN | pt-BR |
|---|---|
| Users | Usuários |
| Customer / Customers | Cliente(s) |
| Status | Status |
| Active | Ativo |
| Pending invite | Convite pendente |
| Locked / Suspended | Bloqueado / Suspenso |
| Role / Team | Função / Equipe |
| Workspace | Espaço de trabalho |
| Billing | Cobrança |
| Plan | Plano |
| Joined date | Data de entrada (Users) / Data de cadastro (Default) |
| Export / Hide / Customize | Exportar / Ocultar / Personalizar |
| Rows per page | Linhas por página |
| Page X of Y | Página X de Y |
| No results. | Nenhum resultado. |
| Search… | Buscar… |
| Newest/Oldest first | Mais recentes primeiro / Mais antigos primeiro |
| Last 30 days | Últimos 30 dias |
| Paid / Pending / Overdue / Trial | Pago / Pendente / Em atraso / Teste |
| Subscribed / Inactive / Unsubscribed | Assinante / Inativo / Descadastrado |
| Total Revenue | Receita total |
| New Customers | Novos clientes |
| Active Accounts | Contas ativas |
| Growth Rate | Taxa de crescimento |
| Segments | Segmentos |
| Sort | Ordenar |
| Actions | Ações |
| Edit / Manage / Resend | Editar / Gerenciar / Reenviar |
| Balance / Wallet | Saldo / Carteira |
| Net worth / Savings rate | Patrimônio líquido / Taxa de poupança |
| Stage / Health | Estágio / Saúde |
| Opportunity / Deal | Oportunidade / Negócio |
| On Track / Needs Review / At Risk / On Hold | Em dia / Precisa de revisão / Em risco / Em pausa |
| Autopay | Débito automático |
| Realtime / Unique Visitors | Visitantes em tempo real / únicos |
| Pageviews | Visualizações de página |
| Traffic sources / Referrers | Fontes de tráfego / Indicadores |
| Organic Search / Direct / Referral / Paid | Busca orgânica / Direto / Indicação / Pago |
| Traffic Quality / Baseline | Qualidade do tráfego / Qualidade de referência |
| Year to date | Desde o início do ano |
| Deep Work | Trabalho profundo |
| Out for Delivery / Customs Hold / On Hold (envio) | Saiu para entrega / Retenção aduaneira / Em pausa |
| Fulfilled / Unfulfilled / Refunded / Returned | Atendido / Não atendido / Reembolsado / Devolvido |
| Needs action / Returns (filtro) | Precisa de ação / Devoluções |
| Inventory / In stock / Low stock / Out of stock | Estoque / Em estoque / Estoque baixo / Esgotado |
| Stock Accuracy / Average Order / Return Requests | Exatidão de estoque / Ticket médio / Solicitações de devolução |
| Top Products / Store Traffic / Anomalies | Produtos mais vendidos / Tráfego da loja / Anomalias |
| Gradebook / Assignment / Avg. Attendance | Diário de notas / Atividade / Frequência média |
| Most Improved / Top Performer | Maior evolução / Melhor desempenho |
| Shipment / Tier (Priority/Standard/Non-priority) | Envio / Prioridade / Padrão / Sem prioridade |
| Transport mode (land/air/sea, road/flight/ship) | terrestre · aéreo · marítimo / rodoviário · aéreo · marítimo |
| Central Patient Monitoring / Acknowledge(d) | Central de monitoramento de pacientes / Reconhecer / Reconhecido |
| Full disclosure / Event review | Registro completo / Revisão de eventos |
| HR / RR (clínico) / Resp | FC / FR |
| Kanban (Ideas/Planned/Building/QA/Shipped) | Ideias / Planejado / Em execução / QA / Entregue |
| Kanban prioridades (Low/Medium/High) | Baixa / Média / Alta |
| Teams (Data/Finance Ops/Platform/Product/Security) | Dados / Operações Financeiras / Plataforma / Produto / Segurança |
| Tasks (backlog, To do/In progress/Done/Cancelled) | backlog / A fazer / Em progresso / Concluído / Cancelado |
| Invoice (Due date, Amount due, Bill to, Line items) | Fatura (Vencimento, Valor devido, Cliente/Destinatário, Itens) |
| Roles (Granted/Revoked; status Active) | Concedido / Revogado; status Ativa |
| Sign in / Create account / Continue with Google | Entrar / Criar conta / Continuar com Google |
| Quick Create / Page not found / Go back home | Criar rápido / Página não encontrada / Voltar ao início |
| Inbox / Drafts / Sent / Archive / Trash | Caixa de entrada / Rascunhos / Enviados / Arquivo / Lixeira |
| Pinned (grupo) / Snoozed / Mentions / Unassigned | Fixado / Adiado(s) / Menções / Sem atribuição |
| VIP Customers / Orders & Returns / Product Feedback | Clientes VIP / Pedidos e devoluções / Feedback de produto |
| Qualified / At-Risk / Lead | Qualificado / Em risco / Lead |
| Internal note | Nota interna |

**Ficam em inglês por consenso do Lote A:** Retargeting, Onboarding, design system, "Q" → "T"
(roadmap T2), formato "3m 12s", marcas dos mocks (Product Hunt, Linear Plus Plan, Ledger Nano X).

Terminologia do shell já fixada: Painéis, Páginas, Legado, Diversos, Funções (Roles),
Faturas (Invoice), Gestão de usuários (Users).

---

## 4. Inventário de telas restantes

| Lote | Telas | Arquivos | Complexidade | Notas |
|---|---|---|---|---|
| A (Financeiro/produção) | `finance`, `crm`, `analytics`, `productivity` | 9+8+7+10 = 34 | Média | ✅ Concluído (bbfdbb9) |
| B (Operação) | `ecommerce`, `academy`, `logistics`, `infrastructure`, `file-manager`, `patient-monitoring` | 12+6+6+4+7+12 = 47 | Média | ✅ Concluído (em integração) |
| C (Colaboração) | `mail` (rota principal), `chat` (rota principal + dashboard), `calendar`, `kanban`, `tasks` | ~2+9+3+8+7 = 29 | Alta | ✅ Concluído (91bcc22, 324062c) |
| D (Documentos/conta) | `invoice`, `profile`, `roles`, `coming-soon`, `unauthorized` | 12+9+5+1+1 = 28 | Média | ✅ Concluído (870c1be) |
| E (Auth) | `auth/v1` e `auth/v2` (login/register) | ~10 | Baixa | ✅ Concluído (88e28e0); auth fica em `(main)/auth` |
| F (Erros e shell) | `[...not-found]`, `unauthorized`, restos do shell/footer/toolbar | — | Baixa | ✅ Concluído (075097c) |

**Decisão recomendada — telas legadas (`src/app/(main)/dashboard/(legacy)`):** manter em inglês
(não são referência e estão em manutenção mínima); a navegação já está traduzida.

### Restantes no shell/compartilhado
- `grep` final em `src/components/`, `src/app/(auth)`/layouts, fuentes e páginas de erro.
- `src/app/(main)/auth/_components` (formulários de login/registro + validações).
- Email header/toolbar e os demais componentes compartilhados de mail/chat.

---

## 5. Execução (subagentes em paralelo)

**Passo 0 — Ambiente (bloqueante):**
`npm install` para permitir `npm run build`, `npm run lint` (`@biomejs/biome check`) e dev server.

**Passo 1 — Lote A (finance, crm, analytics, productivity):** 2 subagentes em paralelo,
2 telas cada. Cada agente recebe: este plano, o glossário (seção 3) e a tela "Users" como exemplo
de referência no mesmo repositório.

**Passo 2 — Validar lote A com o usuário (screenshots claro/escuro/mobile), depois:** Lote B (2 subagentes, 3 telas cada).

**Passo 3 — Lote C (2 subagentes): mail/chat, calendar/kanban/tasks.** Atenção especial a dados mockados com texto conversacional.

**Passo 4 — Lote D + E (2 subagentes):** invoice/profile/roles + auth (mensagens de validação em pt-BR).

**Passo 5 — Fase de integração (eu):** varredura global, shell, footer, ajustes de consistência (glossário), build final.

Todo lote aplicado deve ser **commitado separadamente** (`feat: traduz lote X para pt-BR`) depois de validado.

---

## 6. Garantia de qualidade

1. **Grep audit (automatizado por tela):**
   ```bash
   rg -l --glob '!node_modules' -e '"[A-Z][a-z]+( [A-Za-z]+)+"' "src/app/(main)/dashboard/<tela>" \
     | grep -v test
   ```
   Revisar omissões aceitas por lista (nomes próprios, siglas).
2. **TypeScript/build:** `npx tsc --noEmit` e `npm run build` após cada lote (erros comuns:
   value de filtro ≠ dado; enum de status ≠ `statusMeta`).
3. **Visual:** `npm run dev` + ego-browser: screenshot de cada tela em claro, escuro e largura mobile.
4. **Funcional:** filtros ainda filtram (tradução de `value`/dado em par), ordenação de datas OK com ISO, tabela pagina.

---

## 7. Riscos e armadilhas conhecidos

| Risco | Mitigação |
|---|---|
| Filtro quebrado por `value` não traduzido junto com dado | Regra nº 4 do protocolo; audit por `equalsString` |
| `date-fns` `parse()` em formato EN quebrando sort | Migrar mocks de data para ISO (como feito em `users`) |
| Plural/singular em strings interpoladas ("1 cliente selecionado") | Usar `selecionado(s)` ou interpolar com React condicional |
| Componentes compartilhados usados por várias telas | Traduzir uma única vez, pela fase de integração |
| Vetor de temas/presets com nomes "Tangerine" etc. | Tratar como nome de marca (manter EN) |
| `capitalize` de CSS com strings pt | Verificar casca visual (`text-xs capitalize {role}`) |
| Gráficos com locale EN no eixo/tooltip | Sempre culminar com `toLocaleDateString("pt-BR")` e `locale: ptBR` |

---

## 8. Critérios de aceite (Done)

- [ ] Nenhuma string visível ao usuário em inglês (permitidas: siglas, nomes próprios, marcas).
- [ ] Filtros, ordenação, busca, paginação funcionando em todas as telas traduzidas.
- [ ] Datas e números no formato `pt-BR`, claro/escuro/móvel visualmente verificados.
- [ ] `npm run build` e `npm run lint` sem erros.
- Este arquivo atualizado: lotes marcados como concluídos com o commit correspondente.
