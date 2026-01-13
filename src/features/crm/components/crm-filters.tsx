'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CRMFiltersProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
}

export function CRMFilters({ busca, onBuscaChange }: CRMFiltersProps) {
  return (
    <div className="flex items-center gap-3 px-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar leads..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="pl-9"
        />
      </div>
      {/* TODO: Add tag filter and user filter in future iterations */}
    </div>
  );
}
