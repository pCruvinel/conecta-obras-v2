<!-- AI_CONTEXT: Este arquivo lista todos os requisitos funcionais por módulo. Consulte-o para entender O QUE o sistema deve fazer. -->

# 📋 Requisitos Funcionais

> Lista completa de funcionalidades do Conecta Obras por módulo.

---

## 📊 Módulo: Dashboard

> Visão panorâmica do banco de dados de obras.

### Funcionalidades

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| DASH-01 | Exibir total de obras no sistema | P0 | ⏳ |
| DASH-02 | Filtrar obras por estado | P0 | ⏳ |
| DASH-03 | Filtrar obras por cidade | P0 | ⏳ |
| DASH-04 | Exibir obras por categoria (ativas, encerradas, nulas) | P0 | ⏳ |
| DASH-05 | Exibir obras por tipo (alvenaria, elétrica, etc.) | P1 | ⏳ |
| DASH-06 | Gráficos dinâmicos de distribuição | P1 | ⏳ |
| DASH-07 | Card clicável redireciona para Leads filtrado | P2 | ⏳ |
| DASH-08 | Contador de novas obras adicionadas na semana | P1 | ⏳ |

---

## 🏗️ Módulo: Leads - Obras

> Pesquisa e filtragem avançada de obras.

### Filtros Disponíveis

| Filtro | Descrição |
|--------|-----------|
| **Categoria** | Tipo geral da obra |
| **Subcategoria** | Detalhamento da categoria |
| **Tipo de obra** | Construção, reforma, elétrica, etc. |
| **Situação** | Status atual da obra |
| **Tipo de área** | Residencial, comercial, industrial |
| **Data de início** | Quando a obra começou |
| **Previsão de término** | Estimativa de conclusão |
| **Metragem** | Tamanho da obra em m² |
| **Zona** | Localização urbana |
| **Destinação** | Uso final do imóvel |
| **Tipo de responsável** | PF ou PJ |

### Funcionalidades

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| LEAD-01 | Listagem de obras em cards | P0 | ⏳ |
| LEAD-02 | Filtros condicionais (tipo muda filtros disponíveis) | P0 | ⏳ |
| LEAD-03 | Ordenação por data (recente/antiga) | P0 | ⏳ |
| LEAD-04 | Busca por palavra-chave (ex: "construtoras") | P0 | ⏳ |
| LEAD-05 | Ícone Mapa - abre localização da obra | P0 | ⏳ |
| LEAD-06 | Ícone Google - pesquisa nome do responsável | P1 | ⏳ |
| LEAD-07 | Ícone PH3 - busca dados de pessoa física | P0 | ⏳ |
| LEAD-08 | Ícone Azulx - busca dados por CNPJ | P0 | ⏳ |
| LEAD-09 | Ícone Chat IA - contextualizado para a obra | P1 | ⏳ |
| LEAD-10 | Botão Agendar - cria agendamento no CRM | P0 | ⏳ |
| LEAD-11 | Botão Favoritar - salva como favorito | P0 | ⏳ |
| LEAD-12 | Botão Acompanhar - adiciona ao CRM com status | P0 | ⏳ |
| LEAD-13 | Botão Excluir (soft) - marca como excluído | P0 | ⏳ |
| LEAD-14 | Indicador visual de lead já em acompanhamento | P0 | ⏳ |
| LEAD-15 | Mostrar qual vendedor está acompanhando | P1 | ⏳ |
| LEAD-16 | Exibir créditos antes de consulta API | P0 | ⏳ |

---

## 🏢 Módulo: Leads - Empresas

> Pesquisa de empresas (mesmo padrão de Obras).

### Funcionalidades

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| EMP-01 | Listagem de empresas em cards | P0 | ⏳ |
| EMP-02 | Filtro por estado e cidade | P0 | ⏳ |
| EMP-03 | Filtro por CNAE (tipo de empresa) | P0 | ⏳ |
| EMP-04 | Mesmos ícones de ação do módulo Obras | P0 | ⏳ |

---

## 🏠 Módulo: Leads - Imóveis

> Pesquisa de imóveis (em desenvolvimento).

### Funcionalidades

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| IMO-01 | Listagem de imóveis em cards | P2 | ⏳ |
| IMO-02 | Filtros específicos para imóveis | P2 | ⏳ |

---

## 📈 Módulo: CRM

> Gestão de relacionamento com leads (separado Obras/Empresas).

### Funcionalidades Gerais

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| CRM-01 | CRM separado para Obras e Empresas | P0 | ⏳ |
| CRM-02 | Visualização em Kanban | P1 | ⏳ |
| CRM-03 | Anotações e histórico por lead | P0 | ⏳ |
| CRM-04 | Tags personalizadas | P1 | ⏳ |
| CRM-05 | Upload de arquivos anexos | P2 | ⏳ |
| CRM-06 | Log de atividades do lead | P1 | ⏳ |
| CRM-07 | Mapa de leads salvos (pins por etapa) | P2 | ⏳ |

### Aba: Relatórios

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| CRM-10 | Total de obras por vendedor | P0 | ⏳ |
| CRM-11 | Ranking por probabilidade de fechamento | P1 | ⏳ |
| CRM-12 | Ranking por temperatura (quente/morno/frio) | P1 | ⏳ |
| CRM-13 | Gráfico de acompanhamentos | P1 | ⏳ |
| CRM-14 | Visão consolidada para Lojista | P0 | ⏳ |
| CRM-15 | Visão individual para Vendedor | P0 | ⏳ |

