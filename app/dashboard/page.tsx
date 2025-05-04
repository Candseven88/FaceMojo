"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("creations")

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Dashboard Header */}
      <header className="bg-black/80 backdrop-blur-lg border-b border-purple-500/20 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
                  FaceMojo
                </h1>
              </a>
              <nav className="hidden md:flex ml-10 space-x-8">
                <a
                  href="#"
                  className={`text-sm font-medium transition-colors ${
                    activeTab === "creations" ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("creations")}
                >
                  My Creations
                </a>
                <a
                  href="#"
                  className={`text-sm font-medium transition-colors ${
                    activeTab === "templates" ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("templates")}
                >
                  Templates
                </a>
                <a
                  href="#"
                  className={`text-sm font-medium transition-colors ${
                    activeTab === "subscription" ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("subscription")}
                >
                  Subscription
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-gray-800">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-500"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Image
                      src="/images/avatar-placeholder.png"
                      alt="User avatar"
                      className="rounded-full object-cover"
                      fill
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border border-gray-800 text-white" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-400">john.doe@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 scrollbar-hide">
            <button
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium mr-2 ${
                activeTab === "creations" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("creations")}
            >
              My Creations
            </button>
            <button
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium mr-2 ${
                activeTab === "templates" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("templates")}
            >
              Templates
            </button>
            <button
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium mr-2 ${
                activeTab === "subscription"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("subscription")}
            >
              Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6 mb-8 shadow-lg shadow-purple-700/10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back, John!</h2>
              <p className="text-gray-300">You have 3 animations remaining in your free plan.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-purple-700/20">
                Create New Animation
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        {activeTab === "creations" && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Recent Creations</h3>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  View All
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: item * 0.1 }}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={`/images/creation-${item}.png`}
                        alt={`Creation ${item}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h4 className="text-white font-medium">Animation #{item}</h4>
                        <p className="text-gray-300 text-sm">Created 2 days ago</p>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="h-8 px-2 border-gray-700 text-gray-300">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-2 border-gray-700 text-gray-300">
                          Share
                        </Button>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscription" && (
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h3 className="text-xl font-bold text-white mb-6">Your Subscription</h3>
              <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6 shadow-lg shadow-purple-700/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 mb-2">
                      Current Plan
                    </div>
                    <h4 className="text-lg font-bold text-white">Free Plan</h4>
                    <p className="text-gray-300 mt-1">3 animations remaining this month</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-purple-700/20">
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Available Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-white">Free</h4>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold text-white">$0</span>
                      <span className="ml-1 text-gray-400">/month</span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">5 animations per month</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">720p resolution</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">Basic templates</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">FaceMojo watermark</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-900 p-6">
                    <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white" disabled>
                      Current Plan
                    </Button>
                  </div>
                </motion.div>

                {/* Pro Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-purple-500 overflow-hidden relative"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"></div>
                  <div className="p-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 mb-2">
                      Popular
                    </div>
                    <h4 className="text-lg font-bold text-white">Pro</h4>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold text-white">$9.99</span>
                      <span className="ml-1 text-gray-400">/month</span>
                    </div>
                    <ul className="mt-6 space-y-3">
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
                        <span className="ml-2 text-gray-300">All templates</span>
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
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">Priority processing</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-900 p-6">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-purple-700/20">
                      Upgrade to Pro
                    </Button>
                  </div>
                </motion.div>

                {/* Premium Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-white">Premium</h4>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold text-white">$24.99</span>
                      <span className="ml-1 text-gray-400">/month</span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">Unlimited animations</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">4K resolution</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">All templates + exclusive</span>
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
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">API access</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-300">Dedicated support</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-900 p-6">
                    <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">Upgrade to Premium</Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
