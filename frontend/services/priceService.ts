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

// Mock real-time price data (in production, this would connect to actual APIs like CoinGecko, CoinMarketCap, etc.)
const mockPriceData: Record<string, PriceData> = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    price: 65000,
    change24h: 1250,
    changePercent24h: 1.96,
    marketCap: 1275000000000,
    volume24h: 28500000000,
    lastUpdated: new Date().toISOString(),
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    price: 2300,
    change24h: -45,
    changePercent24h: -1.92,
    marketCap: 276000000000,
    volume24h: 12800000000,
    lastUpdated: new Date().toISOString(),
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
    change24h: 0.001,
    changePercent24h: 0.1,
    marketCap: 32500000000,
    volume24h: 4200000000,
    lastUpdated: new Date().toISOString(),
  },
  USDT: {
    symbol: "USDT",
    name: "Tether",
    price: 0.9998,
    change24h: -0.0002,
    changePercent24h: -0.02,
    marketCap: 95000000000,
    volume24h: 45000000000,
    lastUpdated: new Date().toISOString(),
  },
}

// Generate mock historical chart data
const generateChartData = (symbol: string, days = 30): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const basePrice = mockPriceData[symbol]?.price || 1000
  const now = Date.now()

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000
    const volatility = symbol === "BTC" ? 0.05 : symbol === "ETH" ? 0.07 : 0.001
    const randomChange = (Math.random() - 0.5) * volatility
    const price = basePrice * (1 + randomChange * (i / days))
    const volume = Math.random() * 1000000000 + 500000000

    data.push({
      timestamp,
      price: Math.round(price * 100) / 100,
      volume: Math.round(volume),
    })
  }

  return data.sort((a, b) => a.timestamp - b.timestamp)
}

export class PriceService {
  private static instance: PriceService
  private priceData: Record<string, PriceData> = { ...mockPriceData }
  private subscribers: ((data: Record<string, PriceData>) => void)[] = []
  private intervalId: NodeJS.Timeout | null = null

  static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService()
    }
    return PriceService.instance
  }

  startRealTimeUpdates(): void {
    if (this.intervalId) return

    this.intervalId = setInterval(() => {
      // Simulate real-time price updates
      Object.keys(this.priceData).forEach((symbol) => {
        const current = this.priceData[symbol]
        const volatility = symbol === "BTC" ? 0.002 : symbol === "ETH" ? 0.003 : 0.0001
        const change = (Math.random() - 0.5) * volatility
        const newPrice = current.price * (1 + change)
        const priceChange = newPrice - current.price
        const percentChange = (priceChange / current.price) * 100

        this.priceData[symbol] = {
          ...current,
          price: Math.round(newPrice * 100) / 100,
          change24h: Math.round((current.change24h + priceChange) * 100) / 100,
          changePercent24h: Math.round(percentChange * 100) / 100,
          lastUpdated: new Date().toISOString(),
        }
      })

      this.notifySubscribers()
    }, 3000) // Update every 3 seconds
  }

  stopRealTimeUpdates(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  subscribe(callback: (data: Record<string, PriceData>) => void): () => void {
    this.subscribers.push(callback)

    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback)
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback({ ...this.priceData }))
  }

  getCurrentPrices(): Record<string, PriceData> {
    return { ...this.priceData }
  }

  getPrice(symbol: string): PriceData | null {
    return this.priceData[symbol] || null
  }

  getChartData(symbol: string, days = 30): ChartDataPoint[] {
    return generateChartData(symbol, days)
  }

  // Simulate fetching from external API
  async fetchLatestPrices(): Promise<Record<string, PriceData>> {
    // In production, this would make actual API calls
    await new Promise((resolve) => setTimeout(resolve, 500))
    return this.getCurrentPrices()
  }
}
