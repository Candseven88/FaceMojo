"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const { toast } = useToast()

  const handleSubscribe = (plan: string) => {
    // Here we would integrate with creem.io
    toast({
      title: `${plan} subscription`,
      description: "Redirecting to payment page...",
    })

    // In a real implementation, we would redirect to creem.io checkout
    setTimeout(() => {
      window.location.href = "/checkout"
    }, 1500)
  }

  return (
    <section id="pricing" className="py-20 md:py-28 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
            Choose Your Plan
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan for your needs and start bringing your photos to life today
          </p>

          <div className="flex items-center justify-center mt-8">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-full p-1 border border-purple-500/30">
              <div className="flex">
                <button
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-700/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setBillingCycle("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-700/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setBillingCycle("yearly")}
                >
                  Yearly
                  <span className="ml-1 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Save 20%</span>
                </button>
              </div>
            </div>
          </div>
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
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <p className="text-gray-400 mb-6">Perfect for getting started</p>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>

              <Button
                className="w-full bg-gray-800 hover:bg-gray-700 text-white mb-8"
                onClick={() => handleSubscribe("Free")}
              >
                Get Started
              </Button>

              <ul className="space-y-4">
                <PricingFeature included>5 animations per month</PricingFeature>
                <PricingFeature included>720p resolution</PricingFeature>
                <PricingFeature included>Basic templates</PricingFeature>
                <PricingFeature included>FaceMojo watermark</PricingFeature>
                <PricingFeature>Priority processing</PricingFeature>
                <PricingFeature>API access</PricingFeature>
              </ul>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-gray-900 to-gray-900/90 rounded-2xl border border-purple-500/50 overflow-hidden relative transform md:scale-105 md:-translate-y-2 shadow-xl shadow-purple-700/10"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"></div>
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                Popular
              </span>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-400 mb-6">For professionals and content creators</p>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-white">${billingCycle === "monthly" ? "9.99" : "7.99"}</span>
                <span className="text-gray-400 ml-2">
                  /{billingCycle === "monthly" ? "month" : "month, billed yearly"}
                </span>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-purple-700/20 mb-8"
                onClick={() => handleSubscribe("Pro")}
              >
                Subscribe Now
              </Button>

              <ul className="space-y-4">
                <PricingFeature included>50 animations per month</PricingFeature>
                <PricingFeature included>1080p resolution</PricingFeature>
                <PricingFeature included>All templates</PricingFeature>
                <PricingFeature included>No watermark</PricingFeature>
                <PricingFeature included>Priority processing</PricingFeature>
                <PricingFeature>API access</PricingFeature>
              </ul>
            </div>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
              <p className="text-gray-400 mb-6">For businesses and power users</p>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-white">${billingCycle === "monthly" ? "24.99" : "19.99"}</span>
                <span className="text-gray-400 ml-2">
                  /{billingCycle === "monthly" ? "month" : "month, billed yearly"}
                </span>
              </div>

              <Button
                className="w-full bg-gray-800 hover:bg-gray-700 text-white mb-8"
                onClick={() => handleSubscribe("Premium")}
              >
                Subscribe Now
              </Button>

              <ul className="space-y-4">
                <PricingFeature included>Unlimited animations</PricingFeature>
                <PricingFeature included>4K resolution</PricingFeature>
                <PricingFeature included>All templates + exclusive</PricingFeature>
                <PricingFeature included>No watermark</PricingFeature>
                <PricingFeature included>Priority processing</PricingFeature>
                <PricingFeature included>API access</PricingFeature>
                <PricingFeature included>Dedicated support</PricingFeature>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Creem.io Integration Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-gray-900/80 backdrop-blur-md rounded-xl border border-purple-500/30 px-6 py-4">
            <img src="/images/creem-logo.png" alt="Creem.io" className="h-6 mr-3" />
            <p className="text-gray-300 text-sm">
              Secure payments powered by <span className="text-white font-medium">Creem.io</span>
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800 p-6">
              <h4 className="text-lg font-medium text-white mb-3">Can I change plans anytime?</h4>
              <p className="text-gray-300">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes to your subscription
                will take effect immediately.
              </p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800 p-6">
              <h4 className="text-lg font-medium text-white mb-3">How does the billing work?</h4>
              <p className="text-gray-300">
                We use Creem.io for secure payment processing. You'll be charged at the beginning of each billing cycle,
                and you can manage your payment methods in your account settings.
              </p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800 p-6">
              <h4 className="text-lg font-medium text-white mb-3">What payment methods are accepted?</h4>
              <p className="text-gray-300">
                We accept all major credit cards, PayPal, and Apple Pay through our Creem.io integration. All
                transactions are secure and encrypted.
              </p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-800 p-6">
              <h4 className="text-lg font-medium text-white mb-3">Do you offer refunds?</h4>
              <p className="text-gray-300">
                We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with our service,
                contact our support team within 7 days of your purchase.
              </p>
            </div>
          </div>
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
