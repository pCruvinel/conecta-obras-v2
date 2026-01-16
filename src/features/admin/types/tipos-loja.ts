import { PermissoesModulo, Endereco, Geofencing } from './tipos-franquia';

export interface Loja {
    id: string;
    franquia_id: string;
    nome: string;
    documento?: string; // CNPJ ou CPF
    tipo_documento?: 'cpf' | 'cnpj';

    // Contato Principal
    responsavel_nome: string;
    responsavel_email: string;
    responsavel_telefone?: string;

    // Endereço
    endereco?: Endereco;
    cidade: string;
    estado: string;

    // Configurações
    permissoes?: PermissoesModulo;
    geofencing?: Geofencing;
    territorios: string[];

    // Créditos
    creditos_disponiveis?: number; // Deprecated
    creditos_quota_mensal: number;
    creditos_consumidos: number;
    creditos_distribuidos: number;

    ativa: boolean;
    created_at: string;
    updated_at?: string;

    // Relacionamentos (join)
    franquias?: { nome: string };
}

export type NovaLoja = Omit<Loja, 'id' | 'created_at' | 'updated_at' | 'creditos_disponiveis' | 'creditos_consumidos' | 'creditos_distribuidos' | 'franquias'>;
export type AtualizarLoja = Partial<NovaLoja>;
