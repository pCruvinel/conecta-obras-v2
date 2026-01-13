export interface LeadCRM {
  id: string;
  tipo: 'obra' | 'empresa';
  referencia_id: string;
  usuario_id: string;
  loja_id: string;
  
  // Pipeline
  etapa: EtapaLead;
  temperatura: 'quente' | 'morno' | 'frio';
  probabilidade: number; // 0-100
  valor_estimado?: number;
  
  // Dados da referência (join)
  obra?: {
    id: string;
    titulo: string;
    cidade: string;
    estado: string;
  };
  empresa?: {
    id: string;
    nome_fantasia: string;
    cidade?: string;
    estado?: string;
  };
  
  // Contato principal
  contato_nome?: string;
  contato_telefone?: string;
  contato_email?: string;
  
  // Meta
  favorito: boolean;
  proximo_agendamento?: string | null;
  tags?: { id: string; nome: string; cor: string }[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type EtapaLead = 
  | 'selecao'
  | 'primeiro_contato'
  | 'nao_respondeu'
  | 'negociando'
  | 'proposta_enviada'
  | 'fechado_ganho'
  | 'fechado_perdido';

export interface EtapaConfig {
  ordem: number;
  label: string;
  cor: string;
  icone: string;
}

export const ETAPAS_CONFIG: Record<EtapaLead, EtapaConfig> = {
  selecao: { ordem: 1, label: 'Seleção', cor: 'slate', icone: 'ClipboardList' },
  primeiro_contato: { ordem: 2, label: 'Primeiro Contato', cor: 'blue', icone: 'Phone' },
  nao_respondeu: { ordem: 3, label: 'Não Respondeu', cor: 'orange', icone: 'Clock' },
  negociando: { ordem: 4, label: 'Em Negociação', cor: 'amber', icone: 'MessageSquare' },
  proposta_enviada: { ordem: 5, label: 'Proposta Enviada', cor: 'violet', icone: 'Send' },
  fechado_ganho: { ordem: 6, label: 'Fechado Ganho', cor: 'emerald', icone: 'CheckCircle' },
  fechado_perdido: { ordem: 7, label: 'Fechado Perdido', cor: 'red', icone: 'XCircle' },
};

export const LISTA_ETAPAS = Object.entries(ETAPAS_CONFIG)
  .sort(([, a], [, b]) => a.ordem - b.ordem)
  .map(([key]) => key as EtapaLead);

export interface KanbanColumn {
  id: EtapaLead;
  title: string;
  color: string;
  leads: LeadCRM[];
}
