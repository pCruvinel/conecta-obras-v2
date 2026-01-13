'use client';

import { useState, useMemo } from 'react';
import { KanbanBoard } from '@/features/crm/components/kanban/kanban-board';
import { LeadsList } from '@/features/crm/components/leads-list';
import { useLeadsCRM } from '@/features/crm/hooks/use-leads-crm';
import { useAtualizarEtapa } from '@/features/crm/hooks/use-atualizar-etapa';
import { CabecalhoPagina } from '@/components/compartilhados/cabecalho-pagina';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Settings2, 
  Columns3, 
  Tags, 
  Archive, 
  List,
  LayoutGrid
} from 'lucide-react';
import { NovoLeadDialog } from '@/features/crm/components/novo-lead-dialog';

export default function PaginaCRM() {
  const { data: leads, isLoading, error } = useLeadsCRM();
  const { mutate: atualizarEtapa } = useAtualizarEtapa();
  const [busca, setBusca] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Client-side filtering
  const leadsFiltrados = useMemo(() => {
    if (!leads) return [];
    if (!busca.trim()) return leads;
    
    const termoBusca = busca.toLowerCase();
    return leads.filter(lead => 
      lead.contato_nome?.toLowerCase().includes(termoBusca) ||
      lead.contato_email?.toLowerCase().includes(termoBusca) ||
      lead.obra?.titulo?.toLowerCase().includes(termoBusca) ||
      lead.empresa?.nome_fantasia?.toLowerCase().includes(termoBusca)
    );
  }, [leads, busca]);

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <CabecalhoPagina breadcrumbs={[{ label: 'CRM' }]} />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Carregando CRM...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <CabecalhoPagina breadcrumbs={[{ label: 'CRM' }]} />
        <div className="flex-1 flex items-center justify-center text-destructive">
          Erro ao carregar leads: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header com Breadcrumb e Ações */}
      <CabecalhoPagina breadcrumbs={[{ label: 'CRM' }]}>
        {/* Pesquisa */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar leads..." 
            className="pl-8 w-48 lg:w-64 h-8"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Tags Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Tags className="h-4 w-4 mr-1.5" />
              Tags
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por Tag</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Badge className="mr-2 bg-red-500">Urgente</Badge>
              Urgente
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Badge className="mr-2 bg-blue-500">Novo</Badge>
              Novo
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Badge className="mr-2 bg-green-500">VIP</Badge>
              VIP
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Toggle */}
        <div className="flex items-center border rounded-md">
          <Button 
            variant={viewMode === 'kanban' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-8 rounded-r-none"
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-8 rounded-l-none"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Novo Negócio */}
        <NovoLeadDialog />

        {/* Menu de Configurações do Kanban */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Configurações do Kanban</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Columns3 className="h-4 w-4 mr-2" />
              Gerenciar Colunas
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings2 className="h-4 w-4 mr-2" />
              Campos Personalizados
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Tags className="h-4 w-4 mr-2" />
              Gerenciar Tags
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Archive className="h-4 w-4 mr-2" />
              Arquivados
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CabecalhoPagina>

      {/* Área Principal - Kanban ou Lista */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {viewMode === 'kanban' ? (
          <KanbanBoard 
            leads={leadsFiltrados} 
            aoMudarEtapa={(id, etapa) => atualizarEtapa({ id, etapa })} 
          />
        ) : (
          <LeadsList 
            leads={leadsFiltrados} 
            aoMudarEtapa={(id, etapa) => atualizarEtapa({ id, etapa })} 
          />
        )}
      </div>
    </div>
  );
}
