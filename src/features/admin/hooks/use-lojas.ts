import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Loja } from '../types/tipos-loja';

export interface LojaComFranquia extends Loja {
    franquias: {
        nome: string;
    };
}

export function useLojas() {
    const supabase = createClient();

    const query = useQuery({
        queryKey: ['lojas'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('lojas')
                .select('*, franquias(nome)')
                .order('created_at', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as LojaComFranquia[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        lojas: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
