"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Users,
  Kanban,
  Search,
  MessageSquare,
  Shield,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavegacaoLateralProps extends React.HTMLAttributes<HTMLDivElement> {
  mobile?: boolean
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/obras", label: "Obras", icon: Building2 },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/crm", label: "CRM", icon: Kanban },
  { href: "/consulta-plus", label: "Consulta Plus", icon: Search },
  { href: "/chat-ia", label: "Chat IA", icon: MessageSquare },
  { href: "/admin", label: "Painel ADM", icon: Shield },
]

export function NavegacaoLateral({ className, mobile }: NavegacaoLateralProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex flex-col h-full py-4", className)}>
      <div className="px-6 mb-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Conecta Obras
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
        })}
      </nav>

      {/* User stub for sidebar footer if needed, or keeping it clean */}
      {!mobile && (
          <div className="mt-auto px-6 pt-4 border-t">
              <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                      <span className="text-sm font-medium">Usuário</span>
                      <span className="text-xs text-muted-foreground">admin@conecta.com</span>
                  </div>
              </div>
          </div>
      )}
    </div>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-background w-72">
        <NavegacaoLateral mobile className="border-none" />
      </SheetContent>
    </Sheet>
  )
}
