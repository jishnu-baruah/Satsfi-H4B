"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { PriceService, type PriceData } from "@/services/priceService"

export default function PriceTicker() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const priceService = PriceService.getInstance()

    // Initial load
    priceService.fetchLatestPrices().then((data) => {
      setPrices(data)
      setIsLoading(false)
    })

    // Start real-time updates
    priceService.startRealTimeUpdates()

    // Subscribe to updates
    const unsubscribe = priceService.subscribe(setPrices)

    return () => {
      unsubscribe()
      priceService.stopRealTimeUpdates()
    }
  }, [])

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === "BTC") return `$${price.toLocaleString()}`
    if (symbol === "ETH") return `$${price.toLocaleString()}`
    return `$${price.toFixed(4)}`
  }

  const formatChange = (change: number) => {
    return change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`
  }

  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 min-w-[200px]">
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
              <div className="space-y-1">
                <div className="w-16 h-4 bg-gray-700 rounded animate-pulse" />
                <div className="w-12 h-3 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 text-green-400 min-w-fit">
          <Activity className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-semibold">LIVE</span>
        </div>

        {Object.values(prices).map((price) => (
          <div key={price.symbol} className="flex items-center gap-3 min-w-[180px] group">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  price.changePercent24h >= 0 ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="font-bold text-white">{price.symbol}</span>
            </div>

            <div className="text-right">
              <div className="font-mono font-semibold text-white">{formatPrice(price.price, price.symbol)}</div>
              <div
                className={`text-xs font-mono flex items-center gap-1 ${
                  price.changePercent24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {price.changePercent24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {formatChange(price.changePercent24h)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
