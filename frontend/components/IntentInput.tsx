"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2, Send, Sparkles, BrainCircuit } from "lucide-react"
import { toast as sonnerToast } from "sonner"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
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
  defaultValue?: string
  onSubmit?: (intent: string) => void
  onExplainMore?: (intent: string) => void
}

export default function IntentInput({
  placeholder = "e.g., Stake 0.5 Core",
  className = "",
  onSignIn,
  onNewResponse,
  defaultValue,
  onSubmit,
  onExplainMore,
}: IntentInputProps) {
  const [intent, setIntent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"learner" | "pro">("pro")
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
  const [isExplaining, setIsExplaining] = useState(false)

  const effectiveSignIn = onSignIn || civicSignIn

  useEffect(() => {
    if (defaultValue) {
      setIntent(defaultValue);
    }
  }, [defaultValue]);

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

  const handleExplainMore = async () => {
    if (onExplainMore) {
        onExplainMore(intent);
        sonnerToast.dismiss("intent-explanation");
    } else {
        console.error("onExplainMore prop not provided to IntentInput");
        sonnerToast.error("Cannot open chat.", { description: "This feature is not available here." });
    }
  };

  const handleExplain = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to get explanation.');
      }
      sonnerToast.info("Here's what that means:", {
        description: (
          <div className="prose prose-sm prose-invert">
             <p>{data.explanation}</p>
             <div className="flex gap-2 mt-4">
                <Button size="sm" className="w-full" onClick={() => executeTransaction()} disabled={isExplaining}>
                   Proceed
                </Button>
                <Button size="sm" variant="outline" className="w-full" onClick={handleExplainMore} disabled={isExplaining}>
                   {isExplaining ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Explain More'}
                </Button>
             </div>
          </div>
        ),
        duration: 20000,
        id: "intent-explanation",
      });
    } catch (err: any) {
      sonnerToast.error("Explanation Failed", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const executeTransaction = async () => {
    setIsLoading(true)
    sonnerToast.dismiss("intent-explanation"); // Dismiss the explanation toast

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (onSubmit) {
      onSubmit(intent)
      return
    }

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
    
    if (mode === 'learner') {
      handleExplain();
    } else {
      executeTransaction();
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
          <div className="mode-switch-container">
             <BrainCircuit className="mode-switch-icon" />
             <Label
                htmlFor="mode-switch"
                className={`mode-label ${mode === 'learner' ? 'learner' : 'pro'}`}
             >
                Learner Mode
             </Label>
             <Switch
                id="mode-switch"
                checked={mode === 'learner'}
                onCheckedChange={(checked) => setMode(checked ? 'learner' : 'pro')}
                className="mode-switch"
             />
          </div>
        </div>
      </div>
    </form>
  )
}
