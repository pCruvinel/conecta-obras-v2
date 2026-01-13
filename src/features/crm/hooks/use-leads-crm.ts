import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { LeadCRM, EtapaLead } from '../types/tipos-crm';

// Mock data para desenvolvimento (quando não há auth)
const MOCK_LEADS: LeadCRM[] = [
  {
    id: 'lead-1',
    tipo: 'obra',
    referencia_id: 'obra-1',
    usuario_id: 'user-1',
    loja_id: 'loja-1',
    etapa: 'selecao',
    temperatura: 'quente',
    probabilidade: 80,
    valor_estimado: 150000,
    obra: { id: 'obra-1', titulo: 'Edifício Aurora', cidade: 'São Paulo', estado: 'SP' },
    contato_nome: 'João Silva',
    contato_telefone: '11 99999-1111',
    contato_email: 'joao.silva@email.com',
    favorito: true,
    proximo_agendamento: new Date(Date.now() + 86400000).toISOString(),
    tags: [{ id: 'tag-1', nome: 'VIP', cor: '#22c55e' }],
    created_at: new Date(Date.now() - 604800000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'lead-2',
    tipo: 'empresa',
    referencia_id: 'empresa-1',
    usuario_id: 'user-1',
    loja_id: 'loja-1',
    etapa: 'primeiro_contato',
    temperatura: 'morno',
    probabilidade: 60,
    valor_estimado: 85000,
    empresa: { id: 'empresa-1', nome_fantasia: 'Construtora Beta', cidade: 'Rio de Janeiro', estado: 'RJ' },
    contato_nome: 'Maria Santos',
    contato_telefone: '21 98888-2222',
    contato_email: 'maria@construtora.com',
    favorito: false,
    proximo_agendamento: null,
    tags: [{ id: 'tag-2', nome: 'Novo', cor: '#3b82f6' }],
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'lead-3',
    tipo: 'obra',
    referencia_id: 'obra-2',
    usuario_id: 'user-1',
    loja_id: 'loja-1',
    etapa: 'negociando',
    temperatura: 'quente',
    probabilidade: 75,
    valor_estimado: 220000,
    obra: { id: 'obra-2', titulo: 'Residencial Parkview', cidade: 'Curitiba', estado: 'PR' },
    contato_nome: 'Pedro Oliveira',
    contato_telefone: '41 97777-3333',
    contato_email: 'pedro@parkview.com',
    favorito: true,
    proximo_agendamento: new Date(Date.now() + 172800000).toISOString(),
    tags: [{ id: 'tag-1', nome: 'VIP', cor: '#22c55e' }, { id: 'tag-3', nome: 'Urgente', cor: '#ef4444' }],
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'lead-4',
    tipo: 'empresa',
    referencia_id: 'empresa-2',
    usuario_id: 'user-1',
    loja_id: 'loja-1',
    etapa: 'proposta_enviada',
    temperatura: 'morno',
    probabilidade: 65,
    valor_estimado: 180000,
    empresa: { id: 'empresa-2', nome_fantasia: 'Alpha Engenharia', cidade: 'Belo Horizonte', estado: 'MG' },
    contato_nome: 'Ana Costa',
    contato_telefone: '31 96666-4444',
    contato_email: 'ana@alphaeng.com.br',
    favorito: false,
    proximo_agendamento: null,
    tags: [],
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'lead-5',
    tipo: 'obra',
    referencia_id: 'obra-3',
    usuario_id: 'user-1',
    loja_id: 'loja-1',
    etapa: 'nao_respondeu',
    temperatura: 'frio',
    probabilidade: 25,
    valor_estimado: 95000,
    obra: { id: 'obra-3', titulo: 'Centro Comercial Express', cidade: 'Porto Alegre', estado: 'RS' },
    contato_nome: 'Carlos Lima',
    contato_telefone: '51 95555-5555',
    contato_email: 'carlos.lima@express.com',
    favorito: false,
    proximo_agendamento: null,
    tags: [],
    created_at: new Date(Date.now() - 518400000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'lead-6',
    tipo: 'empresa',
    referencia_id: 'empresa-3',
    usuario_id: 'user-1',
    loja_id: 'loja-1',
    etapa: 'fechado_ganho',
    temperatura: 'quente',
    probabilidade: 100,
    valor_estimado: 320000,
    empresa: { id: 'empresa-3', nome_fantasia: 'Mega Construções Ltda', cidade: 'Brasília', estado: 'DF' },
    contato_nome: 'Roberto Mendes',
    contato_telefone: '61 94444-6666',
    contato_email: 'roberto@mega.com.br',
    favorito: true,
    proximo_agendamento: null,
    tags: [{ id: 'tag-1', nome: 'VIP', cor: '#22c55e' }],
    created_at: new Date(Date.now() - 2592000000).toISOString(),
    updated_at: new Date(Date.now() - 604800000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'lead-7',
    tipo: 'obra',
    referencia_id: 'obra-4',
    usuario_id: 'user-1',
    loja_id: 'loja-1',
    etapa: 'fechado_perdido',
    temperatura: 'frio',
    probabilidade: 0,
    valor_estimado: 75000,
    obra: { id: 'obra-4', titulo: 'Galpão Industrial Norte', cidade: 'Manaus', estado: 'AM' },
    contato_nome: 'Fernanda Rocha',
    contato_telefone: '92 93333-7777',
    contato_email: 'fernanda@galpao.com',
    favorito: false,
    proximo_agendamento: null,
    tags: [],
    created_at: new Date(Date.now() - 1728000000).toISOString(),
    updated_at: new Date(Date.now() - 1296000000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'lead-8',
    tipo: 'empresa',
    referencia_id: 'empresa-4',
    usuario_id: 'user-1',
    loja_id: 'loja-1',
    etapa: 'primeiro_contato',
    temperatura: 'quente',
    probabilidade: 70,
    valor_estimado: 145000,
    empresa: { id: 'empresa-4', nome_fantasia: 'Delta Incorporadora', cidade: 'Florianópolis', estado: 'SC' },
    contato_nome: 'Lucas Ferreira',
    contato_telefone: '48 92222-8888',
    contato_email: 'lucas@delta.com.br',
    favorito: false,
    proximo_agendamento: new Date(Date.now() + 259200000).toISOString(),
    tags: [{ id: 'tag-2', nome: 'Novo', cor: '#3b82f6' }],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    deleted_at: null,
  },
];

// Flag para usar mock data (true = sempre usar mock, false = tentar Supabase)
const USE_MOCK_DATA = true;

export function useLeadsCRM() {
  const supabase = createClient();

  const query = useQuery({
    queryKey: ['leads-crm'],
    queryFn: async (): Promise<LeadCRM[]> => {
      // Usar mock data para desenvolvimento
      if (USE_MOCK_DATA) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_LEADS;
      }

      // Tentar buscar do Supabase (requer auth)
      try {
        const { data, error } = await supabase
          .from('leads_crm')
          .select('*')
          .is('deleted_at', null)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const leadsFormatados: LeadCRM[] = data.map((item: any) => ({
          ...item,
          obra: undefined,
          empresa: undefined,
          tags: []
        }));

        return leadsFormatados;
      } catch (error) {
        console.warn('Erro ao buscar leads do Supabase, usando mock data:', error);
        return MOCK_LEADS;
      }
    }
  });

  return query;
}
