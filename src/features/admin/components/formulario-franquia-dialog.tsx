'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCriarFranquia } from "../hooks/use-criar-franquia";
import { useAtualizarFranquia } from "../hooks/use-atualizar-franquia";
import { NovaFranquia, Franquia } from "../types/tipos-franquia";
import { MapPin, Plus, Loader2, Eye, EyeOff } from "lucide-react";
import { GeofencingSelector } from "./geofencing-selector";
import { toast } from "sonner";

// Funções de Máscara
function maskCNPJ(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
}

function maskPhone(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
}

function maskCEP(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
}

interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

// Schema de Validação
const formSchema = z.object({
    nome: z.string().min(2, "Nome da franquia deve ter pelo menos 2 caracteres."),
    cnpj: z.string().optional(),
    responsavel_nome: z.string().min(2, "Nome do responsável é obrigatório."),
    responsavel_email: z.string().email("Email inválido."),
    responsavel_telefone: z.string().optional(),

    // Senha para criar conta do usuário (opcional ao editar)
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres.").optional().or(z.literal('')),
    confirmar_senha: z.string().optional().or(z.literal('')),

    // Endereço
    endereco: z.object({
        cep: z.string().min(8, "CEP inválido"),
        logradouro: z.string().min(1, "Rua é obrigatória"),
        numero: z.string().min(1, "Número é obrigatório"),
        complemento: z.string().optional(),
        bairro: z.string().min(1, "Bairro é obrigatório"),
        cidade: z.string().min(1, "Cidade é obrigatória"),
        estado: z.string().length(2, "UF inválida"),
    }),

    // Permissões - pelo menos 1 módulo deve estar ativo
    permissoes: z.object({
        dashboard: z.boolean(),
        leads_obras: z.boolean(),
        leads_empresas: z.boolean(),
        crm: z.boolean(),
        consulta_plus: z.boolean(),
        chat_ia: z.boolean(),
    }).refine(
        (data) => Object.values(data).some(v => v === true),
        { message: "Selecione pelo menos 1 módulo de permissão." }
    ),

    // Geofencing (opcional - pode editar depois)
    geofencing: z.object({
        obras: z.array(z.object({
            estado: z.string(),
            cidades: z.array(z.string())
        })),
        empresas: z.array(z.object({
            estado: z.string(),
            cidades: z.array(z.string())
        })),
    }),

    // Créditos (quota mensal)
    creditos_quota_mensal: z.number().min(0).optional(),
    ativa: z.boolean(),
}).refine(
    (data) => !data.senha || data.senha === data.confirmar_senha,
    { message: "As senhas não coincidem.", path: ["confirmar_senha"] }
);

type FormValues = z.infer<typeof formSchema>;

interface FormularioFranquiaDialogProps {
    franquia?: Franquia;
    children?: React.ReactNode;
}

