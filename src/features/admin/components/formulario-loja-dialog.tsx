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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCriarLoja } from "../hooks/use-criar-loja";
import { useAtualizarLoja } from "../hooks/use-atualizar-loja";
import { useFranquias } from "../hooks/use-franquias";
import { Loja } from "../types/tipos-loja";
import { Store, Plus, Loader2, Eye, EyeOff, Edit, MapPin } from "lucide-react";
import { GeofencingSelector } from "./geofencing-selector";
import { toast } from "sonner";

// Masks
function maskCPF(value: string): string {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substring(0, 14);
}

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
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
}

const formSchema = z.object({
    nome: z.string().min(2, "Nome da loja deve ter pelo menos 2 caracteres."),
    franquia_id: z.string().min(1, "Selecione uma franquia."),
    tipo_documento: z.enum(['cpf', 'cnpj']),
    documento: z.string().optional(),

    responsavel_nome: z.string().min(1, "Nome do responsável é obrigatório."),
    responsavel_email: z.string().email("Email inválido."),
    responsavel_telefone: z.string().optional(),

    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres.").optional().or(z.literal('')),
    confirmar_senha: z.string().optional().or(z.literal('')),

    endereco: z.object({
        cep: z.string().min(9, "CEP inválido").max(9, "CEP inválido"),
        logradouro: z.string().min(1, "Rua é obrigatória"),
        numero: z.string().min(1, "Número é obrigatório"),
        complemento: z.string().optional(),
        bairro: z.string().min(1, "Bairro é obrigatório"),
        cidade: z.string().min(1, "Cidade é obrigatória"),
        estado: z.string().length(2, "Estado inválido"),
    }),

    permissoes: z.object({
        dashboard: z.boolean(),
        leads_obras: z.boolean(),
        leads_empresas: z.boolean(),
        crm: z.boolean(),
        consulta_plus: z.boolean(),
        chat_ia: z.boolean(),
    }),

    creditos_quota_mensal: z.number().min(0).optional(),

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

    ativa: z.boolean(),
}).refine(
    (data) => !data.senha || data.senha === data.confirmar_senha,
    { message: "As senhas não coincidem.", path: ["confirmar_senha"] }
);

type FormValues = z.infer<typeof formSchema>;

interface FormularioLojaDialogProps {
    loja?: Loja;
    trigger?: React.ReactNode;
}

