export type UserRole = 'admin' | 'franquia' | 'lojista' | 'vendedor' | 'convidado';

export interface Usuario {
    id: string;
    email: string;
    nome: string;
    telefone?: string;
    avatar_url?: string;
    role: UserRole;
    franquia_id?: string;
    loja_id?: string;
    territorios: string[];
    ativo: boolean;
    created_at: string;
    updated_at?: string;
    ultimo_acesso?: string;
}

export type NovoUsuario = Omit<Usuario, 'id' | 'created_at' | 'updated_at' | 'ultimo_acesso'>;
export type AtualizarUsuario = Partial<NovoUsuario>;
