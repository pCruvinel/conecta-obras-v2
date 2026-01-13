import { LayoutAutenticado } from "@/components/layouts/layout-autenticado"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutAutenticado>{children}</LayoutAutenticado>
}
