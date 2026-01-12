<!-- AI_CONTEXT: Este arquivo define a visão macro do produto, as personas e as regras de negócio invioláveis. Leia-o para entender O QUE o sistema faz e PARA QUEM. -->

# 📦 Conecta Obras - Regras Globais

> Fonte de verdade para visão, personas e mandamentos do sistema.

---

## 🎯 Visão Macro do Produto

**O que é:** **Conecta Obras** é uma plataforma de mapeamento de obras para geração de leads, integrando CRM, consultas enriquecidas via APIs e prospecção automatizada (SDR).

**Problema que resolve:** Empresas do segmento de construção civil têm dificuldade em encontrar e qualificar leads de obras em andamento para prospecção comercial.

**Proposta de valor:** Acesso a uma base de dados de obras ativas em todo o Brasil, com ferramentas de enriquecimento de dados (telefone, e-mail, CNPJ), CRM integrado e automações de prospecção.

### Contexto de Mercado

| Aspecto | Descrição |
|---------|-----------|
| **Segmento** | B2B |
| **Vertical** | Construção Civil / Materiais de Construção |
| **Modelo de Negócio** | SaaS com créditos de consulta |

---

## 👥 Personas

### Persona 1: Vendedor de Loja de Materiais

| Campo | Descrição |
|-------|-----------|
| **Quem é** | Vendedor de loja de materiais de construção, 25-45 anos |
| **Objetivo principal** | Encontrar obras em andamento na sua região para oferecer produtos |
| **Dor principal** | Não sabe onde estão as obras ativas, perde tempo prospectando sem informações |
| **Como usamos** | Leads (pesquisa obras), CRM (acompanha leads), Consultas (enriquece contatos) |

### Persona 2: Lojista / Gerente de Loja

| Campo | Descrição |
|-------|-----------|
| **Quem é** | Dono ou gerente de loja, 35-55 anos |
| **Objetivo principal** | Monitorar performance dos vendedores e garantir conversões |
| **Dor principal** | Não tem visibilidade do esforço de prospecção da equipe |
| **Como usamos** | Painel CRM (relatórios), Dashboard (métricas), Indicadores (produtividade) |

### Persona 3: Franqueado / Gestor Regional

| Campo | Descrição |
|-------|-----------|
| **Quem é** | Responsável por múltiplas lojas em uma região |
| **Objetivo principal** | Gerenciar permissões e distribuir territórios entre lojas |
| **Dor principal** | Dificuldade em organizar cobertura territorial |
| **Como usamos** | Painel Administrativo (cadastros, permissões, distribuição de créditos) |

### Persona 4: Administrador do SaaS

| Campo | Descrição |
|-------|-----------|
| **Quem é** | Equipe técnica/comercial do Conecta Obras |
| **Objetivo principal** | Gerenciar franquias, monitorar uso de APIs, faturamento |
| **Dor principal** | Controle de consumo de créditos e logs de auditoria |
| **Como usamos** | Painel ADM (gestão completa, logs, APIs, faturamento) |

---

## ⚖️ Os Mandamentos

> **Regras invioláveis do sistema.** Toda decisão de código deve respeitar estes princípios.

### 🔴 Mandamentos de Dados

| # | Regra | Justificativa |
|---|-------|---------------|
| 1 | **Nunca deletar dados, apenas soft-delete** | Auditoria e recuperação |
| 2 | **Todo registro tem `created_at` e `updated_at`** | Rastreabilidade |
| 3 | **Logs obrigatórios para consumo de APIs pagas** | Controle de custos e auditoria |
| 4 | **Primeira consulta API salva no banco** | Economia de créditos em consultas repetidas |
| 5 | **Créditos cobrados mesmo em cache** | Modelo de negócio |

### 🟡 Mandamentos de UX

| # | Regra | Justificativa |
|---|-------|---------------|
| 6 | **Mostrar créditos antes de consumir APIs** | Transparência de custos |
| 7 | **Feedback visual para toda ação do usuário** | Clareza de estado |
| 8 | **Alerta visual quando lead já está em acompanhamento** | Evita conflito entre vendedores |
| 9 | **Cards de leads devem ser simples e escaneáveis** | Vendedores ficam 24h olhando |
| 10 | **Exportação em Excel e PDF obrigatória** | Necessidade do lojista |

### 🟢 Mandamentos de Negócio

| # | Regra | Justificativa |
|---|-------|---------------|
| 11 | **Loja não pode existir sem Franquia** | Hierarquia obrigatória |
| 12 | **Vendedor só vê seus próprios leads no CRM** | Organização e privacidade |
| 13 | **Lojista vê todos os vendedores da loja** | Gestão de equipe |
| 14 | **Permissões territoriais são hierárquicas** | Franquia → Loja → Vendedor |
| 15 | **Franquia só distribui territórios que ADM liberou** | Controle de acesso |
| 16 | **Relatórios automatizados mensais por e-mail** | Engajamento e valor |

---

## 📚 Glossário

| Termo | Definição |
|-------|-----------|
| **Lead** | Obra, empresa ou imóvel identificado como oportunidade de venda |
| **Obra** | Construção em andamento mapeada no sistema |
| **CRM** | Customer Relationship Management - gestão de relacionamento com leads |
| **SDR** | Sales Development Representative - módulo de prospecção automatizada |
| **PH3** | API de busca de dados de pessoas físicas (nome, telefone, e-mail) |
| **Azulx / DUCs** | API de busca de dados por CNPJ/CPF |
| **Deep Search** | Busca avançada com IA para enriquecimento de dados |
| **Franquia** | Entidade que organiza um grupo de lojas |
| **Loja** | Estabelecimento comercial com vendedores |
| **Créditos** | Unidade de consumo para consultas em APIs pagas |
| **Acompanhamento** | Lead salvo no CRM com status de prospecção |
| **Temperatura** | Classificação do lead (quente, morno, frio) |
| **Probabilidade** | Percentual estimado de fechamento (50%, 80%, etc.) |

---

## 🔗 Documentação Relacionada

| Documento | Descrição |
|-----------|-----------|
| [11_requisitos_funcionais.md](./11_requisitos_funcionais.md) | Funcionalidades por módulo |
| [12_historias_usuario.md](./12_historias_usuario.md) | User stories por persona |
| [13_hierarquia_usuarios.md](./13_hierarquia_usuarios.md) | Roles e permissões detalhadas |

---

<sub>Última atualização: 2026-01-12</sub>
