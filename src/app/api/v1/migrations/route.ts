import { HttpStatusCodeEnum } from '@/enums';
import { Database } from '@/infra/database';

export async function GET() {
  const data = await Database.migrateUp({ dryRun: true });

  return new Response(JSON.stringify(data), {
    status: HttpStatusCodeEnum.OK,
  });
}

export async function POST() {
  await Database.migrateUp({ dryRun: false });

  return new Response(undefined, {
    status: HttpStatusCodeEnum.NO_CONTENT,
  });
}
