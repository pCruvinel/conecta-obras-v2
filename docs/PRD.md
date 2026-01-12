<!-- AI_CONTEXT: Este é o PRD (Product Requirements Document) principal do Conecta Obras. Consulte-o para entender as funcionalidades detalhadas e roadmap de melhorias. -->

# 📋 PRD - Conecta Obras

> **Product Requirements Document**  
> Versão 2.0 - Redesenvolvimento da plataforma

---

## 📌 Visão Geral

### O que é o Conecta Obras?

**Conecta Obras** é uma plataforma SaaS B2B de **mapeamento de obras para geração de leads**, voltada para empresas do segmento de construção civil e materiais de construção.

### Problema que Resolve

| Dor | Impacto |
|-----|---------|
| Vendedores não sabem onde estão as obras ativas | Perda de tempo em prospecção "no escuro" |
| Falta de informações de contato dos responsáveis | Dificuldade em iniciar conversas comerciais |
| Ausência de CRM integrado ao fluxo de prospecção | Leads se perdem, sem acompanhamento |
| Gestores sem visibilidade do esforço de vendas | Impossibilidade de medir e otimizar performance |

### Proposta de Valor

> "Encontre obras em andamento, enriqueça os dados de contato e acompanhe seus leads em um único lugar."

---

## 🎯 Objetivos do Redesenvolvimento

| Objetivo | Métrica de Sucesso |
|----------|-------------------|
| Modernizar a stack tecnológica | Migração completa para Next.js 16 + Supabase |
| Melhorar UX dos vendedores | Tempo médio por pesquisa < 30 segundos |
| Aumentar engajamento no CRM | Taxa de uso do CRM > 70% dos leads salvos |
| Preparar para escala | Suporte a 500+ usuários simultâneos |

---

## 👥 Personas

### Vendedor de Loja (Usuário Principal)

| Aspecto | Descrição |
|---------|-----------|
| **Perfil** | 25-45 anos, vendedor de loja de materiais |
| **Objetivo** | Encontrar obras e fechar vendas |
| **Frequência de uso** | 4-8 horas/dia |
| **Dor principal** | "Não sei onde estão as obras na minha região" |

### Lojista / Gerente

| Aspecto | Descrição |
|---------|-----------|
| **Perfil** | 35-55 anos, dono/gerente de loja |
| **Objetivo** | Monitorar performance da equipe |
| **Frequência de uso** | 1-2 horas/dia |
| **Dor principal** | "Não consigo ver o esforço dos meus vendedores" |

### Franqueado

| Aspecto | Descrição |
|---------|-----------|
| **Perfil** | 40-60 anos, gestor de múltiplas lojas |
| **Objetivo** | Organizar territórios e distribuir recursos |
| **Frequência de uso** | 2-3 horas/semana |
| **Dor principal** | "Preciso dividir as regiões entre as lojas" |

---

## 📦 Módulos do Sistema

### 1. Dashboard

#### Funcionalidade Atual

Visão panorâmica do banco de dados de obras, exibindo:
- Total de obras por estado/cidade
- Obras por categoria (ativas, encerradas, nulas)
- Obras por tipo (alvenaria, elétrica, etc.)
- Gráficos de distribuição

#### Fluxo do Usuário

```
Usuário acessa Dashboard → Seleciona Estado → Seleciona Cidade
→ Visualiza panorama de oportunidades na região
```

#### 💡 Melhorias Sugeridas

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Cards clicáveis** | Clicar em "252 obras ativas" leva direto para Leads filtrado | P1 |
| **Contador de novas obras** | "Esta semana: +5.234 obras adicionadas" — demonstra valor | P0 |
| **Comparativo temporal** | Mostrar variação % vs semana/mês anterior | P2 |
| **Mapa de calor** | Visualização geográfica de concentração de obras | P2 |

---

### 2. Leads - Obras

#### Funcionalidade Atual

Pesquisa e filtragem avançada de obras com os seguintes filtros:

