'use client';

import { Eye } from 'lucide-react';
import { Boundary } from '@/components/internal/boundary';
import { useAdmin } from '@/features/admin/providers/admin-provider';

export function Presence() {
  const { snapshot } = useAdmin();
  return (
    <Boundary label="Presence">
      <span className="text-gray inline-flex items-center gap-1.5 text-xs font-medium">
        <Eye className="h-3.5 w-3.5" />
        <span className="inline-block min-w-3 text-right font-mono text-black tabular-nums dark:text-white">
          {snapshot ? Math.max(snapshot.presence, 1) : ''}
        </span>
        watching
      </span>
    </Boundary>
  );
}
