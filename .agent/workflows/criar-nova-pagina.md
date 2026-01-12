---
description: Cria uma página com listagem e CRUD
---

# Criar Nova Página

Este workflow cria uma página Next.js com listagem, filtros e ações CRUD.

## Passos

1. **Criar estrutura de rotas** em `src/app/(auth)/`:

```
src/app/(auth)/[modulo]/
├── page.tsx              # Listagem
├── novo/
│   └── page.tsx          # Criar novo
└── [id]/
    ├── page.tsx          # Detalhes
    └── editar/
        └── page.tsx      # Editar
```

2. **Página de Listagem** (`page.tsx`):

```tsx
import { Suspense } from 'react';
import { CabecalhoPagina } from '@/components/compartilhados/cabecalho-pagina';
import { TabelaClientes } from '@/features/clientes/components/tabela-clientes';
import { FiltrosClientes } from '@/features/clientes/components/filtros-clientes';
import { BotaoNovoCliente } from '@/features/clientes/components/botao-novo-cliente';
import { IndicadorCarregamento } from '@/components/compartilhados/indicador-carregamento';

export const metadata = {
  title: 'Clientes | Conecta Obras',
  description: 'Gestão de clientes',
};

export default function PaginaClientes() {
  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Clientes"
        descricao="Gerencie seus clientes"
        acoes={<BotaoNovoCliente />}
      />
      
      <FiltrosClientes />
      
      <Suspense fallback={<IndicadorCarregamento />}>
        <TabelaClientes />
      </Suspense>
    </div>
  );
}
```

3. **Página de Criação** (`novo/page.tsx`):

```tsx
import { CabecalhoPagina } from '@/components/compartilhados/cabecalho-pagina';
import { FormularioCliente } from '@/features/clientes/components/formulario-cliente';

export const metadata = {
  title: 'Novo Cliente | Conecta Obras',
};

export default function PaginaNovoCliente() {
  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo="Novo Cliente"
        descricao="Cadastre um novo cliente"
        voltarPara="/clientes"
      />
      
      <div className="max-w-2xl">
        <FormularioCliente />
      </div>
    </div>
  );
}
```

4. **Página de Detalhes** (`[id]/page.tsx`):

```tsx
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CabecalhoPagina } from '@/components/compartilhados/cabecalho-pagina';
import { DetalhesCliente } from '@/features/clientes/components/detalhes-cliente';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PaginaDetalhesCliente({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: cliente } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!cliente) {
    notFound();
  }
  
  return (
    <div className="space-y-6">
      <CabecalhoPagina
        titulo={cliente.nome}
        descricao="Detalhes do cliente"
        voltarPara="/clientes"
      />
      
      <DetalhesCliente cliente={cliente} />
    </div>
  );
}
```

## Componente CabecalhoPagina

```tsx
// src/components/compartilhados/cabecalho-pagina.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CabecalhoPaginaProps {
  titulo: string;
  descricao?: string;
  voltarPara?: string;
  acoes?: React.ReactNode;
}

export function CabecalhoPagina({
  titulo,
  descricao,
  voltarPara,
  acoes,
}: CabecalhoPaginaProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {voltarPara && (
          <Button variant="ghost" size="icon" asChild>
            <Link href={voltarPara}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold">{titulo}</h1>
          {descricao && (
            <p className="text-muted-foreground">{descricao}</p>
          )}
        </div>
      </div>
      {acoes && <div>{acoes}</div>}
    </div>
  );
}
```

## Convenções

- **Páginas**: Usar Server Components quando possível
- **Metadata**: Sempre definir `title` e `description`
- **Loading**: Usar `Suspense` com fallback
- **Not Found**: Usar `notFound()` para 404
