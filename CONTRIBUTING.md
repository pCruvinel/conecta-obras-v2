# 🤝 Guia de Contribuição

> Padrões e boas práticas para contribuir com o Conecta Obras.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 20+ (recomendado: usar `nvm`)
- **pnpm** 9+ (gerenciador de pacotes)
- **Git** 2.40+
- **VS Code** com extensões recomendadas

### Extensões VS Code Recomendadas

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## 🚀 Setup do Projeto

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/conecta-obras.git
cd conecta-obras

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Inicie o Supabase local (opcional)
npx supabase start

# 5. Inicie o servidor de desenvolvimento
pnpm dev
```

---

## 📂 Estrutura do Projeto

Consulte a documentação completa em:
- [Estrutura de Pastas](./docs/20_ARCH/22_estrutura_projeto.md)
- [Convenções de Nomenclatura](./docs/20_ARCH/21_convencoes_nomenclatura.md)

### Resumo Rápido

```
src/
├── app/              # Rotas (App Router)
├── components/
│   ├── ui/           # Componentes shadcn
│   └── compartilhados/
├── features/         # Módulos por domínio
├── hooks/            # Hooks globais
├── lib/              # Configurações
├── types/            # Tipagens globais
└── utils/            # Utilitários
```

---

## 🎨 Padrões de Código

### Nomenclatura (Clean Code pt-BR)

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes | `TipoNome` | `FormularioCliente` |
| Hooks | `use[Acao][Entidade]` | `useCriarObra` |
| Arquivos | kebab-case | `formulario-cliente.tsx` |
| Booleanos | `esta/tem/pode` | `estaCarregando`, `temErro` |

> 📖 Guia completo: [21_convencoes_nomenclatura.md](./docs/20_ARCH/21_convencoes_nomenclatura.md)

### Estrutura de Componente

```tsx
// formulario-cliente.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { useCriarCliente } from '@/features/clientes/hooks/use-criar-cliente';
import { schemaCliente, type DadosCliente } from '@/features/clientes/types/tipos-cliente';

interface FormularioClienteProps {
  aoSalvar?: (dados: DadosCliente) => void;
}

export function FormularioCliente({ aoSalvar }: FormularioClienteProps) {
  const [estaEnviando, setEstaEnviando] = useState(false);
  const { criarCliente } = useCriarCliente();
  
  const form = useForm<DadosCliente>({
    resolver: zodResolver(schemaCliente),
  });

  const aoSubmeter = async (dados: DadosCliente) => {
    setEstaEnviando(true);
    try {
      await criarCliente(dados);
      aoSalvar?.(dados);
    } finally {
      setEstaEnviando(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(aoSubmeter)}>
      {/* campos */}
      <Button type="submit" disabled={estaEnviando}>
        {estaEnviando ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  );
}
```

---

## 🔀 Fluxo de Git

### Branches

| Branch | Propósito |
|--------|-----------|
| `main` | Produção estável |
| `develop` | Desenvolvimento integrado |
| `feature/*` | Novas funcionalidades |
| `fix/*` | Correções de bugs |
| `hotfix/*` | Correções urgentes em produção |

### Commits (Conventional Commits)

```bash
# Formato
<tipo>(<escopo>): <descrição>

# Exemplos
feat(leads): adiciona filtro por metragem
fix(crm): corrige exibição de temperatura
docs(readme): atualiza instruções de setup
refactor(auth): simplifica lógica de login
```

### Tipos Permitidos

| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `style` | Formatação (sem mudança de código) |
| `refactor` | Refatoração |
| `test` | Testes |
| `chore` | Tarefas de manutenção |

---

## ✅ Checklist de PR

Antes de abrir um Pull Request:

- [ ] Código segue as convenções de nomenclatura
- [ ] Sem erros de linting (`pnpm lint`)
- [ ] Sem erros de TypeScript (`pnpm type-check`)
- [ ] Testes passando (`pnpm test`)
- [ ] Build funciona (`pnpm build`)
- [ ] Documentação atualizada (se aplicável)
- [ ] PR tem descrição clara

---

## 📚 Documentação

Toda a documentação está em `docs/`:

- **Produto**: `docs/10_PRODUCT/`
- **Arquitetura**: `docs/20_ARCH/`
- **Módulos**: `docs/30_MODULES/`

Ao adicionar nova funcionalidade, atualize a documentação relevante.

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Servidor de desenvolvimento
pnpm build            # Build de produção
pnpm start            # Inicia build de produção

# Qualidade
pnpm lint             # Verifica linting
pnpm lint:fix         # Corrige linting
pnpm type-check       # Verifica TypeScript
pnpm test             # Executa testes

# Supabase
npx supabase start    # Inicia local
npx supabase stop     # Para local
npx supabase db push  # Aplica migrations
npx supabase gen types typescript --local > src/types/supabase.ts
```

---

## ❓ Dúvidas?

Consulte a documentação ou abra uma issue para discussão.

<sub>Última atualização: 2026-01-12</sub>
