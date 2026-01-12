<!-- AI_CONTEXT: Este arquivo contém as histórias de usuário por persona. Consulte-o para entender os fluxos do ponto de vista do usuário. -->

# 📖 Histórias de Usuário

> User stories organizadas por persona para o Conecta Obras.

---

## 👤 Vendedor

### Pesquisa de Leads

| ID | História |
|----|----------|
| US-V01 | Como **vendedor**, quero pesquisar obras na minha região para encontrar oportunidades de venda. |
| US-V02 | Como **vendedor**, quero filtrar obras por tipo, categoria e metragem para encontrar as mais relevantes. |
| US-V03 | Como **vendedor**, quero ver a localização da obra no mapa para planejar minhas visitas. |
| US-V04 | Como **vendedor**, quero buscar o telefone do responsável da obra para entrar em contato. |
| US-V05 | Como **vendedor**, quero saber se outro vendedor da loja já está acompanhando uma obra para evitar conflitos. |
| US-V06 | Como **vendedor**, quero ver quantos créditos tenho antes de fazer uma consulta paga para controlar meu uso. |

### Gestão de CRM

| ID | História |
|----|----------|
| US-V10 | Como **vendedor**, quero adicionar uma obra aos meus favoritos para acessar rapidamente depois. |
| US-V11 | Como **vendedor**, quero agendar um follow-up para não esquecer de entrar em contato. |
| US-V12 | Como **vendedor**, quero marcar a temperatura de um lead (quente/morno/frio) para priorizar meu tempo. |
| US-V13 | Como **vendedor**, quero adicionar anotações sobre um lead para registrar o histórico de contatos. |
| US-V14 | Como **vendedor**, quero excluir um lead que não tem potencial para limpar minha lista. |
| US-V15 | Como **vendedor**, quero ver meus indicadores (pesquisas, agendamentos, favoritos) para acompanhar meu esforço. |

### Consultas e IA

| ID | História |
|----|----------|
| US-V20 | Como **vendedor**, quero pesquisar um CNPJ específico para obter dados de contato da empresa. |
| US-V21 | Como **vendedor**, quero usar o chat de IA contextualizado para descobrir mais informações sobre uma obra. |
| US-V22 | Como **vendedor**, quero que as consultas anteriores alimentem a IA para não precisar pesquisar de novo. |

---

## 🏪 Lojista

### Gestão de Equipe

| ID | História |
|----|----------|
| US-L01 | Como **lojista**, quero cadastrar novos vendedores para expandir minha equipe. |
| US-L02 | Como **lojista**, quero atribuir territórios (cidades) a cada vendedor para organizar a cobertura. |
| US-L03 | Como **lojista**, quero ver o CRM de todos os meus vendedores para acompanhar o trabalho deles. |

### Relatórios e Indicadores

| ID | História |
|----|----------|
| US-L10 | Como **lojista**, quero ver um ranking de probabilidade de fechamento para focar nos leads mais promissores. |
| US-L11 | Como **lojista**, quero saber quantas pesquisas cada vendedor fez para medir o esforço da equipe. |
| US-L12 | Como **lojista**, quero exportar os indicadores em Excel para analisar em planilhas. |
| US-L13 | Como **lojista**, quero exportar relatórios em PDF para compartilhar com a diretoria. |
| US-L14 | Como **lojista**, quero receber um relatório mensal por e-mail para não precisar acessar o sistema. |

### Prospecção

| ID | História |
|----|----------|
| US-L20 | Como **lojista**, quero ver um mapa com todos os leads salvos para ter visão panorâmica. |
| US-L21 | Como **lojista**, quero que os pins do mapa mudem de cor conforme a etapa do lead para entender o funil visualmente. |

---

## 🏢 Franquia

### Gestão de Lojas

| ID | História |
|----|----------|
| US-F01 | Como **franqueado**, quero cadastrar novas lojas para expandir minha rede. |
| US-F02 | Como **franqueado**, quero distribuir territórios (estados) entre minhas lojas para organizar a região. |
| US-F03 | Como **franqueado**, quero distribuir créditos de consulta para cada loja para controlar o orçamento. |

### Visibilidade

| ID | História |
|----|----------|
| US-F10 | Como **franqueado**, quero ver um dashboard consolidado de todas as minhas lojas para ter visão geral. |
| US-F11 | Como **franqueado**, quero comparar a performance entre lojas para identificar oportunidades de melhoria. |

---

## 🔑 Administrador

### Gestão do Sistema

| ID | História |
|----|----------|
| US-A01 | Como **administrador**, quero cadastrar novas franquias para expandir o negócio. |
| US-A02 | Como **administrador**, quero definir quais territórios cada franquia pode acessar para controlar a distribuição. |
| US-A03 | Como **administrador**, quero distribuir créditos de API para as franquias para gerenciar o faturamento. |

### Auditoria e Controle

| ID | História |
|----|----------|
| US-A10 | Como **administrador**, quero ver logs de todas as consultas de APIs pagas para auditar o consumo. |
| US-A11 | Como **administrador**, quero saber quantas consultas foram feitas por franquia/loja para cobrar corretamente. |
| US-A12 | Como **administrador**, quero definir datas de faturamento por franquia para organizar a cobrança. |

### Dashboard Global

| ID | História |
|----|----------|
| US-A20 | Como **administrador**, quero ver o total de obras no sistema para comunicar o valor da plataforma. |
| US-A21 | Como **administrador**, quero ver quantas novas obras foram adicionadas na semana para mostrar atualização. |
| US-A22 | Como **administrador**, quero ver totais por estado/cidade para identificar cobertura. |

---

## 🆕 Convidado

### Onboarding

| ID | História |
|----|----------|
| US-G01 | Como **visitante**, quero me registrar na plataforma para conhecer o sistema. |
| US-G02 | Como **convidado**, quero ver a interface do sistema para entender o que posso fazer após contratar. |
| US-G03 | Como **convidado**, quero receber um e-mail de boas-vindas com informações sobre a plataforma. |

---

## 🤖 Sistema (Automações)

| ID | História |
|----|----------|
| US-S01 | Como **sistema**, devo salvar a primeira consulta de API no banco para economizar em consultas futuras. |
| US-S02 | Como **sistema**, devo cobrar créditos mesmo em consultas de cache para manter o modelo de negócio. |
| US-S03 | Como **sistema**, devo enviar relatórios mensais automaticamente para engajar os lojistas. |
| US-S04 | Como **sistema**, devo criar perfil em public.usuarios quando novo usuário se registrar no auth. |
| US-S05 | Como **sistema**, devo alimentar o contexto da IA com dados de consultas anteriores por obra. |

---

## 📋 Critérios de Aceitação Padrão

Toda história deve atender:

1. ✅ Feedback visual para ações do usuário
2. ✅ Tratamento de erros com mensagem clara
3. ✅ Loading state durante operações assíncronas
4. ✅ Responsividade mobile
5. ✅ Log de auditoria para ações críticas
6. ✅ Soft-delete (nunca deletar dados)

---

<sub>Última atualização: 2026-01-12</sub>
