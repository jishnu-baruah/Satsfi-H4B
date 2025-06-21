import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Sparkles, Bot, User, Minimize2, Maximize2, Trash2 } from "lucide-react"
import { useAccount } from "wagmi"
import { API_URL } from "@/lib/config"

interface Message {
  id: string
  content: string
  role: "user" | "model"
}

const GeminiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { address } = useAccount()
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

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
    if (!input.trim() || !address) return

    const newMessage: Message = { id: Date.now().toString(), content: input, role: "user" }
    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch(`${API_URL}/chatbot/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input, userAddress: address }),
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()
      if (data.success) {
        const aiMessage: Message = { id: Date.now().toString() + 'ai', content: data.reply, role: 'model' };
        setMessages(prev => [...prev, aiMessage]);
      } else {
         const errorMessage: Message = { id: Date.now().toString() + 'ai', content: "Sorry, I couldn't get a response. Please try again.", role: 'model' };
         setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error)
       const errorMessage: Message = { id: Date.now().toString() + 'ai', content: "There was an error connecting to the assistant.", role: 'model' };
       setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110 z-50"
        aria-label="Open chatbot"
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
      </button>

      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-full max-w-md bg-white dark:bg-black rounded-xl shadow-2xl flex flex-col transition-all duration-300 z-50 ${isMinimized ? 'h-16' : 'h-[70vh]'}`}>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              <h3 className="font-bold text-lg">SatsFi Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
               <button
                onClick={handleClearChat}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Clear chat history"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                   {messages.map((message) => (
                    <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'model' && <Bot className="h-8 w-8 bg-purple-500 text-white rounded-full p-1.5 flex-shrink-0" />}
                      <div className={`px-4 py-2 rounded-2xl max-w-sm ${message.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 rounded-bl-none'}`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.role === 'user' && <User className="h-8 w-8 bg-gray-300 text-gray-700 rounded-full p-1.5 flex-shrink-0" />}
                    </div>
                  ))}
                  {isTyping && (
                     <div className="flex items-start gap-3 justify-start">
                        <Bot className="h-8 w-8 bg-purple-500 text-white rounded-full p-1.5 flex-shrink-0" />
                        <div className="px-4 py-2 rounded-2xl max-w-sm bg-gray-100 dark:bg-gray-800 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-0"></span>
                                <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-150"></span>
                                <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-300"></span>
                            </div>
                        </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="p-4 border-t dark:border-gray-800">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about your portfolio..."
                    className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button type="submit" className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 disabled:bg-purple-300" disabled={!input.trim()}>
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default GeminiChatbot