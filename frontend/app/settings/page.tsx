"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import { Check, X, Bell, DollarSign, Globe, Shield, Download, Trash2, User, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const [civicPassStatus, setCivicPassStatus] = useState(true)
  const [aiAlerts, setAiAlerts] = useState(true)
  const [fiatDisplay, setFiatDisplay] = useState("USD")
  const [currencyUnit, setCurrencyUnit] = useState("BTC")
  const { toast } = useToast()

  const handleToggle = (setting: string, value: boolean) => {
    toast({
      title: "Settings Updated",
      description: `${setting} has been ${value ? "enabled" : "disabled"}`,
      variant: "success",
    })
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h1 className="text-4xl font-bold gradient-text mb-8">Settings</h1>

        {/* Civic Pass Status */}
        <div className="glass-card neon-border p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Civic Pass Status</h3>
                <p className="text-gray-400">Identity verification for enhanced features and higher limits</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {civicPassStatus ? (
                <>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <Check className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-semibold">Verified</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <X className="w-6 h-6 text-red-400" />
                  <span className="text-red-400 font-semibold">Not Verified</span>
                </>
              )}
            </div>
          </div>

          {!civicPassStatus && (
            <button className="btn-primary mt-6">
              <Lock className="w-4 h-4 mr-2" />
              Verify with Civic Pass
            </button>
          )}
        </div>

        {/* Preferences */}
        <div className="glass-card neon-border p-8 mb-8">
          <h3 className="text-2xl font-bold gradient-text mb-8 flex items-center gap-3">
            <User className="w-6 h-6" />
            Preferences
          </h3>

          <div className="space-y-8">
            {/* AI Alerts Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">AI Alerts</h4>
                  <p className="text-sm text-gray-400">Receive Gemini-powered recommendations and market insights</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAiAlerts(!aiAlerts)
                  handleToggle("AI Alerts", !aiAlerts)
                }}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                  aiAlerts ? "bg-gradient-to-r from-orange-500 to-orange-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                    aiAlerts ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Fiat Display */}
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Fiat Display</h4>
                  <p className="text-sm text-gray-400">Primary fiat currency for portfolio display</p>
                </div>
              </div>
              <select
                value={fiatDisplay}
                onChange={(e) => setFiatDisplay(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            {/* Currency Unit */}
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Currency Unit</h4>
                  <p className="text-sm text-gray-400">Primary unit for cryptocurrency display</p>
                </div>
              </div>
              <select
                value={currencyUnit}
                onChange={(e) => setCurrencyUnit(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="BTC">BTC</option>
                <option value="sats">Satoshis</option>
                <option value="mBTC">mBTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="glass-card neon-border p-8">
          <h3 className="text-2xl font-bold gradient-text mb-8">Account Management</h3>
          <div className="space-y-4">
            <button className="btn-secondary w-full flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300">
              <Download className="w-5 h-5" />
              Export Transaction History
            </button>
            <button className="btn-secondary w-full flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300">
              <Download className="w-5 h-5" />
              Download Account Data
            </button>
            <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 border border-red-500/30">
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
