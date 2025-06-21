"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Zap, Bitcoin, DollarSign, Activity } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Optimization",
      description:
        "Our Gemini AI continuously monitors Core DeFi protocols to maximize your stCORE yields automatically.",
      skeleton: <SkeletonOne />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-r border-gray-800/50",
    },
    {
      title: "Secure CORE Staking",
      description: "Stake your CORE tokens across multiple Core protocols while maintaining full custody and control.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 border-gray-800/50",
    },
    {
      title: "Real-time Analytics",
      description: "Track your portfolio performance with live data and AI-powered insights.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r border-gray-800/50",
    },
    {
      title: "Instant Liquidity",
      description:
        "Borrow against your Bitcoin without selling. Access USDC liquidity while keeping your BTC exposure.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ]

  return (
    <div className="relative z-20 py-20 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
          Built for Web3 Maximalists
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-gray-400 text-center font-normal">
          From staking to borrowing, SatsFi provides everything you need to maximize your Web3 assets' potential while
          maintaining full control and security.
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-2xl border-gray-800/50 glass-card">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  return <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>{children}</div>
}

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug gradient-text">
      {children}
    </p>
  )
}

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-gray-400 font-normal",
        "text-left max-w-sm mx-0 md:text-sm my-2",
      )}
    >
      {children}
    </p>
  )
}

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto glass-card shadow-2xl group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-4">
          {/* AI Dashboard Mockup */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">AI Optimizer</span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Babylon Protocol</span>
              <span className="text-green-400 font-mono">7.2% APY</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">stCORE Vault</span>
              <span className="text-green-400 font-mono">6.1% APY</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Pell Network</span>
              <span className="text-green-400 font-mono">5.7% APY</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-lg">
            <div className="text-orange-300 text-sm">AI Recommendation</div>
            <div className="text-white text-sm">Move 0.2 BTC to Babylon for +1.1% yield</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-gray-950 via-transparent to-transparent w-full pointer-events-none" />
    </div>
  )
}

export const SkeletonTwo = () => {
  const protocols = [
    { name: "Babylon", logo: "B", color: "from-orange-500 to-red-500", apy: "7.2%" },
    { name: "stCORE", logo: "sC", color: "from-blue-500 to-cyan-500", apy: "6.1%" },
    { name: "Pell", logo: "P", color: "from-purple-500 to-pink-500", apy: "5.7%" },
    { name: "B14G", logo: "B14", color: "from-green-500 to-emerald-500", apy: "8.3%" },
    { name: "Aave", logo: "A", color: "from-indigo-500 to-purple-500", apy: "4.8%" },
  ]

  const cardVariants = {
    whileHover: {
      scale: 1.05,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.05,
      rotate: 0,
      zIndex: 100,
    },
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-8 gap-6 h-full overflow-hidden">
      <div className="flex flex-row -ml-10">
        {protocols.slice(0, 3).map((protocol, idx) => (
          <motion.div
            variants={cardVariants}
            key={"protocols-first" + idx}
            style={{
              rotate: Math.random() * 10 - 5,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-3 glass-card border border-gray-700/50 shrink-0 overflow-hidden"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-r ${protocol.color} rounded-lg flex items-center justify-center mb-2`}
            >
              <span className="text-white font-bold text-sm">{protocol.logo}</span>
            </div>
            <div className="text-white text-sm font-semibold">{protocol.name}</div>
            <div className="text-green-400 text-xs font-mono">{protocol.apy}</div>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {protocols.slice(2).map((protocol, idx) => (
          <motion.div
            key={"protocols-second" + idx}
            style={{
              rotate: Math.random() * 10 - 5,
            }}
            variants={cardVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-3 glass-card border border-gray-700/50 shrink-0 overflow-hidden"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-r ${protocol.color} rounded-lg flex items-center justify-center mb-2`}
            >
              <span className="text-white font-bold text-sm">{protocol.logo}</span>
            </div>
            <div className="text-white text-sm font-semibold">{protocol.name}</div>
            <div className="text-green-400 text-xs font-mono">{protocol.apy}</div>
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-gray-950 to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-gray-950 to-transparent h-full pointer-events-none" />
    </div>
  )
}

export const SkeletonThree = () => {
  return (
    <div className="relative flex gap-10 h-full group/chart">
      <div className="w-full mx-auto bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-4 relative p-4">
          {/* Chart Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">Portfolio Performance</span>
            </div>
            <div className="text-green-400 font-mono text-sm">+12.3%</div>
          </div>

          {/* Mock Chart */}
          <div className="flex-1 relative">
            <svg className="w-full h-full" viewBox="0 0 300 150">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,120 Q50,100 100,80 T200,60 T300,40"
                stroke="#f97316"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <path d="M0,120 Q50,100 100,80 T200,60 T300,40 L300,150 L0,150 Z" fill="url(#chartGradient)" />
            </svg>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-white font-mono text-lg">$47.5K</div>
              <div className="text-gray-400 text-xs">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-mono text-lg">6.1%</div>
              <div className="text-gray-400 text-xs">Avg APY</div>
            </div>
            <div className="text-center">
              <div className="text-orange-400 font-mono text-lg">$5.32</div>
              <div className="text-gray-400 text-xs">Daily Yield</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center relative bg-transparent mt-10">
      <div className="glass-card p-6 rounded-2xl max-w-sm mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
            <Bitcoin className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">Bitcoin Collateral</div>
            <div className="text-gray-400 text-sm">0.5 BTC</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Available to Borrow</span>
            <span className="text-white font-mono">$21,250</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Current LTV</span>
            <span className="text-green-400 font-mono">65%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Interest Rate</span>
            <span className="text-blue-400 font-mono">3.2%</span>
          </div>
        </div>

        <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-200">
          <DollarSign className="w-4 h-4 inline mr-2" />
          Borrow USDC
        </button>
      </div>
    </div>
  )
}
