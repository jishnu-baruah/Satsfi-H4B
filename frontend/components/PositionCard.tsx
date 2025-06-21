"use client"

import { TrendingUp, DollarSign, AlertTriangle } from "lucide-react"

interface PositionCardProps {
  type: "stake" | "borrow"
  asset: string
  amount: string
  value: string
  apy?: number
  ltv?: number
  dailyYield?: string
  collateralRatio?: number
}

export default function PositionCard({
  type,
  asset,
  amount,
  value,
  apy,
  ltv,
  dailyYield,
  collateralRatio,
}: PositionCardProps) {
  const isStaking = type === "stake"
  const isHighRisk = ltv && ltv > 80

  return (
    <div className="glass-card neon-border p-6 hover:scale-105 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isStaking
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
                  : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30"
              }`}
            >
              {isStaking ? "Staked" : "Borrowed"}
            </span>
            {isHighRisk && <AlertTriangle className="w-4 h-4 text-red-400" />}
          </div>
          <h3 className="text-2xl font-bold font-mono mb-1">
            {amount} {asset}
          </h3>
          <p className="text-gray-400 flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {value}
          </p>
        </div>

        <div className="text-right space-y-2">
          {apy && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-bold font-mono">{apy}%</span>
            </div>
          )}
          {ltv && (
            <div className={`text-sm font-mono ${isHighRisk ? "text-red-400" : "text-gray-400"}`}>LTV: {ltv}%</div>
          )}
          {collateralRatio && <div className="text-sm text-gray-400 font-mono">Ratio: {collateralRatio}%</div>}
        </div>
      </div>

      {dailyYield && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Daily Yield</span>
            <span className="text-green-400 font-bold font-mono">+{dailyYield}</span>
          </div>
        </div>
      )}
    </div>
  )
}
