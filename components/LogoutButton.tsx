"use client"

import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("userPlan")
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-md shadow-md hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 cursor-pointer"
    >
      Logout
    </button>
  )
}