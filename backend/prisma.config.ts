require('dotenv/config');
const { defineConfig, env } = require('prisma/config');
const path = require('path');

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
