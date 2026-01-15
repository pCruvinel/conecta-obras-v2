import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Obra } from '../types/tipos-obra';

export function useObra(id: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ['obra', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('obras')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Obra;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 30, // 30 minutos
    });
}
