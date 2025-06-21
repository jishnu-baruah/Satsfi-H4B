"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import IntentInput from "@/components/IntentInput"
import PositionCard from "@/components/PositionCard"
import AlertCard from "@/components/AlertCard"
import PriceTicker from "@/components/PriceTicker"
import PriceChart from "@/components/PriceChart"
import MarketOverview from "@/components/MarketOverview"
import { Sparkles, TrendingUp, DollarSign, Activity, BarChart3, RefreshCw } from "lucide-react"
import { useUser } from "@civic/auth/react"
import { usePortfolio } from "@/hooks/usePortfolio"
import { Skeleton } from "@/components/ui/skeleton"

// Enhanced mock data
const vaults = [
  {
    name: "stCORE",
    apy: 6.1,
    tvl: "$2.4M",
    description: "Core staking vault with liquid staking rewards",
    risk: "low" as const,
  },
  {
    name: "B14G",
    apy: 8.3,
    tvl: "$1.8M",
    description: "Bitcoin yield farming with automated strategies",
    risk: "medium" as const,
  },
  {
    name: "Pell",
    apy: 5.7,
    tvl: "$3.2M",
    description: "Restaking protocol with enhanced security",
    risk: "low" as const,
  },
  {
    name: "Babylon",
    apy: 7.2,
    tvl: "$1.1M",
    description: "Bitcoin staking with native yield",
    risk: "medium" as const,
  },
]

const positions = [
  {
    type: "stake" as const,
    asset: "BTC",
    amount: "0.5",
    value: "32,500",
    apy: 6.1,
    dailyYield: "$5.32",
    collateralRatio: 150,
  },
  {
    type: "borrow" as const,
    asset: "USDC",
    amount: "15,000",
    value: "15,000",
    ltv: 65,
  },
]

const alerts = [
  {
    type: "warning" as const,
    message: "APY has dropped from 6.1% → 4.2% in Pell vault",
    timestamp: "2 hours ago",
    priority: "medium" as const,
  },
  {
    type: "info" as const,
    message: "New vault available: Babylon BTC staking at 7.2% APY",
    timestamp: "1 day ago",
    priority: "low" as const,
  },
  {
    type: "danger" as const,
    message: "Repay 10% to stay in safe LTV range (currently 65%)",
    timestamp: "3 hours ago",
    priority: "high" as const,
  },
  {
    type: "success" as const,
    message: "Successfully earned $5.32 in daily yield from stCORE",
    timestamp: "6 hours ago",
    priority: "low" as const,
  },
]

export default function Dashboard() {
  const [lastIntent, setLastIntent] = useState("Max yield on 0.5 BTC")
  const [systemResponse, setSystemResponse] = useState("Staked into Pell Vault @ 6.1%")
  const [mounted, setMounted] = useState(false)
  const [selectedChart, setSelectedChart] = useState<"BTC" | "ETH">("BTC")
  const { user } = useUser();
  const { portfolio, isLoading, error, refetch } = usePortfolio();

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewResponse = (intent: string, response: string) => {
    setLastIntent(intent);
    setSystemResponse(response);
  };

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

        {/* Charts and Market Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Price Chart */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold gradient-text">Price Charts</h2>
              <div className="flex bg-gray-800/50 rounded-lg p-1 ml-auto">
                <button
                  onClick={() => setSelectedChart("BTC")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    selectedChart === "BTC"
                      ? "bg-orange-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  BTC
                </button>
                <button
                  onClick={() => setSelectedChart("ETH")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    selectedChart === "ETH"
                      ? "bg-orange-500 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  ETH
                </button>
              </div>
            </div>
            <PriceChart symbol={selectedChart} height={350} />
          </div>

          {/* Market Overview */}
          <div>
            <MarketOverview />
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

        {/* Vault APY Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6" />
            My Vaults
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {vaults.map((vault, index) => (
              <div
                key={vault.name}
                className="glass-card p-6 min-w-[320px] hover:bg-gray-800/30 transition-all duration-500 group border border-gray-800/30 hover:border-orange-500/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">
                        {vault.name}
                      </h3>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          vault.risk === "low"
                            ? "bg-green-400/60"
                            : vault.risk === "medium"
                              ? "bg-yellow-400/60"
                              : "bg-red-400/60"
                        } group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>
                    {vault.description && (
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                        {vault.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-5 h-5 text-green-400 group-hover:scale-105 transition-transform duration-300" />
                      <div className="text-3xl font-bold text-green-400 font-mono group-hover:text-green-300 transition-colors duration-300">
                        {vault.apy}%
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">APY</div>
                  </div>
                </div>

                {vault.tvl && (
                  <div className="mb-6 p-3 bg-gray-800/20 group-hover:bg-gray-800/40 rounded-lg border border-gray-700/30 group-hover:border-gray-700/50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        Total Value Locked
                      </span>
                      <span className="font-semibold text-white font-mono">{vault.tvl}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => console.log(`Staking in ${vault.name}`)}
                  className="w-full bg-gradient-to-r from-orange-500/80 to-orange-600/80 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-orange-500/20 group-hover:shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    Stake Now
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Positions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6" />
            Active Positions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {positions.map((position, index) => (
              <PositionCard
                key={index}
                type={position.type}
                asset={position.asset}
                amount={position.amount}
                value={position.value}
                apy={position.apy}
                ltv={position.ltv}
                dailyYield={position.dailyYield}
                collateralRatio={position.collateralRatio}
              />
            ))}
          </div>
        </div>

        {/* AI Alerts Feed */}
        <div>
          <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            AI Recommendations
          </h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <AlertCard
                key={index}
                type={alert.type}
                message={alert.message}
                timestamp={alert.timestamp}
                priority={alert.priority}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
