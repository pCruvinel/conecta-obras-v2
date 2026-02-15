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
import { usePermissoes, Permissoes } from "@/hooks/use-permissoes"
import { SidebarCollapsibleItem } from "@/components/compartilhados/sidebar-collapsible-item"

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

// Tipos para menu items
interface MenuItemSimples {
  titulo: string;
  url: string;
  icone: React.ComponentType<{ className?: string }>;
  permissao?: keyof Permissoes;
}

interface MenuItemComSubmenu {
  titulo: string;
  icone: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  items: { titulo: string; url: string; permissao?: keyof Permissoes }[];
}

type MenuItem = MenuItemSimples | MenuItemComSubmenu;

// Menu principal com permissões
const menuPrincipal: MenuItem[] = [
  { titulo: "Dashboard", url: "/dashboard", icone: LayoutDashboard, permissao: "dashboard" },
  {
    titulo: "Leads",
    icone: Users,
    isActive: true,
    items: [
      { titulo: "Obras", url: "/leads/obras", permissao: "leads_obras" },
      { titulo: "Empresas", url: "/leads/empresas", permissao: "leads_empresas" },
    ],
  },
  { titulo: "CRM", url: "/crm", icone: Kanban, permissao: "crm" },
]

// Menu secundário com permissões
const menuSecundario: MenuItemSimples[] = [
  { titulo: "Consulta Plus", url: "/consulta-plus", icone: Search, permissao: "consulta_plus" },
  { titulo: "Chat IA", url: "/chat-ia", icone: MessageSquare, permissao: "chat_ia" },
]

// Menu admin (apenas para admins)
const menuAdmin: MenuItemSimples[] = [
  { titulo: "Painel ADM", url: "/admin", icone: Shield },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { logout, estaDeslogando } = useLogout()
  const { usuario, isAdmin, temPermissao, isLoading } = usePermissoes()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Antes de montar, mostra menu completo para SSR consistente
  const shouldFilter = mounted && !isLoading

  // Filtra menu principal baseado em permissões
  const menuPrincipalFiltrado = shouldFilter
    ? menuPrincipal.filter((item) => {
      if ('items' in item) {
        const itemsPermitidos = item.items.filter(subItem =>
          !subItem.permissao || temPermissao(subItem.permissao)
        )
        return itemsPermitidos.length > 0
      }
      return !item.permissao || temPermissao(item.permissao)
    }).map((item) => {
      if ('items' in item) {
        return {
          ...item,
          items: item.items.filter(subItem =>
            !subItem.permissao || temPermissao(subItem.permissao)
          )
        }
      }
      return item
    })
    : menuPrincipal // Antes de montar, mostra menu completo

  // Filtra menu secundário
  const menuSecundarioFiltrado = shouldFilter
    ? menuSecundario.filter(item => !item.permissao || temPermissao(item.permissao))
    : menuSecundario

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
        {menuPrincipalFiltrado.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuPrincipalFiltrado.map((item) => {
                  // Renderização para itens com submenu
                  if ('items' in item) {
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
        )}

        {/* Ferramentas */}
        {menuSecundarioFiltrado.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuSecundarioFiltrado.map((item) => {
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
        )}

        {/* Administração - apenas para admins */}
        {shouldFilter && isAdmin && (
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
        )}
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
                    <AvatarImage src="/placeholder-user.jpg" alt={mounted ? (usuario?.nome || "Usuário") : "Usuário"} />
                    <AvatarFallback className="rounded-lg">
                      {mounted ? (usuario?.nome?.substring(0, 2).toUpperCase() || "US") : "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{mounted ? (usuario?.nome || "Usuário") : "Usuário"}</span>
                    <span className="truncate text-xs">{mounted ? (usuario?.email || "") : ""}</span>
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
