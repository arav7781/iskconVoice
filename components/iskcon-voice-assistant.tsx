"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react"
import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react"
import { Track } from "livekit-client"
import "@livekit/components-styles"

// Divine Message component with ISKCON spiritual theme
const SpiritualMessage: React.FC<{ type: "agent" | "user"; text: string }> = ({ type, text }) => {
  return (
    <div className="flex items-start space-x-4 mb-6 animate-fade-in">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg ${
          type === "agent"
            ? "bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-yellow-400"
            : "bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-yellow-300"
        }`}
      >
        {type === "agent" ? "🕉️" : "🙏"}
      </div>
      <div
        className={`flex-1 p-4 rounded-2xl shadow-md relative overflow-hidden ${
          type === "agent"
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500"
            : "bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-orange-500"
        }`}
      >
        {type === "agent" && (
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
            <div className="text-4xl">🪷</div>
          </div>
        )}
        <p className="text-gray-800 leading-relaxed relative z-10">{text}</p>
        {type === "agent" && <div className="mt-2 text-xs text-blue-600 font-medium">🙏 Prabhu Krishna Das</div>}
      </div>
    </div>
  )
}

// Sacred Mandala Visualization Component
const SacredMandala: React.FC<{ state: string; isActive: boolean }> = ({ state, isActive }) => {
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Outer rotating ring with mantras */}
      <div
        className={`absolute inset-0 border-4 border-yellow-400 rounded-full ${isActive ? "animate-spin-slow" : ""} opacity-60`}
      >
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <span className="text-xs text-yellow-600 font-bold">हरे</span>
        </div>
        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
          <span className="text-xs text-yellow-600 font-bold">कृष्ण</span>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className="text-xs text-yellow-600 font-bold">राम</span>
        </div>
        <div className="absolute top-1/2 -left-2 transform -translate-y-1/2">
          <span className="text-xs text-yellow-600 font-bold">हरे</span>
        </div>
      </div>

      {/* Middle pulsing ring */}
      <div
        className={`absolute inset-4 border-2 border-orange-400 rounded-full ${
          state === "listening"
            ? "animate-pulse bg-orange-100"
            : state === "speaking"
              ? "animate-bounce bg-blue-100"
              : "bg-white"
        } shadow-lg`}
      />

      {/* Inner sacred symbol */}
      <div className="absolute inset-8 bg-gradient-to-br from-blue-600 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
        <div className="text-4xl text-white animate-pulse">
          {state === "listening" ? "🎧" : state === "speaking" ? "🗣️" : state === "thinking" ? "🧘" : "🕉️"}
        </div>
      </div>

      {/* Divine light rays */}
      {isActive && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 bg-gradient-to-t from-yellow-400 to-transparent opacity-60 animate-pulse`}
              style={{
                height: "60px",
                left: "50%",
                top: "-30px",
                transformOrigin: "center 126px",
                transform: `translateX(-50%) rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}

// Main Voice Assistant Interface with Divine Theme
const KrishnaVoiceInterface: React.FC = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant()
  const localParticipant = useLocalParticipant()
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  })

  const [messages, setMessages] = useState<
    Array<{ id?: string; text: string; type: "agent" | "user"; firstReceivedTime: number }>
  >([])

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" as const })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" as const })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime)
    setMessages(allMessages)
  }, [agentTranscriptions, userTranscriptions])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-yellow-200">
      {/* Divine Header */}
      <div className="bg-gradient-to-r from-blue-600 via-orange-600 to-blue-800 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 text-6xl">🪷</div>
          <div className="absolute bottom-4 left-4 text-4xl">🕉️</div>
          <div className="absolute top-1/2 left-1/4 text-3xl">✨</div>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center space-x-3">
              <span className="text-4xl">🕉️</span>
              <span>Krishna Consciousness Voice Guide</span>
            </h2>
            <p className="text-blue-200 text-lg">हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे</p>
            <p className="text-blue-100 text-sm mt-1">Spiritual Wisdom & Divine Guidance</p>
          </div>
          <div
            className={`px-6 py-3 rounded-full text-sm font-bold shadow-lg border-2 ${
              state === "listening"
                ? "bg-green-500 border-green-300 animate-pulse"
                : state === "thinking"
                  ? "bg-yellow-500 border-yellow-300 animate-bounce"
                  : state === "speaking"
                    ? "bg-orange-500 border-orange-300"
                    : "bg-gray-600 border-gray-400"
            }`}
          >
            {state === "listening"
              ? "🎧 Listening to Your Heart"
              : state === "thinking"
                ? "🧘 Contemplating Wisdom"
                : state === "speaking"
                  ? "🗣️ Sharing Divine Knowledge"
                  : "✨ Ready for Spiritual Guidance"}
          </div>
        </div>
      </div>

      {/* Sacred Mandala Visualization Area */}
      <div className="bg-gradient-to-b from-yellow-50 to-orange-50 p-8 border-b border-yellow-200">
        <SacredMandala state={state} isActive={state !== "idle"} />

        {/* Audio Visualizer as Lotus Petals */}
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-lg bg-white/60 rounded-full p-4 backdrop-blur-sm">
            <BarVisualizer
              state={state}
              barCount={16}
              trackRef={audioTrack}
              className="h-20"
              options={{
                barColor: state === "speaking" ? "#3b82f6" : "#f97316",
                bgColor: "transparent",
              }}
            />
          </div>
        </div>
      </div>

      {/* Divine Control Bar */}
      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 px-8 py-6 border-b border-yellow-200">
        <VoiceAssistantControlBar />
        <div className="mt-4 text-center">
          <p className="text-sm text-orange-700 font-medium flex items-center justify-center space-x-2">
            <span>🙏</span>
            <span>Speak with devotion, listen with an open heart</span>
            <span>🪷</span>
          </p>
          <p className="text-xs text-orange-600 mt-1">सत्यम् शिवम् सुन्दरम् - Truth, Auspiciousness, Beauty</p>
        </div>
      </div>

      {/* Spiritual Conversation Area */}
      <div
        ref={chatContainerRef}
        className="h-[500px] overflow-y-auto p-8 bg-gradient-to-b from-white to-blue-50 relative"
      >
        {/* Background spiritual elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 right-10 text-8xl">🪷</div>
          <div className="absolute bottom-20 left-10 text-6xl">🕉️</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl">✨</div>
        </div>

        {messages.length === 0 ? (
          <div className="text-center text-gray-600 mt-12 relative z-10">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white text-4xl">🕉️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-blue-800">Hare Krishna! Welcome to Spiritual Guidance</h3>
            <p className="text-lg mb-4 text-orange-700">🙏 हरे कृष्ण! आध्यात्मिक मार्गदर्शन में आपका स्वागत है</p>

            <div className="grid md:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="text-2xl mb-2">📿</div>
                <p className="text-sm text-blue-700">Ask about chanting, meditation & spiritual practices</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <div className="text-2xl mb-2">📖</div>
                <p className="text-sm text-orange-700">Explore Bhagavad Gita wisdom & Krishna's teachings</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <div className="text-2xl mb-2">🪷</div>
                <p className="text-sm text-purple-700">Understand karma, dharma & life's purpose</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="text-2xl mb-2">🕉️</div>
                <p className="text-sm text-green-700">Learn about devotion, surrender & love of God</p>
              </div>
            </div>

            <p className="text-sm mt-6 text-gray-600 italic">
              🎧 Start speaking to receive spiritual guidance from Prabhu Krishna Das
            </p>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {messages.map((msg, index) => (
              <SpiritualMessage key={msg.id || index} type={msg.type} text={msg.text} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Main ISKCON Page Component
const ISKCONSpiritualPage: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    connectToSpirtualGuide()
  }, [])

  const connectToSpirtualGuide = useCallback(async () => {
    setIsConnecting(true)
    try {
      const userName = `devotee-${Math.random().toString(36).substring(7)}`
      const response = await fetch(
        `https://aravsaxena884-iskcon.hf.space/getToken?name=${encodeURIComponent(userName)}`,
      )

      if (!response.ok) {
        throw new Error("Failed to connect to spiritual guide")
      }

      const tokenData = await response.text()
      setToken(tokenData)
      setIsConnected(true)
    } catch (error) {
      console.error("Connection error:", error)
      alert("Unable to connect to spiritual guide. Please try again with devotion.")
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnectFromGuide = useCallback(() => {
    setIsConnected(false)
    setToken(null)
  }, [])

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-orange-600 to-blue-800 relative overflow-hidden flex items-center justify-center">
        {/* Divine Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            {/* Floating lotus petals */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`absolute text-4xl opacity-30 animate-float-random`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              >
                🪷
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-white relative z-10">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <span className="text-6xl">🕉️</span>
          </div>

          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-400 bg-clip-text text-transparent">
            Connecting to Divine Wisdom
          </h2>

          <p className="text-xl text-blue-200 mb-6">🙏 Please wait while we establish spiritual connection...</p>

          <div className="flex items-center justify-center space-x-3">
            <svg className="animate-spin w-8 h-8 text-yellow-300" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-lg text-yellow-200">Establishing connection...</span>
          </div>
        </div>

        <style jsx>{`
          @keyframes float-random {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          .animate-float-random { animation: float-random 4s ease-in-out infinite; }
        `}</style>
      </div>
    )
  }

  if (isConnected && token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-orange-50 to-blue-100 relative overflow-hidden">
        {/* Floating spiritual elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            {/* Floating lotus petals */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`absolute text-4xl opacity-30 animate-float-random`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              >
                🪷
              </div>
            ))}

            {/* Divine light rays */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-yellow-300/20 to-transparent rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-300/20 to-transparent rounded-full animate-pulse animation-delay-2000" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <a
            href="/"
            className="mb-6 flex items-center space-x-3 text-orange-700 hover:text-blue-700 transition-colors group"
          >
            <svg
              className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">🙏 Return to Divine Home</span>
          </a>

          <LiveKitRoom
            serverUrl="wss://hello-mynqr5n8.livekit.cloud"
            token={token}
            connect={true}
            video={false}
            audio={true}
            onDisconnected={disconnectFromGuide}
            className="w-full"
          >
            <RoomAudioRenderer />
            <KrishnaVoiceInterface />
          </LiveKitRoom>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-700 to-red-600 relative overflow-hidden flex items-center justify-center">
      <div className="text-center text-white relative z-10 max-w-2xl mx-auto px-4">
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
          <span className="text-6xl">🙏</span>
        </div>

        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-400 bg-clip-text text-transparent">
          Connection Challenge
        </h2>

        <p className="text-xl text-orange-200 mb-6">
          Unable to connect to the spiritual guide at this moment. This may be due to high devotee traffic or server
          maintenance.
        </p>

        <button
          onClick={connectToSpirtualGuide}
          className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-yellow-300"
        >
          <span className="flex items-center justify-center space-x-3">
            <span className="text-2xl">🔄</span>
            <span>Try Again with Devotion</span>
            <span className="text-2xl">🪷</span>
          </span>
        </button>

        <p className="text-sm text-yellow-200 mt-4 italic">
          🕉️ "Krishna will provide when the time is right" - Bhagavad Gita
        </p>
      </div>
    </div>
  )
}

export default ISKCONSpiritualPage
