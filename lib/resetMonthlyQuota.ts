import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "./firebase"

export async function resetMonthlyQuota() {
  const subRef = collection(db, "userSubscriptions")
  const snapshot = await getDocs(subRef)

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  for (const userDoc of snapshot.docs) {
    const data = userDoc.data()
    const lastReset = data.lastResetAt?.toDate?.() || new Date(2000, 0, 1) // 默认很早的时间

    const lastMonth = lastReset.getMonth()
    const lastYear = lastReset.getFullYear()

    if (lastMonth !== currentMonth || lastYear !== currentYear) {
      let animationsLeft = 0

      if (data.plan === "basic") {
        animationsLeft = 10
      } else if (data.plan === "pro") {
        animationsLeft = 50
      } else {
        continue // 非法套餐
      }

      await updateDoc(doc(db, "userSubscriptions", userDoc.id), {
        animationsLeft,
        lastResetAt: new Date()
      })

      console.log(`✅ Reset for ${userDoc.id}: ${animationsLeft} animations.`)
    }
  }

  console.log("✅ Monthly reset complete.")
}