const ESTADOS_BRASIL = [
    { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' }, { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' }, { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
];

export function FormularioLojaDialog({ loja, trigger }: FormularioLojaDialogProps) {
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const isEditing = !!loja;

    const { criarLoja, isPending: isCriando } = useCriarLoja();
    const { atualizarLoja, isPending: isAtualizando } = useAtualizarLoja();
    const { franquias } = useFranquias();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: "",
            franquia_id: "",
            tipo_documento: "cnpj",
            documento: "",
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
            creditos_quota_mensal: 0,
            geofencing: {
                obras: [],
                empresas: []
            },
            ativa: true,
        },
    });

    useEffect(() => {
        if (open && loja) {
            form.reset({
                nome: loja.nome,
                franquia_id: loja.franquia_id,
                tipo_documento: loja.tipo_documento || 'cnpj',
                documento: loja.documento || "",
                responsavel_nome: loja.responsavel_nome || "",
                responsavel_email: loja.responsavel_email || "",
                responsavel_telefone: loja.responsavel_telefone || "",
                senha: "",
                confirmar_senha: "",
                endereco: loja.endereco || {
                    cep: '',
                    logradouro: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: loja.cidade || '', // Keep for backward compatibility if backend still sends top-level
                    estado: loja.estado || '', // Keep for backward compatibility if backend still sends top-level
                },
                permissoes: loja.permissoes || {
                    dashboard: true, leads_obras: true, leads_empresas: true,
                    crm: true, consulta_plus: true, chat_ia: true,
                },
                creditos_quota_mensal: loja.creditos_quota_mensal || 0,
                geofencing: loja.geofencing || { obras: [], empresas: [] },
                ativa: loja.ativa ?? true,
            });
        } else if (open && !loja) {
            form.reset({
                nome: "", franquia_id: "", tipo_documento: 'cnpj', documento: "",
                responsavel_nome: "", responsavel_email: "", responsavel_telefone: "",
                senha: "", confirmar_senha: "",
                endereco: {
                    cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
                },
                permissoes: {
                    dashboard: false, leads_obras: false, leads_empresas: false,
                    crm: false, consulta_plus: false, chat_ia: false,
                },
                creditos_quota_mensal: 0,
                geofencing: { obras: [], empresas: [] },
                ativa: true,
            });
        }
    }, [open, loja, form]);

    const handleCepBlur = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            setIsLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    form.setValue('endereco.logradouro', data.logradouro);
                    form.setValue('endereco.bairro', data.bairro);
                    form.setValue('endereco.cidade', data.localidade);
                    form.setValue('endereco.estado', data.uf);
                    form.setFocus('endereco.numero');
                } else {
                    toast.error("CEP não encontrado.");
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                toast.error("Erro ao buscar CEP. Tente novamente.");
            } finally {
                setIsLoadingCep(false);
            }
        }
    };

    const onSubmit = async (data: FormValues) => {
        try {
            const lojaData = {
                nome: data.nome,
                franquia_id: data.franquia_id,
                tipo_documento: data.tipo_documento,
                documento: data.documento,
                responsavel_nome: data.responsavel_nome,
                responsavel_email: data.responsavel_email,
                responsavel_telefone: data.responsavel_telefone,
                cidade: data.endereco.cidade,
                estado: data.endereco.estado,
                endereco: data.endereco,
                permissoes: data.permissoes,
                creditos_quota_mensal: data.creditos_quota_mensal || 0,
                geofencing: data.geofencing,
                ativa: data.ativa,
                territorios: [],
            };

            if (isEditing && loja) {
                await atualizarLoja({ id: loja.id, dados: lojaData, senha: data.senha });
                toast.success("Loja atualizada com sucesso!");
            } else {
                if (!data.senha) {
                    toast.error("Senha é obrigatória para nova loja.");
                    return;
                }
                await criarLoja({ ...lojaData, senha: data.senha });
                toast.success("Loja criada com sucesso!");
            }
            setOpen(false);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erro ao salvar loja.";
            toast.error(errorMessage);
        }
    };

    const isPending = isCriando || isAtualizando;
    const tipoDoc = form.watch('tipo_documento');
    const franquiaId = form.watch('franquia_id');
    const franquiaSelecionada = franquias?.find(f => f.id === franquiaId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Loja
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        {isEditing ? "Editar Loja" : "Nova Loja"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Atualize os dados e permissões da loja." : "Preencha os dados básicos e configure as permissões da loja."}
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

                                    {/* Franquia Select - campo extra da loja */}
                                    <FormField
                                        control={form.control}
                                        name="franquia_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Franquia Vinculada *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione a franquia..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {franquias?.map((f) => (
                                                            <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {franquiaSelecionada && (
                                                    <FormDescription>
                                                        Créditos disponíveis na franquia: {franquiaSelecionada.creditos_disponiveis}
                                                    </FormDescription>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nome"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Razão Social / Nome da Loja</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Loja Centro SP" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="documento"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        <div className="flex items-center gap-2">
                                                            <span>{tipoDoc === 'cpf' ? 'CPF' : 'CNPJ'}</span>
                                                            <Select value={tipoDoc} onValueChange={(v) => form.setValue('tipo_documento', v as 'cpf' | 'cnpj')}>
                                                                <SelectTrigger className="h-6 w-20 text-xs">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="cnpj">CNPJ</SelectItem>
                                                                    <SelectItem value="cpf">CPF</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={tipoDoc === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                                                            {...field}
                                                            onChange={(e) => {
                                                                const masked = tipoDoc === 'cpf' ? maskCPF(e.target.value) : maskCNPJ(e.target.value);
                                                                field.onChange(masked);
                                                            }}
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
                                                            placeholder="email@loja.com"
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
                                                : "Esta senha será usada pelo administrador da loja para acessar o sistema."
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
                                    <FormField
                                        control={form.control}
                                        name="ativa"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Conta Ativa</FormLabel>
                                                    <FormDescription>Quando desativada, a loja não terá acesso ao sistema.</FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-lg font-medium">Acesso aos Módulos</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Selecione quais módulos esta loja poderá acessar.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[
                                                { name: 'dashboard', label: 'Dashboard', desc: 'Visualização de métricas' },
                                                { name: 'leads_obras', label: 'Leads Obras', desc: 'Base de obras' },
                                                { name: 'leads_empresas', label: 'Leads Empresas', desc: 'Base de empresas' },
                                                { name: 'crm', label: 'CRM', desc: 'Gestão de pipeline' },
                                                { name: 'consulta_plus', label: 'Consulta Plus', desc: 'Consultas avançadas' },
                                                { name: 'chat_ia', label: 'Chat IA', desc: 'Assistente virtual' },
                                            ].map((perm) => (
                                                <FormField
                                                    key={perm.name}
                                                    control={form.control}
                                                    name={`permissoes.${perm.name}` as any}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                                            <FormControl>
                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel className="text-sm">{perm.label}</FormLabel>
                                                                <FormDescription className="text-xs">{perm.desc}</FormDescription>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-lg font-medium">Gestão de Créditos</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Defina o crédito de consulta mensal para esta loja.
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
                                                    <FormDescription>
                                                        Este valor será restaurado a cada reset mensal.
                                                        {franquiaSelecionada && !isEditing && (
                                                            <span className="block text-yellow-600 dark:text-yellow-400 font-medium mt-1">
                                                                Será descontado de: {franquiaSelecionada.nome} ({franquiaSelecionada.creditos_disponiveis} disponíveis)
                                                            </span>
                                                        )}
                                                    </FormDescription>
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
                                                                Defina quais estados e cidades esta loja pode visualizar na base de Obras.
                                                            </FormDescription>
                                                        </div>
                                                    </div>
                                                    <FormControl>
                                                        <GeofencingSelector
                                                            value={field.value || []}
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
                                                        <MapPin className="h-5 w-5 text-primary" />
                                                        <div>
                                                            <FormLabel className="text-base font-semibold">Leads de Empresas</FormLabel>
                                                            <FormDescription>
                                                                Defina quais estados e cidades esta loja pode visualizar na base de Empresas.
                                                            </FormDescription>
                                                        </div>
                                                    </div>
                                                    <FormControl>
                                                        <GeofencingSelector
                                                            value={field.value || []}
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
                        </Tabs>

                        <div className="flex justify-end gap-2 pt-4 flex-shrink-0">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Salvar Alterações" : "Criar Loja"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
