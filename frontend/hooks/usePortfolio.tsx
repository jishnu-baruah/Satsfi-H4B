import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { API_URL } from '../lib/config';

interface PortfolioData {
  stakedBalance: string;
  borrowedBalance: string;
  healthFactor: string;
  positions: any[];
}

export const usePortfolio = () => {
  const { address, isConnected } = useAccount();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/user/portfolio/${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      const result = await response.json();
      if (result.success) {
        setPortfolio(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch portfolio data');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return { portfolio, isLoading, error, refetch: fetchPortfolio };
}; 