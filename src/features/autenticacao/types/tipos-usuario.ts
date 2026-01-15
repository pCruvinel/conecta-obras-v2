export type RoleUsuario = 'admin' | 'franquia' | 'lojista' | 'vendedor' | 'convidado';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  avatar_url?: string;
  role: RoleUsuario;
  franquia_id?: string;
  loja_id?: string;
  territorios: string[]; // Array de strings
  ativo: boolean;
  created_at: string;
  updated_at: string;
}