### Aba: Agendamentos

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| CRM-20 | Calendário de agendamentos | P0 | ⏳ |
| CRM-21 | Filtro por vendedor | P0 | ⏳ |
| CRM-22 | Filtro por data (início/fim) | P0 | ⏳ |

### Aba: Favoritos

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| CRM-30 | Listagem de obras favoritas | P0 | ⏳ |
| CRM-31 | Todos os ícones de ação disponíveis | P0 | ⏳ |

### Aba: Acompanhamentos

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| CRM-40 | Listagem com status (seleção, contato, não respondeu) | P0 | ⏳ |
| CRM-41 | Filtro por status | P0 | ⏳ |
| CRM-42 | Temperatura e probabilidade visíveis | P0 | ⏳ |

### Aba: Excluídos

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| CRM-50 | Listagem de leads excluídos (soft) | P0 | ⏳ |
| CRM-51 | Possibilidade de restaurar | P1 | ⏳ |

### Aba: Indicadores

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| CRM-60 | Contadores numéricos (pesquisas, agendamentos, favoritos) | P0 | ⏳ |
| CRM-61 | Filtro por data | P0 | ⏳ |
| CRM-62 | Exportar em Excel | P0 | ⏳ |
| CRM-63 | Exportar em PDF | P0 | ⏳ |

---

## 🔍 Módulo: Consulta Plus

> Busca livre por CNPJ/CPF.

### Funcionalidades

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| CONS-01 | Campo de busca por CNPJ | P0 | ⏳ |
| CONS-02 | Campo de busca por CPF | P0 | ⏳ |
| CONS-03 | Exibição de resultados (telefone, e-mail, endereço) | P0 | ⏳ |
| CONS-04 | Histórico de consultas realizadas | P1 | ⏳ |
| CONS-05 | Indicador de créditos consumidos | P0 | ⏳ |

---

## 🤖 Módulo: Chat IA

> Assistente de IA para pesquisas.

### Funcionalidades

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| IA-01 | Chat flutuante disponível em todas as telas | P0 | ⏳ |
| IA-02 | Chat contextualizado por obra (quando aberto do card) | P1 | ⏳ |
| IA-03 | Chat livre sem contexto (menu principal) | P0 | ⏳ |
| IA-04 | Alimentar IA com dados de consultas (PH3, Azulx) | P2 | ⏳ |
| IA-05 | Deep Search como alternativa ao Google | P2 | ⏳ |

---

## ⚙️ Módulo: Painel Administrativo

> Gestão de usuários, APIs e faturamento.

### Funcionalidades ADM

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| ADM-01 | Cadastro de Franquia | P0 | ⏳ |
| ADM-02 | Cadastro de Loja (vinculada a Franquia) | P0 | ⏳ |
| ADM-03 | Cadastro de Vendedor (vinculado a Loja) | P0 | ⏳ |
| ADM-04 | Gerenciamento de créditos por API | P0 | ⏳ |
| ADM-05 | Logs de consumo de APIs (auditoria) | P0 | ⏳ |
| ADM-06 | Distribuição de créditos hierárquica | P0 | ⏳ |
| ADM-07 | Permissões por território (estado/cidade) | P0 | ⏳ |
| ADM-08 | Data de faturamento por Franquia | P1 | ⏳ |
| ADM-09 | Dashboard com totais (franquias, lojas, vendedores) | P0 | ⏳ |

---

## 📧 Módulo: SDR (Sales Development)

> Prospecção automatizada.

### Funcionalidades

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| SDR-01 | Criação de campanhas de prospecção | P1 | ⏳ |
| SDR-02 | Seleção de leads do CRM para campanha | P1 | ⏳ |
| SDR-03 | Configuração de estratégias de disparo | P1 | ⏳ |
| SDR-04 | Acompanhamento de respostas | P1 | ⏳ |
| SDR-05 | Integração com tags do CRM | P2 | ⏳ |

---

## 🔐 Módulo: Autenticação

> Login, registro e recuperação.

### Funcionalidades

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| AUTH-01 | Login com e-mail/senha | P0 | ⏳ |
| AUTH-02 | Registro externo (usuário convidado) | P0 | ⏳ |
| AUTH-03 | Registro interno (convite por e-mail) | P0 | ⏳ |
| AUTH-04 | Recuperação de senha | P0 | ⏳ |
| AUTH-05 | E-mails personalizados (boas-vindas, convite, reset) | P1 | ⏳ |
| AUTH-06 | Trigger para criar perfil em public.users | P0 | ⏳ |
| AUTH-07 | Role padrão conforme tipo de registro | P0 | ⏳ |

---

## 📊 Módulo: Relatórios Automatizados

> Envio automático de relatórios.

### Funcionalidades

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| REL-01 | E-mail mensal automático para Lojista | P2 | ⏳ |
| REL-02 | Resumo de indicadores do período | P2 | ⏳ |
| REL-03 | Anexo em PDF | P2 | ⏳ |

---

## 🔗 Legenda

| Símbolo | Significado |
|---------|-------------|
| P0 | Crítico/Bloqueante - MVP |
| P1 | Alta prioridade |
| P2 | Média prioridade |
| P3 | Baixa prioridade |
| ⏳ | Pendente |
| 🔄 | Em desenvolvimento |
| ✅ | Concluído |

---

<sub>Última atualização: 2026-01-12</sub>
