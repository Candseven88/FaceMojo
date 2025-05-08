"use client"

import { motion } from "framer-motion"
import { Check, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

export function PricingSection() {
  const { toast } = useToast()

  return (
    <section id="pricing" className="py-20 md:py-28 relative">
      {/* Background Glow */}
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
          {/* Free Trial */}
          <PricingCard
            title="Free Trial"
            subtitle="Try 1 animation for free"
            price="$0"
            priceUnit="/ one-time"
            buttonText="Try Free"
            onClick={() => {
              if (localStorage.getItem("freeTrialUsed")) {
                toast({ title: "Trial already used", description: "You’ve already used your free trial." })
              } else {
                localStorage.setItem("freeTrialUsed", "true")
                toast({ title: "Free Trial Activated", description: "You can now generate 1 animation." })
              }
            }}
            features={[
              "1 animation only",
              "Standard quality (512×512)",
              "FaceMojo watermark",
              { label: "Priority processing", included: false },
            ]}
            highlight=""
          />

          {/* Basic Plan */}
          <PricingCard
            title="Basic"
            subtitle="10 animations / month"
            price="$5"
            priceUnit="/ month"
            buttonText="Upgrade to Basic"
            onClick={() => {
              localStorage.setItem("userPlan", "basic")
              window.location.href = "https://www.creem.io/payment/prod_FDwwEsjdqfy6bQ6MZ4T0p"
            }}
            features={[
              "10 animations / month",
              "Enhanced quality (optimized for mobile)",
              "No watermark",
              "Priority processing",
            ]}
            highlight="Recommended"
          />

          {/* Pro Plan */}
          <PricingCard
            title="Pro"
            subtitle="50 animations / month"
            price="$15"
            priceUnit="/ month"
            buttonText="Upgrade to Pro"
            onClick={() => {
              localStorage.setItem("userPlan", "pro")
              window.location.href = "https://www.creem.io/payment/prod_7GcWnmwWJ9vqqO8LirnCCA"
            }}
            features={[
              "50 animations / month",
              "Best quality + priority rendering",
              "No watermark",
              "Priority processing",
              "API access (coming soon)",
            ]}
            highlight="Best Value"
          />
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  title,
  subtitle,
  price,
  priceUnit,
  buttonText,
  onClick,
  features,
  highlight,
}: {
  title: string
  subtitle: string
  price: string
  priceUnit: string
  buttonText: string
  onClick: () => void
  features: (string | { label: string; included: boolean })[]
  highlight?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden relative ${highlight === "Recommended" ? "border-cyan-500/50 shadow-lg shadow-cyan-500/20" : ""
        } ${highlight === "Best Value" ? "border-yellow-400/40 shadow-lg shadow-yellow-400/10" : ""}`}
    >
      {highlight && (
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${highlight === "Recommended"
                ? "bg-cyan-500/20 text-cyan-300"
                : "bg-yellow-500/20 text-yellow-300"
              }`}
          >
            {highlight}
          </span>
        </div>
      )}
      <div className="p-8">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{subtitle}</p>
        <div className="flex items-baseline mb-8">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-400 ml-2">{priceUnit}</span>
        </div>
        <button
          onClick={onClick}
          className={`w-full block text-center px-4 py-2 rounded-lg mb-8 text-white ${(highlight === "Recommended" || highlight === "Best Value")
              ? "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-0 shadow-lg shadow-purple-700/20"
              : "bg-gray-800 hover:bg-gray-700"
            }`}
        >
          {buttonText}
        </button>
        <ul className="space-y-4">
          {features.map((feature, idx) => {
            if (typeof feature === "string") {
              return <PricingFeature key={idx} included>{feature}</PricingFeature>
            }
            return <PricingFeature key={idx} included={feature.included}>{feature.label}</PricingFeature>
          })}
        </ul>
      </div>
    </motion.div>
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
export { PricingCard }