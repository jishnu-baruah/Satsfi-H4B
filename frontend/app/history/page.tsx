"use client"

import { useState, useEffect, useMemo } from "react"
import Navbar from "@/components/Navbar"
import TransactionModal from "@/components/TransactionModal"
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  Loader,
  AlertTriangle,
  Users,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportToCSV, exportToJSON } from "@/utils/exportTransactions"
import { Skeleton } from "@/components/ui/skeleton"
import { API_URL } from "@/lib/config"
import { PriceService, PriceData } from "@/services/priceService"
import { useAccount } from "wagmi"

interface Transaction {
  id: string
  type: "stake" | "unstake" | "borrow" | "repay" | "deposit" | "withdraw" | "unknown"
  asset: string
  amount: string
  value: string
  status: "completed" | "pending" | "failed"
  timestamp: string
  hash: string
  vault?: string
  apy?: number
  ltv?: number
  fee: string
  error?: string
  rawIntent?: string
}

// Helper to transform backend data into frontend format
const transformTransaction = (tx: any, prices: Record<string, PriceData>): Transaction => {
  const getStatus = (): "completed" | "pending" | "failed" => {
    switch (tx.status) {
      case "success":
        return "completed"
      case "failed":
        return "failed"
      case "pending_review":
      default:
        return "pending"
    }
  }

  const getType = (): Transaction["type"] => {
    const action = tx.parsed_intent?.action?.toLowerCase()
    const validTypes: Transaction["type"][] = ["stake", "unstake", "borrow", "repay", "deposit", "withdraw"]
    if (validTypes.includes(action)) {
      return action
    }
    return "unknown"
  }

  const status = getStatus()
  const amount = Number(tx.parsed_intent?.amount || 0)
  const asset = tx.parsed_intent?.asset || "N/A"
  
  // Use live prices to calculate the value
  const livePrice = prices[asset.toUpperCase()]?.price || 0
  const value = amount * livePrice

  return {
    id: tx._id,
    type: getType(),
    asset: asset,
    amount: amount.toLocaleString(),
    value: `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    status,
    timestamp: tx.createdAt,
    hash: tx._id, // Using _id as a placeholder for a real hash
    vault: tx.parsed_intent?.vault || "SatsFi Vault",
    apy: tx.parsed_intent?.apy,
    ltv: tx.parsed_intent?.ltv,
    fee: "$0.00", // Placeholder
    error: status === "failed" ? tx.response_message : undefined,
    rawIntent: tx.raw_intent,
  }
}

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [sortBy, setSortBy] = useState<"date" | "amount" | "type">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [historyView, setHistoryView] = useState<"all" | "user">("all")
  const { address, isConnected } = useAccount()

  useEffect(() => {
    const fetchAndTransformTransactions = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // 1. Fetch live prices first
        const priceService = PriceService.getInstance()
        const prices = await priceService.fetchLatestPrices()

        // 2. Determine API endpoint based on selected view
        let apiUrl = `${API_URL}/intent/transactions`
        if (historyView === "user") {
          if (!isConnected || !address) {
            // If user view is selected but wallet is not connected, show empty state
            setTransactions([])
            setIsLoading(false)
            return
          }
          apiUrl = `${API_URL}/intent/transactions/${address}`
        }

        // 3. Fetch raw transactions from our backend
        const response = await fetch(apiUrl)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        const result = await response.json()

        // 4. Transform transactions using live price data
        if (result.success) {
          const transformedTxs = result.data.map((tx: any) => transformTransaction(tx, prices))
          setTransactions(transformedTxs)
        } else {
          throw new Error(result.message || "Failed to fetch transactions")
        }
      } catch (e: any) {
        console.error("Fetch error:", e)
        setError(e.message)
        toast({
          title: "Error Fetching History",
          description: e.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndTransformTransactions()
  }, [toast, historyView, address, isConnected])

  // Filter and search logic
  useEffect(() => {
    let filtered = [...transactions]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.vault?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((tx) => tx.type === filterType)
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((tx) => tx.status === filterStatus)
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter((tx) => new Date(tx.timestamp) >= new Date(dateRange.start))
    }
    if (dateRange.end) {
      filtered = filtered.filter((tx) => new Date(tx.timestamp) <= new Date(dateRange.end))
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.timestamp)
          bValue = new Date(b.timestamp)
          break
        case "amount":
          aValue = Number.parseFloat(a.amount.replace(/,/g, ""))
          bValue = Number.parseFloat(b.amount.replace(/,/g, ""))
          break
        case "type":
          aValue = a.type
          bValue = b.type
          break
        default:
          aValue = new Date(a.timestamp)
          bValue = new Date(b.timestamp)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, filterType, filterStatus, dateRange, sortBy, sortOrder])

  // Statistics
  const stats = useMemo(() => {
    const total = filteredTransactions.length
    const completed = filteredTransactions.filter((tx) => tx.status === "completed").length
    const pending = filteredTransactions.filter((tx) => tx.status === "pending").length
    const failed = filteredTransactions.filter((tx) => tx.status === "failed").length

    return { total, completed, pending, failed }
  }, [filteredTransactions])

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowModal(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterStatus("all")
    setDateRange({ start: "", end: "" })
    setSortBy("date")
    setSortOrder("desc")
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
      variant: "success",
    })
  }

  const handleExport = (format: "csv" | "json") => {
    if (format === "csv") {
      exportToCSV(filteredTransactions, "satsfi_transactions")
    } else {
      exportToJSON(filteredTransactions, "satsfi_transactions")
    }

    toast({
      title: "Export Successful",
      description: `Transactions exported as ${format.toUpperCase()}`,
      variant: "success",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stake":
      case "deposit":
        return <TrendingUp className="w-5 h-5 text-green-400" />
      case "unstake":
      case "withdraw":
      case "repay":
        return <TrendingDown className="w-5 h-5 text-red-400" />
      case "borrow":
        return <RefreshCw className="w-5 h-5 text-blue-400" />
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400" />
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Transaction History</h1>
            <p className="text-gray-400">Track all your DeFi activities and transactions</p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-800/50 border border-gray-700/50 rounded-xl p-1">
              <button
                onClick={() => setHistoryView("all")}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                  historyView === "all" ? "bg-orange-500/30 text-white" : "text-gray-400 hover:bg-gray-700/50"
                }`}
              >
                <Users className="w-4 h-4" />
                All
              </button>
              <button
                onClick={() => setHistoryView("user")}
                disabled={!isConnected}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                  historyView === "user" ? "bg-orange-500/30 text-white" : "text-gray-400 hover:bg-gray-700/50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <User className="w-4 h-4" />
                My History
              </button>
            </div>
            <button onClick={() => handleExport("csv")} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button onClick={() => handleExport("json")} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              JSON
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-white font-mono">
              {isLoading ? <Skeleton className="h-8 w-16" /> : stats.total}
            </div>
            <div className="text-sm text-gray-400">Total Transactions</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-green-400 font-mono">
              {isLoading ? <Skeleton className="h-8 w-16" /> : stats.completed}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-yellow-400 font-mono">
              {isLoading ? <Skeleton className="h-8 w-16" /> : stats.pending}
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl font-bold text-red-400 font-mono">
              {isLoading ? <Skeleton className="h-8 w-16" /> : stats.failed}
            </div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by asset, hash, vault, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center gap-2 ${showFilters ? "bg-orange-500/20 border-orange-500/30" : ""}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Clear Filters */}
            <button onClick={clearFilters} className="btn-secondary flex items-center gap-2">
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-700/50">
              {/* Type Filter */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Transaction Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Types</option>
                  <option value="stake">Stake</option>
                  <option value="unstake">Unstake</option>
                  <option value="borrow">Borrow</option>
                  <option value="repay">Repay</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdraw">Withdraw</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}

          {/* Sort Controls */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount" | "type")}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="type">Type</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="glass-card p-12 text-center">
              <div className="text-red-400 mb-4">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">Failed to load transactions</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No transactions found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
                className="glass-card neon-border p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      {getStatusIcon(transaction.status)}
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold capitalize">{transaction.type}</h3>
                        <span className="text-sm text-gray-400 font-mono">{transaction.asset}</span>
                        {transaction.vault && (
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                            {transaction.vault}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{formatDate(transaction.timestamp)}</span>
                        <span className="font-mono">{transaction.hash.slice(0, 10)}...</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold font-mono text-white mb-1">
                      {transaction.amount} {transaction.asset}
                    </div>
                    <div className="text-gray-400">{transaction.value}</div>
                    {transaction.apy && <div className="text-sm text-green-400">APY: {transaction.apy}%</div>}
                    {transaction.ltv && <div className="text-sm text-blue-400">LTV: {transaction.ltv}%</div>}
                  </div>
                </div>

                {transaction.error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="text-red-400 text-sm">{transaction.error}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal transaction={selectedTransaction} isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
