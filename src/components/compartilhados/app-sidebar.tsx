"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  Kanban,
  Search,
  MessageSquare,
  Shield,
  ChevronUp,
  Settings,
  LogOut,
} from "lucide-react"

import { useLogout } from "@/features/autenticacao/hooks/use-logout"
import { SidebarCollapsibleItem } from "@/components/compartilhados/sidebar-collapsible-item"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Menu principal
const menuPrincipal = [
  { titulo: "Dashboard", url: "/dashboard", icone: LayoutDashboard },
  {
    titulo: "Leads",
    icone: Users,
    isActive: true,
    items: [
      { titulo: "Obras", url: "/leads/obras" },
      { titulo: "Empresas", url: "/leads/empresas" },
    ],
  },
  { titulo: "CRM", url: "/crm", icone: Kanban },
]

// Menu secundário
const menuSecundario = [
  { titulo: "Consulta Plus", url: "/consulta-plus", icone: Search },
  { titulo: "Chat IA", url: "/chat-ia", icone: MessageSquare },
]

// Menu admin
const menuAdmin = [
  { titulo: "Painel ADM", url: "/admin", icone: Shield },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { logout, estaDeslogando } = useLogout()

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header com Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold">
                  C
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Conecta Obras</span>
                  <span className="truncate text-xs text-muted-foreground">Plataforma de Leads</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuPrincipal.map((item) => {
                // Renderização para itens com submenu
                if (item.items) {
                  return <SidebarCollapsibleItem key={item.titulo} item={item} pathname={pathname} />
                }

                // Renderização para itens simples
                const estaAtivo = pathname === item.url || pathname?.startsWith(`${item.url}/`)
                return (
                  <SidebarMenuItem key={item.titulo}>
                    <SidebarMenuButton asChild isActive={estaAtivo} tooltip={item.titulo}>
                      <Link href={item.url}>
                        {item.icone && <item.icone />}
                        <span>{item.titulo}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Ferramentas */}
        <SidebarGroup>
          <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuSecundario.map((item) => {
                const estaAtivo = pathname === item.url || pathname?.startsWith(`${item.url}/`)
                return (
                  <SidebarMenuItem key={item.titulo}>
                    <SidebarMenuButton asChild isActive={estaAtivo} tooltip={item.titulo}>
                      <Link href={item.url}>
                        <item.icone />
                        <span>{item.titulo}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Administração */}
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuAdmin.map((item) => {
                const estaAtivo = pathname === item.url || pathname?.startsWith(`${item.url}/`)
                return (
                  <SidebarMenuItem key={item.titulo}>
                    <SidebarMenuButton asChild isActive={estaAtivo} tooltip={item.titulo}>
                      <Link href={item.url}>
                        <item.icone />
                        <span>{item.titulo}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer com User */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder-user.jpg" alt="Usuário" />
                    <AvatarFallback className="rounded-lg">US</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Usuário</span>
                    <span className="truncate text-xs">admin@conecta.com</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={logout}
                  disabled={estaDeslogando}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {estaDeslogando ? 'Saindo...' : 'Sair'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
