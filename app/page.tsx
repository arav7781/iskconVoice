"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Star, Quote, ArrowRight, ChevronDown, MapPin, Clock, Phone, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

// Spiritual teachings data for infinite scroll
const spiritualTeachings = [
  { icon: "🕉️", title: "Om Meditation", description: "Sacred sound of the universe" },
  { icon: "📿", title: "Japa Chanting", description: "Repetitive prayer with beads" },
  { icon: "🪷", title: "Lotus Position", description: "Traditional meditation posture" },
  { icon: "🙏", title: "Bhakti Yoga", description: "Path of devotional service" },
  { icon: "📖", title: "Bhagavad Gita", description: "Krishna's eternal wisdom" },
  { icon: "🎵", title: "Kirtan", description: "Devotional singing and dancing" },
  { icon: "🌸", title: "Prasadam", description: "Sanctified food offering" },
  { icon: "🕯️", title: "Aarti", description: "Lamp offering ceremony" },
  { icon: "🏛️", title: "Temple Visit", description: "Sacred space worship" },
  { icon: "🌅", title: "Mangala Aarti", description: "Dawn worship ceremony" },
]

const testimonials = [
  {
    name: "Radha Devi",
    location: "Mumbai, India",
    text: "Krishna consciousness has transformed my life completely. The peace and joy I experience through chanting is indescribable.",
    rating: 5,
  },
  {
    name: "Govinda Das",
    location: "London, UK",
    text: "The spiritual guidance from ISKCON has helped me understand my true purpose in life. Hare Krishna!",
    rating: 5,
  },
  {
    name: "Gopi Devi",
    location: "New York, USA",
    text: "Through the teachings of Bhagavad Gita, I found answers to all my life's questions. Eternally grateful.",
    rating: 5,
  },
]

const upcomingEvents = [
  {
    title: "Janmashtami Celebration",
    date: "August 26, 2024",
    time: "6:00 PM - 11:00 PM",
    location: "ISKCON Temple, Vrindavan",
    description: "Celebrate the birth of Lord Krishna with devotional programs",
  },
  {
    title: "Bhagavad Gita Study Circle",
    date: "Every Sunday",
    time: "10:00 AM - 12:00 PM",
    location: "Community Center",
    description: "Weekly study of Krishna's teachings with experienced devotees",
  },
  {
    title: "Kirtan Evening",
    date: "Every Friday",
    time: "7:00 PM - 9:00 PM",
    location: "ISKCON Center",
    description: "Join us for devotional singing and spiritual fellowship",
  },
]