export function FormularioFranquiaDialog({ franquia, children }: FormularioFranquiaDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { criarFranquia, estaCriando } = useCriarFranquia();
    const { atualizarFranquia, estaAtualizando } = useAtualizarFranquia();
    const isEditing = !!franquia;

    // Busca endereço pelo CEP via ViaCEP API
    const handleCepBlur = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        setIsLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data: ViaCepResponse = await response.json();

            if (data.erro) {
                toast.error('CEP não encontrado.');
                return;
            }

            form.setValue('endereco.logradouro', data.logradouro || '');
            form.setValue('endereco.bairro', data.bairro || '');
            form.setValue('endereco.cidade', data.localidade || '');
            form.setValue('endereco.estado', data.uf || '');
            form.setValue('endereco.complemento', data.complemento || '');
        } catch {
            toast.error('Erro ao buscar CEP.');
        } finally {
            setIsLoadingCep(false);
        }
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            cnpj: "",
            responsavel_nome: "",
            responsavel_email: "",
            responsavel_telefone: "",
            senha: "",
            confirmar_senha: "",
            endereco: {
                cep: "",
                logradouro: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: "",
            },
            permissoes: {
                dashboard: false,
                leads_obras: false,
                leads_empresas: false,
                crm: false,
                consulta_plus: false,
                chat_ia: false,
            },
            geofencing: {
                obras: [],
                empresas: []
            },
            creditos_quota_mensal: 0,
            ativa: true,
        },
    });

    useEffect(() => {
        if (open) {
            if (franquia) {
                // Ao editar, preenche com os dados existentes
                // Precisamos garantir que os dados batam com o schema, especialmente arrays e objetos
                form.reset({
                    nome: franquia.nome || "",
                    cnpj: franquia.cnpj || "",
                    responsavel_nome: franquia.responsavel_nome || "",
                    responsavel_email: franquia.responsavel_email || "",
                    responsavel_telefone: franquia.responsavel_telefone || "",
                    senha: "",
                    confirmar_senha: "",
                    endereco: {
                        cep: franquia.endereco?.cep || "",
                        logradouro: franquia.endereco?.logradouro || "",
                        numero: franquia.endereco?.numero || "",
                        complemento: franquia.endereco?.complemento || "",
                        bairro: franquia.endereco?.bairro || "",
                        cidade: franquia.endereco?.cidade || "",
                        estado: franquia.endereco?.estado || "",
                    },
                    permissoes: franquia.permissoes || {
                        dashboard: false,
                        leads_obras: false,
                        leads_empresas: false,
                        crm: false,
                        consulta_plus: false,
                        chat_ia: false,
                    },
                    geofencing: franquia.geofencing || { obras: [], empresas: [] },
                    creditos_quota_mensal: franquia.creditos_quota_mensal ?? 0,
                    ativa: franquia.ativa ?? true,
                });
            } else {
                // Ao criar, limpa para os valores padrão
                form.reset({
                    nome: "",
                    cnpj: "",
                    responsavel_nome: "",
                    responsavel_email: "",
                    responsavel_telefone: "",
                    senha: "",
                    endereco: {
                        cep: "",
                        logradouro: "",
                        numero: "",
                        complemento: "",
                        bairro: "",
                        cidade: "",
                        estado: "",
                    },
                    permissoes: {
                        dashboard: false,
                        leads_obras: false,
                        leads_empresas: false,
                        crm: false,
                        consulta_plus: false,
                        chat_ia: false,
                    },
                    geofencing: {
                        obras: [],
                        empresas: []
                    },
                    creditos_quota_mensal: 0,
                    ativa: true,
                });
            }
        }
    }, [open, franquia, form]);

    async function onSubmit(values: FormValues) {
        if (isEditing && franquia) {
            await atualizarFranquia({ id: franquia.id, dados: values });
        } else {
            await criarFranquia(values as NovaFranquia);
        }
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Franquia
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Franquia" : "Nova Franquia"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Atualize os dados e permissões da franquia." : "Preencha os dados básicos e configure as permissões da franquia."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col min-h-0">
                        <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden min-h-0">
                            <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
                                <TabsTrigger value="info">Informações Básicas</TabsTrigger>
                                <TabsTrigger value="permissoes">Permissões</TabsTrigger>
                            </TabsList>

                            <div className="flex-1 overflow-y-auto p-4 border rounded-md mt-2">
                                <TabsContent value="info" className="space-y-4 mt-0">
                                    <h3 className="text-lg font-medium">Dados Gerais</h3>
                                    <FormField
                                        control={form.control}
                                        name="nome"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Razão Social / Nome da Franquia</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Franquia São Paulo Capital" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="cnpj"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CNPJ</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="00.000.000/0000-00"
                                                            {...field}
                                                            onChange={(e) => field.onChange(maskCNPJ(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="responsavel_nome"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Responsável</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nome completo" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                        <FormField
                                            control={form.control}
                                            name="responsavel_email"
                                            render={({ field, fieldState }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="email@franquia.com"
                                                            {...field}
                                                            onBlur={() => form.trigger('responsavel_email')}
                                                            className={fieldState.error ? 'border-red-400 focus-visible:ring-red-400' : ''}
                                                        />
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
                                                    <FormLabel>Telefone</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="(11) 99999-9999"
                                                            {...field}
                                                            onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Credenciais de Acesso */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-lg font-medium">Credenciais de Acesso</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                            <FormField
                                                control={form.control}
                                                name="senha"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{isEditing ? "Nova Senha" : "Senha"}</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type={showPassword ? "text" : "password"}
                                                                    placeholder={isEditing ? "Deixe em branco para manter" : "Mínimo 6 caracteres"}
                                                                    {...field}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="confirmar_senha"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Confirmar Senha</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type={showConfirmPassword ? "text" : "password"}
                                                                    placeholder="Repita a senha"
                                                                    {...field}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                >
                                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {isEditing
                                                ? "Deixe em branco para manter a senha atual. Preencha apenas se quiser alterar."
                                                : "Esta senha será usada pelo administrador da franquia para acessar o sistema."
                                            }
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-lg font-medium">Endereço</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="endereco.cep"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>CEP</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    placeholder="00000-000"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(maskCEP(e.target.value))}
                                                                    onBlur={(e) => handleCepBlur(e.target.value)}
                                                                />
                                                                {isLoadingCep && (
                                                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="endereco.estado"
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
                                            <FormField
                                                control={form.control}
                                                name="endereco.cidade"
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
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="endereco.logradouro"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-2">
                                                        <FormLabel>Rua</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Av. Paulista" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="endereco.numero"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Número</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="1000" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="endereco.bairro"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Bairro</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Bela Vista" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="endereco.complemento"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Complemento</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Sala 101" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="permissoes" className="space-y-6 mt-0">
                                    {/* Status da Conta */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Status da Conta</h3>
                                        <FormField
                                            control={form.control}
                                            name="ativa"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>Conta Ativa</FormLabel>
                                                        <FormDescription>
                                                            Quando desativada, a franquia não terá acesso ao sistema.
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-lg font-medium">Acesso aos Módulos</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="permissoes.dashboard"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>Dashboard</FormLabel>
                                                            <FormDescription>
                                                                Visualização de métricas gerais e gráficos.
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="permissoes.leads_obras"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>Leads Obras</FormLabel>
                                                            <FormDescription>
                                                                Acesso à base de dados de obras em andamento.
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="permissoes.leads_empresas"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>Leads Empresas</FormLabel>
                                                            <FormDescription>
                                                                Acesso à base de dados de empresas.
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="permissoes.crm"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>CRM</FormLabel>
                                                            <FormDescription>
                                                                Gestão de pipeline e clientes.
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="permissoes.consulta_plus"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>Consulta Plus</FormLabel>
                                                            <FormDescription>
                                                                Consultas avançadas com créditos.
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="permissoes.chat_ia"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>Chat IA</FormLabel>
                                                            <FormDescription>
                                                                Assistente virtual inteligente.
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-lg font-medium">Gestão de Créditos</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Defina a quota mensal de créditos para esta franquia. Este valor será restaurado a cada reset mensal.
                                        </p>
                                        <FormField
                                            control={form.control}
                                            name="creditos_quota_mensal"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Crédito de Consulta Mensal</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            {...field}
                                                            value={field.value ?? 0}
                                                            onChange={e => field.onChange(e.target.value === '' ? 0 : e.target.valueAsNumber)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-6 pt-4 border-t">
                                        <h3 className="text-lg font-medium">Geofencing</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Defina as regras de acesso geográfico para visualização de leads.
                                        </p>

                                        <FormField
                                            control={form.control}
                                            name="geofencing.obras"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3 rounded-md border p-4 bg-muted/20">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-5 w-5 text-primary" />
                                                        <div>
                                                            <FormLabel className="text-base font-semibold">Leads de Obras</FormLabel>
                                                            <FormDescription>
                                                                Defina quais estados e cidades esta franquia pode visualizar na base de Obras.
                                                            </FormDescription>
                                                        </div>
                                                    </div>
                                                    <FormControl>
                                                        <GeofencingSelector
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="geofencing.empresas"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3 rounded-md border p-4 bg-muted/20">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-5 w-5 text-indigo-500" />
                                                        <div>
                                                            <FormLabel className="text-base font-semibold">Leads de Empresas</FormLabel>
                                                            <FormDescription>
                                                                Defina quais estados e cidades esta franquia pode visualizar na base de Empresas.
                                                            </FormDescription>
                                                        </div>
                                                    </div>
                                                    <FormControl>
                                                        <GeofencingSelector
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </TabsContent>
                            </div>

                            <div className="pt-4 mt-auto flex justify-end gap-2 flex-shrink-0">
                                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={estaCriando || estaAtualizando}>
                                    {estaCriando || estaAtualizando ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Franquia"}
                                </Button>
                            </div>
                        </Tabs>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
