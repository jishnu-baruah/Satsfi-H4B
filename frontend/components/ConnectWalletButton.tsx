"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from './ui/button';

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm font-mono bg-gray-800 px-3 py-1 rounded-md">
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </p>
        <Button onClick={() => disconnect()} variant="secondary" size="sm">Disconnect</Button>
      </div>
    );
  }

  return (
    <Button onClick={() => connect({ connector: injected() })}>
      Connect Wallet
    </Button>
  );
} 