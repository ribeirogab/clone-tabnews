import fs from 'node:fs';

import { config } from 'dotenv';

// Database connection - https://salsita.github.io/node-pg-migrate/cli#database-connection

if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.development' });
}

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
} = process.env;

const DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

fs.writeFileSync('.env.migrations', `DATABASE_URL=${DATABASE_URL}\n`);
