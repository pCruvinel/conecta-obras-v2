'use client';

import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { useCriarFranquia } from "../hooks/use-criar-franquia";
import { NovaFranquia } from "../types/tipos-franquia";

const formSchema = z.object({
    nome: z.string().min(2, {
        message: "Nome da franquia deve ter pelo menos 2 caracteres.",
    }),
    cnpj: z.string().optional(),
    responsavel_nome: z.string().min(2, {
        message: "Nome do responsável é obrigatório.",
    }),
    responsavel_email: z.string().email({
        message: "Email inválido.",
    }),
    responsavel_telefone: z.string().optional(),
    territorios: z.string().transform((val) => val.split(',').map((t) => t.trim()).filter(Boolean)),
    ativa: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function FormularioFranquia() {
    const { criarFranquia, estaCriando } = useCriarFranquia();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            cnpj: "",
            responsavel_nome: "",
            responsavel_email: "",
            responsavel_telefone: "",
            territorios: "" as any, // Typed as string for input, transformed for submission
            ativa: true,
        },
    });

    async function onSubmit(values: FormValues) {
        // Adapter to match NovaFranquia interface which expects array of strings
        const payload: NovaFranquia = {
            ...values,
            territorios: values.territorios as unknown as string[], // Already transformed by zod
        };
        await criarFranquia(payload);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
                <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome da Franquia</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Franquia São Paulo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="responsavel_nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome do Responsável</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome completo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="responsavel_email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email do Responsável</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@exemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="cnpj"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CNPJ (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="00.000.000/0000-00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="responsavel_telefone"
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
                </div>

                <FormField
                    control={form.control}
                    name="territorios"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Territórios</FormLabel>
                            <FormControl>
                                <Input placeholder="SP, RJ, MG (separados por vírgula)" {...field} />
                            </FormControl>
                            <FormDescription>
                                Siglas dos estados ou cidades (ex: SP:Campinas) separados por vírgula.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={estaCriando}>
                        {estaCriando ? "Salvando..." : "Criar Franquia"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
