import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

// Persist user intents so the agent picks them up on the next cycle.
// The agent reads pending_intents and incorporates them into the Claude prompt.
export async function POST(req: NextRequest) {
  const { intent, owner } = await req.json();

  if (!intent || typeof intent !== 'string' || intent.trim().length < 3) {
    return NextResponse.json({ error: 'Invalid intent' }, { status: 400 });
  }

  const sanitized = intent.trim().slice(0, 500);

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO pending_intents (owner_address, intent_text, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT DO NOTHING`,
        [owner ?? 'anonymous', sanitized],
      );
    } catch (err) {
      console.error('[api/intent] DB error:', err);
      // Non-fatal — still acknowledge to user
    }
  }

  return NextResponse.json({
    message: `Intent received: "${sanitized}". The agent will act on the next cycle (≤30 min).`,
  });
}