| Filtro | Descrição |
|--------|-----------|
| Categoria | Tipo geral (construção, reforma, etc.) |
| Subcategoria | Detalhamento |
| Tipo de obra | Construção, elétrica, hidráulica |
| Situação | Status atual |
| Tipo de área | Residencial, comercial, industrial |
| Data de início/término | Range de datas |
| Metragem | Tamanho em m² |
| Zona | Localização urbana |
| Destinação | Uso final |
| Tipo de responsável | PF ou PJ |

#### Ações por Card

| Ícone | Ação | Descrição |
|-------|------|-----------|
| 📍 | Mapa | Abre localização no Google Maps |
| 🔍 | Google | Pesquisa nome do responsável no Google |
| 👤 | PH3 | Busca dados de pessoa física (telefone, e-mail) |
| 🏢 | Azulx | Busca dados por CNPJ |
| 🤖 | Chat IA | Abre chat contextualizado para a obra |
| 📅 | Agendar | Cria agendamento no CRM |
| ❤️ | Favoritar | Salva como favorito |
| ➕ | Acompanhar | Adiciona ao CRM com status |
| 🗑️ | Excluir | Marca como excluído (soft delete) |

#### Regras de Negócio

1. **Filtros condicionais**: Tipo de obra altera filtros disponíveis
2. **Alerta de duplicidade**: Se lead já está em acompanhamento por outro vendedor da mesma loja, exibir alerta
3. **Exibição de créditos**: Antes de consulta PH3/Azulx, mostrar saldo e custo

#### 💡 Melhorias Sugeridas

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Deep Search com IA** | Substituir pesquisa Google por busca inteligente | P1 |
| **Contexto de IA por obra** | Salvar consultas PH3/Azulx vinculadas ao ID da obra para alimentar chat | P1 |
| **Busca por palavra-chave avançada** | Adicionar operadores AND/OR para filtrar "construtoras" | P2 |
| **Cards com preview de dados** | Mostrar telefone/e-mail diretamente no card após primeira consulta | P1 |
| **Ordenação por relevância** | Algoritmo que prioriza leads com mais dados disponíveis | P2 |

---

### 3. Leads - Empresas

#### Funcionalidade Atual

Mesma estrutura de Obras, porém focado em empresas:
- Filtro por estado/cidade
- Filtro por CNAE (tipo de empresa)
- Mesmos ícones de ação

#### 💡 Melhorias Sugeridas

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Filtro por porte** | Micro, pequena, média, grande empresa | P1 |
| **Filtro por faturamento** | Range de faturamento estimado | P2 |
| **Histórico de obras** | Empresas com histórico de obras são leads mais quentes | P1 |

---

### 4. Leads - Imóveis

#### Funcionalidade Atual

Em desenvolvimento — pestquisa de imóveis.

#### 💡 Melhorias Sugeridas

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Integração com dados de reforma** | Imóveis antigos = oportunidade de reforma | P2 |
| **Filtro por ano de construção** | Imóveis > 20 anos são candidatos a reforma | P2 |

---

### 5. CRM

#### Funcionalidade Atual

CRM básico separado por Obras e Empresas:

| Aba | Descrição |
|-----|-----------|
| **Relatórios** | Gráficos de ranking por probabilidade/temperatura |
| **Agendamentos** | Calendário com follow-ups |
| **Favoritos** | Listagem de leads favoritos |
| **Acompanhamentos** | Leads com status (seleção, contato, não respondeu) |
| **Excluídos** | Leads descartados (soft delete) |
| **Indicadores** | Contadores numéricos por período |

#### Campos de Acompanhamento

| Campo | Opções |
|-------|--------|
| **Etapa** | Seleção, contato, não respondeu, negociando, fechado |
| **Temperatura** | Quente, morno, frio |
| **Probabilidade** | 10% a 100% |

