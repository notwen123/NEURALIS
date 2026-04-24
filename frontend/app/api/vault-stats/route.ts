import { Pool } from 'pg';
import { NextResponse } from 'next/server';
import { createPublicClient, http, formatUnits } from 'viem';
import { mainnet } from 'viem/chains'; // Using mainnet as a placeholder for structure, RPC will define the target
import { NEXT_PUBLIC_VAULT_MANAGER_ADDRESS, VAULT_MANAGER_ABI, STRATEGY_ABI } from '@/lib/contracts';

let pool: Pool | null = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';

const publicClient = createPublicClient({
  transport: http(RPC_URL),
});

// Mapping for strategy addresses to readable names (Production Tier)
const STRATEGY_NAME_MAP: Record<string, string> = {
  '0x0102510f1efc2c5049b3fffda2d6c451510c3076': 'Delta Neutral',
  '0x66973d683d4467bce58405722667110d66e6d756': 'ETH Yield Loop',
  '0x620f5db5ababfebe64652882ade6daa1005939d2': 'Liquid Staking',
};


export async function GET() {
  try {
    // 1. Fetch DB Stats (Rebalances)
    let dbStats = { total_rebalances: '0', triggered_count: '0', last_rebalance_at: null };
    if (pool) {
      const result = await pool.query(`
        SELECT
          COUNT(*)                              AS total_rebalances,
          COUNT(*) FILTER (WHERE triggered)     AS triggered_count,
          MAX(executed_at)                      AS last_rebalance_at
        FROM rebalance_history
      `);
      dbStats = result.rows[0];
    }

    // 2. Fetch On-Chain Stats (TVL & Strategies)
    const [totalAssets, activeStrategies] = await Promise.all([
      publicClient.readContract({
        address: NEXT_PUBLIC_VAULT_MANAGER_ADDRESS as `0x${string}`,
        abi: VAULT_MANAGER_ABI,
        functionName: 'totalAssets',
      }),
      publicClient.readContract({
        address: NEXT_PUBLIC_VAULT_MANAGER_ADDRESS as `0x${string}`,
        abi: VAULT_MANAGER_ABI,
        functionName: 'getActiveStrategies',
      }),
    ]);

    // 3. Fetch Strategy Details (TVL & APY)
    const strategyDetails = await Promise.all(
      ((activeStrategies || []) as `0x${string}`[]).map(async (addr) => {
        try {
          const [tvl, apy] = await Promise.all([
            publicClient.readContract({
              address: addr,
              abi: STRATEGY_ABI,
              functionName: 'getTVL',
            }).catch(() => 0n),
            publicClient.readContract({
              address: addr,
              abi: STRATEGY_ABI,
              functionName: 'getAPY',
            }).catch(() => 0n),
          ]);

          return {
            address: addr,
            name: STRATEGY_NAME_MAP[addr.toLowerCase()] || `Strategy_${addr.slice(2, 6).toUpperCase()}`,
            value: Number(formatUnits(tvl, 6)),
            apy: Number(apy) / 100,
          };
        } catch {
          return null;
        }
      })
    );

    const validStrategies = strategyDetails.filter(Boolean);
    const totalApy = validStrategies.reduce((acc, s) => acc + (s?.apy || 0), 0);
    const averageApy = validStrategies.length > 0 ? totalApy / validStrategies.length : 0;

    // 4. Return Combined Telemetry
    return NextResponse.json({
      data: {
        tvl: formatUnits(totalAssets as bigint, 6),
        active_strategies: validStrategies.length,
        total_rebalances: dbStats.total_rebalances,
        triggered_count: dbStats.triggered_count,
        last_rebalance_at: dbStats.last_rebalance_at,
        avg_apy: averageApy.toFixed(2),
        allocations: validStrategies,
      }
    });

  } catch (err) {
    console.error('[api/vault-stats] Hardware Error:', err);
    return NextResponse.json(
      { error: 'Failed to synchronize with protocol telemetry' },
      { status: 500 }
    );
  }
}

