import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface MetricasAgregadas {
    total: number;
    ativas: number;
    encerradas: number;
    nulas: number;
    semanal: {
        quantidade: number;
        variacao: number;
    };
}

export function useMetricasObras() {
    const supabase = createClient();

    return useQuery({
        queryKey: ['metricas-obras'],
        queryFn: async (): Promise<MetricasAgregadas> => {
            // Busca dados da view
            const { data: viewData, error: viewError } = await supabase
                .from('vw_metricas_obras')
                .select('total, ativas, encerradas, nulas');

            if (viewError) throw viewError;

            // Agrega os dados da view (client-side aggregation of view rows)
            const totais = viewData.reduce((acc, curr) => ({
                total: acc.total + (curr.total || 0),
                ativas: acc.ativas + (curr.ativas || 0),
                encerradas: acc.encerradas + (curr.encerradas || 0),
                nulas: acc.nulas + (curr.nulas || 0),
            }), { total: 0, ativas: 0, encerradas: 0, nulas: 0 });

            // Busca dados semanais da RPC
            const { data: semanalData, error: rpcError } = await supabase
                .rpc('fn_contar_obras_semana');

            if (rpcError) throw rpcError;

            return {
                ...totais,
                semanal: {
                    quantidade: semanalData?.[0]?.quantidade || 0,
                    variacao: semanalData?.[0]?.variacao || 0,
                }
            };
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
