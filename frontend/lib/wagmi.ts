import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

export const TARGET_CHAIN_ID = 2124225178762456;

// NEURALIS Agent Economy Appchain — chain config
const initiaMiniEVM = defineChain({
  id:   TARGET_CHAIN_ID,
  name: 'NEURALIS',
  nativeCurrency: { name: 'NEURAL', symbol: 'NEURAL', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL ?? 'https://jsonrpc-evm-1.anvil.asia-southeast.initia.xyz'] },
  },
});

export const wagmiConfig = createConfig({
  chains:      [initiaMiniEVM],
  transports:  { [initiaMiniEVM.id]: http() },
});
