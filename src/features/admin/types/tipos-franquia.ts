export interface Endereco {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string; // UF
}

export interface PermissoesModulo {
    dashboard: boolean;
    leads_obras: boolean;
    leads_empresas: boolean;
    crm: boolean;
    consulta_plus: boolean;
    chat_ia: boolean;
}

export interface RegraGeofencing {
    estado: string; // UF ou 'TODOS'
    cidades: string[]; // Lista de cidades ou ['TODAS']
}

export interface Geofencing {
    obras: RegraGeofencing[];
    empresas: RegraGeofencing[];
}

export interface Franquia {
    id: string;
    nome: string;
    cnpj?: string;

    // Contato Principal
    responsavel_nome: string;
    responsavel_email: string;
    responsavel_telefone?: string;

    // Endereço Completo
    endereco: Endereco;

    // Configurações e Permissões
    permissoes: PermissoesModulo;
    geofencing: Geofencing;

    // Financeiro / Créditos
    creditos_disponiveis?: number; // Deprecated - mantido para compatibilidade
    creditos_quota_mensal: number; // Quota fixa mensal
    creditos_consumidos: number; // Créditos usados no mês
    creditos_distribuidos: number; // Créditos dados para lojas

    ativa: boolean;
    created_at: string;
    updated_at: string;
}

export type NovaFranquia = Omit<Franquia, 'id' | 'created_at' | 'updated_at'>;
export type AtualizarFranquia = Partial<NovaFranquia>;
