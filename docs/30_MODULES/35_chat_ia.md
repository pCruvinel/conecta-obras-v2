<!-- AI_CONTEXT: Este arquivo documenta o módulo Chat IA. Consulte-o para entender o assistente inteligente. -->

# 📦 Módulo: Chat IA

| Metadata | Valor |
|----------|-------|
| **Status** | `Dev` |
| **Última Atualização** | 2026-01-12 |
| **Owner** | @equipe |
| **Prioridade** | P1 |

---

## 📝 Resumo Executivo

> Este módulo fornece um **assistente de IA** que responde perguntas sobre obras e leads, usando **contexto das consultas realizadas**.

Ajuda vendedores a descobrir informações sem pesquisa manual.

---

## 🎯 Funcionalidades

### Features Principais

| ID | Feature | Status | Descrição |
|----|---------|--------|-----------|
| F01 | Chat contextualizado | ⏳ | Aberto a partir de um card de obra |
| F02 | Chat livre global | ⏳ | Perguntas gerais |
| F03 | Chat flutuante | ⏳ | Disponível em todas as telas |
| F04 | Histórico de conversas | ⏳ | Continuar conversas anteriores |
| F05 | Contexto por ID de obra | ⏳ | IA conhece dados da obra |
| F06 | RAG com dados internos | ⏳ | Pesquisa em consultas salvas |
| F07 | Resumo de lead | ⏳ | Gera resumo automático |

### Requisitos Relacionados

| ID | Requisito |
|----|-----------|
| CHAT-01 | Chat contextualizado por obra |
| CHAT-02 | Chat livre acessível do menu |
| CHAT-03 | Alimentar IA com dados de consultas |

---

## 🗂️ Mapeamento de Arquivos

### Componentes

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/chat-ia/components/chat-flutuante.tsx` | Widget | Botão flutuante + modal |
| `src/features/chat-ia/components/janela-chat.tsx` | Container | Área de conversa |
| `src/features/chat-ia/components/mensagem-chat.tsx` | Mensagem | Bolha de chat |
| `src/features/chat-ia/components/input-mensagem.tsx` | Input | Campo de digitação |
| `src/features/chat-ia/components/lista-conversas.tsx` | Lista | Histórico de chats |
| `src/features/chat-ia/components/sugestoes-rapidas.tsx` | Chips | Perguntas sugeridas |

### Hooks

| Arquivo | Tipo | Responsabilidade |
|---------|------|------------------|
| `src/features/chat-ia/hooks/use-chat.ts` | Mutation | Enviar mensagem |
| `src/features/chat-ia/hooks/use-conversas.ts` | Query | Listar conversas |
| `src/features/chat-ia/hooks/use-contexto-obra.ts` | Query | Carregar contexto |

### Types

| Arquivo | Conteúdo |
|---------|----------|
| `src/features/chat-ia/types/tipos-chat.ts` | Interfaces de chat |

### Backend (Supabase)

| Recurso | Localização | Descrição |
|---------|-------------|-----------|
| **Tabelas** | `conversas_ia` | Metadados da conversa |
| **Tabelas** | `mensagens_ia` | Mensagens trocadas |
| **Edge Functions** | `supabase/functions/chat-openai` | Integração OpenAI |

---

## 📊 Estruturas de Dados

### Conversa e Mensagem

```typescript
export interface Conversa {
  id: string;
  usuario_id: string;
  titulo: string;
  contexto_tipo?: 'obra' | 'empresa'; // null = chat livre
  contexto_id?: string; // ID da obra/empresa
  created_at: string;
  updated_at: string;
}

