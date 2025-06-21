"use client";

import { CivicAuthProvider } from '@civic/auth/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import type { Chain } from 'wagmi/chains';

export const coreDaoTestnet = {
  id: 1114,
  name: 'Core Blockchain TestNet',
  nativeCurrency: {
    name: 'Test Core',
    symbol: 'tCORE',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.test2.btcs.network'] },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.test2.btcs.network' },
  },
} as const satisfies Chain;


const wagmiConfig = createConfig({
  chains: [coreDaoTestnet],
  transports: {
    [coreDaoTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CivicAuthProvider>
          {children}
        </CivicAuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 