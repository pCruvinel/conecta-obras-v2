# 🔌 SDR Module: API Integrations

> **Responsável:** Backend Specialist Agent
> **Foco:** Evolution API (WhatsApp) e Google FileSearch (RAG)

---

## 1. Evolution API (WhatsApp)

Utilizaremos a Evolution API v2 para gerenciar a conexão com WhatsApp.

### 1.1 Endpoints Críticos

| Ação | Método | Endpoint (Relativo à Base URL) | Payload |
|------|--------|--------------------------------|---------|
| **Criar Instância** | POST | `/instance/create` | `{ "instanceName": "sdr_org_{uuid}", "qrcode": true }` |
| **Conectar** | GET | `/instance/connect/{instance}` | - |
| **Enviar Texto** | POST | `/message/sendText/{instance}` | `{ "number": "5511999...", "text": "Olá!" }` |
| **Checar Status** | GET | `/instance/connectionState/{instance}` | - |
| **Logout** | DELETE | `/instance/logout/{instance}` | - |

### 1.2 Webhooks

Configurar webhook global na Evolution para apontar para nossa Edge Function: `https://[project].supabase.co/functions/v1/sdr-webhook-evolution`

**Eventos Monitorados:**
- `connection.update`: Atualizar `sdr_instances.whatsapp_status`.
- `messages.upsert`: Receber mensagens de leads.

### 1.3 Estrutura de Payload (Webhook)

```json
// messages.upsert
{
  "event": "messages.upsert",
  "instance": "sdr_org_123",
  "data": {
    "key": {
      "remoteJid": "5511999999999@s.whatsapp.net",
      "fromMe": false
    },
    "message": {
      "conversation": "Qual o preço da reforma?"
    }
  }
}
```

---

## 2. Google FileSearch API (RAG)

Utilizaremos a Google Vertex AI Agent Builder (Search) ou API Discovery Engine para indexar documentos.

### 2.1 Autenticação
- Service Account (JSON Key) armazenada em **Supabase Vault** ou Variável de Ambiente (`GOOGLE_SERVICE_ACCOUNT`).
- Escopes: `https://www.googleapis.com/auth/cloud-platform`.

### 2.2 Estrutura de Metadados (Metadata Filtering)

Para garantir isolamento entre clientes (Multi-tenancy), cada chunks/documento indexado DEVE conter o `instance_id`.

**Filtro na Busca:**
```json
{
  "filter": "instance_id = \"uuid-da-instancia\"",
  "query": "Qual o prazo de entrega?"
}
```

### 2.3 Fluxo de Ingestão (Upload)

1.  Usuário faz upload do PDF no Frontend.
2.  Backend salva arquivo temporário.
3.  Backend chama Google API `documents.create` convertendo PDF para texto ou enviando binário (se suportado pelo Data Store).
4.  Define campo customizado `structData` ou `metadata` com `{ "instance_id": "..." }`.

---

## 3. Segurança & Boas Práticas

1.  **Isolation:** NUNCA fazer query no Google sem o filtro `instance_id`.
2.  **Rate Limiting:** Controlar disparos do WhatsApp para evitar banimento (QueueSystem).
3.  **Sanitization:** Limpar números de telefone antes de enviar (remover máscaras, garantir DDI 55).
