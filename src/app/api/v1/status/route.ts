import { HttpStatusCodeEnum } from '@/enums';
import { Database } from '@/infra/database';
import { StatusRouteGetResponse } from '@/interfaces';

export async function GET() {
  const updatedAt = new Date().toISOString();

  const {
    version: dbVersion,
    openedConnections,
    maxConnections,
  } = await Database.getInfo();

  const response: StatusRouteGetResponse = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        opened_connections: openedConnections,
        max_connections: maxConnections,
        version: dbVersion,
      },
    },
  };

  return new Response(JSON.stringify(response), {
    status: HttpStatusCodeEnum.OK,
  });
}
