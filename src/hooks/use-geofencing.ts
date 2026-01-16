'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useCallback, useMemo } from 'react';

export interface RegraGeofencing {
    estado: string;
    cidades: string[];
}

export interface Geofencing {
    obras: RegraGeofencing[];
    empresas: RegraGeofencing[];
}

interface GeofencingData {
    isAdmin: boolean;
    geofencing: Geofencing | null;
    estadosPermitidos: (tipo: 'obras' | 'empresas') => string[];
    cidadesPermitidas: (tipo: 'obras' | 'empresas', estado: string) => string[];
    temRestricao: (tipo: 'obras' | 'empresas') => boolean;
}

export function useGeofencing(): GeofencingData {
    const supabase = createClient();

    const query = useQuery({
        queryKey: ['geofencing-usuario'],
        queryFn: async (): Promise<{ isAdmin: boolean; geofencing: Geofencing | null }> => {
            // 1. Get current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                return { isAdmin: false, geofencing: null };
            }

            // 2. Get user data with franquia_id
            const { data: usuario, error: usuarioError } = await supabase
                .from('usuarios')
                .select('role, franquia_id')
                .eq('id', user.id)
                .single();

            if (usuarioError || !usuario) {
                return { isAdmin: false, geofencing: null };
            }

            // 3. Admin has no restrictions
            if (usuario.role === 'admin') {
                return { isAdmin: true, geofencing: null };
            }

            // 4. Get franchise geofencing if user has franquia_id
            if (usuario.franquia_id) {
                const { data: franquia, error: franquiaError } = await supabase
                    .from('franquias')
                    .select('geofencing')
                    .eq('id', usuario.franquia_id)
                    .single();

                if (!franquiaError && franquia) {
                    return {
                        isAdmin: false,
                        geofencing: franquia.geofencing as Geofencing
                    };
                }
            }

            // 5. Default: no access
            return { isAdmin: false, geofencing: { obras: [], empresas: [] } };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isAdmin = query.data?.isAdmin ?? false;
    const geofencing = query.data?.geofencing ?? null;

    // Memoized helper: Get allowed states for a type
    const estadosPermitidos = useCallback((tipo: 'obras' | 'empresas'): string[] => {
        if (isAdmin || !geofencing) return []; // Empty means all allowed
        const regras = geofencing[tipo];
        return regras.map(r => r.estado);
    }, [isAdmin, geofencing]);

    // Memoized helper: Get allowed cities for a state
    const cidadesPermitidas = useCallback((tipo: 'obras' | 'empresas', estado: string): string[] => {
        if (isAdmin || !geofencing) return []; // Empty means all allowed
        const regra = geofencing[tipo].find(r => r.estado === estado);
        return regra?.cidades ?? [];
    }, [isAdmin, geofencing]);

    // Memoized helper: Check if there are restrictions
    const temRestricao = useCallback((tipo: 'obras' | 'empresas'): boolean => {
        if (isAdmin) return false;
        if (!geofencing) return true; // No data = restricted
        const regras = geofencing[tipo];
        return regras.length > 0;
    }, [isAdmin, geofencing]);

    return {
        isAdmin,
        geofencing,
        estadosPermitidos,
        cidadesPermitidas,
        temRestricao,
    };
}
