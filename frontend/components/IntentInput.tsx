"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2, Send, Sparkles } from "lucide-react"
import { toast as sonnerToast } from "sonner"
import { Button } from "./ui/button"
import { useUser } from "@civic/auth/react"
import {
  API_URL,
  StakingVaultABI,
  LendingPoolABI,
  STAKING_VAULT_ADDRESS,
  LENDING_POOL_ADDRESS,
} from "@/lib/config"
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi"

interface IntentInputProps {
  placeholder?: string
  className?: string
  onSignIn?: () => void
  onNewResponse?: (intent: string, response: string) => void
}

export default function IntentInput({
  placeholder = "e.g., Max yield on 0.5 BTC",
  className = "",
  onSignIn,
  onNewResponse,
}: IntentInputProps) {
  const [intent, setIntent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, signIn: civicSignIn } = useUser()
  const { address } = useAccount()
  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract()
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash })

  const [transactionId, setTransactionId] = useState<string | null>(null)

  const effectiveSignIn = onSignIn || civicSignIn

  // Effect to confirm transaction with backend
  useEffect(() => {
    if (hash && transactionId) {
      const confirmTx = async () => {
        try {
          await fetch(`${API_URL}/transaction/confirm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactionId, transactionHash: hash }),
          })
        } catch (error) {
          console.error("Failed to confirm transaction with backend", error)
        }
      }
      confirmTx()
      setTransactionId(null) // Reset after confirming
    }
  }, [hash, transactionId])

  // Effect to show toast notifications based on transaction status
  useEffect(() => {
    if (isConfirming) {
      sonnerToast.loading("Transaction is processing...", {
        description: "Waiting for blockchain confirmation.",
        id: "tx-status",
      })
    }
    if (isConfirmed) {
      const successMsg = "Your transaction has been successfully recorded on the blockchain."
      onNewResponse?.(intent, successMsg)
      sonnerToast.success("Transaction Confirmed!", {
        description: successMsg,
        id: "tx-status",
      })
    }
    if (writeError || receiptError) {
      const errorMsg = (writeError || receiptError)?.message || "An unknown error occurred."
      onNewResponse?.(intent, errorMsg)
      sonnerToast.error("Transaction Failed", {
        description: errorMsg,
        id: "tx-status",
      })
    }
  }, [isConfirming, isConfirmed, writeError, receiptError, intent, onNewResponse])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const loadingCondition = isLoading || isWritePending || isConfirming
    if (!intent.trim() || loadingCondition) {
      return
    }

    if (!user) {
      setIsLoading(true)
      setTimeout(() => {
        sonnerToast.info("Sign in to continue", {
          description:
            "That's a great question! Please sign in to get a personalized answer.",
          action: {
            label: "Sign In",
            onClick: () => effectiveSignIn(),
          },
        })
        setIsLoading(false)
      }, 500)
      return
    }

    setIsLoading(true)

    try {
      if (!address) {
        throw new Error(
          "Could not find user wallet address. Please connect your wallet."
        )
      }

      const response = await fetch(`${API_URL}/intent/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: intent,
          userAddress: address,
          contractAddresses: {
            stakingVault: STAKING_VAULT_ADDRESS,
            lendingPool: LENDING_POOL_ADDRESS,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "An unexpected error occurred.")
      }

      onNewResponse?.(intent, data.message)

      sonnerToast.info("Action Required", {
        description: data.message,
      })

      if (data.transaction) {
        setTransactionId(data.transactionId)
        const { to, functionName, args, value } = data.transaction

        // Determine which ABI to use
        const abi =
          functionName === "deposit" || functionName === "withdraw" ? StakingVaultABI : LendingPoolABI

        const writeArgs = {
          address: to,
          abi,
          functionName,
          args,
          value: value ? BigInt(value) : undefined,
        }

        writeContract(writeArgs)
      }
      setIntent("")
    } catch (err: any) {
      onNewResponse?.(intent, err.message || "Failed to process intent.")
      sonnerToast.error("Error", {
        description: err.message || "Failed to process intent.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isLoadingOverall = isLoading || isWritePending || isConfirming

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#B4FF3C]/5 via-[#4FFF7B]/5 to-[#B4FF3C]/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative glass-card p-2 group-hover:border-[#B4FF3C]/30 transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-1 relative">
              <Sparkles className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#B4FF3C] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <input
                type="text"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-none pl-14 pr-4 py-5 text-lg placeholder-gray-500 focus:outline-none text-white font-mono group-hover:placeholder-gray-400 transition-colors duration-300"
                disabled={isLoadingOverall}
              />
            </div>
            <button
              type="submit"
              disabled={!intent.trim() || isLoadingOverall}
              className="btn-primary mr-2 p-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoadingOverall ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
