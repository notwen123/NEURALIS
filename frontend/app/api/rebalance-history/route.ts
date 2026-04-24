import { Pool } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

export async function GET(req: NextRequest) {
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get('limit') ?? '20'),
    100,
  );

  if (!pool) {
    return NextResponse.json({ data: [] });
  }

  try {
    const result = await pool.query(
      `SELECT id, executed_at, tx_hash, prev_alloc, new_alloc, explanation, triggered
       FROM rebalance_history
       ORDER BY executed_at DESC
       LIMIT $1`,
      [limit],
    );
    return NextResponse.json({ data: result.rows || [] });
  } catch (err) {
    console.error('[api/rebalance-history]', err);
    return NextResponse.json({ data: [] });
  }
}

