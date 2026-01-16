'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface CreditosUsuario {
    quota_mensal: number;
    consumidos: number;
    disponiveis: number;
}

interface ConfiguracoesSistema {
    id: string;
    dia_reset_creditos: number;
    ultimo_reset: string | null;
}

interface LogConsumo {
    id: string;
    usuario_id: string;
    tipo_consulta: string;
    creditos_consumidos: number;
    dados_consulta: Record<string, unknown>;
    created_at: string;
}

export function useCreditos() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    // Buscar créditos do usuário atual
    const creditosQuery = useQuery({
        queryKey: ['creditos-usuario'],
        queryFn: async (): Promise<CreditosUsuario | null> => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data: usuario, error } = await supabase
                .from('usuarios')
                .select('creditos_quota_mensal, creditos_consumidos')
                .eq('id', user.id)
                .single();

            if (error || !usuario) return null;

            return {
                quota_mensal: usuario.creditos_quota_mensal,
                consumidos: usuario.creditos_consumidos,
                disponiveis: usuario.creditos_quota_mensal - usuario.creditos_consumidos,
            };
        },
        staleTime: 30 * 1000, // 30 seconds
    });

    // Buscar configurações do sistema
    const configQuery = useQuery({
        queryKey: ['configuracoes-sistema'],
        queryFn: async (): Promise<ConfiguracoesSistema | null> => {
            const { data, error } = await supabase
                .from('configuracoes_sistema')
                .select('*')
                .limit(1)
                .single();

            if (error) return null;
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Consumir crédito
    const consumirMutation = useMutation({
        mutationFn: async ({ tipoConsulta, dadosConsulta }: { tipoConsulta: string; dadosConsulta?: Record<string, unknown> }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const { data, error } = await supabase.rpc('consumir_credito', {
                p_usuario_id: user.id,
                p_tipo_consulta: tipoConsulta,
                p_dados_consulta: dadosConsulta || {},
            });

            if (error) throw error;
            if (data === false) throw new Error('Sem créditos disponíveis');

            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creditos-usuario'] });
        },
        onError: (error: Error) => {
            if (error.message === 'Sem créditos disponíveis') {
                toast.error('Você não possui créditos suficientes para esta consulta.');
            } else {
                toast.error('Erro ao processar consulta.');
            }
        },
    });

    // Buscar log de consumo (para admin/franquia)
    const useLogConsumo = (franquiaId?: string) => {
        return useQuery({
            queryKey: ['log-consumo', franquiaId],
            queryFn: async (): Promise<LogConsumo[]> => {
                let query = supabase
                    .from('log_consumo_creditos')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);

                if (franquiaId) {
                    query = query.eq('franquia_id', franquiaId);
                }

                const { data, error } = await query;
                if (error) throw error;
                return data || [];
            },
            enabled: !!franquiaId || franquiaId === undefined,
        });
    };

    return {
        creditos: creditosQuery.data,
        isLoadingCreditos: creditosQuery.isLoading,
        configuracoes: configQuery.data,
        consumirCredito: consumirMutation.mutateAsync,
        isConsumindo: consumirMutation.isPending,
        temCreditos: (creditosQuery.data?.disponiveis ?? 0) > 0,
        useLogConsumo,
    };
}
