"use client"

import { motion } from "framer-motion"
import { Upload, Sparkles, Download, Share2 } from "lucide-react"
import Image from "next/image"

export function HowItWorks() {
  const timestamp = Date.now()
  const steps = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Upload",
      description: "Add your portrait photo and a driving video",
      image: "/images/upload-step.png",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Animate",
      description: "Our AI works its magic to bring your photo to life",
      image: `/images/animate-step.gif?t=${timestamp}`,
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: "Download",
      description: "Save your animation to share with friends",
      image: `/images/download-step.gif?t=${timestamp}`,
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: "Share",
      description: "Post your creation on social media",
      image: `/images/share-step.gif?t=${timestamp}`,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
            How It Works
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our cutting-edge AI technology makes the process simple and fast
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-purple-500/30 relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-md"></div>

                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="text-cyan-400 relative z-10"
                  >
                    {step.icon}
                  </motion.div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50 -z-10 transform -translate-x-1/2"></div>
                )}
              </div>

              {/* Step image */}
              <div className="relative w-full h-[220px] mb-4 rounded-lg overflow-hidden border border-purple-500/30 shadow-lg shadow-purple-700/10 flex items-center justify-center bg-black">
                <img
                  src={step.image || "/placeholder.svg"}
                  alt={step.title}
                  className="object-contain max-h-full w-full h-full"
                />
              </div>

              <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech specs bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 bg-black/50 backdrop-blur-md rounded-xl border border-purple-500/30 p-6 shadow-lg shadow-purple-700/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-cyan-400 font-mono text-lg mb-1">0.5s</div>
              <div className="text-gray-400 text-sm">Processing Time</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-cyan-400 font-mono text-lg mb-1">99.8%</div>
              <div className="text-gray-400 text-sm">Accuracy Rate</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-cyan-400 font-mono text-lg mb-1">4K</div>
              <div className="text-gray-400 text-sm">Output Quality</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-cyan-400 font-mono text-lg mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Cloud Processing</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
