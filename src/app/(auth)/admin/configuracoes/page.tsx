'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { CabecalhoPagina } from '@/components/compartilhados/cabecalho-pagina';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Settings, Calendar, Save, Loader2 } from 'lucide-react';

export default function PaginaConfiguracoes() {
    const supabase = createClient();
    const queryClient = useQueryClient();
    const [diaReset, setDiaReset] = useState<string>('1');

    // Buscar configurações
    const { data: config, isLoading } = useQuery({
        queryKey: ['configuracoes-sistema'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('configuracoes_sistema')
                .select('*')
                .limit(1)
                .single();

            if (error) throw error;
            return data;
        },
    });

    useEffect(() => {
        if (config) {
            setDiaReset(config.dia_reset_creditos.toString());
        }
    }, [config]);

    // Salvar configurações
    const { mutate: salvarConfig, isPending } = useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from('configuracoes_sistema')
                .update({ dia_reset_creditos: parseInt(diaReset) })
                .eq('id', config?.id);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Configurações salvas com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['configuracoes-sistema'] });
        },
        onError: () => {
            toast.error('Erro ao salvar configurações.');
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Administração', href: '/admin' },
                    { label: 'Configurações' }
                ]}
            />

            <div className="flex-1 p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Settings className="h-8 w-8" />
                        Configurações do Sistema
                    </h1>
                    <p className="text-muted-foreground">
                        Configure parâmetros globais da plataforma.
                    </p>
                </div>

                <div className="grid gap-6 max-w-2xl">
                    {/* Configuração de Créditos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Reset Mensal de Créditos
                            </CardTitle>
                            <CardDescription>
                                Defina o dia do mês em que os créditos consumidos serão zerados.
                                Todas as quotas serão restauradas neste dia.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="dia-reset">Dia do Reset</Label>
                                <Select value={diaReset} onValueChange={setDiaReset}>
                                    <SelectTrigger className="w-full max-w-xs">
                                        <SelectValue placeholder="Selecione o dia..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 28 }, (_, i) => i + 1).map((dia) => (
                                            <SelectItem key={dia} value={dia.toString()}>
                                                Dia {dia}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Máximo dia 28 para garantir execução em todos os meses.
                                </p>
                            </div>

                            {config?.ultimo_reset && (
                                <div className="text-sm text-muted-foreground">
                                    Último reset: {new Date(config.ultimo_reset).toLocaleDateString('pt-BR')}
                                </div>
                            )}

                            <Button
                                onClick={() => salvarConfig()}
                                disabled={isPending}
                                className="mt-4"
                            >
                                {isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Salvar Configurações
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
