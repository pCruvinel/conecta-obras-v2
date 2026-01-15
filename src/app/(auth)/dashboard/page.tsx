import { Metadata } from 'next';
import { PainelMetricas } from '@/features/dashboard/components/painel-metricas';
import { CabecalhoPagina } from '@/components/compartilhados/cabecalho-pagina';

export const metadata: Metadata = {
  title: 'Dashboard | Conecta Obras',
  description: 'Visão geral das obras e leads no sistema.',
};

export default function PaginaDashboard() {
  return (
    <div className="flex flex-col h-full">
      <CabecalhoPagina
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' }
        ]}
      />

      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">
            Acompanhe as principais métricas de obras e leads do sistema.
          </p>
        </div>

        <PainelMetricas />
      </div>
    </div>
  );
}
