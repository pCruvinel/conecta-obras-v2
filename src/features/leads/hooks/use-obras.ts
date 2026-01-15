import { useQuery } from '@tanstack/react-query';
import { Obra } from '../types/tipos-obra';
import { FiltrosObra } from '../types/tipos-filtros';
import { create } from 'zustand';

// Configuração do Supabase Externo (Hardcoded conforme solicitado na tarefa)
const EXTERNAL_API_URL = "https://xncroxkjyztpytcqyrih.supabase.co/rest/v1/cno_completov2";
const EXTERNAL_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuY3JveGtqeXp0cHl0Y3F5cmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyNDE3NDksImV4cCI6MjA0NTgxNzc0OX0.OjvIrAYi_yFkBln90D2P_T5dc0qCZQFwOzPZk3qSABM";

// Função para buscar obras na API externa
const buscarObras = async (filtros: FiltrosObra) => {
    // Cálculo de Paginação
    const limit = filtros.itens_por_pagina || 50;
    const page = filtros.pagina || 1;
    const offset = (page - 1) * limit;

    const headers: Record<string, string> = {
        "apikey": EXTERNAL_API_KEY,
        "Authorization": `Bearer ${EXTERNAL_API_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "count=exact",
        "Range": `${offset}-${offset + limit - 1}`
    };

    // Construindo a URL com Query Params
    const params = new URLSearchParams();
    params.append("select", "*");
    params.append("order", "\"Data de registro\".desc");

    // --- FILTROS ---

    // 1. Estado (Espera Sigla Maiúscula: SP, MG)
    if (filtros.estado && filtros.estado !== 'todos') {
        params.append("Estado", `eq.${filtros.estado.toUpperCase()}`);
    }

    // 2. Cidade (Espera TUDO MAIÚSCULO COM ACENTO: "SÃO PAULO")
    if (filtros.cidade) {
        params.append("Nome do município", `eq.${filtros.cidade.toUpperCase()}`);
    }

    // Construção da Query String base
    let queryString = params.toString();

    // 3. Categoria (Lógica baseada em Unidade de Medida)
    if (filtros.categoria) {
        if (filtros.categoria === 'eletrica_infra') {
            // Elétrica: CONTÉM 'kv' OU 'kw' OU 'kva'
            // Usamos um parametro 'or' dedicado para essa lógica inclusiva
            // Nota: PostgREST permite múltiplos 'or' na query string, tratando-os como AND entre si.
            // Ex: ?or=(unidade.ilike.kv,unidade.ilike.kw)&or=(nome.ilike.search)
            const orEletr = `or=("Unidade de medida".ilike.*kv*,"Unidade de medida".ilike.*kw*,"Unidade de medida".ilike.*kva*)`;
            queryString = queryString ? `${queryString}&${orEletr}` : orEletr;

        } else if (filtros.categoria === 'construcao_civil') {
            // Construção Civil: NÃO CONTÉM 'kv' E NÃO CONTÉM 'kw' E NÃO CONTÉM 'kva'
            // Usamos parâmetros diretos de negação. O params.append lida com isso se atualizarmos o params antes.
            // Mas como já convertemos params para string lá em cima, vamos concatenar manualmente.

            // "Unidade de medida" not like *kv* AND "Unidade de medida" not like *kw* ...
            const notKv = `"Unidade de medida".not.ilike.*kv*`;
            const notKw = `"Unidade de medida".not.ilike.*kw*`;
            const notKva = `"Unidade de medida".not.ilike.*kva*`;

            // Concatenando para criar ANDs implícitos
            queryString = queryString
                ? `${queryString}&Unidade de medida=${notKv}&Unidade de medida=${notKw}&Unidade de medida=${notKva}`
                : `Unidade de medida=${notKv}&Unidade de medida=${notKw}&Unidade de medida=${notKva}`;
        }
    }

    // 4. Datas
    // Data Início -> "Data de registro"
    if (filtros.data_inicio) {
        // gte = maior ou igual
        params.delete("Data de registro"); // Evita duplicidade se algo estranho acontecer
        const dateParam = `Data de registro=gte.${filtros.data_inicio}`;
        queryString = queryString ? `${queryString}&${dateParam}` : dateParam;
    }

    // Previsão Término -> "previsaoTermino"
    if (filtros.previsao_termino) {
        // Filtrar obras cuja previsão é ATÉ a data escolhida (lte)
        // Adicionando aspas ("") para garantir case-sensitivity e ::date para forçar comparação de data (evitar erro de texto)
        const dateEndParam = `"previsaoTermino"::date=lte.${filtros.previsao_termino}`;
        queryString = queryString ? `${queryString}&${dateEndParam}` : dateEndParam;
    }

    // 5. Busca Textual (OR Clause)
    if (filtros.termo_busca) {
        let termo = filtros.termo_busca.trim();

        // Colunas de Texto Selecionadas
        const columnsToSearch = [
            "Logradouro",
            "Complemento",
            "Bairro",
            "Nome empresarial",
            "Nome",
            "CNO",
            "Número do logradouro",
            "Destinação",
            "Tipo de obra",
            "Situação",
            "NI do responsável",
            "Nome do município"
        ];

        const orClauses = columnsToSearch.map(col => `"${col}".ilike.*${termo}*`).join(',');
        const orRaw = `or=(${orClauses})`;

        // Adiciona à query
        queryString = queryString ? `${queryString}&${orRaw}` : orRaw;
    }

    const fullUrl = `${EXTERNAL_API_URL}?${queryString}`;
    console.log("DEBUG - Buscando Obras URL:", fullUrl);

    const response = await fetch(fullUrl, { headers });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro API Externa:", response.status, errorText);
        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Pegar o total do header Content-Range (ex: 0-49/100)
    const contentRange = response.headers.get("Content-Range");
    let total = 0;
    if (contentRange) {
        const parts = contentRange.split('/');
        if (parts.length > 1) {
            total = parseInt(parts[1], 10) || data.length;
        }
    } else {
        total = data.length;
    }

    // Mapeamento de Dados
    const obrasMapeadas: Obra[] = data.map((item: any) => ({
        id: item["CNO"],
        cno: item["CNO"],
        numero: item["CNO"],
        created_at: item["Data de registro"] || new Date().toISOString(),
        updated_at: item["Data da situação"] || new Date().toISOString(),

        endereco: `${item["Logradouro"] || ''}, ${item["Número do logradouro"] || ''} - ${item["Bairro"] || ''} ${item["Complemento"] ? '- ' + item["Complemento"] : ''}`,
        cidade: item["Nome do município"],
        estado: item["Estado"],
        latitude: null,
        longitude: null,

        proprietario: item["Nome"],
        responsavel_nome: item["Nome empresarial"] || item["Nome"],
        responsavel_tipo: item["NI do responsável"]?.length > 11 ? 'PJ' : 'PF',
        responsavel_cnpj: item["NI do responsável"],

        categoria: 'construcao_civil',
        subcategoria: item["Nome empresarial"] || 'Não classificado',
        tipo_obra: (item["Tipo de obra"] || 'nova').toLowerCase().includes('demoli') ? 'demolicao' : 'nova',
        situacao: (item["Situação"] || 'em_andamento').toLowerCase().replace(' ', '_'),

        data_inicio: item["Data de início"],
        previsao_termino: item["previsaoTermino"],
        metragem: parseFloat(item["area_m2"] || item["Metragem"] || "0"),
        area_total: parseFloat(item["Área total"] || "0"),
        valor_investimento: parseFloat(item["valorObra"] || "0"),

        zona: item["Código de localização"] === '1' ? 'Urbana' : 'Rural',
        destinacao: item["Destinação"] || 'Não informado',
        imagem_url: null,
        tipo_area: item["Tipo de Área"] || 'construida'
    }));

    return { obras: obrasMapeadas, total: Number(total) };
};

interface ObrasState {
    filtros: FiltrosObra;
    hasSearched: boolean;
    setFiltros: (filtros: FiltrosObra) => void;
    triggerSearch: () => void;
}

export const useObrasStore = create<ObrasState>((set) => ({
    filtros: { pagina: 1, itens_por_pagina: 50 }, // Default values
    hasSearched: false,
    setFiltros: (filtros) => set({ filtros }),
    triggerSearch: () => set({ hasSearched: true }),
}));

export function useObras() {
    const { filtros, hasSearched, setFiltros, triggerSearch } = useObrasStore();

    const query = useQuery({
        queryKey: ['obras-externas', filtros],
        queryFn: () => buscarObras(filtros),
        enabled: hasSearched, // Só busca se triggerSearch foi ativado
        staleTime: 1000 * 60 * 5,
        retry: 1
    });

    return {
        ...query,
        obras: query.data?.obras || [],
        total: query.data?.total || 0,
        filtros,
        setFiltros,
        triggerSearch
    };
}
