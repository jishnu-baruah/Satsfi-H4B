"use client";

import { CivicAuthProvider } from '@civic/auth/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coreDao } from 'wagmi/chains';

const wagmiConfig = createConfig({
  chains: [coreDao],
  transports: {
    [coreDao.id]: http(),
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