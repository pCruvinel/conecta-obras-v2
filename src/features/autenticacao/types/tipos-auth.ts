import { z } from 'zod';

export const schemaLogin = z.object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type DadosLogin = z.infer<typeof schemaLogin>;

export const schemaRegistro = z.object({
    nome: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não conferem',
    path: ['confirmarSenha'],
});

export type DadosRegistro = z.infer<typeof schemaRegistro>;

export const schemaEsqueciSenha = z.object({
    email: z.string().email('E-mail inválido'),
});

export type DadosEsqueciSenha = z.infer<typeof schemaEsqueciSenha>;
