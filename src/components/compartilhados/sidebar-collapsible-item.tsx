"use client";

import * as React from "react";
import Link from "next/link";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// Componente auxiliar para itens colapsáveis com Hover
export function SidebarCollapsibleItem({ item, pathname }: { item: any, pathname: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Mantém aberto se estiver em uma rota filha, mas permite controle via hover
    const rotaAtiva = item.items?.some((sub: any) => pathname === sub.url);

    React.useEffect(() => {
        if (rotaAtiva) setIsOpen(true);
    }, [rotaAtiva]);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="group/collapsible"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)} // Fecha ao tirar o mouse, independente da rota
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.titulo} className="cursor-default">
                        {item.icone && <item.icone />}
                        <span>{item.titulo}</span>
                        {/* Seta removida conforme solicitado */}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items.map((subItem: any) => (
                            <SidebarMenuSubItem key={subItem.titulo}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                    <Link href={subItem.url}>
                                        <span>{subItem.titulo}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
