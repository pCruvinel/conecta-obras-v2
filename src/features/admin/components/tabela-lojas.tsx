'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LojaComFranquia } from "../hooks/use-lojas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TabelaLojasProps {
    lojas: LojaComFranquia[];
    isLoading: boolean;
}

export function TabelaLojas({ lojas, isLoading }: TabelaLojasProps) {
    if (isLoading) {
        return <div className="text-center p-4">Carregando lojas...</div>;
    }

    if (lojas.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">Nenhuma loja encontrada.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Franquia</TableHead>
                        <TableHead>Cidade/UF</TableHead>
                        <TableHead>Territórios</TableHead>
                        <TableHead>Créditos</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Criação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lojas.map((loja) => (
                        <TableRow key={loja.id}>
                            <TableCell className="font-medium">{loja.nome}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{loja.franquias?.nome || 'N/A'}</Badge>
                            </TableCell>
                            <TableCell>{loja.cidade} - {loja.estado}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {loja.territorios?.slice(0, 3).map((t) => (
                                        <Badge key={t} variant="outline" className="text-xs">
                                            {t}
                                        </Badge>
                                    ))}
                                    {loja.territorios?.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{loja.territorios.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{loja.creditos_disponiveis?.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge variant={loja.ativa ? "default" : "destructive"}>
                                    {loja.ativa ? "Ativa" : "Inativa"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {loja.created_at ? format(new Date(loja.created_at), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
