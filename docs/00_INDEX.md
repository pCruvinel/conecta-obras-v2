# 📚 Índice da Documentação

> **Ponto de entrada para a memória de longo prazo do projeto.**  
> Use este documento como mapa para navegar pela documentação.

---

## 🗂️ Estrutura

| Pasta | Descrição |
|-------|-----------|
| [01_PROJECT_MEMORY.md](./01_PROJECT_MEMORY.md) | Diário de bordo — contexto, decisões e próximos passos |
| [10_PRODUCT/](./10_PRODUCT/) | Requisitos, PRDs, personas e jornadas de usuário |
| [20_ARCH/](./20_ARCH/) | Arquitetura, ADRs, diagramas e padrões técnicos |
| [30_MODULES/](./30_MODULES/) | Documentação por módulo/feature do sistema |

---

## 🚀 Comandos Úteis do Projeto

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build de produção
npm run lint         # Verifica linting

# Testes
npm run test         # Executa testes unitários
npm run test:e2e     # Executa testes end-to-end

# Database (Supabase)
npx supabase start   # Inicia Supabase local
npx supabase db push # Aplica migrations
```

---

## 📖 Como Usar Esta Documentação

1. **Contexto Rápido** → Leia `01_PROJECT_MEMORY.md` primeiro
2. **Entender o Produto** → Explore `10_PRODUCT/`
3. **Arquitetura** → Consulte `20_ARCH/` para decisões técnicas
4. **Detalhes de Módulos** → Navegue em `30_MODULES/`

---

<sub>Última atualização: 2026-01-12</sub>
