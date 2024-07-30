import { query } from '@/infra/database';

export async function GET() {
  const result = await query('SELECT 1 + 1');

  console.log(result.rows);

  return new Response('OK', { status: 200 });
}
