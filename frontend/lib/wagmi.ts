import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

// NEURALIS Agent Economy Appchain — chain config
const initiaMiniEVM = defineChain({
  id:   Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 1),
  name: 'NEURALIS',
  nativeCurrency: { name: 'NEURAL', symbol: 'NEURAL', decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL ?? 'http://localhost:8545'] },
  },
});

export const wagmiConfig = createConfig({
  chains:      [initiaMiniEVM],
  transports:  { [initiaMiniEVM.id]: http() },
});