#### 💡 Melhorias Sugeridas (Prioridade Alta)

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Visualização Kanban** | Arrastar e soltar entre etapas — mais intuitivo | P0 |
| **Histórico de atividades** | Log de todas as ações (ligou, enviou mensagem, etc.) | P0 |
| **Tags personalizadas** | Etiquetas customizáveis por vendedor/loja | P1 |
| **Upload de arquivos** | Anexar propostas, orçamentos, fotos | P1 |
| **Anotações com rich text** | Formatação básica em anotações | P2 |
| **Automações** | Ex: Lead sem contato há 7 dias → notificação | P1 |
| **Mapa de leads** | Visualizar todos os leads salvos no mapa com pins coloridos por etapa | P1 |
| **Integração com WhatsApp** | Botão para abrir conversa direto no WhatsApp | P0 |
| **Timeline visual** | Linha do tempo de todas as interações | P1 |

---

### 6. Consulta Plus

#### Funcionalidade Atual

Busca livre por CNPJ ou CPF, desvinculada de uma obra específica.

#### Casos de Uso

- Vendedor tem lista de CPFs/CNPJs e quer enriquecer
- Consulta rápida para encontrar telefone de um contato específico

#### 💡 Melhorias Sugeridas

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Histórico de consultas** | Ver consultas anteriores sem gastar crédito | P1 |
| **Consulta em lote** | Upload de planilha com múltiplos CNPJ/CPF | P2 |
| **Exportação de resultados** | Baixar resultado em CSV/Excel | P1 |

---

### 7. Chat IA

#### Funcionalidade Atual

Chat com IA (OpenAI Search) disponível em duas modalidades:
- **Contextualizado**: Aberto a partir do card de uma obra específica
- **Livre**: Menu principal, sem contexto

#### Limitação Atual

Usa modelo de pesquisa (limitado), não tem acesso aos dados internos do sistema.

#### 💡 Melhorias Sugeridas

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Chat flutuante global** | Disponível em todas as telas, não apenas em menu | P0 |
| **Contexto dinâmico** | Alimentar IA com dados de consultas (PH3, Azulx) por ID da obra | P1 |
| **RAG com dados internos** | IA pesquisa em dados já consultados usando File Search | P1 |
| **Sugestões automáticas** | IA sugere próxima ação baseada no histórico do lead | P2 |
| **Resumo de lead** | Botão "Resumir tudo que sei sobre este lead" | P1 |

---

### 8. Painel Administrativo

#### Funcionalidade Atual

| Funcionalidade | Descrição |
|----------------|-----------|
| Cadastro de Franquia | Cria nova franquia com território |
| Cadastro de Loja | Vincula loja a uma franquia |
| Cadastro de Vendedor | Vincula vendedor a uma loja |
| Gerenciamento de APIs | Visualiza consumo de Azulx/PH3 |
| Logs de atividades | Auditoria de consultas |
| Distribuição de créditos | ADM → Franquia → Loja |
| Permissões territoriais | Define estados/cidades por usuário |

#### 💡 Melhorias Sugeridas

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Dashboard por role** | Cada tipo de usuário vê informações relevantes ao entrar | P0 |
| **Relatório de faturamento** | Consumo por franquia/loja para cobrança | P1 |
| **Alertas de crédito baixo** | Notificação quando saldo < 20% | P1 |
| **Importação em massa** | Upload de planilha para cadastrar múltiplos usuários | P2 |
| **Gestão de planos** | Diferentes níveis de acesso (Basic, Pro, Enterprise) | P2 |

---

### 9. SDR (Sales Development)

#### Funcionalidade Planejada

Módulo de prospecção automatizada via WhatsApp (Evolution API):

| Funcionalidade | Descrição |
|----------------|-----------|
| Campanhas | Criar campanhas de disparo |
| Seleção de leads | Escolher leads do CRM por filtros/tags |
| Templates | Mensagens pré-definidas com variáveis |
| Agendamento | Programar envios |
| Respostas | Acompanhar respostas e encaminhar para vendedor |

