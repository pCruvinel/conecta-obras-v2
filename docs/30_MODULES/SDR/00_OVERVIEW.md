# 📦 SDR Module: Overview (Visão Geral)

> **Resumo:** Módulo de Prospecção Automatizada (SDR) projetado como um produto independente ("add-on") do Conecta Obras. Focado em escalar vendas via WhatsApp com inteligência contextual (RAG).

---

## 🎯 Objetivos do Produto

1.  **Autonomia:** Permitir que o usuário configure seu próprio "SDR Bot" sem intervenção do suporte.
2.  **Contextualização:** O Bot deve responder dúvidas sobre a empresa do usuário usando uma base de conhecimento própria (Upload de PDFs/DOCs).
3.  **Segurança e Isolamento:** Dados de um cliente jamais devem vazar para outro (RAG com Metadata Filtering).
4.  **Engajamento:** Alta taxa de entrega e resposta via WhatsApp (Evolution API).

---

## 👤 Personas

1.  **O Administrador da Loja/Vendas:**
    - Configura a "personalidade" do Bot.
    - Sobe os arquivos de treinamento (tabela de preços, catálogo).
    - Acompanha o Dashboard de conversão.
2.  **O SDR Bot (Agente):**
    - Atua passivamente (respondendo leads) e ativamente (disparando campanhas).
    - Objetivo: Qualificar o lead e agendar uma reunião/visita.

---

## 🔑 Funcionalidades Chave (MVP)

- **Onboarding Wizard:** Configuração "self-service" da instância.
- **Conexão QR Code:** Interface direta para ler o QR Code do WhatsApp.
- **Gestão de Conhecimento:** Upload de arquivos e status de indexação.
- **Campanhas de Disparo:** Envio em massa com fila de processamento (Throttling).
- **Inbox Unificado:** (Futuro) Ver e intervir nas conversas do Bot.

---

## 📊 Métricas de Sucesso

- % de Leads respondidos em < 1 min.
- % de Conexão com WhatsApp com sucesso.
- Acurácia das respostas do RAG (Feedback do usuário).
