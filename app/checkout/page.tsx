"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { doc, setDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"

function CheckoutHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const handlePlan = async () => {
      const plan = searchParams.get("plan")
      if (plan === "basic" || plan === "pro") {
        try {
          localStorage.setItem("userPlan", plan)
          console.log(`✅ Plan saved to localStorage: ${plan}`)

          const user = auth.currentUser
          if (user) {
            const subscriptionRef = doc(db, "userSubscriptions", user.uid)
            let animations = plan === "basic" ? 10 : 50

            await setDoc(subscriptionRef, {
              plan,
              animationsLeft: animations,
              subscribedAt: new Date(),
            })
            console.log(`✅ Plan also saved to Firebase: ${plan}`)
          } else {
            console.warn("❌ Cannot save to Firebase: no user")
          }
        } catch (e) {
          console.warn("❌ Failed to save plan info", e)
        }
      }

      setTimeout(() => {
        router.push("/")
      }, 2000)
    }

    handlePlan()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white text-center px-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">🎉 Subscription Successful!</h1>
        <p className="text-lg">Thank you for upgrading. You will be redirected shortly...</p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Loading...</div>}>
      <CheckoutHandler />
    </Suspense>
  )
}