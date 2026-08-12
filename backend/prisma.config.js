require('dotenv/config');
const path = require('path');

// IMPORTANT: load defineConfig safely
const prismaConfig = require('prisma/config');

const defineConfig = prismaConfig.defineConfig;
const env = prismaConfig.env;

module.exports = defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),

  migrations: {
    path: path.join(__dirname, 'prisma', 'migrations'),
  },

  datasources: {
    db: {
      provider: 'postgresql',
      adapter: 'postgresql',
      url: env('DATABASE_URL'),
    },
  },
});
