'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { KanbanColumn as KanbanColumnType } from '../../types/tipos-crm';
import { KanbanCard } from './kanban-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanColunaProps {
  coluna: KanbanColumnType;
}

export function KanbanColuna({ coluna }: KanbanColunaProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: coluna.id,
    data: { type: 'column', columnId: coluna.id }
  });

  // Mapear cores para classes de background mais suaves
  const getHeaderColor = (color: string) => {
    // Se for uma cor tailwind direta, tentar adaptar ou usar estilo inline se for hex
    // Assumindo que 'color' vem como 'blue', 'red', etc ou hex
    return { borderColor: coluna.color };
  };

  return (
    <div className="flex flex-col h-full min-w-[320px] max-w-[320px] rounded-2xl bg-muted/30 dark:bg-muted/10 border border-transparent hover:border-border/50 transition-colors">
      {/* Header Moderno */}
      <div className="p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
           <div 
             className="w-3 h-3 rounded-full shadow-sm ring-2 ring-background" 
             style={{ backgroundColor: coluna.color }} 
           />
           <div className="flex flex-col">
             <span className="font-bold text-sm text-foreground/90">{coluna.title}</span>
             <span className="text-xs text-muted-foreground font-medium">
               {coluna.leads.length} {coluna.leads.length === 1 ? 'lead' : 'leads'}
             </span>
           </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Área de Drop */}
      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 px-3 pb-3 transition-colors rounded-b-2xl",
          isOver && "bg-muted/50 ring-2 ring-inset ring-primary/20"
        )}
      >
        <ScrollArea className="h-full pr-3 -mr-3">
          <div className="flex flex-col gap-3 pb-4">
            <SortableContext items={coluna.leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
              {coluna.leads.map((lead) => (
                <KanbanCard key={lead.id} lead={lead} />
              ))}
            </SortableContext>
            
            {coluna.leads.length === 0 && (
              <div className="h-24 border-2 border-dashed border-muted-foreground/10 rounded-xl flex items-center justify-center text-muted-foreground/40 text-sm font-medium">
                Arraste um lead aqui
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
