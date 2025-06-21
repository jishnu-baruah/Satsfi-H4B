"use client"

import { AlertTriangle, TrendingDown, TrendingUp, Info, Clock } from "lucide-react"

interface AlertCardProps {
  type: "warning" | "info" | "success" | "danger"
  message: string
  timestamp: string
  priority?: "low" | "medium" | "high"
}

export default function AlertCard({ type, message, timestamp, priority = "medium" }: AlertCardProps) {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case "danger":
        return <TrendingDown className="w-5 h-5 text-red-400" />
      case "success":
        return <TrendingUp className="w-5 h-5 text-green-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getGradient = () => {
    switch (type) {
      case "warning":
        return "from-yellow-500/10 to-orange-500/10 border-yellow-500/30"
      case "danger":
        return "from-red-500/10 to-pink-500/10 border-red-500/30"
      case "success":
        return "from-green-500/10 to-emerald-500/10 border-green-500/30"
      default:
        return "from-blue-500/10 to-cyan-500/10 border-blue-500/30"
    }
  }

  const getPriorityIndicator = () => {
    if (priority === "high") return "animate-pulse"
    return ""
  }

  return (
    <div
      className={`bg-gradient-to-r ${getGradient()} border rounded-xl p-4 hover:scale-105 transition-all duration-300 ${getPriorityIndicator()}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 rounded-lg bg-gray-800/50">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-200 font-medium leading-relaxed">{message}</p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-3 h-3 text-gray-500" />
            <p className="text-xs text-gray-500 font-mono">{timestamp}</p>
            {priority === "high" && (
              <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full font-bold">HIGH PRIORITY</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
