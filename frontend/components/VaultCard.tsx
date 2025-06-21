"use client"

import { TrendingUp, Zap, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VaultCardProps {
  name: string
  apy: number
  tvl?: string
  description?: string
  risk?: "low" | "medium" | "high"
  onStake?: () => void
}

export default function VaultCard({ name, apy, tvl, description, risk = "medium", onStake }: VaultCardProps) {
  const { toast } = useToast()

  const handleStake = () => {
    toast({
      title: "Staking Initiated",
      description: `Preparing to stake in ${name} vault...`,
      variant: "success",
    })
    onStake?.()
  }

  const getRiskColor = () => {
    switch (risk) {
      case "low":
        return "text-green-400"
      case "high":
        return "text-red-400"
      default:
        return "text-yellow-400"
    }
  }

  return (
    <div className="glass-card neon-border min-w-[320px] p-6 transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-2xl font-bold text-green-400">{name}</h3>
            <Shield className={`w-4 h-4 ${getRiskColor()}`} />
          </div>
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div className="text-3xl font-bold text-green-400 font-mono">{apy}%</div>
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">APY</div>
        </div>
      </div>

      {tvl && (
        <div className="mb-6 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Total Value Locked</span>
            <span className="font-semibold text-white font-mono">{tvl}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleStake}
        className="btn-primary btn-glow w-full group-hover:shadow-orange-500/50 transition-all duration-300"
      >
        <Zap className="w-4 h-4 mr-2" />
        Stake Now
      </button>
    </div>
  )
}
