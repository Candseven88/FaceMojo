"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { signInAnonymouslyIfNeeded } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { PricingCard } from "@/components/pricing-section"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import AnimationHistory from "@/components/AnimationHistory"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("creations")
  const [currentPlan, setCurrentPlan] = useState("Free Trial")

  useEffect(() => {
    signInAnonymouslyIfNeeded()
  }, [])

  // 自动登录判断 + 读取订阅状态
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login")
      } else {
        try {
          const subRef = doc(db, "userSubscriptions", user.uid)
          const subSnap = await getDoc(subRef)
          if (subSnap.exists()) {
            const data = subSnap.data()
            const plan = data.plan
            const animationsLeft = data.animationsLeft ?? 0
            setCurrentPlan(
              (plan === "basic" ? "Basic Plan" : plan === "pro" ? "Pro Plan" : "Free Trial") +
              ` (${animationsLeft} animations left)`
            )
          }
        } catch (err) {
          console.error("Failed to fetch subscription plan", err)
        }
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("userPlan")
      toast({ title: "Logged out", description: "You have been successfully logged out." })
      router.push("/login")
    } catch {
      toast({ title: "Logout failed", description: "Please try again.", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-lg border-b border-purple-500/20 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">FaceMojo</a>
            <nav className="hidden md:flex ml-10 space-x-8">
              {["creations", "templates", "subscription"].map(tab => (
                <a
                  key={tab}
                  href="#"
                  className={`text-sm font-medium transition-colors ${activeTab === tab ? "text-white" : "text-gray-400 hover:text-white"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-500" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Image src="/images/avatar-placeholder.png" alt="User" className="rounded-full object-cover" fill />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border border-gray-800 text-white" align="end">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-400">john.doe@example.com</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="text-gray-300 focus:bg-gray-800"><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 focus:bg-gray-800"><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="text-gray-300 focus:bg-gray-800" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gray-900/80 rounded-2xl border border-purple-500/30 p-6 mb-8 shadow-lg shadow-purple-700/10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {auth.currentUser?.displayName || auth.currentUser?.uid.slice(0, 6)}!
              </h2>
              <p className="text-gray-300">Your current plan: <strong>{currentPlan}</strong></p>
            </div>
            <Button
              onClick={() => router.push("/#upload-flow")}
              className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
            >
              Create New Animation
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        {activeTab === "creations" && <AnimationHistory />}
        {activeTab === "subscription" && (
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h3 className="text-xl font-bold mb-6">Your Subscription</h3>
              <div className="bg-gray-900/80 rounded-2xl border border-purple-500/30 p-6 shadow-lg">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <div className="text-xs font-medium bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full mb-2">Current Plan</div>
                    <h4 className="text-lg font-bold">{currentPlan}</h4>
                    <p className="text-gray-300 mt-1">Auto-loaded from Firebase</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-4">
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
                      onClick={() => router.push("/checkout?plan=basic")}
                    >
                      Upgrade to Basic
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      onClick={() => router.push("/checkout?plan=pro")}
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* 所有套餐选项卡片展示 */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
                  Choose Your Plan
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Pick the right plan and start animating your photos with FaceMojo.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

                <PricingCard
                  title="Basic"
                  subtitle="10 animations / month"
                  price="$5"
                  priceUnit="/ month"
                  buttonText="Upgrade to Basic"
                  onClick={() => {
                    localStorage.setItem("userPlan", "basic")
                    router.push("/checkout?plan=basic")
                  }}
                  features={[
                    "10 animations / month",
                    "Enhanced quality (optimized for mobile)",
                    "No watermark",
                    "Priority processing",
                  ]}
                  highlight="Recommended"
                />

                <PricingCard
                  title="Pro"
                  subtitle="50 animations / month"
                  price="$15"
                  priceUnit="/ month"
                  buttonText="Upgrade to Pro"
                  onClick={() => {
                    localStorage.setItem("userPlan", "pro")
                    router.push("/checkout?plan=pro")
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
          </div>
        )}
      </main>
    </div>
  )
}