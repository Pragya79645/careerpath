"use client"

import { ThreeDCardDemo } from "@/components/3d-card"
import { AnimatedText } from "@/components/animated-text"
import ButtonWrapper from "@/components/getStarted"

import { SVGMaskEffectDemo } from "@/components/mid"
import { SparklesText } from "@/components/sparkle-text"
import { Button } from "@/components/ui/button"
import Example from "@/components/uploadResumeBtn"
import { HeroHighlightDemo } from "@/components/violet-text"
import { motion } from "framer-motion"
import { ArrowRight, Upload, Sparkles, ChevronDown } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section - Full Width */}
      <section className="relative w-full min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 z-10"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 blur-3xl"
              style={{
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] bg-[length:50px_50px] opacity-[0.02] z-0"></div>

        {/* Hero content */}
        <div className="container mx-auto px-4 md:px-6 relative z-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block"
              >
                <div className="bg-gradient-to-r from-blue-700 via-blue-200 to-blue-900 p-px rounded-full">
                 
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight"
              >
               
                <span className="bg-gradient-to-r from-purple-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
                  Let&apos;s Pick Up.
                </span>
              </motion.h1>

          <div><HeroHighlightDemo /></div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className=" relative overflow-hidden h-14 px-0 text-lg"
                >
                  <span className="relative flex items-center">
                   <ButtonWrapper />
                  </span>
                  <span className="absolute "></span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden border-purple-500 hover:border-purple-600 transition-all duration-300 h-14 px-0 text-lg"
                >
                  <span className=" z-10 flex items-center">
                    <Example />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </motion.div>
            </motion.div>
          

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-[500px] hidden lg:block"
            >
              {/* 3D illustration or mockup would go here */}
              <div><ThreeDCardDemo /></div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </motion.div>
      </section>
      <div><SVGMaskEffectDemo /></div>

      {/* Featured Careers Section - Full Width */}
      <section className="w-full py-20 bg-gradient-to-b from-background to-background/95 relative">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
          <div><SparklesText text={"About US"} /></div>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6">
              Discover the hottest career paths that match your skills and interests
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              {
                name: "Frontend Dev",
                emoji: "💻",
                color: "from-purple-500/10 to-blue-500/10",
                border: "border-purple-500/20",
              },
              {
                name: "AI Wizard",
                emoji: "🧙",
                color: "from-blue-500/10 to-teal-500/10",
                border: "border-blue-500/20",
              },
              {
                name: "Data Diva",
                emoji: "📊",
                color: "from-teal-500/10 to-purple-500/10",
                border: "border-teal-500/20",
              },
              {
                name: "UX Queen",
                emoji: "🎨",
                color: "from-purple-500/10 to-teal-500/10",
                border: "border-purple-500/20",
              },
            ].map((career, index) => (
              <motion.div
                key={career.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className={`border ${career.border} rounded-xl overflow-hidden group cursor-pointer`}
              >
                <div
                  className={`bg-gradient-to-br ${career.color} h-full p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 group-hover:scale-[1.02]`}
                >
                  <div className="text-4xl md:text-5xl mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
                    {career.emoji}
                  </div>
                  <div className="font-medium text-lg md:text-xl">{career.name}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Full Width with Gradient Background */}
      <section className="w-full py-20 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-teal-500/5 relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=20&width=20')] bg-[length:20px_20px] opacity-[0.03]"></div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "93%", label: "Career Match Rate" },
              { number: "10k+", label: "Active Users" },
              { number: "250+", label: "Career Paths" },
              { number: "24/7", label: "AI Support" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-teal-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Full Width */}
      <section className="w-full py-20 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
         <div><AnimatedText text={"Success Stories"} /></div>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-6">
              See how Career Path Navigator has transformed careers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Frontend Developer",
                company: "TechCorp",
                quote:
                  "Went from confused grad to Frontend Queen in just 6 months! The roadmap was exactly what I needed.",
                avatar: "/placeholder.svg?height=80&width=80",
              },
              {
                name: "Jamie Smith",
                role: "UX Designer",
                company: "DesignHub",
                quote:
                  "The AI recommendations were spot on! I discovered my passion for UX design through this platform.",
                avatar: "/placeholder.svg?height=80&width=80",
              },
              {
                name: "Taylor Johnson",
                role: "Data Analyst",
                company: "DataDriven",
                quote: "The skill gap analysis helped me focus my learning. Now I'm earning 2x my previous salary!",
                avatar: "/placeholder.svg?height=80&width=80",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/10 rounded-xl p-6 md:p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
                <p className="italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width with Gradient Background */}
      <section className="w-full py-20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 relative">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Ready to{" "}
              <span className="bg-gradient-to-r from-purple-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
                level up
              </span>{" "}
              your career?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Join thousands of professionals who found their dream career path with our AI-powered platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-14 px-8 text-lg"
              >
                Get Started For Free
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
