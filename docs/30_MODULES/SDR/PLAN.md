# 📦 Plano de Implementação: SDR Module (V2)

> **Objetivo:** Criar um módulo de SDR (Sales Development Representative) robusto, escalável e independente, com integração WhatsApp (Evolution API) e Google FileSearch (RAG).

---

## 1. Visão Geral

O módulo SDR será reestruturado para funcionar como um produto semi-independente ("add-on"), vendido separadamente. Ele deve possuir seu próprio fluxo de onboarding e contexto.

### Principais Requisitos
- **Independência:** Capacidade de ativar/desativar o módulo por organização/usuário.
- **Onboarding Dedicado:** Configuração inicial do "SDR Bot" (Nome, Segmento, Tom de voz).
- **RAG (Retrieval-Augmented Generation):** Uso de Google FileSearch API com filtro `metadata={'id_instancia': '...'}` para base de conhecimento isolada por cliente.
- **WhatsApp:** Integração profunda com Evolution API (QR Code, Status, Webhooks de mensagens).
- **Escalabilidade:** Arquitetura preparada para alto volume de disparos e processamento de mensagens (Filas/Queues).

---

## 2. Arquitetura Proposta

### 2.1 Modelo de Dados (Supabase)

#### Novas Tabelas / Alterações
1.  **`sdr_instances` (ou `sdr_config`)**:
    - `id`: UUID (PK)
    - `org_id`: UUID (FK)
    - `bot_name`: String
    - `company_name`: String
    - `segment`: String
    - `tone_of_voice`: String
    - `whatsapp_status`: Enum ('disconnected', 'connecting', 'connected')
    - `evolution_instance_id`: String
    - `file_search_store_id`: String (Google Vector Store ID)
    - `active`: Boolean

2.  **`sdr_knowledge_base`**:
    - `id`: UUID
    - `instance_id`: UUID (FK)
    - `file_id`: String (Google File ID)
    - `file_name`: String
    - `status`: Enum ('uploading', 'indexing', 'ready', 'error')
    - `metadata`: JSONB ({ id_instancia: '...' })

3.  **`sdr_campaigns`** (Refatoração da existente):
    - Adicionar suporte a filas e agendamento robusto.

### 2.2 Integrações

- **Evolution API**:
    - Endpoint para gerar QR Code (Exibir no frontend).
    - Webhook para receber status de conexão (`connection.update`).
    - Webhook para receber mensagens (`messages.upsert`).
    - Envio de mensagens via fila (Edge Function + Supabase Queues ou Cron).

- **Google FileSearch API**:
    - Upload de arquivos PDF/DOCX.
    - Associação de metadata `id_instancia` para isolamento de contexto.
    - Query (Search) filtrando por `id_instancia` ao gerar respostas.

---

## 3. Plano de Execução (Fases)

### Fase 1: Fundamentação e Documentação Técnica
- [ ] Criar estrutura de documentação em `docs/30_MODULES/SDR/`.
    - `00_OVERVIEW.md`: Visão do produto e casos de uso.
    - `10_ARCHITECTURE.md`: Schema do banco, Diagrama de fluxo de dados.
    - `20_INTEGRATIONS_API.md`: Detalhes da Evolution API e Google FileSearch.
    - `30_ONBOARDING_FLOW.md`: Fluxo de UX do primeiro acesso.
- [ ] Definir Schema do Banco de Dados final (SQL).

### Fase 2: Backend e Integrações Core
- [ ] Implementar Tabelas `sdr_instances`, `sdr_knowledge_base`.
- [ ] Criar Edge Function `sdr-connect-whatsapp`: Gerenciar instância Evolution e QR Code.
- [ ] Criar Edge Function `sdr-webhook-evolution`: Processar eventos de conexão e mensagens.
- [ ] Criar Service `FileSearchService`: Upload e Search com metadata filter.

### Fase 3: Frontend e UX (Onboarding)
- [ ] Criar página de "Ativação do SDR" (Landing interna se não tiver ativo).
- [ ] Implementar Wizard de Onboarding:
    1.  **Identidade:** Nome do Bot, Empresa, Segmento.
    2.  **Conexão:** Exibição do QR Code e Status em tempo real.
    3.  **Conhecimento:** Upload de arquivos para base de conhecimento.
- [ ] Dashboard Principal do SDR (Visão de Campanhas e Status).

### Fase 4: Lógica de Negócio (Campanhas e RAG)
- [ ] Refatorar criação de campanhas para usar o novo contexto.
- [ ] Implementar lógica de resposta automática (RAG) usando o FileSearch.
- [ ] Testes de carga e validação de fluxo.

---

## 4. Próximos Passos (Imediato)

Aprovar este plano para iniciar a **Fase 1 (Documentação Técnica)** e **Fase 2 (Backend)**.
