'use client';

import Link from "next/link";
import { Building2, CreditCard, Store, Users, ExternalLink, Settings, FileText } from "lucide-react";
import { CabecalhoPagina } from "@/components/compartilhados/cabecalho-pagina";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardMetrica } from "@/features/dashboard/components/card-metrica";
import { useFranquias } from "@/features/admin/hooks/use-franquias";
import { useLojas } from "@/features/admin/hooks/use-lojas";
import { useUsuarios } from "@/features/admin/hooks/use-usuarios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PaginaAdmin() {
    const { franquias } = useFranquias();
    const { lojas } = useLojas();
    const { usuarios } = useUsuarios();

    const totalCreditos = (franquias?.reduce((acc, f) => acc + (f.creditos_disponiveis || 0), 0) || 0) +
        (lojas?.reduce((acc, l) => acc + (l.creditos_disponiveis || 0), 0) || 0);

    const metricas = {
        franquias: franquias?.length || 0,
        lojas: lojas?.length || 0,
        usuarios: usuarios?.length || 0,
        creditos: totalCreditos
    };

    const ultimosUsuarios = usuarios?.slice(0, 5) || [];

    return (
        <div className="flex flex-col h-full">
            <CabecalhoPagina
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' }
                ]}
            />

            <div className="flex-1 space-y-6 p-6 overflow-auto">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <CardMetrica
                        titulo="Franquias Ativas"
                        valor={metricas.franquias}
                        icone={Building2}
                        tendencia={10}
                        descricao="Total de franquias"
                        iconClassName="text-primary"
                    />
                    <CardMetrica
                        titulo="Lojas Ativas"
                        valor={metricas.lojas}
                        icone={Store}
                        tendencia={5}
                        descricao="Total de lojas"
                        iconClassName="text-primary"
                    />
                    <CardMetrica
                        titulo="Usuários Totais"
                        valor={metricas.usuarios}
                        icone={Users}
                        tendencia={12}
                        descricao="Usuários no sistema"
                        iconClassName="text-primary"
                    />
                    <CardMetrica
                        titulo="Créditos em Circulação"
                        valor={metricas.creditos.toLocaleString()}
                        icone={CreditCard}
                        descricao="Saldo total distribuído"
                        iconClassName="text-primary"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Últimos Usuários</CardTitle>
                            <CardDescription>
                                Usuários cadastrados recentemente na plataforma.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {ultimosUsuarios.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar_url} />
                                                <AvatarFallback>{user.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{user.nome}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="capitalize">
                                                {user.role}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {format(new Date(user.created_at), "dd 'de' MMM", { locale: ptBR })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {ultimosUsuarios.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Nenhum usuário encontrado.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Atividades Recentes</CardTitle>
                            <CardDescription>
                                Últimas ações realizadas no sistema.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { text: "Novo usuário cadastrado na Franquia SP", time: "Há 2 horas" },
                                    { text: "Loja 'Centro' adicionada", time: "Há 5 horas" },
                                    { text: "Créditos distribuídos para Franquia MG", time: "Há 1 dia" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{item.text}</p>
                                            <p className="text-xs text-muted-foreground">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/admin/franquias" className="h-full">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Gestão de Franquias
                                </CardTitle>
                                <CardDescription>
                                    Gerencie franquias, territórios e distribuição de créditos.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <Button className="w-full">Acessar</Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/lojas" className="h-full">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="h-5 w-5 text-primary" />
                                    Gestão de Lojas
                                </CardTitle>
                                <CardDescription>
                                    Cadastre lojas vinculadas a franquias e seus gerentes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <Button className="w-full">Acessar</Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/usuarios" className="h-full">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Gestão de Usuários
                                </CardTitle>
                                <CardDescription>
                                    Controle de acesso, roles e permissões de usuários.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <Button className="w-full">Acessar</Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/logs-consultas" className="h-full">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Logs de Consultas
                                </CardTitle>
                                <CardDescription>
                                    Visualize o histórico de consumo de créditos.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <Button className="w-full">Acessar</Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/configuracoes" className="h-full">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    Configurações
                                </CardTitle>
                                <CardDescription>
                                    Parâmetros globais do sistema como dia de reset de créditos.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <Button className="w-full">Acessar</Button>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