export interface Mensagem {
  id: string;
  conversa_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface ContextoObra {
  obra: Obra;
  consultasPH3: ConsultaPH3[];
  consultasAzulx: ConsultaAzulx[];
  anotacoesCRM: Anotacao[];
}
```

### Schema do Banco

```sql
CREATE TABLE conversas_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.usuarios(id) NOT NULL,
  titulo TEXT DEFAULT 'Nova conversa',
  contexto_tipo TEXT, -- 'obra', 'empresa', null
  contexto_id UUID, -- referência
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE mensagens_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id UUID REFERENCES conversas_ia(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_usados INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔄 Fluxos de Dados

### Fluxo: Enviar Mensagem

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Usuário   │ ──▶ │   Digita    │ ──▶ │   Salva     │
│   Envia     │     │  Mensagem   │     │   no DB     │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
                                    ┌─────────────────┐
                                    │ Monta Contexto  │
                                    │ (obra + dados)  │
                                    └────────┬────────┘
                                             │
                                             ▼
                                   ┌─────────────────┐
                                   │ Edge Function   │
                                   │  chat-openai    │
                                   └────────┬────────┘
                                            │
                                            ▼
                                  ┌─────────────────┐
                                  │    OpenAI API   │
                                  └────────┬────────┘
                                           │
                                           ▼
                                 ┌───────────────────┐
                                 │ Salva Resposta DB │
                                 └────────┬──────────┘
                                          │
                                          ▼
                                 ┌───────────────────┐
                                 │ Streaming na UI   │
                                 └───────────────────┘
```

---

## 🔗 Dependências e Integrações

### Consome (Imports)

| Dependência | Tipo | Propósito |
|-------------|------|-----------|
| `@/lib/supabase` | Lib | Cliente do banco |
| `@/features/leads` | Módulo | Dados de obras |
| `@/features/consulta-plus` | Módulo | Dados de consultas |
| `openai` | SDK | API da OpenAI |

### Expõe (Exports)

| Export | Tipo | Consumido por |
|--------|------|---------------|
| `ChatFlutuante` | Componente | Layout principal |
| `useChat()` | Hook | Componentes de chat |

---

## ⚠️ Regras de Negócio

### Montagem de Contexto

```typescript
// Contexto enviado para a IA
const montarContexto = async (obraId: string): Promise<string> => {
  const obra = await supabase.from('obras').select('*').eq('id', obraId).single();
  const consultas = await supabase.from('consultas_ph3').select('*').eq('obra_id', obraId);
  const anotacoes = await supabase.from('anotacoes_leads').select('*').eq('lead_id', obraId);
  
  return `
    CONTEXTO DA OBRA:
    - Endereço: ${obra.endereco}
    - Responsável: ${obra.responsavel_nome}
    - Tipo: ${obra.tipo_obra}
    
    CONSULTAS REALIZADAS:
    ${consultas.map(c => `- ${c.nome}: ${c.telefones.join(', ')}`).join('\n')}
    
    ANOTAÇÕES DO CRM:
    ${anotacoes.map(a => `- ${a.conteudo}`).join('\n')}
  `;
};
```

### Limites

| Limite | Valor |
|--------|-------|
| Tokens por mensagem | 4.000 |
| Tokens por contexto | 8.000 |
| Mensagens por conversa | 100 |

---

## 🎨 UI/UX

### Chat Flutuante

```
                                              ┌───────────────────────┐
                                              │ 💬 Chat IA            │
                                              ├───────────────────────┤
                                              │ [←] Nova conversa     │
                                              ├───────────────────────┤
                                              │ 🤖 Olá! Como posso    │
                                              │    ajudar?            │
                                              │                       │
                                              │ 👤 Quem é o           │
                                              │    responsável desta  │
                                              │    obra?              │
                                              │                       │
                                              │ 🤖 O responsável é    │
                                              │    João Silva,        │
                                              │    telefone...        │
                                              ├───────────────────────┤
                                              │ [Digite sua pergunta] │
                                              │              [Enviar] │
┌──────────────────────────────────────────┐  └───────────────────────┘
│ ...conteúdo da página...                 │            ▲
│                                          │    ┌───────┴───────┐
│                                          │    │  🤖 Chat IA   │ ← Botão flutuante
└──────────────────────────────────────────┘    └───────────────┘
```

### Sugestões Contextuais

```
┌─────────────────────────────────────────────────────────┐
│ Sugestões:                                              │
│ [Resumir este lead] [Telefone do responsável]          │
│ [Histórico de contatos] [Próximos passos]              │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Melhorias Sugeridas

| Melhoria | Prioridade | Justificativa |
|----------|------------|---------------|
| RAG com File Search | P1 | Pesquisar em todos os dados salvos |
| Resumo automático de lead | P1 | Economiza tempo |
| Geração de mensagem para WhatsApp | P2 | Produtividade |
| Sugestão de próxima ação | P2 | Orientação para vendedor |

---

<sub>Módulo Chat IA v1.0 | Última atualização: 2026-01-12</sub>
