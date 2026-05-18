import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { defineConfig } from 'prisma/config';

const url = process.env.DATABASE_URL ?? 'file:./prisma/drop.db';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url },
  adapter: new PrismaBetterSqlite3({ url }),
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});
