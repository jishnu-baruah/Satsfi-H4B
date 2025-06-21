"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
import { PriceService, type PriceData } from "@/services/priceService"

export default function MarketOverview() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const priceService = PriceService.getInstance()

    priceService.fetchLatestPrices().then((data) => {
      setPrices(data)
      setIsLoading(false)
    })

    const unsubscribe = priceService.subscribe(setPrices)
    return unsubscribe
  }, [])

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-48" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full" />
                  <div className="space-y-1">
                    <div className="w-16 h-4 bg-gray-700 rounded" />
                    <div className="w-12 h-3 bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="w-20 h-4 bg-gray-700 rounded" />
                  <div className="w-16 h-3 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card neon-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-orange-400" />
        <h3 className="text-2xl font-bold gradient-text">Market Overview</h3>
      </div>

      <div className="space-y-4">
        {Object.values(prices).map((price) => (
          <div
            key={price.symbol}
            className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:bg-gray-800/50 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  price.symbol === "BTC"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                    : price.symbol === "ETH"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : price.symbol === "USDC"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700"
                        : "bg-gradient-to-r from-green-600 to-green-700"
                }`}
              >
                {price.symbol.slice(0, 2)}
              </div>

              <div>
                <div className="font-semibold text-white">{price.name}</div>
                <div className="text-sm text-gray-400">{price.symbol}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-white text-lg">
                {price.symbol === "BTC" || price.symbol === "ETH"
                  ? `$${price.price.toLocaleString()}`
                  : `$${price.price.toFixed(4)}`}
              </div>

              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  price.changePercent24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {price.changePercent24h >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {price.changePercent24h >= 0 ? "+" : ""}
                {price.changePercent24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-700/50">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Total Market Cap</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {formatMarketCap(Object.values(prices).reduce((sum, p) => sum + p.marketCap, 0))}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">24h Volume</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {formatVolume(Object.values(prices).reduce((sum, p) => sum + p.volume24h, 0))}
          </div>
        </div>
      </div>
    </div>
  )
}
