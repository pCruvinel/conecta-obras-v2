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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCriarLoja } from "../hooks/use-criar-loja";
import { useFranquias } from "../hooks/use-franquias";
import { NovaLoja } from "../types/tipos-loja";

const formSchema = z.object({
    franquia_id: z.string().min(1, { message: "Selecione uma franquia." }),
    nome: z.string().min(2, { message: "Nome da loja deve ter pelo menos 2 caracteres." }),
    cnpj: z.string().optional(),
    endereco: z.string().optional(),
    cidade: z.string().min(2, { message: "Cidade é obrigatória." }),
    estado: z.string().length(2, { message: "Use a sigla do estado (ex: SP)." }),
    territorios: z.string().optional(),
    ativa: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function FormularioLoja() {
    const { criarLoja, estaCriando } = useCriarLoja();
    const { franquias } = useFranquias();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            franquia_id: "",
            nome: "",
            cnpj: "",
            endereco: "",
            cidade: "",
            estado: "",
            territorios: "",
            ativa: true,
        },
    });

    async function onSubmit(values: FormValues) {
        const payload: NovaLoja = {
            ...values,
            territorios: values.territorios
                ? values.territorios.split(',').map((t) => t.trim()).filter(Boolean)
                : [],
            estado: values.estado.toUpperCase(),
        };
        await criarLoja(payload);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">

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
                                    {franquias.map((franquia) => (
                                        <SelectItem key={franquia.id} value={franquia.id}>
                                            {franquia.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome da Loja</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Loja Centro" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="cidade"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cidade</FormLabel>
                                <FormControl>
                                    <Input placeholder="São Paulo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado (UF)</FormLabel>
                                <FormControl>
                                    <Input placeholder="SP" maxLength={2} {...field} />
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
                        name="endereco"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endereço (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Rua X, 123" {...field} />
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
                            <FormLabel>Territórios da Loja</FormLabel>
                            <FormControl>
                                <Input placeholder="SP:Centro, SP:Sul" {...field} />
                            </FormControl>
                            <FormDescription>
                                Subdivisões dos territórios da franquia.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={estaCriando}>
                        {estaCriando ? "Salvando..." : "Criar Loja"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
