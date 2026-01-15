export type CategoriaObra = 'construcao_civil' | 'eletrica_infra';
export type TipoObra = 'nova' | 'reforma' | 'ampliacao' | 'demolicao';
export type SituacaoObra = 'em_estudo' | 'em_projeto' | 'em_licitacao' | 'em_andamento' | 'paralisada' | 'concluida' | 'cancelada';
export type TipoArea = 'construida' | 'terreno';

export interface Obra {
    id: string;
    cno?: string;
    numero: string;
    endereco: string;
    cidade: string;
    estado: string;
    proprietario?: string;
    categoria: CategoriaObra;
    subcategoria: string;
    tipo_obra: TipoObra;
    situacao: SituacaoObra;
    tipo_area: TipoArea;
    data_inicio: string;
    previsao_termino: string | null;
    metragem: number | null;
    area_total?: number | null;
    valor_investimento?: number | null;
    zona: string | null;
    kilowatt?: number | null; // Novo campo para Obras Elétricas
    destinacao: string | null;
    responsavel_nome: string | null;
    responsavel_tipo: 'PF' | 'PJ';
    responsavel_cnpj: string | null;
    imagem_url: string | null;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
    updated_at: string;
}
