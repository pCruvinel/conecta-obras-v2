'use client';

import { LeadCRM, ETAPAS_CONFIG, EtapaLead } from '@/features/crm/types/tipos-crm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MoreHorizontal, 
  Building2, 
  MapPin,
  Mail,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface LeadsListProps {
  leads: LeadCRM[];
  aoMudarEtapa: (id: string, etapa: EtapaLead) => void;
}

const temperaturaCores = {
  quente: 'bg-red-500',
  morno: 'bg-orange-500',
  frio: 'bg-blue-500',
};

const temperaturaLabels = {
  quente: 'Quente',
  morno: 'Morno',
  frio: 'Frio',
};

export function LeadsList({ leads, aoMudarEtapa }: LeadsListProps) {
  const formatarData = (data: string | null | undefined) => {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatarValor = (valor: number | undefined) => {
    if (!valor) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const getIniciais = (nome: string | undefined) => {
    if (!nome) return '??';
    return nome.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  };

  if (leads.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-8">
        Nenhum lead encontrado
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">Lead</TableHead>
              <TableHead className="w-[180px]">Empresa/Obra</TableHead>
              <TableHead className="w-[140px]">Etapa</TableHead>
              <TableHead className="w-[100px]">Temperatura</TableHead>
              <TableHead className="w-[120px]">Valor Est.</TableHead>
              <TableHead className="w-[100px]">Prob.</TableHead>
              <TableHead className="w-[120px]">Últ. Contato</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
              const etapaConfig = ETAPAS_CONFIG[lead.etapa];
              const nome = lead.contato_nome || 'Sem nome';
              const empresa = lead.empresa?.nome_fantasia || lead.obra?.titulo || '-';
              const cidade = lead.empresa?.cidade || lead.obra?.cidade || '';
              const estado = lead.empresa?.estado || lead.obra?.estado || '';
              const localizacao = cidade && estado ? `${cidade}, ${estado}` : cidade || estado || '';

              return (
                <TableRow key={lead.id} className="group cursor-pointer hover:bg-muted/50">
                  {/* Lead Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs bg-muted">
                          {getIniciais(lead.contato_nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm truncate">{nome}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {lead.contato_email && (
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="h-3 w-3" />
                              {lead.contato_email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Empresa/Obra */}
                  <TableCell>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {empresa}
                      </span>
                      {localizacao && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {localizacao}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Etapa */}
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs font-medium",
                        etapaConfig.cor === 'emerald' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        etapaConfig.cor === 'red' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        etapaConfig.cor === 'blue' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        etapaConfig.cor === 'orange' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                        etapaConfig.cor === 'amber' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        etapaConfig.cor === 'violet' && "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
                      )}
                    >
                      {etapaConfig.label}
                    </Badge>
                  </TableCell>

                  {/* Temperatura */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", temperaturaCores[lead.temperatura])} />
                      <span className="text-sm">{temperaturaLabels[lead.temperatura]}</span>
                    </div>
                  </TableCell>

                  {/* Valor */}
                  <TableCell>
                    <span className="text-sm font-medium">
                      {formatarValor(lead.valor_estimado)}
                    </span>
                  </TableCell>

                  {/* Probabilidade */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${lead.probabilidade}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{lead.probabilidade}%</span>
                    </div>
                  </TableCell>

                  {/* Último Contato */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatarData(lead.updated_at)}
                    </span>
                  </TableCell>

                  {/* Ações */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Agendar contato</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs">Mover para</DropdownMenuLabel>
                        {Object.entries(ETAPAS_CONFIG).map(([key, config]) => (
                          <DropdownMenuItem 
                            key={key}
                            onClick={() => aoMudarEtapa(lead.id, key as EtapaLead)}
                            disabled={lead.etapa === key}
                          >
                            {config.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
