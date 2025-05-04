"use client"

import { motion } from "framer-motion"
import { Check, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

export function PricingSection() {
  const { toast } = useToast()
  return (
    <section id="pricing" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
            Choose Your Plan
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Pick the right plan and start animating your photos with FaceMojo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-2">Free Trial</h3>
              <p className="text-gray-400 mb-6">Try 1 animation for free</p>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400 ml-2">/ one-time</span>
              </div>
              <button
                onClick={() => {
                  if (localStorage.getItem("freeTrialUsed")) {
                    toast({
                      title: "Trial already used",
                      description: "You’ve already used your free trial.",
                    });
                    return;
                  } else {
                    localStorage.setItem("freeTrialUsed", "true");
                    const target = document.getElementById("features");
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = "/#features";
                    }
                  }
                }}
                className="w-full block text-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg mb-8"
              >
                Try Free
              </button>
              <ul className="space-y-4">
                <PricingFeature included>1 animation only</PricingFeature>
                <PricingFeature included>Standard quality (512×512)</PricingFeature>
                <PricingFeature included>FaceMojo watermark</PricingFeature>
                <PricingFeature>Priority processing</PricingFeature>
              </ul>
            </div>
          </motion.div>

          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-gray-900 to-gray-900/90 rounded-2xl border border-purple-500/50 overflow-hidden relative transform md:scale-105 md:-translate-y-2 shadow-xl shadow-purple-700/10"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"></div>
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300">
                Recommended
              </span>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
              <p className="text-gray-400 mb-6">10 animations / month</p>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-white">$5</span>
                <span className="text-gray-400 ml-2">/ month</span>
              </div>
              <a
                href="https://www.creem.io/payment/prod_FDwwEsjdqfy6bQ6MZ4T0p"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg mb-8"
              >
                Subscribe
              </a>
              <ul className="space-y-4">
                <PricingFeature included>10 animations / month</PricingFeature>
                <PricingFeature included>Enhanced quality (optimized for mobile)</PricingFeature>
                <PricingFeature included>No watermark</PricingFeature>
                <PricingFeature included>Priority processing</PricingFeature>
              </ul>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="p-8">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                  Best Value
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-400 mb-6">50 animations / month</p>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-white">$15</span>
                <span className="text-gray-400 ml-2">/ month</span>
              </div>
              <a
                href="https://www.creem.io/payment/prod_7GcWnmwWJ9vqqO8LirnCCA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg mb-8"
              >
                Subscribe
              </a>
              <ul className="space-y-4">
                <PricingFeature included>50 animations / month</PricingFeature>
                <PricingFeature included>Best quality + priority rendering</PricingFeature>
                <PricingFeature included>No watermark</PricingFeature>
                <PricingFeature included>Priority processing</PricingFeature>
                <PricingFeature included>API access (coming soon)</PricingFeature>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function PricingFeature({ children, included = false }: { children: React.ReactNode; included?: boolean }) {
  return (
    <li className="flex items-start">
      {included ? (
        <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
      ) : (
        <span className="h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-600"></span>
        </span>
      )}
      <span className={`ml-3 ${included ? "text-gray-300" : "text-gray-500 line-through"}`}>{children}</span>
      {!included && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-1.5 text-gray-500 hover:text-gray-400">
                <HelpCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 border-gray-800 text-white">
              <p>Available in higher tier plans</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </li>
  )
}