"use client"

import { motion } from "framer-motion"
import { Lightbulb } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function UserTips() {
  const tips = [
    {
      text: "Try your selfie + a TikTok sound",
      image: "/images/tip-tiktok.png",
    },
    {
      text: "Use a pet photo for hilarious results",
      image: "/images/tip-pet.png",
    },
    {
      text: "Create a meme face that reacts",
      image: "/images/tip-meme.png",
    },
    {
      text: "Animate an old family photo",
      image: "/images/tip-family.png",
    },
    {
      text: "Make your profile picture speak",
      image: "/images/tip-profile.png",
    },
    {
      text: "Combine with music for social media posts",
      image: "/images/tip-music.png",
    },
  ]

  const [showFeedback, setShowFeedback] = useState(false)

  return (
    <section className="py-20 md:py-28 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center mb-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center mr-4 relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-yellow-500/50 blur-md"></div>
            <Lightbulb className="h-8 w-8 text-white relative z-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
            Need Inspiration?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center bg-black/50 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4 shadow-lg shadow-purple-700/10 overflow-hidden"
            >
              <div className="w-28 h-28 rounded-lg overflow-hidden mr-4 flex-shrink-0 border border-purple-500/30">
                <Image
                  src={tip.image || "/placeholder.svg"}
                  alt={`Tip ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="font-medium text-white text-xs">{index + 1}</span>
                  </div>
                  <p className="text-white font-medium">{tip.text}</p>
                </div>
                <div className="flex">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 mr-2">
                    #trending
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300">#creative</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSermFAkp6UU0Us3cD464W4KyrQmX-LRpwMwf65TC_KZ-F2LJA/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition-all duration-300 font-semibold text-sm shadow-lg shadow-purple-900/20"
        >
          💬 Help Us Improve FaceMojo
        </a>
      </motion.div>
    </section>
  )
}
