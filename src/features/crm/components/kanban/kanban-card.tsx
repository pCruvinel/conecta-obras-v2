'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LeadCRM } from '../../types/tipos-crm';
import { CalendarIcon, MapPin, Building2, MoreHorizontal, MessageSquare, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface KanbanCardProps {
  lead: LeadCRM;
}

const TEMPERATURA_COLORS = {
  quente: 'bg-red-50 text-red-700 border-red-100 ring-red-500/10',
  morno: 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10',
  frio: 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10',
};

export function KanbanCard({ lead }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id, data: lead });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const formatarMoeda = (valor?: number) => {
    if (!valor) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const titulo = lead.tipo === 'obra' ? lead.obra?.titulo : lead.empresa?.nome_fantasia;
  const localizacao = lead.tipo === 'obra' 
    ? `${lead.obra?.cidade}, ${lead.obra?.estado}` 
    : `${lead.empresa?.cidade || '-'}, ${lead.empresa?.estado || '-'}`;
  
  const initials = titulo?.substring(0, 2).toUpperCase() || 'LD';

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-lg transition-all border-border/40 group relative overflow-hidden",
        isDragging && "shadow-xl ring-2 ring-primary rotate-2 z-50",
        !isDragging && "hover:border-primary/20",
        "dark:bg-background/80 dark:backdrop-blur-sm"
      )}>
        {/* Faixa decorativa lateral indicando temperatura (opcional) */}
        <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity", 
            lead.temperatura === 'quente' && "bg-red-500",
            lead.temperatura === 'morno' && "bg-amber-500",
            lead.temperatura === 'frio' && "bg-blue-500",
        )} />

        <CardContent className="p-4 space-y-3">
          {/* Header do Card */}
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 space-y-1.5">
               <div className="flex items-center gap-2">
                 <Badge variant="secondary" className={cn(
                   "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 h-5 border shadow-none",
                   TEMPERATURA_COLORS[lead.temperatura]
                 )}>
                   {lead.temperatura}
                 </Badge>
                 {lead.probabilidade >= 80 && (
                   <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-700 bg-emerald-50 h-5 px-1.5">
                     {lead.probabilidade}% CHANCE
                   </Badge>
                 )}
               </div>
               
               <h4 className="font-bold text-sm leading-tight text-foreground/90 group-hover:text-primary transition-colors line-clamp-2">
                 {titulo || 'Sem título'}
               </h4>
            </div>
            
            {/* Ações rápidas (visible on hover) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-1">
               <button className="p-1.5 text-muted-foreground hover:bg-muted rounded-full">
                 <MoreHorizontal className="w-4 h-4" />
               </button>
            </div>
          </div>

          {/* Dados Principais */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
              <span className="truncate max-w-[180px]">{localizacao}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
              <span className="truncate">
                {lead.tipo === 'obra' ? 'Obra' : 'Empresa'}
              </span>
            </div>

            {lead.proximo_agendamento && (
               <div className="flex items-center gap-2 text-xs pt-1">
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-100 font-medium">
                   <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                   <span>{lead.proximo_agendamento}</span> 
                 </div>
               </div>
            )}
          </div>

          {/* Footer: Avatar e Valor */}
          <div className="pt-3 border-t flex items-center justify-between">
             <div className="flex gap-1.5 items-center">
                <Avatar className="h-6 w-6 border-2 border-background">
                   <AvatarImage src={`https://avatar.vercel.sh/${lead.id}`} />
                   <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                
                {/* Tags minimalistas */}
                {lead.tags?.slice(0, 2).map(tag => (
                   <div key={tag.id} 
                        className="w-2 h-2 rounded-full ring-2 ring-background ring-offset-1" 
                        style={{ backgroundColor: tag.cor }} 
                        title={tag.nome} 
                   />
                ))}
            </div>
             
             <span className="text-sm font-bold text-foreground">
               {formatarMoeda(lead.valor_estimado)}
             </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
