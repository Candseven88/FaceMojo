"use client"

import { motion } from "framer-motion"
import { Heart, Laugh, Star, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function UseCases() {
  const useCases = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Revive Precious Memories",
      description: "Animate a loved one's photo to smile and speak, bringing cherished memories back to life.",
      image: "/images/memories-use-case.png",
    },
    {
      icon: <Laugh className="h-6 w-6" />,
      title: "Make Your Friends Laugh",
      description: "Create hilarious deepfakes with friend photos and memes for endless entertainment.",
      image: "/images/friends-use-case.png",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Turn Yourself into a Star",
      description: "Sync your face with celebrity speeches or movie clips and become the star of the show.",
      image: "/images/star-use-case.png",
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Craft Creative Edits",
      description: "Use in storytelling, short films, or viral content to engage your audience like never before.",
      image: "/images/creative-use-case.png",
    },
  ]

  return (
    <section id="use-cases" className="py-20 md:py-28 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
            What Can You Create with FaceMojo?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Unleash your creativity with endless possibilities for animation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={useCase.image || "/placeholder.svg"}
                    alt={useCase.title}
                    width={320}
                    height={180}
                    className="object-contain w-full h-full bg-black rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                  {/* Floating icon */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center border border-purple-500/30">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className="text-purple-400"
                    >
                      {useCase.icon}
                    </motion.div>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{useCase.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 bg-black/50 backdrop-blur-md rounded-xl border border-purple-500/30 p-8 shadow-lg shadow-purple-700/10 relative overflow-hidden"
        >
          {/* Quote marks */}
          <div className="absolute top-4 left-4 text-8xl text-purple-500/20 font-serif">"</div>
          <div className="absolute bottom-4 right-4 text-8xl text-purple-500/20 font-serif">"</div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <p className="text-xl text-gray-200 italic mb-6">
              FaceMojo has completely transformed how I create content. The AI animation is so realistic, my followers
              can't believe it's generated from a single photo!
            </p>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-purple-500 bg-black flex items-center justify-center">
                <Image
                  src="/images/testimonial-avatar.png"
                  alt="Sarah Johnson"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <h4 className="text-white font-medium">Sarah Johnson</h4>
                <p className="text-gray-400 text-sm">Content Creator</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
