# 🗓️ Backlog de Desenvolvimento (Pedro & Kassio)

> **Documento Vivo**: Este backlog organiza o desenvolvimento paralelo do **Conecta Obras**.
> **Objetivo**: Permitir que Pedro e Kassio trabalhem simultaneamente com o mínimo de conflito (merge conflicts).

---

## 👥 Divisão de Responsabilidades

| Desenvolvedor | Foco Principal | Módulos Chave | Cores no Kanban |
|---------------|----------------|---------------|-----------------|
| **Kassio** (Dev 2) | **Fundação, Acesso & Dados** | Auth, Leads, Dashboard, Admin | 🔵 Azul |
| **Pedro** (Dev 1) | **Gestão & Inteligência** | CRM, SDR, Consulta Plus, Chat IA | 🟠 Laranja |

---

## 📅 Sprint 1: Fundação & Estrutura (Semanas 1-2)

**Objetivo**: Ter o sistema rodando com autenticação e estruturas de dados básicas do CRM.

### 🔵 Kassio (Auth & Core)

- [ ] **Setup Supabase Auth**:
  - Configurar Providers (Email/Password)
  - Criar tabelas `public.users` (com trigger) e `public.profiles`
  - Implementar RLS base para `users`
- [ ] **Páginas de Autenticação**:
  - Login `/login`
  - Registro `/register` com seleção de plano/role (mock inicial)
  - Recuperação de senha
- [ ] **Layouts do Sistema**:
  - `DashboardLayout` (Sidebar, Header, UserNav)
  - Proteção de rotas (Middleware)
- [ ] **Módulo Dashboard (Estrutura)**:
  - Criar página inicial `/dashboard` (vazia por enquanto)
  - Componentes de Cards de KPI (skeleton)

### 🟠 Pedro (CRM Base)

- [ ] **Modelagem CRM**:
  - Criar tabela `crm_pipelines` (etapas do funil)
  - Criar tabela `crm_deals` (negócios/cards)
  - Definir tipos TypeScript para Leads/Deals
- [ ] **Componentes CRM (UI)**:
  - `KanbanBoard`: Componente de drag-and-drop
  - `KanbanColumn`: Coluna do funil
  - `KanbanCard`: Card do lead
- [ ] **Página CRM**:
  - Rota `/crm`
  - Visualização de lista vs Kanban
  - Modal de "Novo Negócio" (apenas UI e validação Zod)
- [ ] **Hooks CRM**:
  - `useDeals` (mockado inicialmente)
  - `useUpdateDealStage`

---

## 📅 Sprint 2: Dados & Funcionalidades Core (Semanas 3-4)

**Objetivo**: Usuário consegue buscar leads (Kassio) e gerenciá-los no CRM (Pedro).

### 🔵 Kassio (Leads & Maps)

- [ ] **Módulo Leads**:
  - Tabela `leads_obras` e `leads_empresas`
  - Rota `/leads/obras` com filtros avançados
  - Integração com Google Maps API (visualização de pinos)
- [ ] **Detalhes do Lead**:
  - Página `/leads/obras/[id]`
  - Galeria de fotos da obra
  - Botão "Enviar para CRM" (integração com trabalho do Pedro)
- [ ] **Sistema de Créditos (Back)**:
  - Tabela `user_credits`
  - Logic para debitar créditos ao visualizar contato

### 🟠 Pedro (CRM Full & Consulta Plus)

- [ ] **Lógica CRM Completa**:
  - Integração `useDeals` com Supabase real
  - Persistência do Drag-and-Drop
  - Histórico de atividades no card (`crm_activities`)
- [ ] **Consulta Plus**:
  - Rota `/consulta-plus`
  - Integração (mock ou real) com API CNPJ/CPF
  - Exibição de dados enriquecidos (Sócios, Dívidas)
- [ ] **Agendamentos**:
  - Componente de Agenda/Calendário dentro do card do CRM

---

## 📅 Sprint 3: Gestão & Inteligência (Semanas 5-6)

**Objetivo**: Admin controla o sistema e usuário tem ferramentas avançadas (SDR/IA).

### 🔵 Kassio (Admin & Financeiro)

- [ ] **Painel ADM**:
  - Gestão de Usuários (Franquia > Loja > Vendedor)
  - Gestão de Planos e Créditos
  - Relatórios de uso do sistema
- [ ] **Configurações**:
  - Perfil do usuário (upload foto, alterar senha)
  - Configuração da loja/franquia

### 🟠 Pedro (SDR & Chat IA)

- [ ] **Módulo SDR**:
  - Integração Evolution API (WhatsApp)
  - Cadência de mensagens
  - Templates de mensagens
- [ ] **Chat IA**:
  - Componente flutuante global
  - Integração com OpenAI/Anthropic
  - Contexto: "Responda sobre a obra X"

---

## 🔄 Pontos de Convergência (Merge Points)

> Momentos onde o trabalho dos dois se encontra. Atenção redobrada!

1.  **Fim da Sprint 1**:
    *   Auth (Kassio) deve estar pronto para o CRM (Pedro) usar `user_id` nos cards.
2.  **Meio da Sprint 2**:
    *   Botão "Enviar para CRM" (Kassio) precisa chamar a função de criar Deal (Pedro).
3.  **Deploy**:
    *   Merge das migrations do Supabase (cuidado com `supabase/migrations`).

---

## 📝 Definição de Pronto (DoD)

- [ ] Código em TypeScript sem erros (`npm run type-check`)
- [ ] Lint verificado (`npm run lint`)
- [ ] Componentes usando shadcn/ui e Tailwind
- [ ] Responsivo (Mobile/Desktop)
- [ ] RLS aplicado em todas as novas tabelas

---

<sub>Gerado para Conecta Obras em 2026-01-12</sub>
