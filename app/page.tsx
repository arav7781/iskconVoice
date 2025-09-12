import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-primary">
          <span className="text-3xl text-primary" aria-label="Om symbol">
            🕉️
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Spiritual Voice Assistant
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto text-balance">
          Experience divine guidance through AI-powered spiritual conversations rooted in ISKCON wisdom
        </p>
        <Link
          href="/spiritual-assistant"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
        >
          <span aria-label="Microphone">🎤</span>
          <span>Enter Spiritual Assistant</span>
        </Link>
      </div>
    </div>
  )
}
