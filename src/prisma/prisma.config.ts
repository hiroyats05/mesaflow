import { defineConfig } from '@prisma/config';

const url = process.env.DATABASE_URL ?? 'file:./src/prisma/prisma/dev.db';

export default defineConfig({
  schema: 'schema.prisma',
  datasource: {
    url,
  },
});