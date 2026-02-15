# 🚀 SDR Module: Onboarding Flow

> **Responsável:** Frontend/Product Specialist
> **Objetivo:** Garantir que o usuário configure o SDR com sucesso em < 5 minutos.

---

## 1. Mapa de Navegação

`Dashboard > SDR (Menu Lateral) > Landing Page (Se inativo) > Wizard de Ativação`

---

## 2. Etapas do Wizard

### Passo 1: Identidade do Agente
Formulário simples para "dar vida" ao bot.

- **Campos:**
    - `Nome do Bot` (Ex: "Assistente da Conecta", "Ana da Silva")
    - `Segmento` (Select: "Construção", "Reforma", "Solar", "Outros")
    - `Tom de Voz` (Cards Selecionáveis: "Formal", "Consultivo", "Otimista")
- **Preview:** Mostrar um "Chat Fake" ao lado, mudando a saudação conforme o Tom de Voz escolhido.

### Passo 2: Conexão WhatsApp
Interface "Terminal-like" para feedback em tempo real.

1.  Botão: "Gerar QR Code".
2.  Estado `Loading`: "Iniciando instância segura..." (Spinner).
3.  Estado `QRCode`: Exibe QR Code grande no centro.
4.  Estado `Connecting`: "Conectando ao WhatsApp..." (Assim que scanear).
5.  Estado `Success`: "Conectado! ✅" (Confetis).

### Passo 3: Base de Conhecimento (Knowledge Base)
Área de Dropzone para uploads.

- **Instrução:** "Arraste PDFs com seus preços, serviços e dúvidas frequentes."
- **Lista de Arquivos:**
    - `[PDF] Tabela_2024.pdf` — *Indexando... 15%*
    - `[DOC] Apresentacao.docx` — *Pronto ✅*
- **Aviso:** "Recomendamos arquivos com texto selecionável (não imagens escaneadas)."

---

## 3. Empty State (Pós-Onboarding)

Ao finalizar, redirecionar para o **Dashboard SDR**.

- Se não houver campanhas: Botão CTA Grande "Criar Primeira Campanha".
- Se houver conexão mas sem arquivos: Card de Alerta "Seu bot ainda não sabe muito sobre sua empresa. Adicionar Arquivos."
