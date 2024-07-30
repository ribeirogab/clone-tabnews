import pg, { type QueryConfig, type QueryConfigValues } from 'pg';

import { getServerEnvs } from '@/lib/env';
const { Client } = pg;

export const query = async (
  queryTextOrConfig: string | QueryConfig<unknown[]>,
  values?: QueryConfigValues<string[]>,
) => {
  const env = getServerEnvs();

  const client = new Client({
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
  });
  await client.connect();

  const result = await client.query(queryTextOrConfig, values);

  await client.end();

  return result;
};
