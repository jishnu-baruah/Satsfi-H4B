"use client"
import { X, Copy, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: string
  asset: string
  amount: string
  value: string
  status: string
  timestamp: string
  hash: string
  vault?: string
  apy?: number
  ltv?: number
  fee: string
  error?: string
}

interface TransactionModalProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
}

export default function TransactionModal({ transaction, isOpen, onClose }: TransactionModalProps) {
  const { toast } = useToast()

  if (!isOpen || !transaction) return null

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      variant: "success",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-400 animate-spin" />
      case "failed":
        return <XCircle className="w-6 h-6 text-red-400" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card neon-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {getStatusIcon(transaction.status)}
              <h2 className="text-2xl font-bold gradient-text capitalize">{transaction.type} Transaction</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Transaction Details */}
          <div className="space-y-6">
            {/* Amount and Value */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-white mb-2">
                  {transaction.amount} {transaction.asset}
                </div>
                <div className="text-xl text-gray-400">{transaction.value}</div>
              </div>
            </div>

            {/* Status and Timestamp */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  <span className="font-semibold capitalize">{transaction.status}</span>
                </div>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-1">Date & Time</div>
                <div className="font-mono text-sm">{formatDate(transaction.timestamp)}</div>
              </div>
            </div>

            {/* Transaction Hash */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Transaction Hash</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(transaction.hash, "Transaction hash")}
                    className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-700/50 rounded transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="font-mono text-sm break-all">{transaction.hash}</div>
            </div>

            {/* Additional Details */}
            <div className="grid md:grid-cols-2 gap-4">
              {transaction.vault && (
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-1">Vault</div>
                  <div className="font-semibold">{transaction.vault}</div>
                </div>
              )}

              {transaction.apy && (
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-1">APY</div>
                  <div className="font-semibold text-green-400">{transaction.apy}%</div>
                </div>
              )}

              {transaction.ltv && (
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-1">Loan-to-Value</div>
                  <div className="font-semibold text-blue-400">{transaction.ltv}%</div>
                </div>
              )}

              <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-1">Network Fee</div>
                <div className="font-semibold">{transaction.fee}</div>
              </div>
            </div>

            {/* Error Message */}
            {transaction.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="font-semibold text-red-400">Transaction Failed</span>
                </div>
                <div className="text-red-300">{transaction.error}</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button onClick={() => copyToClipboard(transaction.id, "Transaction ID")} className="btn-secondary flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy ID
            </button>
            <button className="btn-secondary flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
