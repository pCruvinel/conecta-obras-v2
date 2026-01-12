<!-- AI_CONTEXT: Este arquivo contém os action items extraídos da reunião de planejamento. -->

# 📋 Action Items - Reunião 12/01/2026

> Items extraídos da reunião de planejamento do Conecta Obras.

---

## 🔴 Prioridade Alta (MVP)

| # | Item | Responsável | Status |
|---|------|-------------|--------|
| 1 | **Autenticação completa**: login, registro, recuperação de senha, modo convidado | A definir | ⏳ |
| 2 | **Trigger para public.users** quando registrar no auth | A definir | ⏳ |
| 3 | **E-mails personalizados**: boas-vindas, convite, reset senha | A definir | ⏳ |
| 4 | **Painel de cadastro de usuários** (Franquia → Loja → Vendedor) | A definir | ⏳ |
| 5 | **Página de Leads Obras** com filtros e pesquisa | A definir | ⏳ |
| 6 | **Integração API existente** para busca de obras | A definir | ⏳ |

---

## 🟡 Prioridade Média

| # | Item | Responsável | Status |
|---|------|-------------|--------|
| 7 | **Mostrar créditos antes de consulta** Azulx/PH3 | A definir | ⏳ |
| 8 | **Contexto de IA por ID da obra**: alimentar com dados de consultas | A definir | ⏳ |
| 9 | **Relatórios automatizados mensais** por e-mail | A definir | ⏳ |
| 10 | **Contador de novas obras** no dashboard | A definir | ⏳ |
| 11 | **Padronizar enums** em UPPERCASE_KEBAB nos types | A definir | ⏳ |
| 12 | **CRM robusto**: Kanban, tags, histórico, arquivos | A definir | ⏳ |

---

## 🟢 Prioridade Baixa (Roadmap)

| # | Item | Responsável | Status |
|---|------|-------------|--------|
| 13 | **Mapa de leads no CRM** com pins por etapa | A definir | ⏳ |
| 14 | **Deep Search** como alternativa ao Google | A definir | ⏳ |
| 15 | **Dashboard clicável**: cards redirecionam para Leads filtrado | A definir | ⏳ |
| 16 | **Módulo SDR** para prospecção automatizada | A definir | ⏳ |

---

## 🎨 Design System

| Item | Descrição |
|------|-----------|
| Criar Design System no V0 | Definir variáveis, buttons, cores |
| Documentar tokens | Adicionar ao documento de arquitetura |
| Consistência visual | Aplicar em todos os componentes |

---

## 📝 Decisões Tomadas

| Decisão | Justificativa |
|---------|---------------|
| Vendedor só vê seu próprio CRM | Organização e evitar conflitos |
| Alerta visual para lead já acompanhado | Informar sem bloquear |
| Loja não existe sem Franquia | Hierarquia obrigatória |
| Cache de consultas + cobrança | Economia + modelo de negócio |
| CRM separado Obras/Empresas | Clareza e organização |
| Chat IA flutuante em todas as telas | Acessibilidade |

---

## 🔧 Próximos Passos

1. **Criar conta Supabase** para desenvolvimento
2. **Definir Design System** no V0
3. **Dividir tarefas** entre desenvolvedores
4. **Começar pelo MVP**: Auth + Cadastro + Leads Obras
5. **Apresentar versão inicial** para Andrei

---

## 📅 Divisão de Trabalho Proposta

| Módulo | Pode ser paralelo? | Observação |
|--------|-------------------|------------|
| Dashboard | ✅ Sim | Independente |
| Leads | ✅ Sim | Usa API existente |
| CRM | ✅ Sim | Depende do schema |
| Painel ADM | ✅ Sim | Independente |
| Auth | ❌ Não | Schema base necessário |
| SDR | ✅ Sim | Pode começar depois |

---

<sub>Reunião realizada em 2026-01-12</sub>
