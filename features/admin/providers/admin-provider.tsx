'use client';

import { createContext, useContext } from 'react';
import { useAdminSocket } from '@/features/admin/hooks/use-admin-socket';
import type { AdminSnapshot } from '@/types/admin';

type AdminValue = { snapshot: AdminSnapshot | null; flashIds: Set<string> };

const AdminContext = createContext<AdminValue | null>(null);

export function useAdmin(): AdminValue {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin must be used within AdminProvider');
  return value;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { snapshot, flashIds } = useAdminSocket();
  return <AdminContext value={{ flashIds, snapshot }}>{children}</AdminContext>;
}
