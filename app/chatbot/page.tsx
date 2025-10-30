"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, BookOpen, Heart, Star, Sparkles, Loader2, ArrowLeft, Plus, MessageSquare, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export default function ISKCONBotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [apiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "https://aravsaxena884-iskconChatbot.hf.space")

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const response = await fetch("/api/chat/sessions")
      if (response.status === 401) {
        router.push("/auth/login")
        return
      }
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error("Error loading sessions:", error)
    }
  }

  const createNewSession = async () => {
    try {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      })

      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      const data = await response.json()
      setCurrentSessionId(data.session.id)
      setMessages([])
      setStreamingText("")
      setSessions([data.session, ...sessions])
      addWelcomeMessage()
    } catch (error) {
      console.error("Error creating session:", error)
    }
  }

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`)
      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      const data = await response.json()
      const loadedMessages = data.messages.map((msg: any) => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date(msg.created_at),
      }))
      setMessages(loadedMessages)
      setCurrentSessionId(sessionId)
      setStreamingText("")
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      await fetch(`/api/chat/sessions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
      setSessions(sessions.filter((s) => s.id !== sessionId))
      if (currentSessionId === sessionId) {
        setMessages([])
        setCurrentSessionId(null)
      }
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText])

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: "welcome",
      text: "Hare Krishna! I am here to help you with any spiritual questions based on the teachings of Srila Prabhupada and Vedic wisdom. Please feel free to ask about philosophy, practice, scriptures, or any aspect of Krishna consciousness.",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  const exampleQuestions = [
    "What is the purpose of human life according to Vedic scriptures?",
    "How can I develop devotion to Krishna in daily life?",
    "What is the role of a spiritual master in Krishna consciousness?",
    "How do we understand karma and its effects?",
    "What is the difference between the soul and the body?",
    "How can one balance material responsibilities with spiritual practice?",
    "What is the significance of chanting Hare Krishna?",
    "How does one surrender to Krishna while living in the material world?",
  ]

  const streamText = (text: string, messageId: string) => {
    const sentences = text.split(/(?<=[.!?])\s+/).filter((sentence) => sentence.trim())
    let currentIndex = 0
    let accumulatedText = ""

    const streamInterval = setInterval(() => {
      if (currentIndex < sentences.length) {
        accumulatedText += (accumulatedText ? " " : "") + sentences[currentIndex]
        setStreamingText(accumulatedText)
        currentIndex++
      } else {
        clearInterval(streamInterval)
        const botMessage: Message = {
          id: messageId,
          text: accumulatedText,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setStreamingText("")
        setIsLoading(false)

        if (currentSessionId) {
          fetch("/api/chat/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: currentSessionId,
              text: accumulatedText,
              sender: "bot",
            }),
          }).catch(console.error)
        }
      }
    }, 800)
  }

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim() || !currentSessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsLoading(true)

    try {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          text: text.trim(),
          sender: "user",
        }),
      })
    } catch (error) {
      console.error("Error saving user message:", error)
    }

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        const messageId = (Date.now() + 1).toString()
        streamText(data.answer, messageId)
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an error. Please try again later. Hare Krishna.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const handleExampleClick = (question: string) => {
    setInputText(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-yellow-200 to-blue-300 flex">
      <div
        className={`fixed md:relative w-64 bg-white/95 backdrop-blur-sm border-r-2 border-orange-200 h-screen overflow-y-auto transition-transform duration-300 z-40 ${
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b-2 border-orange-200">
          <button
            onClick={createNewSession}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl px-4 py-2 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-bold text-orange-800 mb-3">Chat History</h3>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                  currentSessionId === session.id
                    ? "bg-orange-200 border-2 border-orange-400"
                    : "bg-orange-50 border-2 border-orange-100 hover:bg-orange-100"
                }`}
              >
                <button
                  onClick={() => {
                    loadSessionMessages(session.id)
                    setShowSidebar(false)
                  }}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-800 truncate">{session.title}</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(session.updated_at).toLocaleDateString()}
                  </span>
                </button>
                <button
                  onClick={() => deleteSession(session.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-200 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 text-8xl">🕉️</div>
          <div className="absolute top-40 right-32 text-6xl">🪷</div>
          <div className="absolute bottom-32 left-16 text-7xl">🕉️</div>
          <div className="absolute bottom-20 right-20 text-5xl">🪷</div>
          <div className="absolute top-1/2 left-1/3 text-6xl">🕉️</div>
          <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-orange-200 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-blue-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl flex flex-col h-screen">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden flex items-center space-x-2 text-orange-700 hover:text-orange-800 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>History</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-orange-700 hover:text-orange-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white p-4 rounded-full shadow-lg mr-4 border-2 border-orange-300">
                <span className="text-4xl">🕉️</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                  ISKCON Spiritual Guide
                </h1>
                <p className="text-lg text-orange-700 font-medium">Vedic Wisdom for Modern Life</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-6 text-orange-600">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium">Scriptural Guidance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Devotional Practice</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">Spiritual Growth</span>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-200 flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-orange-50/80 to-yellow-50/80">
              {messages.length === 0 && !currentSessionId ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Start a new chat to begin your spiritual journey</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-6 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-lg ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white ml-12"
                            : "bg-white/90 backdrop-blur-sm border-2 border-orange-200 text-gray-800 mr-12"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.sender === "bot" && (
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 text-sm">🙏</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-semibold mb-1 text-sm">
                              {message.sender === "user" ? "You" : "Spiritual Guide"}
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {streamingText && (
                    <div className="flex justify-start mb-6">
                      <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl px-6 py-4 shadow-lg max-w-[80%]">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 text-sm">🙏</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold mb-1 text-sm text-gray-800">Spiritual Guide</div>
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                              {streamingText}
                              <span className="inline-block w-2 h-5 bg-orange-500 ml-1 animate-pulse"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isLoading && !streamingText && (
                    <div className="flex justify-start mb-6">
                      <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 rounded-2xl px-6 py-4 shadow-lg max-w-[80%]">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />
                          </div>
                          <div>
                            <div className="font-semibold mb-1 text-sm text-gray-800">Spiritual Guide</div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Sparkles className="w-4 h-4 animate-pulse" />
                              <span className="italic">Contemplating with divine wisdom...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white/95 backdrop-blur-sm border-t-2 border-orange-200 p-6">
              {!currentSessionId ? (
                <button
                  onClick={createNewSession}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
                >
                  Start New Chat
                </button>
              ) : (
                <div className="flex space-x-4">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your spiritual question... (Press Enter to send)"
                    className="flex-1 resize-none border-2 border-orange-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 min-h-[60px] max-h-[120px] bg-white/90"
                    disabled={isLoading}
                    rows={2}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputText.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span className="hidden md:inline">Ask</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Example Questions */}
          {currentSessionId && messages.length <= 1 && (
            <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                Example Spiritual Questions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="text-left p-4 bg-gradient-to-r from-orange-100/80 to-yellow-100/80 rounded-xl hover:from-orange-200/80 hover:to-yellow-200/80 transition-all duration-200 border border-orange-200 hover:border-orange-300 shadow-sm hover:shadow-md transform hover:-translate-y-1 backdrop-blur-sm"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-orange-500 mt-1">💡</span>
                      <span className="text-gray-700 text-sm font-medium leading-relaxed">{question}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-orange-700 font-medium mb-2">🕉️ Hare Krishna Hare Krishna Krishna Krishna Hare Hare 🕉️</p>
            <p className="text-orange-600 text-sm">Based on the teachings of Srila Prabhupada and Vedic scriptures</p>
          </div>
        </div>
      </div>
    </div>
  )
}
