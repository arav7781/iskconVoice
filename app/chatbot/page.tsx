"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, BookOpen, Heart, Star, Sparkles, Loader2, ArrowLeft } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

// Markdown parser with LaTeX support
const parseMarkdown = (text: string) => {
  let html = text
    // LaTeX inline math
    .replace(/\$([^$]+)\$/g, '<span class="math-inline bg-yellow-100 px-1 rounded font-mono text-sm">$1</span>')
    // LaTeX display math
    .replace(/\$\$([^$]+)\$\$/g, '<div class="math-display bg-yellow-50 p-2 my-2 rounded border-l-4 border-yellow-400 font-mono text-center">$$1$$</div>')
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-orange-700 mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-orange-700 mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-orange-700 mt-4 mb-2">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-orange-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded font-mono text-sm">$1</code>')
    // Lists
    .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')

  return html
}

const MarkdownContent = ({ content }: { content: string }) => {
  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}

const PeacockFeatherIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" className="text-blue-600">
      <path
        fill="currentColor"
        d="M12 2c-2 0-3.5 1-4.5 2.5C6.5 6 6 8 6.5 10c.5 2 2 3.5 4 4 .5.2 1 .3 1.5.3s1-.1 1.5-.3c2-.5 3.5-2 4-4 .5-2 0-4-.5-5.5C16 3 14.5 2 12 2z"
      />
      <path
        fill="currentColor"
        d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        opacity="0.7"
      />
      <rect x="11.5" y="14" width="1" height="8" fill="currentColor" />
    </svg>
  </div>
)

const StreamingMessage = ({ text }: { text: string }) => (
  <div className="flex justify-start mb-6">
    <div className="bg-white/90 backdrop-blur-sm border-2 border-teal-200 rounded-2xl px-6 py-4 shadow-lg max-w-[80%]">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
          <PeacockFeatherIcon className="animate-bounce" />
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1 text-sm text-gray-800 flex items-center">
            Spiritual Guide
            <PeacockFeatherIcon className="ml-2 animate-pulse" />
          </div>
          <div className="leading-relaxed text-gray-800">
            <MarkdownContent content={text} />
            <span className="inline-block w-2 h-5 bg-teal-500 ml-1 animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const LoadingIndicator = () => (
  <div className="flex justify-start mb-6">
    <div className="bg-white/90 backdrop-blur-sm border-2 border-teal-200 rounded-2xl px-6 py-4 shadow-lg max-w-[80%]">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
          <PeacockFeatherIcon className="animate-spin" />
        </div>
        <div>
          <div className="font-semibold mb-1 text-sm text-gray-800">Spiritual Guide</div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="italic">Contemplating with divine wisdom...</span>
            <PeacockFeatherIcon className="animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

const ChatMessage = ({ message }: { message: Message }) => (
  <div className={`flex mb-6 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-lg ${
        message.sender === "user"
          ? "bg-gradient-to-r from-blue-500 to-teal-600 text-white ml-12"
          : "bg-white/90 backdrop-blur-sm border-2 border-teal-200 text-gray-800 mr-12"
      }`}
    >
      <div className="flex items-start space-x-3">
        {message.sender === "bot" && (
          <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
            <PeacockFeatherIcon />
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold mb-1 text-sm">{message.sender === "user" ? "You" : "Spiritual Guide"}</div>
          <div className="leading-relaxed">
            {message.sender === "bot" ? (
              <MarkdownContent content={message.text} />
            ) : (
              message.text
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default function ISKCONBotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [apiUrl] = useState("https://aravsaxena884-iskconChatbot.hf.space")

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, streamingText])

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      text: "**Hare Krishna!** 🙏\n\nI am here to help you with any spiritual questions based on the teachings of **Srila Prabhupada** and *Vedic wisdom*. Please feel free to ask about:\n\n- Philosophy and scriptures\n- Devotional practice\n- Krishna consciousness\n- Spiritual growth\n\nHow may I assist you on your spiritual journey?",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [])

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
    const words = text.split(' ')
    let currentIndex = 0
    let accumulatedText = ""

    const streamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        accumulatedText += (accumulatedText ? " " : "") + words[currentIndex]
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
      }
    }, 100) // Faster streaming for better UX
  }

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return

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
        text: "I apologize, but I encountered an error. Please try again later. **Hare Krishna.**",
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
    <div className="min-h-screen bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600">
      <style jsx global>{`
        @keyframes feather-write {
          0% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(2px) rotate(-2deg); }
          50% { transform: translateX(-1px) rotate(1deg); }
          75% { transform: translateX(1px) rotate(-1deg); }
          100% { transform: translateX(0) rotate(0deg); }
        }
        
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(2px); }
          50% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-2px); }
        }
        
        .animate-feather-write {
          animation: feather-write 0.8s ease-in-out infinite;
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 text-8xl">🕉️</div>
        <div className="absolute top-40 right-32 text-6xl">🪷</div>
        <div className="absolute bottom-32 left-16 text-7xl">🕉️</div>
        <div className="absolute bottom-20 right-20 text-5xl">🪷</div>
        <div className="absolute top-1/2 left-1/3 text-6xl">🕉️</div>
        <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-teal-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-emerald-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg mr-4 border-2 border-teal-300">
              <span className="text-4xl">🕉️</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                ISKCON Spiritual Guide
              </h1>
              <p className="text-lg text-blue-200 font-medium">Vedic Wisdom for Modern Life</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-6 text-blue-200">
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

        {/* Main Chat Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4 border-teal-200">
          {/* Chat Messages */}
          <div ref={chatContainerRef} className="h-96 md:h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-teal-50/80 to-emerald-50/80">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {streamingText && <StreamingMessage text={streamingText} />}

            {isLoading && !streamingText && <LoadingIndicator />}
          </div>

          {/* Input Area */}
          <div className="bg-white/95 backdrop-blur-sm border-t-2 border-teal-200 p-6">
            <div className="flex space-x-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your spiritual question... (Press Enter to send)"
                className="flex-1 resize-none border-2 border-teal-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-teal-200 focus:border-teal-400 transition-all duration-200 min-h-[60px] max-h-[120px] bg-white/90"
                disabled={isLoading}
                rows={2}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-600 text-white rounded-2xl hover:from-blue-600 hover:to-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span className="hidden md:inline">Ask</span>
              </button>
            </div>
          </div>
        </div>

        {/* Example Questions */}
        <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-teal-200">
          <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            Example Spiritual Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(question)}
                className="text-left p-4 bg-gradient-to-r from-teal-100/80 to-emerald-100/80 rounded-xl hover:from-teal-200/80 hover:to-emerald-200/80 transition-all duration-200 border border-teal-200 hover:border-teal-300 shadow-sm hover:shadow-md transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="flex items-start space-x-3">
                  <PeacockFeatherIcon className="mt-1" />
                  <span className="text-gray-700 text-sm font-medium leading-relaxed">{question}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="text-white font-medium mb-2 flex items-center justify-center">
            <PeacockFeatherIcon className="mr-2" />
            🕉️ Hare Krishna Hare Krishna Krishna Krishna Hare Hare 🕉️
            <PeacockFeatherIcon className="ml-2" />
          </div>
          <p className="text-blue-200 text-sm">Based on the teachings of Srila Prabhupada and Vedic scriptures</p>
        </div>
      </div>
    </div>
  )
}