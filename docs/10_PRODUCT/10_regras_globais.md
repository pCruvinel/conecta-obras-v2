<!-- AI_CONTEXT: Este arquivo define a visão macro do produto, as personas e as regras de negócio invioláveis. Leia-o para entender O QUE o sistema faz e PARA QUEM. -->

# 📦 Regras Globais do Produto

> Fonte de verdade para visão, personas e mandamentos do sistema.

---

## 🎯 Visão Macro do Produto

<!-- Descreva o produto em 2-3 frases -->

**O que é:** `[Nome do produto]` é uma plataforma que...

**Problema que resolve:** ...

**Proposta de valor:** ...

### Contexto de Mercado

| Aspecto | Descrição |
|---------|-----------|
| **Segmento** | `[B2B / B2C / B2B2C]` |
| **Vertical** | `[Construção / Saúde / Finanças / etc.]` |
| **Modelo de Negócio** | `[SaaS / Marketplace / Licenciamento]` |

---

## 👥 Personas

<!-- Defina quem são os usuários do sistema -->

### Persona 1: `[Nome/Papel]`

| Campo | Descrição |
|-------|-----------|
| **Quem é** | Ex: Gerente de Obras, 35-50 anos |
| **Objetivo principal** | O que essa pessoa quer alcançar |
| **Dor principal** | Qual problema enfrenta hoje |
| **Como usamos** | Quais módulos/features usa |

### Persona 2: `[Nome/Papel]`

| Campo | Descrição |
|-------|-----------|
| **Quem é** | ... |
| **Objetivo principal** | ... |
| **Dor principal** | ... |
| **Como usamos** | ... |

### Persona 3: `[Nome/Papel]`

| Campo | Descrição |
|-------|-----------|
| **Quem é** | ... |
| **Objetivo principal** | ... |
| **Dor principal** | ... |
| **Como usamos** | ... |

---

## ⚖️ Os Mandamentos

> **Regras invioláveis do sistema.** Toda decisão de código deve respeitar estes princípios.

### 🔴 Mandamentos de Dados

| # | Regra | Justificativa |
|---|-------|---------------|
| 1 | **Nunca deletar dados, apenas soft-delete** | Auditoria e recuperação |
| 2 | **Todo registro tem `created_at` e `updated_at`** | Rastreabilidade |
| 3 | **Dados sensíveis são criptografados** | Compliance/LGPD |

### 🟡 Mandamentos de UX

| # | Regra | Justificativa |
|---|-------|---------------|
| 4 | **Ações destrutivas exigem confirmação** | Prevenção de erros |
| 5 | **Feedback visual para toda ação do usuário** | Clareza de estado |
| 6 | **Mobile-first em todas as interfaces** | Uso em campo/obra |

### 🟢 Mandamentos de Negócio

| # | Regra | Justificativa |
|---|-------|---------------|
| 7 | **Multi-tenant por organização** | Isolamento de dados |
| 8 | **Logs de auditoria para ações críticas** | Compliance |
| 9 | **[Adicionar regra específica do negócio]** | ... |

---

## 📚 Glossário

<!-- Termos específicos do domínio -->

| Termo | Definição |
|-------|-----------|
| **OS** | Ordem de Serviço |
| **CC** | Centro de Custo |
| **[Termo]** | [Definição] |

---

<sub>Última atualização: 2026-01-12</sub>
