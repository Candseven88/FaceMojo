import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "./firebase"
import { saveAnimationToFirestore } from "./saveAnimationToFirestore"

/**
 * Handles animation generation logic for free users and subscribers.
 * Supports: Free Trial (1 time), Basic Plan (10/month), Pro Plan (50/month).
 */
export async function handleAnimationGeneration(user: any, videoUrl: string): Promise<string> {
  try {
    const uid = user.uid

    const usageRef = doc(db, "usageStats", uid)
    const subRef = doc(db, "userSubscriptions", uid)

    const [usageSnap, subSnap] = await Promise.all([
      getDoc(usageRef),
      getDoc(subRef)
    ])

    // ✅ 1. Pro or Basic Plan logic
    if (subSnap.exists()) {
      const data = subSnap.data()
      const plan = data.plan
      const left = data.animationsLeft

      if (typeof left === "number" && left > 0) {
        await updateDoc(subRef, { animationsLeft: left - 1 })
        await saveAnimationToFirestore(uid, videoUrl, "AI Animation")
        return `✅ Animation generated! You now have ${left - 1} remaining.`
      } else {
        return "❌ You have used all your animations. Please upgrade or wait for next month."
      }
    }

    // ✅ 2. Free Trial logic
    if (usageSnap.exists()) {
      return "❌ You've already used your 1 free animation. Please upgrade to continue."
    }

    await setDoc(usageRef, {
      used: true,
      timestamp: new Date(),
    })
    await saveAnimationToFirestore(uid, videoUrl, "AI Animation")
    return "✅ Free animation generated! Enjoy 🎉"
  } catch (e) {
    console.error("❌ Error during animation generation:", e)
    return "❌ An unexpected error occurred. Please try again later."
  }
}