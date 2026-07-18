import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { normalizeDatabaseUrl } from '@/lib/db-url';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL!);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
