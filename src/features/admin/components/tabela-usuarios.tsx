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
import { UsuarioCompleto } from "../hooks/use-usuarios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TabelaUsuariosProps {
    usuarios: UsuarioCompleto[];
    isLoading: boolean;
}

export function TabelaUsuarios({ usuarios, isLoading }: TabelaUsuariosProps) {
    if (isLoading) {
        return <div className="text-center p-4">Carregando usuários...</div>;
    }

    if (usuarios.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Associação</TableHead>
                        <TableHead>Territórios</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Criação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{usuario.nome}</span>
                                    <span className="text-xs text-muted-foreground">{usuario.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="uppercase text-xs">
                                    {usuario.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                                {usuario.franquias && (
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground text-xs">Franquia:</span>
                                        <span>{usuario.franquias.nome}</span>
                                    </div>
                                )}
                                {usuario.lojas && (
                                    <div className="flex flex-col mt-1">
                                        <span className="text-muted-foreground text-xs">Loja:</span>
                                        <span>{usuario.lojas.nome}</span>
                                    </div>
                                )}
                                {!usuario.franquias && !usuario.lojas && <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {usuario.territorios?.slice(0, 3).map((t) => (
                                        <Badge key={t} variant="outline" className="text-xs">
                                            {t}
                                        </Badge>
                                    ))}
                                    {usuario.territorios?.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{usuario.territorios.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={usuario.ativo ? "default" : "destructive"}>
                                    {usuario.ativo ? "Ativo" : "Inativo"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {usuario.created_at ? format(new Date(usuario.created_at), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
