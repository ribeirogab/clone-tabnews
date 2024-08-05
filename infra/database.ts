import pg, { type QueryConfig, type QueryConfigValues } from 'pg';

import { DatabaseInfo } from '@/infra/interfaces';
import { Env } from '@/lib/env';

const { Client } = pg;

export class Database {
  public static async connect() {
    let client: pg.Client | undefined;

    try {
      console.log('[Database] Connecting to database...');

      client = new Client({
        password: Env.server.POSTGRES_PASSWORD,
        database: Env.server.POSTGRES_DB,
        host: Env.server.POSTGRES_HOST,
        port: Env.server.POSTGRES_PORT,
        user: Env.server.POSTGRES_USER,
        ssl: Env.server.POSTGRES_SSL,
      });

      await client.connect();

      console.log('[Database] Connected to database');

      return client;
    } catch (error) {
      console.error('[Database] Error connecting to database', error);

      // Ensure the connection is closed in case of an error
      await client?.end();

      throw error;
    }
  }

  public static async disconnect(client: pg.Client) {
    console.log('[Database] Disconnecting from database...');
    await client.end();
    console.log('[Database] Disconnected from database');
  }

  public static async query(
    queryTextOrConfig: string | QueryConfig<unknown[]>,
    values?: QueryConfigValues<string[]>,
  ) {
    const client = await this.connect();

    try {
      const result = await client.query(queryTextOrConfig, values);

      await this.disconnect(client);

      return result;
    } catch (error) {
      console.error('[Database] Error executing query', error);
    } finally {
      await this.disconnect(client);
    }
  }

  public static async getInfo(): Promise<DatabaseInfo> {
    const client = await this.connect();

    try {
      console.log('[Database] Getting database info...');

      const [openedConnectionsResult, maxConnectionsResult, versionResult] =
        await Promise.all([
          client.query(
            'SELECT COUNT(*)::INT FROM pg_stat_activity WHERE datname = $1;',
            [Env.server.POSTGRES_DB],
          ),
          client.query('SHOW max_connections;'),
          client.query('SHOW server_version;'),
        ]);

      await this.disconnect(client);
      const info: DatabaseInfo = {
        maxConnections: Number(maxConnectionsResult.rows[0]?.max_connections),
        openedConnections: Number(openedConnectionsResult.rows[0].count),
        version: versionResult.rows[0]?.server_version || 'unknown',
      };

      console.log('[Database] Got database info', info);

      return info;
    } catch (error) {
      console.error('[Database] Error getting database info', error);

      throw error;
    } finally {
      await this.disconnect(client);
    }
  }
}
