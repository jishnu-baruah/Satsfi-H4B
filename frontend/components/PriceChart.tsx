"use client"

import { useState, useEffect, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react"
import { PriceService, type ChartDataPoint, type PriceData } from "@/services/priceService"

interface PriceChartProps {
  symbol: string
  height?: number
  showControls?: boolean
}

export default function PriceChart({ symbol, height = 400, showControls = true }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [timeframe, setTimeframe] = useState<"1D" | "7D" | "30D" | "90D">("7D")
  const [chartType, setChartType] = useState<"line" | "area">("area")
  const [currentPrice, setCurrentPrice] = useState<PriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const priceService = PriceService.getInstance()

    const loadData = () => {
      const days = timeframe === "1D" ? 1 : timeframe === "7D" ? 7 : timeframe === "30D" ? 30 : 90
      const data = priceService.getChartData(symbol, days)
      setChartData(data)
      setCurrentPrice(priceService.getPrice(symbol))
      setIsLoading(false)
    }

    loadData()

    // Subscribe to price updates
    const unsubscribe = priceService.subscribe((prices) => {
      setCurrentPrice(prices[symbol] || null)
    })

    return unsubscribe
  }, [symbol, timeframe])

  const chartStats = useMemo(() => {
    if (chartData.length === 0) return null

    const prices = chartData.map((d) => d.price)
    const high = Math.max(...prices)
    const low = Math.min(...prices)
    const first = prices[0]
    const last = prices[prices.length - 1]
    const change = last - first
    const changePercent = (change / first) * 100

    return { high, low, change, changePercent }
  }, [chartData])

  const formatPrice = (value: number) => {
    if (symbol === "BTC" || symbol === "ETH") {
      return `$${value.toLocaleString()}`
    }
    return `$${value.toFixed(4)}`
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    if (timeframe === "1D") {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-card p-3 border border-gray-700/50">
          <p className="text-gray-400 text-sm mb-1">{new Date(label).toLocaleString()}</p>
          <p className="text-white font-semibold">Price: {formatPrice(data.price)}</p>
          <p className="text-gray-400 text-sm">Volume: ${(data.volume / 1000000).toFixed(1)}M</p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-32 mb-4" />
          <div className="h-64 bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card neon-border p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold gradient-text">{symbol} Price Chart</h3>
            {currentPrice && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    currentPrice.changePercent24h >= 0 ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span className="text-sm text-gray-400">Live</span>
              </div>
            )}
          </div>

          {currentPrice && (
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold font-mono text-white">{formatPrice(currentPrice.price)}</span>
              <div
                className={`flex items-center gap-1 ${
                  currentPrice.changePercent24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {currentPrice.changePercent24h >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {currentPrice.changePercent24h >= 0 ? "+" : ""}
                  {currentPrice.changePercent24h.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {showControls && (
          <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
            {/* Timeframe Controls */}
            <div className="flex bg-gray-800/50 rounded-lg p-1">
              {(["1D", "7D", "30D", "90D"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    timeframe === tf
                      ? "bg-orange-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Chart Type Controls */}
            <div className="flex bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setChartType("area")}
                className={`p-2 rounded transition-all duration-200 ${
                  chartType === "area"
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Activity className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`p-2 rounded transition-all duration-200 ${
                  chartType === "line"
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Chart Stats */}
      {chartStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">24h High</div>
            <div className="font-mono font-semibold text-green-400">{formatPrice(chartStats.high)}</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">24h Low</div>
            <div className="font-mono font-semibold text-red-400">{formatPrice(chartStats.low)}</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Change</div>
            <div className={`font-mono font-semibold ${chartStats.change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {chartStats.change >= 0 ? "+" : ""}
              {formatPrice(chartStats.change)}
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Change %</div>
            <div
              className={`font-mono font-semibold ${chartStats.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {chartStats.changePercent >= 0 ? "+" : ""}
              {chartStats.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} stroke="#9CA3AF" fontSize={12} />
              <YAxis tickFormatter={formatPrice} stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                strokeWidth={2}
                fill={`url(#gradient-${symbol})`}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} stroke="#9CA3AF" fontSize={12} />
              <YAxis tickFormatter={formatPrice} stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#f97316" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
