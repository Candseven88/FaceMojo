"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="features" className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-gray-900 to-gray-900"></div>

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f11_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f11_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        {/* Glowing Orbs */}
        <motion.div
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px]"
        ></motion.div>

        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-600/20 blur-[100px]"
        ></motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center mb-6 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium border border-purple-500/30">
              <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
              AI-Powered Animation Technology
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-6 leading-tight">
              FaceMojo
            </h1>

            <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">Bring your photos to life</h2>

            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              AI-powered animation that makes your photo move, talk, and feel alive. Transform static images into
              dynamic expressions with cutting-edge neural network technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-full px-8 shadow-lg shadow-purple-700/20"
              >
                Try It Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-purple-500/50 text-gray-200 bg-gray-900/40 backdrop-blur-sm hover:bg-purple-900/30 hover:border-purple-400 hover:text-white"
              >
                See Examples
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20 bg-gradient-to-br from-gray-900 to-purple-900/50">
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
              <img
                src="/images/facemojo-demo.gif"
                alt="FaceMojo AI Animation Demo"
                className="w-full h-auto"
              />

              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl border border-purple-500/50 pointer-events-none"></div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-md"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-pink-400 rounded-bl-md"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400 rounded-br-md"></div>
            </div>

            {/* Tech specs floating element */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-10 -left-10 bg-black/80 backdrop-blur-lg rounded-lg border border-purple-500/30 p-4 shadow-lg shadow-purple-700/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                <div className="text-sm font-mono text-cyan-400">
                  AI Processing: <span className="text-white">Real-time</span>
                </div>
              </div>
            </motion.div>

            {/* Tech specs floating element 2 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -top-8 -right-8 bg-black/80 backdrop-blur-lg rounded-lg border border-purple-500/30 p-4 shadow-lg shadow-purple-700/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                <div className="text-sm font-mono text-purple-400">
                  Neural Network: <span className="text-white">Active</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </motion.div>
      </div>
    </section>
  )
}