#### 💡 Melhorias Sugeridas

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Sequências multi-etapa** | Follow-up automático se não responder em X dias | P1 |
| **Personalização com IA** | IA ajusta mensagem baseado no perfil do lead | P2 |
| **A/B Testing** | Testar diferentes abordagens | P2 |
| **Integração com CRM** | Atualizar status automaticamente com base em respostas | P0 |
| **Métricas detalhadas** | Taxa de abertura, resposta, conversão | P1 |

---

### 10. Autenticação

#### Funcionalidade Atual/Planejada

| Funcionalidade | Status |
|----------------|--------|
| Login com e-mail/senha | A implementar |
| Registro externo (convidado) | A implementar |
| Convite por e-mail (interno) | A implementar |
| Recuperação de senha | A implementar |
| E-mails personalizados | A implementar |

#### Regras

1. Registro externo → Role `GUEST` (sem acesso funcional)
2. Convite interno → Role definida pelo administrador
3. Trigger automático: `auth.users` → `public.usuarios`

#### 💡 Melhorias Sugeridas

| Melhoria | Justificativa | Prioridade |
|----------|--------------|------------|
| **Login social** | Google/Microsoft para facilitar onboarding | P2 |
| **2FA** | Autenticação de dois fatores para admins | P2 |
| **SSO** | Single Sign-On para grandes empresas | P3 |

---

## 📊 Relatórios Automatizados

#### Funcionalidade Sugerida (Nova)

Envio automático de relatórios mensais por e-mail:

| Relatório | Destinatário | Conteúdo |
|-----------|--------------|----------|
| Performance mensal | Lojista | Resumo de atividades, ranking de vendedores |
| Uso do sistema | Franqueado | Consumo de créditos, atividade por loja |
| Faturamento | ADM | Consumo total, projeção de custo |

---

## 🔐 Segurança e Compliance

### Requisitos de Segurança

| Requisito | Implementação |
|-----------|---------------|
| RLS em todas as tabelas | Row Level Security no Supabase |
| Dados sensíveis | CPF/CNPJ não expostos sem consulta paga |
| Auditoria | Log de todas as consultas de APIs pagas |
| Secrets | Variáveis de ambiente, nunca no código |
| LGPD | Soft delete, direito ao esquecimento |

---

## 🗓️ Roadmap Sugerido

### Fase 1 - MVP (4-6 semanas)

- [ ] Autenticação completa
- [ ] Painel de cadastro (Franquia → Loja → Vendedor)
- [ ] Leads - Obras (pesquisa + filtros)
- [ ] Integração APIs existentes (PH3, Azulx)
- [ ] CRM básico (favoritos, acompanhamentos)
- [ ] Dashboard básico

### Fase 2 - Funcionalidades Core (4-6 semanas)

- [ ] CRM Kanban
- [ ] Histórico de atividades
- [ ] Chat IA flutuante
- [ ] Mapa de leads
- [ ] Relatórios avançados
- [ ] Exportação Excel/PDF

### Fase 3 - Diferenciação (4-6 semanas)

- [ ] SDR / Campanhas WhatsApp
- [ ] Automações no CRM
- [ ] Deep Search com IA
- [ ] Contexto de IA por obra
- [ ] Relatórios automatizados por e-mail

### Fase 4 - Escala (Contínuo)

- [ ] Leads - Imóveis
- [ ] Integração com novos fornecedores de dados
- [ ] App mobile (PWA ou nativo)
- [ ] API pública para integrações

---

## 📎 Documentação Relacionada

| Documento | Descrição |
|-----------|-----------|
| [RULES.md](./RULES.md) | Regras imutáveis do projeto |
| [11_requisitos_funcionais.md](./10_PRODUCT/11_requisitos_funcionais.md) | Requisitos detalhados por módulo |
| [12_historias_usuario.md](./10_PRODUCT/12_historias_usuario.md) | User stories |
| [13_hierarquia_usuarios.md](./10_PRODUCT/13_hierarquia_usuarios.md) | Roles e permissões |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Sistema de design |

---

> **Documento vivo** — Atualizar conforme decisões forem tomadas.  
> <sub>Última atualização: 2026-01-12</sub>
