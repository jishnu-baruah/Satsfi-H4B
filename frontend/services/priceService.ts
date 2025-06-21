import { API_URL } from "@/lib/config";

export interface PriceData {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  marketCap: number
  volume24h: number
  lastUpdated: string
}

export interface ChartDataPoint {
  timestamp: number
  price: number
  volume: number
}

// The IDs of the cryptocurrencies we want to fetch from CoinGecko
const COIN_GECKO_IDS = ["bitcoin", "ethereum", "usd-coin", "tether", "core"];

export class PriceService {
  private static instance: PriceService
  private priceData: Record<string, PriceData> = {}
  private subscribers: ((data: Record<string, PriceData>) => void)[] = []
  private intervalId: NodeJS.Timeout | null = null

  static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService()
    }
    return PriceService.instance
  }

  startRealTimeUpdates(): void {
    if (this.intervalId) return;

    // Fetch prices immediately, then start the interval
    this.fetchLatestPrices();

    this.intervalId = setInterval(() => {
      this.fetchLatestPrices();
    }, 30000); // Update every 30 seconds
  }

  stopRealTimeUpdates(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  subscribe(callback: (data: Record<string, PriceData>) => void): () => void {
    this.subscribers.push(callback)
    // Immediately notify the new subscriber with current data
    if (Object.keys(this.priceData).length > 0) {
        callback(this.priceData);
    }
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback)
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback({ ...this.priceData }))
  }

  getPrice(symbol: string): PriceData | null {
    return this.priceData[symbol] || null
  }

  // Fetches live data from our own backend proxy
  async fetchLatestPrices(): Promise<Record<string, PriceData>> {
    try {
      const url = `${API_URL}/prices`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`CoinGecko API request failed: ${response.statusText}`);
      }
      const data = await response.json();

      const newPriceData: Record<string, PriceData> = {};
      
      const idToInfoMap: { [id: string]: { symbol: string; name: string } } = {
        'bitcoin': { symbol: 'BTC', name: 'Bitcoin' },
        'ethereum': { symbol: 'ETH', name: 'Ethereum' },
        'usd-coin': { symbol: 'USDC', name: 'USD Coin' },
        'tether': { symbol: 'USDT', name: 'Tether' },
        'coredaoorg': { symbol: 'CORE', name: 'Core' }
      };

      Object.keys(data).forEach(id => {
          const coin = data[id];
          const info = idToInfoMap[id];
          
          if (info) {
            newPriceData[info.symbol] = {
                symbol: info.symbol,
                name: info.name,
                price: coin.usd,
                change24h: 0, // API provides percentage change, not absolute
                changePercent24h: coin.usd_24h_change || 0,
                marketCap: coin.usd_market_cap,
                volume24h: coin.usd_24h_vol,
                lastUpdated: new Date(coin.last_updated_at * 1000).toISOString(),
            };
          }
      });
      
      this.priceData = newPriceData;
      this.notifySubscribers();
      return this.priceData;

    } catch (error) {
      console.error("Failed to fetch price data:", error);
      // Return stale data if available
      return this.priceData;
    }
  }

  async fetchChartData(symbol: string, days: number): Promise<ChartDataPoint[]> {
    try {
        const id = this.symbolToId(symbol);
        if (!id) throw new Error(`Unsupported symbol: ${symbol}`);

        const url = `${API_URL}/prices/historical?id=${id}&days=${days}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch chart data: ${response.statusText}`);
        }
        const data = await response.json();

        // The API returns {prices: [[timestamp, price]], total_volumes: [[timestamp, volume]]}
        return data.prices.map((p: [number, number], index: number) => ({
            timestamp: p[0],
            price: p[1],
            volume: data.total_volumes[index] ? data.total_volumes[index][1] : 0,
        }));
    } catch (error) {
        console.error(`Error fetching chart data for ${symbol}:`, error);
        return []; // Return empty array on error
    }
  }

  // Helper to convert symbol to CoinGecko ID
  private symbolToId(symbol: string): string | null {
      const map: { [key: string]: string } = {
          'BTC': 'bitcoin',
          'ETH': 'ethereum',
          'USDC': 'usd-coin',
          'USDT': 'tether',
          'CORE': 'coredaoorg'
      };
      return map[symbol] || null;
  }
  
  getChartData(symbol: string, days = 30): Promise<ChartDataPoint[]> {
      return this.fetchChartData(symbol, days);
  }
}
