'use client';

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useConvidarUsuario } from "../hooks/use-convidar-usuario";
import { useFranquias } from "../hooks/use-franquias";
import { useLojas } from "../hooks/use-lojas";
import { NovoUsuario, UserRole } from "../types/tipos-usuario";

const formSchema = z.object({
    nome: z.string().min(2, { message: "Nome é obrigatório." }),
    email: z.string().email({ message: "Email inválido." }),
    telefone: z.string().optional(),
    role: z.enum(['admin', 'franquia', 'lojista', 'vendedor', 'convidado'] as const),
    franquia_id: z.string().optional(),
    loja_id: z.string().optional(),
    territorios: z.string().transform((val) => val ? val.split(',').map((t) => t.trim()).filter(Boolean) : []),
    ativo: z.boolean().default(true),
}).refine((data) => {
    if (data.role === 'franquia' && !data.franquia_id) return false;
    if ((data.role === 'lojista' || data.role === 'vendedor') && (!data.franquia_id || !data.loja_id)) return false;
    return true;
}, {
    message: "Selecione a Franquia e/ou Loja para este cargo.",
    path: ["franquia_id"], // Highlight franchise field error primarily
});

type FormValues = z.infer<typeof formSchema>;

export function FormularioUsuario() {
    const { convidarUsuario, estaEnviando } = useConvidarUsuario();
    const { franquias } = useFranquias();
    const { lojas } = useLojas();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            email: "",
            telefone: "",
            role: "vendedor",
            franquia_id: "",
            loja_id: "",
            territorios: "" as any,
            ativo: true,
        },
    });

    const role = useWatch({ control: form.control, name: "role" });
    const selectedFranquiaId = useWatch({ control: form.control, name: "franquia_id" });

    const lojasFiltradas = lojas.filter(l => l.franquia_id === selectedFranquiaId);
    const showFranquia = ['franquia', 'lojista', 'vendedor'].includes(role);
    const showLoja = ['lojista', 'vendedor'].includes(role);

    async function onSubmit(values: FormValues) {
        const payload: NovoUsuario = {
            ...values,
            territorios: values.territorios as unknown as string[],
        };
        await convidarUsuario(payload);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="João Silva" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="joao@exemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="(00) 00000-0000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Função (Role)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                        <SelectItem value="franquia">Franquia</SelectItem>
                                        <SelectItem value="lojista">Lojista (Gerente)</SelectItem>
                                        <SelectItem value="vendedor">Vendedor</SelectItem>
                                        <SelectItem value="convidado">Convidado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {showFranquia && (
                    <FormField
                        control={form.control}
                        name="franquia_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Franquia</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a franquia" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {franquias.map((f) => (
                                            <SelectItem key={f.id} value={f.id}>
                                                {f.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {showLoja && (
                    <FormField
                        control={form.control}
                        name="loja_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loja</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedFranquiaId}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a loja" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {lojasFiltradas.map((l) => (
                                            <SelectItem key={l.id} value={l.id}>
                                                {l.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {!selectedFranquiaId && <FormDescription>Selecione uma franquia primeiro.</FormDescription>}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="territorios"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Territórios Permitidos (Opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="SP:Centro, SP:Sul" {...field} />
                            </FormControl>
                            <FormDescription>
                                Deixe vazio para herdar da loja/franquia ou restrinja acesso a territórios específicos.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={estaEnviando}>
                        {estaEnviando ? "Enviando..." : "Convidar Usuário"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
