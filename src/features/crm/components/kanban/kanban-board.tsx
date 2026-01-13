'use client';

import { useState, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  PointerSensor,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  closestCorners
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import { 
  LeadCRM, 
  KanbanColumn as KanbanColumnType, 
  LISTA_ETAPAS, 
  ETAPAS_CONFIG,
  EtapaLead
} from '../../types/tipos-crm';
import { KanbanColuna } from './kanban-coluna';
import { KanbanCard } from './kanban-card';

// Variável global para corrigir problema de SSR no DndKit
const isBrowser = typeof window !== 'undefined';

interface KanbanBoardProps {
  leads: LeadCRM[];
  aoMudarEtapa?: (leadId: string, novaEtapa: EtapaLead) => void;
}

export function KanbanBoard({ leads, aoMudarEtapa }: KanbanBoardProps) {
  // Estado local para otimistic updates
  const [items, setItems] = useState<LeadCRM[]>(leads); // Na prática usar useEffect para sync
  const [activeLead, setActiveLead] = useState<LeadCRM | null>(null);

  // Mapear colunas baseado nos leads
  const colunas = useMemo(() => {
    return LISTA_ETAPAS.map(etapa => ({
      id: etapa,
      title: ETAPAS_CONFIG[etapa].label,
      color: ETAPAS_CONFIG[etapa].cor,
      leads: items.filter(lead => lead.etapa === etapa)
    }));
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevenir drag acidental ao clicar
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current) {
      setActiveLead(event.active.data.current as LeadCRM);
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveALead = active.data.current?.hasOwnProperty('tipo');
    const isOverALead = over.data.current?.hasOwnProperty('tipo');
    const isOverAColumn = over.data.current?.type === 'column';

    // Soltando Lead sobre Lead (reordenar ou mudar coluna)
    if (isActiveALead && isOverALead) {
       // Lógica de reordenação visual (opcional nesta fase)
    }

    // Soltando Lead sobre Coluna Vazia
    if (isActiveALead && isOverAColumn) {
       // Mudar etapa visualmente (se necessário antes do drop)
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const activeLeadData = active.data.current as LeadCRM;
    const overId = over.id;

    // Identificar nova etapa
    // Se soltou sobre uma coluna
    let novaEtapa: EtapaLead | null = null;

    if (LISTA_ETAPAS.includes(overId as EtapaLead)) {
      novaEtapa = overId as EtapaLead;
    } 
    // Se soltou sobre outro card
    else if (over.data.current?.etapa) {
      novaEtapa = over.data.current.etapa;
    }

    if (novaEtapa && novaEtapa !== activeLeadData.etapa) {
      // Atualizar estado local
      setItems(items => items.map(lead => {
        if (lead.id === activeLeadData.id) {
          return { ...lead, etapa: novaEtapa! };
        }
        return lead;
      }));

      // Chamar callback para salvar no banco
      aoMudarEtapa?.(activeLeadData.id, novaEtapa);
    }
  }

  // Atualizar items quando props mudarem (sync externo)
  // useEffect(() => { setItems(leads) }, [leads]); 
  // Nota: Isso pode causar conflito com drag state se não for feito com cuidado.
  // Para MVP vamos assumir que o React Query invalida e recarrega.

  if (!isBrowser) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto p-4 snap-x snap-mandatory">
        {colunas.map((coluna) => (
          <KanbanColuna key={coluna.id} coluna={coluna} />
        ))}
      </div>

      {createPortal(
        <DragOverlay>
          {activeLead && <KanbanCard lead={activeLead} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
