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

const bhagavadGitaShlokas = [
  {
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    translation: "You have a right to perform your prescribed duty, but not to the fruits of action.",
    chapter: "Bhagavad Gita 2.47",
  },
  {
    sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।",
    translation: "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure.",
    chapter: "Bhagavad Gita 2.48",
  },
  {
    sanskrit: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।",
    translation: "Engage your mind always in thinking of Me, become My devotee, offer obeisances to Me and worship Me.",
    chapter: "Bhagavad Gita 9.34",
  },
  {
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।",
    translation:
      "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions.",
    chapter: "Bhagavad Gita 18.66",
  },
  {
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।",
    translation:
      "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, I manifest Myself.",
    chapter: "Bhagavad Gita 4.7",
  },
]

const Message: React.FC<{ type: "agent" | "user"; text: string }> = ({ type, text }) => {
  return (
    <div className="flex items-start space-x-4 mb-6">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-xl border-2 ${
          type === "agent"
            ? "temple-gradient border-secondary"
            : "bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-300"
        }`}
      >
        {type === "agent" ? "🕉️" : "🙏"}
      </div>
      <div
        className={`flex-1 p-5 rounded-2xl shadow-lg border ${
          type === "agent"
            ? "bg-card border-l-4 border-primary vrindavan-gradient"
            : "bg-blue-50 border-l-4 border-blue-500"
        }`}
      >
        <p className="text-card-foreground leading-relaxed text-pretty font-medium">{text}</p>
      </div>
    </div>
  )
}

const VoiceAssistantInterface: React.FC = () => {
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
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-secondary/20">
      <div className="temple-gradient p-8 text-white relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-4xl font-bold flex items-center gap-3 mb-2">
              <span className="text-5xl">🕉️</span>
              Krishna Voice Assistant
            </h2>
            <p className="text-primary-foreground/95 text-xl font-medium">श्रीकृष्ण गुरु • Divine Wisdom from Vrindavan</p>
          </div>
          <div
            className={`px-6 py-3 rounded-full text-sm font-bold shadow-xl border-2 border-white/30 ${
              state === "listening"
                ? "bg-green-500"
                : state === "thinking"
                  ? "bg-yellow-500"
                  : state === "speaking"
                    ? "bg-orange-500"
                    : "bg-gray-600"
            }`}
          >
            {state === "listening"
              ? "🎤 Receiving your prayers"
              : state === "thinking"
                ? "🧘 Seeking Krishna's guidance"
                : state === "speaking"
                  ? "🗣️ Sharing divine nectar"
                  : "🙏 Awaiting your devotion"}
          </div>
        </div>
      </div>

      <div className="vrindavan-gradient p-8 border-b-2 border-secondary/20">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-lg relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full temple-gradient flex items-center justify-center text-3xl shadow-2xl border-4 border-white">
                🪷
              </div>
            </div>
            <BarVisualizer state={state} barCount={16} trackRef={audioTrack} className="h-24 opacity-90" />
          </div>
        </div>
      </div>

      <div className="bg-muted px-8 py-6 border-b-2 border-secondary/20">
        <VoiceAssistantControlBar />
        <p className="text-sm text-muted-foreground mt-4 text-center text-balance">
          <span className="font-bold text-primary">🙏 Divine Guidance:</span> This sacred assistant channels wisdom from
          the Bhagavad Gita and ISKCON teachings. For personal spiritual initiation, seek guidance from qualified gurus
          at your local ISKCON temple.
        </p>
      </div>

      <div ref={chatContainerRef} className="h-96 overflow-y-auto p-8 bg-background">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <div className="w-24 h-24 mx-auto mb-8 temple-gradient rounded-full flex items-center justify-center shadow-2xl border-4 border-secondary">
              <span className="text-white text-4xl">🕉️</span>
            </div>
            <p className="text-3xl font-bold mb-6 text-foreground">Hare Krishna! Radhe Radhe! 🙏</p>
            <p className="text-xl mb-6 text-balance font-medium">Welcome to Krishna's divine voice assistant</p>
            <p className="text-base text-balance max-w-lg mx-auto mb-8">
              🗣️ Seek spiritual guidance rooted in the eternal wisdom of Bhagavad Gita and the divine teachings of His
              Divine Grace A.C. Bhaktivedanta Swami Prabhupada. Let Krishna consciousness illuminate your path.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <Message key={msg.id || index} type={msg.type} text={msg.text} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const SpiritualAssistantPage: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const [currentShloka] = useState(() => bhagavadGitaShlokas[Math.floor(Math.random() * bhagavadGitaShlokas.length)])

  const connectToAgent = useCallback(async () => {
    setIsConnecting(true)
    try {
      const userName = `devotee-${Math.random().toString(36).substring(7)}`

      const response = await fetch(
        `https://aravsaxena884-iskcon.hf.space/getToken?name=${encodeURIComponent(userName)}`,
      )

      if (!response.ok) {
        throw new Error("Failed to get token")
      }

      const tokenData = await response.text()
      setToken(tokenData)
      setIsConnected(true)
    } catch (error) {
      console.error("Connection error:", error)
      alert("Failed to connect to spiritual assistant. Please try again with devotion. 🙏")
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnectFromAgent = useCallback(() => {
    setIsConnected(false)
    setToken(null)
  }, [])

  if (isConnected && token) {
    return (
      <div className="min-h-screen vrindavan-gradient relative overflow-hidden">
        <div className="container mx-auto px-6 py-10 relative z-10">
          <a
            href="/"
            className="mb-8 flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Temple Entrance</span>
          </a>

          <LiveKitRoom
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://app-zq7e4mya.livekit.cloud"}
            token={token}
            connect={true}
            video={false}
            audio={true}
            onDisconnected={disconnectFromAgent}
            className="w-full"
          >
            <RoomAudioRenderer />
            <VoiceAssistantInterface />
          </LiveKitRoom>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen vrindavan-gradient relative overflow-hidden">
      <main className="container mx-auto px-6 py-20 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-secondary">
              <span className="text-5xl text-primary">🕉️</span>
            </div>
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Krishna Voice Assistant
            </h1>
            <h2 className="text-4xl font-bold mb-8 text-muted-foreground">
              श्रीकृष्ण आध्यात्मिक सहायक • Divine ISKCON Guidance
            </h2>

            <div className="max-w-4xl mx-auto mb-12 p-8 bg-card rounded-3xl shadow-2xl border-2 border-primary/20">
              <div className="text-primary text-lg font-bold mb-4 flex items-center justify-center gap-2">
                <span className="text-primary">🪷</span>
                {currentShloka.chapter}
                <span className="text-primary">🪷</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-6 text-balance leading-relaxed">
                {currentShloka.sanskrit}
              </div>
              <div className="text-lg text-muted-foreground text-balance italic font-medium">
                "{currentShloka.translation}"
              </div>
            </div>

            <button
              onClick={connectToAgent}
              disabled={isConnecting}
              className="px-12 py-6 text-xl font-bold bg-primary text-primary-foreground rounded-full shadow-2xl hover:shadow-3xl hover:bg-primary/90 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white/20"
            >
              {isConnecting ? (
                <span className="flex items-center justify-center space-x-3">
                  <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Connecting to Krishna's divine realm...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-3">
                  <span className="text-3xl">🎤</span>
                  <span>Enter Krishna's Divine Presence</span>
                </span>
              )}
            </button>

            <p className="text-xl text-muted-foreground mt-8 max-w-3xl mx-auto text-balance font-medium">
              Receive sacred guidance rooted in the eternal wisdom of Bhagavad Gita and the divine teachings of His
              Divine Grace A.C. Bhaktivedanta Swami Prabhupada
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-card rounded-2xl p-8 shadow-xl border-2 border-primary/20 hover:shadow-2xl transition-all duration-300">
              <div className="text-5xl mb-4">📿</div>
              <h3 className="text-xl font-bold mb-3 text-primary">Japa Meditation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Learn the sacred art of chanting the Hare Krishna maha-mantra with proper pronunciation and devotion
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-xl border-2 border-secondary/20 hover:shadow-2xl transition-all duration-300">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-3 text-secondary">Sacred Scriptures</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Dive deep into the Bhagavad Gita, Srimad Bhagavatam, and other Vedic literatures
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-xl border-2 border-primary/20 hover:shadow-2xl transition-all duration-300">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-3 text-primary">Devotional Service</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Discover the path of bhakti yoga and develop pure Krishna consciousness through seva
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-xl border-2 border-secondary/20 hover:shadow-2xl transition-all duration-300">
              <div className="text-5xl mb-4">🧘</div>
              <h3 className="text-xl font-bold mb-3 text-secondary">Spiritual Sadhana</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Establish daily spiritual practices and discipline for steady progress in Krishna consciousness
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300 text-yellow-900 max-w-4xl mx-auto shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🙏</div>
              <div>
                <h4 className="font-bold mb-3 text-xl">Sacred Guidance & Disclaimer</h4>
                <p className="text-base text-balance leading-relaxed">
                  This divine assistant provides general spiritual guidance based on authentic ISKCON teachings and
                  Bhagavad Gita wisdom. For personal spiritual counseling, initiation guidance, and deeper spiritual
                  advancement, please seek the association of qualified spiritual masters and devotees at your local
                  ISKCON temple.
                  <span className="font-semibold"> Hare Krishna! 🪷</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SpiritualAssistantPage
