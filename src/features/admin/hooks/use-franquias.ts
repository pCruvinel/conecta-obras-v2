import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Franquia } from '../types/tipos-franquia';

export function useFranquias() {
    const supabase = createClient();

    const query = useQuery({
        queryKey: ['franquias'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('franquias')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

            return data as Franquia[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        franquias: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
