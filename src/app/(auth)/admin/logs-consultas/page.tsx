'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { CabecalhoPagina } from '@/components/compartilhados/cabecalho-pagina';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LogConsumo {
    id: string;
    usuario_id: string;
    loja_id: string | null;
    franquia_id: string | null;
    tipo_consulta: string;
    creditos_consumidos: number;
    dados_consulta: Record<string, unknown>;
    created_at: string;
    usuarios?: { nome: string; email: string };
    franquias?: { nome: string };
}

export default function PaginaLogsConsultas() {
    const supabase = createClient();
    const [filtroTipo, setFiltroTipo] = useState<string>('todos');
    const [filtroBusca, setFiltroBusca] = useState<string>('');

    // Buscar logs
    const { data: logs, isLoading } = useQuery({
        queryKey: ['logs-consultas', filtroTipo],
        queryFn: async (): Promise<LogConsumo[]> => {
            let query = supabase
                .from('log_consumo_creditos')
                .select(`
                    *,
                    usuarios:usuario_id (nome, email),
                    franquias:franquia_id (nome)
                `)
                .order('created_at', { ascending: false })
                .limit(200);

            if (filtroTipo !== 'todos') {
                query = query.eq('tipo_consulta', filtroTipo);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        },
    });

    // Filtrar por busca
    const logsFiltrados = logs?.filter(log => {
        if (!filtroBusca) return true;
        const busca = filtroBusca.toLowerCase();
        return (
            log.usuarios?.nome?.toLowerCase().includes(busca) ||
            log.usuarios?.email?.toLowerCase().includes(busca) ||
            log.tipo_consulta?.toLowerCase().includes(busca) ||
            JSON.stringify(log.dados_consulta).toLowerCase().includes(busca)
        );
    });

    // Extrair tipos únicos para filtro
    const tiposUnicos = [...new Set(logs?.map(l => l.tipo_consulta) || [])];

    return (
        <div className="flex flex-col h-full">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Administração', href: '/admin' },
                    { label: 'Logs de Consultas' }
                ]}
            />

            <div className="flex-1 p-6 space-y-6 overflow-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-8 w-8" />
                        Logs de Consultas
                    </h1>
                    <p className="text-muted-foreground">
                        Histórico de consumo de créditos nas consultas de API.
                    </p>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="space-y-1 flex-1 min-w-[200px]">
                                <Label htmlFor="busca">Buscar</Label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="busca"
                                        placeholder="Usuário, email, dados..."
                                        className="pl-9"
                                        value={filtroBusca}
                                        onChange={(e) => setFiltroBusca(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 w-[200px]">
                                <Label>Tipo de Consulta</Label>
                                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos</SelectItem>
                                        {tiposUnicos.map((tipo) => (
                                            <SelectItem key={tipo} value={tipo}>
                                                {tipo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela de Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Histórico</CardTitle>
                        <CardDescription>
                            {logsFiltrados?.length || 0} registros encontrados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-48">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : logsFiltrados && logsFiltrados.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data/Hora</TableHead>
                                            <TableHead>Usuário</TableHead>
                                            <TableHead>Franquia</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead className="text-center">Créditos</TableHead>
                                            <TableHead>Dados</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logsFiltrados.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-sm">{log.usuarios?.nome || '-'}</p>
                                                        <p className="text-xs text-muted-foreground">{log.usuarios?.email || '-'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {log.franquias?.nome || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{log.tipo_consulta}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary">{log.creditos_consumidos}</Badge>
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    <code className="text-xs">
                                                        {JSON.stringify(log.dados_consulta).substring(0, 50)}
                                                        {JSON.stringify(log.dados_consulta).length > 50 && '...'}
                                                    </code>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Nenhum log de consulta encontrado.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
