"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import IntentInput from "@/components/IntentInput"
import PositionCard from "@/components/PositionCard"
import VaultCard from "@/components/VaultCard"
import AlertCard from "@/components/AlertCard"
import PriceTicker from "@/components/PriceTicker"
import PriceChart from "@/components/PriceChart"
import MarketOverview from "@/components/MarketOverview"
import { Sparkles, TrendingUp, DollarSign, Activity, BarChart3, RefreshCw, Bot } from "lucide-react"
import { useUser } from "@civic/auth/react"
import { usePortfolio } from "@/hooks/usePortfolio"
import { Skeleton } from "@/components/ui/skeleton"
import GeminiChatbot from "@/components/GeminiChatbot"
import { API_URL } from "@/lib/config"

interface Alert {
  type: "warning" | "info" | "danger" | "success"
  message: string
  timestamp: string
  priority: "low" | "medium" | "high"
}

// Static alerts for general info
const staticAlerts: Alert[] = [
  {
    type: "info" as const,
    message: "New vault available: Babylon BTC staking at 7.2% APY",
    timestamp: "1 day ago",
    priority: "low" as const,
  },
]

export default function Dashboard() {
  const [lastIntent, setLastIntent] = useState("Stake 0.5 Core")
  const [systemResponse, setSystemResponse] = useState("Staked into stCORE Vault")
  const [mounted, setMounted] = useState(false)
  const [selectedChart, setSelectedChart] = useState<"BTC" | "ETH" | "CORE">("BTC")
  const { user } = useUser()
  const { portfolio, isLoading, error, refetch } = usePortfolio()
  const [vaults, setVaults] = useState<any[]>([])
  const [vaultsLoading, setVaultsLoading] = useState(true)
  const [alerts, setAlerts] = useState<Alert[]>(staticAlerts)

  useEffect(() => {
    setMounted(true)
    const fetchVaults = async () => {
      setVaultsLoading(true)
      try {
        const response = await fetch(`${API_URL}/vaults`)
        const result = await response.json()
        if (result.success) {
          setVaults(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch vaults:", error)
      } finally {
        setVaultsLoading(false)
      }
    }
    fetchVaults()
  }, [])

  useEffect(() => {
    if (portfolio) {
      const dynamicAlerts: Alert[] = []
      const healthFactor = parseFloat(portfolio.healthFactor)

      if (healthFactor < 1.2 && healthFactor > 0) {
        dynamicAlerts.push({
          type: "danger",
          message: `Your health factor is ${healthFactor.toFixed(2)}. Repay your loan or add collateral to avoid liquidation.`,
          timestamp: "Just now",
          priority: "high",
        })
      } else if (healthFactor < 1.5 && healthFactor > 0) {
        dynamicAlerts.push({
          type: "warning",
          message: `Your health factor is getting low (${healthFactor.toFixed(2)}). Consider adding collateral.`,
          timestamp: "Just now",
          priority: "medium",
        })
      }

      if (systemResponse.toLowerCase().includes("staked")) {
        dynamicAlerts.push({
            type: "success",
            message: `Successfully executed intent: ${lastIntent}`,
            timestamp: "Just now",
            priority: "low"
        })
      }

      // Combine static and dynamic alerts, removing duplicates
      setAlerts(prevAlerts => {
          const allAlerts = [...dynamicAlerts, ...staticAlerts];
          const uniqueMessages = new Set();
          return allAlerts.filter(alert => {
              if (uniqueMessages.has(alert.message)) {
                  return false;
              }
              uniqueMessages.add(alert.message);
              return true;
          });
      });
    }
  }, [portfolio, systemResponse, lastIntent])

  const handleNewResponse = (intent: string, response: string) => {
    setLastIntent(intent)
    setSystemResponse(response)
  }

  if (!mounted) return null

  const StatCard = ({ icon, title, value, subtext, color, loading }: { icon: React.ReactNode, title: string, value: string, subtext: string, color: string, loading: boolean }) => (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
      <div className={`flex items-center justify-between mb-4 text-${color}-400`}>
        {icon}
      </div>
      {loading ? (
        <>
          <Skeleton className="w-3/4 h-8 mb-2" />
          <Skeleton className="w-1/2 h-4" />
        </>
      ) : (
        <>
          <div className="text-2xl font-bold text-white font-mono mb-1">{value}</div>
          <div className="text-sm text-gray-400">{subtext}</div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Welcome back, {user ? user.name || 'Satsfi User' : '...'}
              </h1>
              <p className="text-gray-400">Here's your portfolio overview and real-time market data</p>
            </div>
            <button onClick={() => refetch()} className="glass-card-button flex items-center gap-2 p-2 hover:bg-gray-700/50 transition-colors">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm">Refresh data</span>
            </button>
          </div>
        </div>

       {/* Intent Status Section */}
       <div className="glass-card neon-border p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold gradient-text">Intent Status</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm uppercase tracking-wider">Last Intent:</span>
                <p className="text-lg font-mono text-white mt-1">{lastIntent}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm uppercase tracking-wider">System Response:</span>
                <p className="text-green-400 font-semibold font-mono mt-1">{systemResponse}</p>
              </div>
            </div>
          </div>

          <IntentInput
            placeholder="Enter your next intent..."
            onNewResponse={handleNewResponse}
          />
        </div>


        {/* Live Price Ticker */}
        <PriceTicker />

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="w-8 h-8" />}
            title="Staked Balance"
            value={`${parseFloat(portfolio?.stakedBalance || "0").toFixed(4)} stCORE`}
            subtext="Staked CORE Balance"
            color="green"
            loading={isLoading}
          />
          <StatCard
            icon={<Activity className="w-8 h-8" />}
            title="Borrowed Balance"
            value={`${parseFloat(portfolio?.borrowedBalance || "0").toFixed(4)} CORE`}
            subtext="Total Borrowed"
            color="orange"
            loading={isLoading}
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Health Factor"
            value={portfolio?.healthFactor ? parseFloat(portfolio.healthFactor).toFixed(2) : 'N/A'}
            subtext="Loan Health"
            color="blue"
            loading={isLoading}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Positions, Vaults */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Positions */}
            <div>
              <h2 className="text-2xl font-bold gradient-text mb-4">Active Positions</h2>
              <div className="space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                  </>
                ) : portfolio?.positions && portfolio.positions.length > 0 ? (
                  portfolio.positions.map((pos: any, index: number) => (
                    <PositionCard key={index} {...pos} />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No active positions found.</p>
                    <p className="text-sm">Make your first move using the intent bar above!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Available Vaults */}
            <div>
              <h2 className="text-2xl font-bold gradient-text mb-4">Available Vaults</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {vaultsLoading ? (
                  // Skeleton loaders for vaults
                  <>
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                  </>
                ) : vaults.length > 0 ? (
                  vaults.map((vault) => (
                    <VaultCard key={vault.name} {...vault} />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8 md:col-span-2">
                    <p>No vaults are currently available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Market Overview & Chatbot */}
          <div className="lg:col-span-1 space-y-8">
            <MarketOverview />
            <GeminiChatbot />
          </div>
        </div>

        {/* Charts and Alerts */}
        <div className="grid lg:grid-cols-3 gap-8 my-8">
          {/* Price Chart */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-orange-400" />
                  <h2 className="text-2xl font-bold gradient-text">Price Charts</h2>
                </div>
                <div className="flex bg-gray-800/50 rounded-lg p-1">
                  {(["BTC", "ETH", "CORE"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedChart(s)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                        selectedChart === s
                          ? "bg-orange-500 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <PriceChart symbol={selectedChart} height={350} />
              </div>
            </div>
          </div>

          {/* Right Column: Alerts */}
          <div className="lg:col-span-1">
             <div>
                <h2 className="text-2xl font-bold gradient-text mb-4">Alerts & Notifications</h2>
                <div className="space-y-4">
                   {alerts.length > 0 ? (
                      alerts.map((alert, index) => (
                         <AlertCard key={index} {...alert} />
                      ))
                   ) : (
                      <div className="text-center text-gray-500 py-8">
                         <p>No new notifications.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}