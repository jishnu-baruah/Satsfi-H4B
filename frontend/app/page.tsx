"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import IntentInput from "@/components/IntentInput"
import FeaturesSection from "@/components/ui/features-section"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { useUser } from "@civic/auth/react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, signIn } = useUser()
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const stickyNavRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleSignIn = () => {
    scrollToHero()
    setTimeout(() => signIn(), 100)
  }

  const handleDashboardClick = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      handleSignIn()
    }
  }

  const handleIntentSubmit = (intent: string) => {
    console.log("Intent submitted:", intent)
    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  const handleTryDemo = () => {
    scrollToHero()
    setShowDemo(true)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 morphing-bg"></div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(180, 255, 60, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180, 255, 60, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Sticky Navigation */}
      <header
        ref={stickyNavRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isSticky ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148" alt="Satsfi Logo" className="w-12 h-12 object-contain" />
              <Link
                href="/"
                className="text-2xl font-bold gradient-text-subtle hover:scale-105 transition-transform duration-300"
              >
                SatsFi
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDashboardClick}
                className="hidden sm:block text-gray-400 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/5"
              >
                Dashboard
              </button>
              <button onClick={handleSignIn} className="btn-landing">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#B4FF3C]/5 via-[#4FFF7B]/5 to-[#B4FF3C]/5 rounded-3xl blur-3xl opacity-60 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#B4FF3C]/3 to-transparent rounded-3xl" />

        <div className="relative z-10">
          <div className="mb-8 slide-up">
            <div
              className="inline-flex items-center gap-2 px-6 py-3 border rounded-full text-sm mb-8 pulse-subtle"
              style={{
                backgroundColor: "rgba(180, 255, 60, 0.05)",
                borderColor: "rgba(180, 255, 60, 0.2)",
                color: "#B4FF3C",
                boxShadow: "0 0 20px rgba(180, 255, 60, 0.1)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Onchain Banking
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight slide-up slide-up-delay-1">
            <span className="gradient-text block mb-4">On-chain Banking</span>
            <span className="text-white block mb-4">Starts with Your</span>
            <span className="gradient-text block">Intent</span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed slide-up slide-up-delay-2"
            style={{ color: "#9CA3AF" }}
          >
            <span className="text-white font-semibold">Stake. Borrow. Earn.</span> All in one sentence.
            <br />
            <span className="text-gray-500">Let AI optimize your Onchain Banking strategy automatically.</span>
          </p>

          <div className="max-w-3xl mx-auto mb-12 slide-up slide-up-delay-3">
            <IntentInput
              placeholder={showDemo ? "Borrow 2,000 CORE without selling stCORE" : "e.g., Max yield on 0.5 stCORE"}
              defaultValue={showDemo ? "Borrow 2,000 CORE without selling stCORE" : ""}
              onSubmit={handleIntentSubmit}
              className="mb-8"
              onSignIn={handleSignIn}
            />
          </div>

          <button
            onClick={handleTryDemo}
            className="group font-semibold flex items-center gap-3 mx-auto mb-20 transition-all duration-500 px-8 py-4 rounded-xl border border-transparent hover:scale-105 card-hover-effect"
            style={{
              color: "#B4FF3C",
              backgroundColor: "rgba(180, 255, 60, 0.05)",
              borderColor: "rgba(180, 255, 60, 0.2)",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.color = "#4FFF7B"
              target.style.backgroundColor = "rgba(180, 255, 60, 0.1)"
              target.style.boxShadow = "0 10px 30px rgba(180, 255, 60, 0.2)"
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.color = "#B4FF3C"
              target.style.backgroundColor = "rgba(180, 255, 60, 0.05)"
              target.style.boxShadow = "none"
            }}
          >
            <Sparkles className="w-5 h-5 group-hover:animate-spin transition-transform duration-300" />
            Try Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-white font-bold text-4xl mb-6 gradient-text-subtle">How It Works</h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: "#9CA3AF" }}>
            Three simple steps to start earning with your Onchain Assets
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((step, index) => {
            const titles = ["Connect Wallet", "Set Your Intent", "Earn Automatically"]
            const descriptions = [
              "Securely connect your wallet and maintain full custody of your assets",
              "Tell our AI what you want to achieve in plain English - no complex DeFi knowledge required",
              "Our AI optimizes your strategy across protocols and manages everything automatically",
            ]
            const features = ["✓ Non-custodial Security", "✓ AI-Powered Intelligence", "✓ Automated Optimization"]

            return (
              <div
                key={step}
                className={`glass-card p-8 text-center card-hover-effect group ${
                  index === 0 ? "floating-animation" : index === 1 ? "floating-delayed" : "floating-slow"
                }`}
              >
                <div className="relative mb-8">
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-lg relative overflow-hidden"
                    style={{
                      background:
                        step % 2 === 1
                          ? "linear-gradient(135deg, #B4FF3C, #4FFF7B)"
                          : "linear-gradient(135deg, #4FFF7B, #B4FF3C)",
                      boxShadow: "0 8px 20px rgba(180, 255, 60, 0.2)",
                    }}
                  >
                    <span className="text-3xl font-bold text-black relative z-10">{step}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 pulse-subtle"
                    style={{ backgroundColor: "rgba(180, 255, 60, 0.6)" }}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#B4FF3C] transition-colors duration-300">
                  {titles[index]}
                </h3>
                <p
                  className="leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300"
                  style={{ color: "#9CA3AF" }}
                >
                  {descriptions[index]}
                </p>
                <div
                  className="opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 border rounded-lg transform translate-y-2 group-hover:translate-y-0"
                  style={{
                    backgroundColor: "rgba(180, 255, 60, 0.05)",
                    borderColor: "rgba(180, 255, 60, 0.2)",
                  }}
                >
                  <div className="text-sm font-medium" style={{ color: "rgba(180, 255, 60, 0.9)" }}>
                    {features[index]}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden md:flex justify-center items-center mt-16 space-x-8">
          <div
            className="w-20 h-1 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(180, 255, 60, 0.4), rgba(79, 255, 123, 0.4))",
            }}
          />
          <div className="w-3 h-3 rounded-full pulse-subtle" style={{ backgroundColor: "rgba(180, 255, 60, 0.6)" }} />
          <div
            className="w-20 h-1 rounded-full"
            style={{
              background: "linear-gradient(90deg, rgba(79, 255, 123, 0.4), rgba(180, 255, 60, 0.4), transparent)",
            }}
          />
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="glass-card neon-border p-12 max-w-4xl mx-auto card-hover-effect">
          <h2 className="text-white font-bold text-4xl mb-6 gradient-text-subtle">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
            Join thousands of users who are already earning passive income with their Web3 assets through AI-powered DeFi
            strategies.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={handleTryDemo}
              className="btn-landing"
            >
              Launch App & Start Earning
            </button>
            <button
              onClick={handleDashboardClick}
              className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
            >
              Go to App
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}