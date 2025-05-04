"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate payment processing with creem.io
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Payment successful",
        description: "Your subscription has been activated.",
      })
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 shadow-xl shadow-purple-700/10"
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-white">Checkout</h1>
              <div className="flex items-center">
                <img src="/images/creem-logo.png" alt="Creem.io" className="h-6 mr-2" />
                <span className="text-sm text-gray-400">Secure payment by Creem.io</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-medium text-white mb-4">Payment Method</h2>
                      <RadioGroup defaultValue="card" className="space-y-3">
                        <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <RadioGroupItem value="card" id="card" className="border-gray-600 text-purple-500" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                              <span>Credit / Debit Card</span>
                            </div>
                          </Label>
                          <div className="flex space-x-1">
                            <div className="w-8 h-5 bg-gray-700 rounded"></div>
                            <div className="w-8 h-5 bg-gray-700 rounded"></div>
                            <div className="w-8 h-5 bg-gray-700 rounded"></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <RadioGroupItem value="paypal" id="paypal" className="border-gray-600 text-purple-500" />
                          <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <span className="font-bold text-blue-400">Pay</span>
                              <span className="font-bold text-blue-600">Pal</span>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-lg font-medium text-white">Card Information</h2>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                          />
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Name on Card</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-purple-700/20 h-12"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Lock className="h-4 w-4 mr-2" />
                            Pay Now
                          </div>
                        )}
                      </Button>
                      <p className="text-xs text-gray-400 text-center mt-3">
                        By clicking "Pay Now", you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              <div className="md:col-span-2">
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                  <h2 className="text-lg font-medium text-white mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Pro Plan (Monthly)</span>
                      <span className="text-white">$9.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tax</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between font-medium">
                      <span className="text-gray-300">Total</span>
                      <span className="text-white">$9.99</span>
                    </div>
                  </div>

                  <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                    <h3 className="font-medium text-white mb-2">Pro Plan Includes:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">50 animations per month</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">1080p resolution</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">No watermark</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
