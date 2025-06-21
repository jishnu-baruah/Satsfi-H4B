"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import PriceTicker from "@/components/PriceTicker"
import PriceChart from "@/components/PriceChart"
import MarketOverview from "@/components/MarketOverview"
import { BarChart3 } from "lucide-react"

export default function MarketsPage() {
  const [selectedAsset, setSelectedAsset] = useState<"BTC" | "ETH" | "USDC" | "USDT">("BTC")

  const assets = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
  ] as const

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Markets</h1>
          <p className="text-gray-400">Real-time cryptocurrency prices and market data</p>
        </div>

        {/* Live Price Ticker */}
        <PriceTicker />

        {/* Asset Selection */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold gradient-text">Select Asset</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {assets.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset.symbol)}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  selectedAsset === asset.symbol
                    ? "bg-gradient-to-r from-orange-500/20 to-purple-500/20 border-orange-500/30 text-white"
                    : "bg-gray-800/30 border-gray-700/50 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <div className="font-bold text-lg">{asset.symbol}</div>
                <div className="text-sm opacity-75">{asset.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Charts and Market Data */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Price Chart */}
          <div className="lg:col-span-2">
            <PriceChart symbol={selectedAsset} height={500} />
          </div>

          {/* Market Overview */}
          <div>
            <MarketOverview />
          </div>
        </div>
      </div>
    </div>
  )
}
