"use client"

import { motion, useAnimation } from "framer-motion"
import { Play, Code, Zap } from "lucide-react"
import { useEffect } from "react"

export function DemoPlaceholder() {
  const controls = useAnimation()

  useEffect(() => {
    // Animate the code lines
    const sequence = async () => {
      await controls.start({
        opacity: [0, 1],
        x: [10, 0],
        transition: { duration: 0.5 },
      })
      await controls.start({
        opacity: [1, 0.7, 1],
        transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
      })
    }
    sequence()
  }, [controls])

  return (
    <section id="demo" className="py-20 md:py-28 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
              See FaceMojo in Action
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Watch how our AI transforms static photos into lifelike animations with facial expressions and lip-syncing
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-700/20 border border-purple-500/30"
          >
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 relative">
              {/* Animated code lines in background */}
              <div className="absolute inset-0 overflow-hidden opacity-20">
                <motion.div animate={controls} className="font-mono text-xs text-cyan-400 p-8">
                  <div className="mb-1">import * as tf from '@tensorflow/tfjs';</div>
                  <div className="mb-1">const model = await tf.loadLayersModel('facemojo/model.json');</div>
                  <div className="mb-1">const inputTensor = tf.browser.fromPixels(imageElement);</div>
                  <div className="mb-1">const normalized = inputTensor.div(255.0);</div>
                  <div className="mb-1">const batched = normalized.expandDims(0);</div>
                  <div className="mb-1">const prediction = await model.predict(batched);</div>
                  <div className="mb-1">const landmarks = prediction.dataSync();</div>
                  <div className="mb-1">applyAnimation(landmarks, targetCanvas);</div>
                </motion.div>
              </div>

              {/* Grid overlay */}
              <div className="absolute inset-0">
                <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f11_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f11_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              </div>

              <div className="text-center z-10">
                <div className="relative inline-block">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(168, 85, 247, 0.4)",
                        "0 0 0 20px rgba(168, 85, 247, 0)",
                        "0 0 0 0 rgba(168, 85, 247, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="w-24 h-24 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-purple-500/50"
                  >
                    <Play className="h-10 w-10 text-purple-400 fill-purple-400/30" />
                  </motion.div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">Real-time Demo Coming Soon</h3>
                <p className="mt-2 text-gray-300">We're putting the finishing touches on our interactive demo</p>
              </div>

              {/* Tech floating elements */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute top-6 left-6 bg-black/80 backdrop-blur-lg rounded-lg border border-purple-500/30 p-3 shadow-lg shadow-purple-700/20"
              >
                <div className="flex items-center space-x-3">
                  <Code className="h-4 w-4 text-cyan-400" />
                  <div className="text-xs font-mono text-cyan-400">
                    Neural Network: <span className="text-white">Active</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute top-6 right-6 bg-black/80 backdrop-blur-lg rounded-lg border border-purple-500/30 p-3 shadow-lg shadow-purple-700/20"
              >
                <div className="flex items-center space-x-3">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <div className="text-xs font-mono text-purple-400">
                    GPU: <span className="text-white">Accelerated</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 pointer-events-none"
              animate={{
                background: [
                  "linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
                  "linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                  "linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
                ],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-400 rounded-tl-md"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-md"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-pink-400 rounded-bl-md"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-400 rounded-br-md"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
