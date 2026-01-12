# 🧠 Project Memory

> **Diário de bordo do projeto conectaObras.**  
> Este documento é a fonte de verdade para o contexto atual, decisões recentes e próximos passos.

---

## 📍 Contexto Atual

| Campo | Valor |
|-------|-------|
| **Fase** | `Inicial / Estruturação` |
| **Sprint** | `Setup de Documentação` |
| **Foco Principal** | Padronização de código e estruturação do projeto |

### Stack Tecnológica

```
Frontend: Next.js 14 (App Router) + React 18 + TypeScript
UI:       Tailwind CSS + shadcn/ui + Radix UI
Backend:  Supabase (Auth, Database, Storage, Edge Functions)
Database: PostgreSQL 15+
Deploy:   Vercel (Frontend) + Supabase Cloud (Backend)
```

---

## 🔧 Últimas Decisões Técnicas

| Data | Decisão | Justificativa |
|------|---------|---------------|
| 2026-01-12 | Criação de guia de nomenclatura Clean Code pt-BR | Padronização e consistência no código |
| 2026-01-12 | Estrutura de features por domínio | Isolamento e manutenibilidade |
| 2026-01-12 | Adoção de prefixos pt-BR para booleanos (`esta`, `tem`, `pode`) | Legibilidade para equipe brasileira |

> 💡 **Dica:** Para decisões complexas, crie um ADR usando `20_ARCH/23_adr_template.md`.

---

## 📋 Próximos Passos (Backlog Prioritário)

- [ ] `[P0]` Configurar projeto Next.js com estrutura definida
- [ ] `[P0]` Configurar Supabase e criar tabelas iniciais
- [ ] `[P1]` Implementar autenticação com Supabase Auth
- [ ] `[P1]` Criar componentes base do design system
- [ ] `[P2]` Documentar primeiro módulo usando o template

> **Legenda:**  
> `P0` = Crítico/Bloqueante | `P1` = Alta prioridade | `P2` = Média | `P3` = Baixa

---

## 🐛 Bugs Conhecidos

| ID | Descrição | Severidade | Status |
|----|-----------|------------|--------|
| — | Nenhum bug registrado ainda | — | — |

---

## 📝 Notas de Sessão

### 2026-01-12

- ✅ Estrutura de documentação criada
- ✅ Guia de convenções de nomenclatura Clean Code pt-BR definido
- ✅ Estrutura de pastas Next.js documentada
- ✅ Template ADR criado
- ✅ Tech stack atualizado para Next.js

---

## 📚 Documentação Relacionada

| Documento | Descrição |
|-----------|-----------|
| [00_INDEX.md](./00_INDEX.md) | Índice geral da documentação |
| [21_convencoes_nomenclatura.md](./20_ARCH/21_convencoes_nomenclatura.md) | Guia de nomenclatura |
| [22_estrutura_projeto.md](./20_ARCH/22_estrutura_projeto.md) | Estrutura de pastas |

---

<sub>Última atualização: 2026-01-12</sub>
