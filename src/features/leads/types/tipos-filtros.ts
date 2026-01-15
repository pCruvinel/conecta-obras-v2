import { CategoriaObra, SituacaoObra, TipoArea, TipoObra } from "./tipos-obra";

export interface FiltrosObra {
    estado?: string;
    cidade?: string;
    categoria?: CategoriaObra | "todas";
    subcategoria?: string;
    tipo_obra?: TipoObra | "todos";
    situacao?: SituacaoObra | "todas";
    tipo_area?: TipoArea;
    data_inicio?: string;          // Mapeado p/ Data de registro
    previsao_termino?: string;     // Mapeado p/ previsaoTermino
    metragem_min?: number;
    metragem_max?: number;
    zona?: string;
    kilowatt?: number;
    responsavel_tipo?: 'PF' | 'PJ';
    termo_busca?: string; // Busca textual (nome, endereco)
    ordenacao?: 'recente' | 'antiga' | 'maior_metragem' | 'menor_metragem';
    pagina?: number;
    itens_por_pagina?: number;
}
