"use client"

import React from "react"
import { motion } from "framer-motion"

export function FAQSection() {
  const faqs = [
    {
      question: "What is FaceMojo?",
      answer: "FaceMojo lets you turn a selfie into a fun animated video using AI. Just upload a photo and a driving video to get started.",
    },
    {
      question: "Is it really free to try?",
      answer: "Yes! Every user gets one free animation. No credit card needed.",
    },
    {
      question: "What video formats are supported?",
      answer: "MP4 only, under 15 seconds and less than 20MB in size.",
    },
    {
      question: "How long does it take to generate a video?",
      answer: "Usually between 30 seconds to 2 minutes, depending on server load.",
    },
    {
      question: "Can I use FaceMojo-generated videos for commercial use?",
      answer: "Currently, FaceMojo is for personal and entertainment use only. Commercial licensing is coming soon.",
    },
  ]

  return (
    <section id="faq" className="py-20 bg-gray-950 text-white border-t border-purple-800/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-700 rounded-lg p-6 bg-gray-800/70"
            >
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-300 text-sm">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}