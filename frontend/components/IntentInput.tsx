"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Send, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface IntentInputProps {
  placeholder?: string
  onSubmit?: (intent: string) => void
  className?: string
  defaultValue?: string
}

export default function IntentInput({
  placeholder = "e.g., Max yield on 0.5 BTC",
  onSubmit,
  className = "",
  defaultValue = "",
}: IntentInputProps) {
  const [intent, setIntent] = useState(defaultValue)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!intent.trim() || isLoading) return

    setIsLoading(true)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/intent/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'An unexpected error occurred.')
      }

      toast({
        title: "Intent Sent!",
        description: data.message || "Your transaction is being processed.",
        variant: "success",
      })
      
      setIntent("")
      onSubmit?.(intent)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to process intent.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!intent.trim() || isLoading}
              className="btn-primary mr-2 p-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