// Infinite scroll component
const InfiniteScroll = ({
  items,
  direction = "left",
  speed = 30,
}: {
  items: typeof spiritualTeachings
  direction?: "left" | "right"
  speed?: number
}) => {
  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

      <div className="infinite-scroll-container">
        <div
          className={`infinite-scroll-content ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}
          style={{ animationDuration: `${speed}s` }}
        >
          {/* First set */}
          {items.map((item, index) => (
            <div key={`first-${index}`} className="flex-none mx-6">
              <Card className="w-64 h-40 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3 animate-float">{item.icon}</div>
                  <h3 className="font-semibold text-card-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Second set for seamless loop */}
          {items.map((item, index) => (
            <div key={`second-${index}`} className="flex-none mx-6">
              <Card className="w-64 h-40 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3 animate-float">{item.icon}</div>
                  <h3 className="font-semibold text-card-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Floating spiritual elements
const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float text-blue-600">🕉️</div>
      <div
        className="absolute top-40 right-20 text-4xl opacity-25 animate-float-reverse text-teal-600"
        style={{ animationDelay: "2s" }}
      >
        🪷
      </div>
      <div
        className="absolute bottom-40 left-20 text-5xl opacity-20 animate-float text-blue-700"
        style={{ animationDelay: "4s" }}
      >
        🙏
      </div>
      <div
        className="absolute bottom-20 right-10 text-3xl opacity-30 animate-float-reverse text-orange-600"
        style={{ animationDelay: "1s" }}
      >
        ✨
      </div>
      <div
        className="absolute top-1/2 left-1/4 text-2xl opacity-25 animate-float text-teal-700"
        style={{ animationDelay: "3s" }}
      >
        📿
      </div>
      <div
        className="absolute top-1/3 right-1/3 text-3xl opacity-20 animate-float-reverse text-blue-700"
        style={{ animationDelay: "5s" }}
      >
        🌸
      </div>

      {/* Spiritual particles */}
      <div className="spiritual-particles" />
    </div>
  )
}

const PeacockFeather = () => {
  return (
    <div className="absolute top-10 right-10 w-32 h-48 animate-float-slow">
      <svg
        viewBox="0 0 100 150"
        className="w-full h-full filter drop-shadow-2xl"
        style={{
          transform: "perspective(1000px) rotateX(15deg) rotateY(-10deg)",
        }}
      >
        {/* Feather shaft */}
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="140"
          stroke="url(#shaftGradient)"
          strokeWidth="2"
          className="animate-peacock-shimmer"
        />

        {/* Feather eye (top circular part) */}
        <ellipse cx="50" cy="25" rx="15" ry="12" fill="url(#eyeGradient)" className="animate-peacock-glow" />
        <ellipse cx="50" cy="25" rx="10" ry="8" fill="url(#eyeInnerGradient)" />
        <ellipse cx="50" cy="25" rx="5" ry="4" fill="url(#eyeCenterGradient)" />
        <ellipse cx="52" cy="23" rx="2" ry="1.5" fill="white" opacity="0.8" />

        {/* Left side barbs */}
        {Array.from({ length: 20 }, (_, i) => (
          <path
            key={`left-${i}`}
            d={`M50 ${40 + i * 5} Q${35 - i * 0.5} ${42 + i * 5} ${30 - i * 0.8} ${45 + i * 5}`}
            stroke="url(#barbGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity={0.8 - i * 0.03}
            className="animate-feather-sway"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}

        {/* Right side barbs */}
        {Array.from({ length: 20 }, (_, i) => (
          <path
            key={`right-${i}`}
            d={`M50 ${40 + i * 5} Q${65 + i * 0.5} ${42 + i * 5} ${70 + i * 0.8} ${45 + i * 5}`}
            stroke="url(#barbGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity={0.8 - i * 0.03}
            className="animate-feather-sway"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}

        {/* Gradients */}
        <defs>
          <linearGradient id="shaftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>

          <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00CED1" />
            <stop offset="30%" stopColor="#1E90FF" />
            <stop offset="60%" stopColor="#4169E1" />
            <stop offset="100%" stopColor="#191970" />
          </radialGradient>

          <radialGradient id="eyeInnerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FA9A" />
            <stop offset="50%" stopColor="#00CED1" />
            <stop offset="100%" stopColor="#1E90FF" />
          </radialGradient>

          <radialGradient id="eyeCenterGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </radialGradient>

          <linearGradient id="barbGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#20B2AA" />
            <stop offset="30%" stopColor="#48D1CC" />
            <stop offset="60%" stopColor="#40E0D0" />
            <stop offset="100%" stopColor="#00CED1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default function ISKCONLandingPage() {
  const [isMuted, setIsMuted] = useState(false)
  const router = useRouter()

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })

  const beginSpiritualJourney = () => {
    router.push("/spiritual-journey")
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingElements />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <PeacockFeather />

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-teal-800/10 to-emerald-900/20"
          style={{ y }}
        />

        {/* Peacock feather wave animations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="peacock-wave-1"></div>
            <div className="peacock-wave-2"></div>
            <div className="peacock-wave-3"></div>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-600 via-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden animate-peacock-glow">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-blue-500/30 to-emerald-600/20 animate-spin-slow"></div>
              <span className="text-6xl relative z-10 filter drop-shadow-lg animate-sacred-pulse">🕉️</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-peacock-shimmer"></div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-lg text-3d"
          >
            Krishna Consciousness
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-2xl md:text-3xl font-medium mb-4 bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-sm"
          >
            International Society for Krishna Consciousness
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे
            <br />
            हरे राम हरे राम राम राम हरे हरे
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1 }}
            className="text-base md:text-lg text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the eternal wisdom of the Vedas and embark on a transformative spiritual journey through Krishna
            consciousness, devotional service, and divine love.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              size="lg"
              className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-teal-700 hover:from-teal-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 relative overflow-hidden"
              onClick={beginSpiritualJourney}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-700 to-teal-800 z-0"></div>
              <span className="flex items-center space-x-3 relative z-10 text-white font-bold drop-shadow-lg">
                <span className="text-2xl filter drop-shadow-sm">🎧</span>
                <span className="filter drop-shadow-sm">Begin Spiritual Journey</span>
                <span className="text-2xl filter drop-shadow-sm">🪷</span>
              </span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300 bg-white/90 backdrop-blur-sm font-semibold"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Explore Teachings
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-16"
          >
            <ChevronDown
              className="w-8 h-8 mx-auto text-muted-foreground animate-bounce cursor-pointer"
              onClick={beginSpiritualJourney}
            />
          </motion.div>
        </div>
      </section>

      {/* Spiritual Teachings Infinite Scroll */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Sacred{" "}
              <span className="bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-lg text-3d">
                Practices
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Immerse yourself in the timeless spiritual practices that lead to Krishna consciousness and inner
              transformation.
            </p>
          </motion.div>
        </div>

        <InfiniteScroll items={spiritualTeachings} direction="left" speed={40} />
        <InfiniteScroll items={spiritualTeachings.slice().reverse()} direction="right" speed={35} />
      </section>

      {/* About ISKCON Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  About{" "}
                  <span className="bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-lg text-3d">
                    ISKCON
                  </span>
                </h2>
                <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                  <p>
                    The International Society for Krishna Consciousness (ISKCON) was founded in 1966 by His Divine Grace
                    A.C. Bhaktivedanta Swami Prabhupada to teach the science of Krishna consciousness throughout the
                    world based on the teachings of the Bhagavad-gita and other Vedic scriptures.
                  </p>
                  <p>
                    ISKCON belongs to the Gaudiya-Vaishnava sampradaya, a monotheistic tradition within the Vedic
                    culture. Today ISKCON comprises of more than 400 temples, 40 rural communities, 26 educational
                    institutes and 45 restaurants worldwide.
                  </p>
                  <p>
                    Our mission is to promote the well-being of society by teaching the science of Krishna consciousness
                    according to the Bhagavad-gita and other ancient scriptures.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-card rounded-lg border border-primary/20">
                    <div className="text-3xl font-bold text-blue-700 mb-2">400+</div>
                    <div className="text-sm text-muted-foreground">Temples Worldwide</div>
                  </div>
                  <div className="text-center p-4 bg-card rounded-lg border border-secondary/20">
                    <div className="text-3xl font-bold text-blue-700 mb-2">50+</div>
                    <div className="text-sm text-muted-foreground">Years of Service</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-600/20 to-teal-600/20 rounded-3xl flex items-center justify-center text-9xl animate-float">
                  🏛️
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-full flex items-center justify-center text-4xl animate-float-reverse">
                  🕉️
                </div>
                <div
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-3xl animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  🪷
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spiritual Journey Section */}
      <section id="spiritual-journey" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Your Spiritual{" "}
              <span className="bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-lg text-3d">
                Journey
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the path to Krishna consciousness through these essential spiritual practices and teachings.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: "📿",
                title: "Chanting",
                description:
                  "Practice the Hare Krishna maha-mantra daily for spiritual purification and divine connection.",
                color: "from-primary to-secondary",
              },
              {
                icon: "📖",
                title: "Study",
                description:
                  "Read Bhagavad-gita and other Vedic scriptures to understand Krishna's teachings and philosophy.",
                color: "from-secondary to-accent",
              },
              {
                icon: "🙏",
                title: "Service",
                description: "Engage in devotional service to Krishna and help spread Krishna consciousness to others.",
                color: "from-accent to-primary",
              },
              {
                icon: "🌸",
                title: "Prasadam",
                description: "Honor Krishna prasadam (sanctified food) to purify the body and consciousness.",
                color: "from-primary to-accent",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/80 backdrop-blur-sm border-primary/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20 group">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-card-foreground">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-muted-foreground leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Devotee{" "}
              <span className="bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-lg text-3d">
                Testimonials
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from fellow devotees about their transformative experiences with Krishna consciousness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/90 backdrop-blur-sm border-primary/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/40 mb-4" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Upcoming{" "}
              <span className="bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-lg text-3d">
                Events
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join us for spiritual festivals, study circles, and devotional programs throughout the year.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/90 backdrop-blur-sm border-primary/20 hover:border-accent/50 transition-all duration-300 hover:shadow-xl group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-blue-600 text-white border-blue-700 font-medium">
                        <Calendar className="w-3 h-3 mr-1" />
                        Event
                      </Badge>
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-300">🎉</div>
                    </div>
                    <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{event.description}</p>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium border-0">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Mantra Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600/10 via-teal-600/5 to-emerald-600/10 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-3xl">
                🕉️
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-lg text-3d">
                The Maha Mantra
              </h2>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-12 border border-blue-600/20 shadow-2xl">
              <p className="text-3xl md:text-4xl font-bold mb-6 leading-relaxed text-blue-700">
                Hare Krishna Hare Krishna Krishna Krishna Hare Hare
                <br />
                Hare Rama Hare Rama Rama Rama Hare Hare
              </p>
              <p className="text-lg md:text-xl text-teal-600 mb-8 leading-relaxed">
                हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे
                <br />
                हरे राम हरे राम राम राम हरे हरे
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                This sacred mantra is the most powerful prayer in the age of Kali. Chanting these holy names purifies
                the heart and awakens our dormant love for Krishna.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-20 bg-gradient-to-br from-blue-600/5 via-teal-600/3 to-emerald-600/5 relative border-t border-blue-600/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            {/* Main Footer Content */}
            <div className="grid lg:grid-cols-4 gap-12 mb-16">
              {/* ISKCON Logo & Description */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 mr-4 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-3xl animate-peacock-glow">
                    🕉️
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-lg text-3d">
                      ISKCON
                    </h3>
                    <p className="text-sm text-muted-foreground">International Society for Krishna Consciousness</p>
                  </div>
                </div>

                <p className="text-foreground/80 leading-relaxed mb-6 max-w-lg">
                  Founded in 1966 by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada to teach the science of
                  Krishna consciousness throughout the world based on the teachings of the Bhagavad-gita and other Vedic
                  scriptures.
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-sm">
                  <div className="text-center p-4 bg-card/50 rounded-lg border border-primary/20 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-blue-700 mb-1">400+</div>
                    <div className="text-xs text-muted-foreground">Temples Worldwide</div>
                  </div>
                  <div className="text-center p-4 bg-card/50 rounded-lg border border-secondary/20 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-blue-700 mb-1">50+</div>
                    <div className="text-xs text-muted-foreground">Years of Service</div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-card-foreground">Quick Links</h4>
                <ul className="space-y-3">
                  {["About ISKCON", "Temples", "Events", "Teachings", "Bhagavad Gita", "Donate"].map((link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-card-foreground">Contact Us</h4>
                <div className="space-y-4">
                  <div className="flex items-start text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-3 mt-1 text-primary" />
                    <div className="text-sm">
                      <p>ISKCON Vrindavan</p>
                      <p>Krishna Balaram Mandir</p>
                      <p>Vrindavan, UP 281121, India</p>
                    </div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">+91 565 254 0021</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">info@iskconvrindavan.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sacred Mantra Section */}
            <div className="text-center py-12 border-t border-b border-blue-600/10">
              <div className="max-w-4xl mx-auto">
                <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x filter drop-shadow-lg text-3d">
                  The Maha Mantra
                </h4>
                <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-600/20">
                  <p className="text-2xl md:text-3xl font-bold mb-4 leading-relaxed text-blue-700">
                    Hare Krishna Hare Krishna Krishna Krishna Hare Hare
                    <br />
                    Hare Rama Hare Rama Rama Rama Hare Hare
                  </p>
                  <p className="text-lg md:text-xl text-teal-600 mb-4 leading-relaxed">
                    हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे
                    <br />
                    हरे राम हरे राम राम राम हरे हरे
                  </p>
                  <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    This sacred mantra purifies the heart and awakens our dormant love for Krishna
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-8 text-center">
              <p className="text-muted-foreground mb-2">
                © 2024 International Society for Krishna Consciousness. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground italic flex items-center justify-center space-x-2">
                <span>🙏</span>
                <span>Hare Krishna! May this service help in your journey back to Godhead.</span>
                <span>🪷</span>
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
