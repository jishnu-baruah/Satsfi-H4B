"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Sparkles, Bot, User, Minimize2, Maximize2, Trash2 } from "lucide-react"
import { useUser } from "@civic/auth/react"
import { useAccount } from "wagmi"
import { API_URL } from "@/lib/config"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface GeminiChatbotProps {
  className?: string
}

export default function GeminiChatbot({ className = "" }: GeminiChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant powered by Gemini. How can I help you optimize your DeFi portfolio today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { address } = useAccount()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleClearChat = async () => {
    if (!address) return;

    try {
      const response = await fetch(`${API_URL}/chatbot/history`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userAddress: address }),
      });

      if (response.ok) {
        setMessages([]); // Clear messages from the UI
      } else {
        console.error("Failed to clear chat history on the server.");
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch(`${API_URL}/chatbot/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          userAddress: address,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get a response from the AI.")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <MessageCircle className="w-6 h-6 relative z-10" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div
          className={`glass-card border-2 border-blue-500/20 shadow-2xl transition-all duration-500 transform ${
            isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h3 className="font-semibold text-white">Gemini AI Assistant</h3>
                <p className="text-xs text-gray-400">Online • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                aria-label="Clear chat history"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-gray-400 hover:text-white" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-gray-400 hover:text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[480px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-orange-500 to-orange-600"
                            : "bg-gradient-to-r from-blue-500 to-purple-600"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`relative px-4 py-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-100 border-cyan-400/50 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 hover:border-cyan-400/70"
                            : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-100 border-purple-400/50 shadow-lg shadow-purple-400/25 hover:shadow-purple-400/40 hover:border-purple-400/70"
                        }`}
                      >
                        <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                        <p
                          className={`text-xs mt-1 font-mono ${
                            message.sender === "user" ? "text-cyan-300/80" : "text-purple-300/80"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>

                        {/* Futuristic Message tail with neon glow */}
                        <div
                          className={`absolute top-3 w-0 h-0 ${
                            message.sender === "user"
                              ? "right-[-8px] border-l-[8px] border-l-cyan-400/60 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-[0_0_4px_rgba(34,211,238,0.5)]"
                              : "left-[-8px] border-r-[8px] border-r-purple-400/60 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-[0_0_4px_rgba(168,85,247,0.5)]"
                          }`}
                        ></div>

                        {/* Neon accent line */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-[1px] rounded-full ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
                              : "bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-800/80 border border-gray-700/50 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-700/50 bg-gray-900/20">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about your portfolio..."
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      disabled={isTyping}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Sparkles className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleSendMessage(e)
                    }}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setInputValue("Analyze my portfolio performance")
                    }}
                    className="text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200 border border-gray-700/30 hover:border-gray-600/50"
                  >
                    📊 Analyze Portfolio
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setInputValue("Suggest yield optimization strategies")
                    }}
                    className="text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200 border border-gray-700/30 hover:border-gray-600/50"
                  >
                    🚀 Optimize Yield
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}