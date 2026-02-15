'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Franquia } from "../types/tipos-franquia";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { FormularioFranquiaDialog } from "./formulario-franquia-dialog";

interface TabelaFranquiasProps {
    franquias: Franquia[];
    isLoading: boolean;
    onDelete?: (id: string) => void;
}

export function TabelaFranquias({ franquias, isLoading, onDelete }: TabelaFranquiasProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [franquiaToDelete, setFranquiaToDelete] = useState<Franquia | null>(null);

    const handleDeleteClick = (franquia: Franquia) => {
        setFranquiaToDelete(franquia);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (franquiaToDelete && onDelete) {
            onDelete(franquiaToDelete.id);
        }
        setDeleteDialogOpen(false);
        setFranquiaToDelete(null);
    };

    if (isLoading) {
        return <div className="text-center p-4">Carregando franquias...</div>;
    }

    if (franquias.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">Nenhuma franquia encontrada.</p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Responsável</TableHead>
                            <TableHead className="text-center">Créditos</TableHead>
                            <TableHead className="text-center">Consumo</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead>Data Criação</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {franquias.map((franquia) => (
                            <TableRow key={franquia.id}>
                                <TableCell className="font-medium">{franquia.nome}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{franquia.responsavel_nome}</span>
                                        <span className="text-xs text-muted-foreground">{franquia.responsavel_email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="font-mono">
                                        {franquia.creditos_disponiveis?.toLocaleString() || 0}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="secondary" className="font-mono">
                                        {/* TODO: Implementar consumo de créditos quando houver dados */}
                                        0
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={franquia.ativa ? "default" : "destructive"}>
                                        {franquia.ativa ? "Ativa" : "Inativa"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {franquia.created_at ? format(new Date(franquia.created_at), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Ações</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <FormularioFranquiaDialog franquia={franquia}>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                            </FormularioFranquiaDialog>
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Detalhes
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => handleDeleteClick(franquia)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir a franquia "{franquiaToDelete?.nome}"?
                            Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
