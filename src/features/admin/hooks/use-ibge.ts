import { useQuery } from "@tanstack/react-query";

export interface EstadoIBGE {
    id: number;
    sigla: string;
    nome: string;
}

export interface CidadeIBGE {
    id: number;
    nome: string;
}

export function useEstados() {
    return useQuery<EstadoIBGE[]>({
        queryKey: ['estados-ibge'],
        queryFn: async () => {
            const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
            if (!response.ok) throw new Error('Falha ao buscar estados');
            return response.json();
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

export function useCidades(uf: string | null) {
    return useQuery<CidadeIBGE[]>({
        queryKey: ['cidades-ibge', uf],
        queryFn: async () => {
            if (!uf) return [];
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
            if (!response.ok) throw new Error('Falha ao buscar cidades');
            return response.json();
        },
        enabled: !!uf,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}
