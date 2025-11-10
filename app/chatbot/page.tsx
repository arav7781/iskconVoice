"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Send, BookOpen, Sparkles, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ISKCONBotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [apiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "https://aravsaxena884-iskconChatbot.hf.space")

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText, scrollToBottom])

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      text: "Hare Krishna! I am here to help you with any spiritual questions based on the teachings of Srila Prabhupada and Vedic wisdom. Please feel free to ask about philosophy, practice, scriptures, or any aspect of Krishna consciousness.",
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
    const chunks = text.split(/(?<=[.!?])\s+/).filter((chunk) => chunk.trim())
    let currentIndex = 0
    let accumulatedText = ""

    const streamInterval = setInterval(() => {
      if (currentIndex < chunks.length) {
        accumulatedText += (accumulatedText ? " " : "") + chunks[currentIndex]
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
    }, 300)
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
    <div style={styles.wrapper}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #fef3c7;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fb923c, #f97316);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #ea580c);
        }
      `}</style>

      {/* Header - Fixed */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button
            onClick={() => router.push("/")}
            style={styles.backButton}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#b45309")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#b84c0c")}
          >
            <ArrowLeft style={{ width: "20px", height: "20px", marginRight: "8px" }} />
            <span>Back</span>
          </button>
          <div style={styles.headerTitle}>
            <h1 style={styles.title}>ISKCON Spiritual Guide</h1>
          </div>
          <div style={{ width: "80px" }} />
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Chat Container */}
        <div style={styles.chatContainer}>
          {/* Messages Area */}
          <div ref={messagesContainerRef} style={styles.messagesArea}>
            <div style={styles.messagesContent}>
              {messages.map((message) => (
                <div key={message.id} style={message.sender === "user" ? styles.userMessageRow : styles.botMessageRow}>
                  <div style={message.sender === "user" ? styles.userMessageBubble : styles.botMessageBubble}>
                    <div style={styles.messageContentContainer}>
                      {message.sender === "bot" && <div style={styles.avatar}>🙏</div>}
                      <div style={styles.messageTextWrapper}>
                        <div style={styles.messageSender}>{message.sender === "user" ? "You" : "Guide"}</div>
                        <div style={styles.messageText}>{message.text}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming message */}
              {streamingText && (
                <div style={styles.botMessageRow}>
                  <div style={styles.botMessageBubble}>
                    <div style={styles.messageContentContainer}>
                      <div style={styles.avatar}>🙏</div>
                      <div style={styles.messageTextWrapper}>
                        <div style={styles.messageSender}>Guide</div>
                        <div style={styles.messageText}>
                          {streamingText}
                          <span style={styles.cursor}>█</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading state */}
              {isLoading && !streamingText && (
                <div style={styles.botMessageRow}>
                  <div style={styles.botMessageBubble}>
                    <div style={styles.messageContentContainer}>
                      <div style={styles.loaderAvatar}>
                        <Loader2 style={{ width: "14px", height: "14px", animation: "spin 1s linear infinite" }} />
                      </div>
                      <div style={styles.messageTextWrapper}>
                        <div style={styles.messageSender}>Guide</div>
                        <div style={styles.loadingText}>
                          <Sparkles
                            style={{
                              width: "14px",
                              height: "14px",
                              marginRight: "4px",
                              animation: "pulse 1.5s ease-in-out infinite",
                            }}
                          />
                          <span style={{ fontStyle: "italic" }}>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div style={styles.inputArea}>
            <div style={styles.inputContainer}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your spiritual question..."
                style={styles.textarea}
                disabled={isLoading}
                rows={2}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                style={{
                  ...styles.sendButton,
                  opacity: isLoading || !inputText.trim() ? 0.6 : 1,
                  cursor: isLoading || !inputText.trim() ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && inputText.trim()) {
                    e.currentTarget.style.background = "linear-gradient(to right, #dc2626, #b91c1c)"
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 20px 25px rgba(0, 0, 0, 0.2)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(to right, #ea580c, #f97316)"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.1)"
                }}
              >
                {isLoading ? (
                  <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                ) : (
                  <Send style={{ width: "16px", height: "16px" }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Example Questions */}
        <div style={styles.examplesContainer}>
          <h3 style={styles.examplesTitle}>
            <BookOpen style={{ width: "16px", height: "16px", marginRight: "8px" }} />
            Example Questions
          </h3>
          <div style={styles.examplesGrid}>
            {exampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(question)}
                style={styles.exampleButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, rgba(254, 165, 112, 0.8), rgba(253, 224, 112, 0.8))"
                  e.currentTarget.style.borderColor = "#ea580c"
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 12px 16px rgba(0, 0, 0, 0.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, rgba(254, 215, 170, 0.6), rgba(253, 230, 138, 0.6))"
                  e.currentTarget.style.borderColor = "#fed7aa"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.08)"
                }}
              >
                💡 {question.substring(0, 45)}...
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, rgb(254, 156, 62), rgb(253, 224, 71), rgb(96, 165, 250))",
    display: "flex",
    flexDirection: "column" as const,
  },
  header: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "2px solid rgb(254, 215, 170)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  headerContent: {
    maxWidth: "1536px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    color: "#b84c0c",
    transition: "color 0.3s ease",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontSize: "16px",
    fontWeight: "500",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center" as const,
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    background: "linear-gradient(to right, rgb(194, 65, 12), rgb(37, 99, 235))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  mainContent: {
    flex: 1,
    marginTop: "80px",
    paddingBottom: "1rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    maxWidth: "1536px",
    margin: "80px auto 0 auto",
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  chatContainer: {
    flex: 1,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(4px)",
    borderRadius: "16px",
    boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1)",
    border: "2px solid rgb(254, 215, 170)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto" as const,
    background: "linear-gradient(to bottom, rgba(254, 243, 199, 0.5), rgba(254, 230, 138, 0.5))",
    padding: "1.5rem",
  },
  messagesContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  userMessageRow: {
    display: "flex",
    justifyContent: "flex-end",
    animation: "fadeIn 0.3s ease-in",
  },
  botMessageRow: {
    display: "flex",
    justifyContent: "flex-start",
    animation: "fadeIn 0.3s ease-in",
  },
  userMessageBubble: {
    maxWidth: "80%",
    borderRadius: "12px",
    padding: "0.75rem 1rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(to right, rgb(234, 88, 12), rgb(249, 115, 22))",
    color: "white",
  },
  botMessageBubble: {
    maxWidth: "80%",
    borderRadius: "12px",
    padding: "0.75rem 1rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(4px)",
    border: "2px solid rgb(254, 215, 170)",
    color: "rgb(31, 41, 55)",
  },
  messageContentContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
  },
  avatar: {
    width: "28px",
    height: "28px",
    background: "rgb(254, 243, 199)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "14px",
    marginTop: "2px",
  },
  loaderAvatar: {
    width: "28px",
    height: "28px",
    background: "rgb(254, 243, 199)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    color: "rgb(234, 88, 12)",
    marginTop: "2px",
  },
  messageTextWrapper: {
    flex: 1,
    minWidth: 0,
  },
  messageSender: {
    fontWeight: "600",
    fontSize: "12px",
    marginBottom: "4px",
    opacity: 0.75,
  },
  messageText: {
    fontSize: "14px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
  },
  cursor: {
    display: "inline-block",
    width: "2px",
    height: "16px",
    background: "rgb(234, 88, 12)",
    marginLeft: "4px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  loadingText: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    color: "rgb(75, 85, 99)",
  },
  inputArea: {
    background: "rgba(255, 255, 255, 0.95)",
    borderTop: "2px solid rgb(254, 215, 170)",
    padding: "1rem",
  },
  inputContainer: {
    display: "flex",
    gap: "0.5rem",
  },
  textarea: {
    flex: 1,
    resize: "none" as const,
    border: "2px solid rgb(254, 165, 112)",
    borderRadius: "8px",
    padding: "0.5rem 1rem",
    fontSize: "14px",
    fontFamily: "inherit",
    minHeight: "44px",
    maxHeight: "120px",
    background: "rgba(255, 255, 255, 0.9)",
    color: "rgb(31, 41, 55)",
    outline: "none",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  sendButton: {
    padding: "0.5rem 1rem",
    background: "linear-gradient(to right, rgb(234, 88, 12), rgb(249, 115, 22))",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    fontSize: "14px",
  },
  examplesContainer: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(4px)",
    borderRadius: "12px",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.08)",
    padding: "1rem",
    border: "2px solid rgb(254, 215, 170)",
    maxHeight: "140px",
    overflowY: "auto" as const,
  },
  examplesTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "rgb(124, 45, 18)",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    margin: "0 0 0.75rem 0",
  },
  examplesGrid: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  },
  exampleButton: {
    textAlign: "left" as const,
    padding: "0.5rem 0.75rem",
    background: "linear-gradient(to right, rgba(254, 215, 170, 0.6), rgba(253, 230, 138, 0.6))",
    borderRadius: "8px",
    border: "1px solid rgb(254, 215, 170)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
    fontSize: "12px",
    fontWeight: "500",
    color: "rgb(55, 65, 81)",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}
