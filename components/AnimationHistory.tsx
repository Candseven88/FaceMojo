"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { format } from "date-fns"

export default function AnimationHistory() {
  const [animations, setAnimations] = useState<any[]>([])

  useEffect(() => {
    const fetchAnimations = async () => {
      const user = auth.currentUser
      if (!user) return

      const animationsRef = collection(db, "animations")
      const q = query(animationsRef, where("uid", "==", user.uid))
      const snapshot = await getDocs(q)

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setAnimations(data)
    }

    fetchAnimations()
  }, [])

  if (!animations.length) {
    return <p className="text-gray-400">You haven't generated any animations yet.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {animations.map((anim) => (
        <div key={anim.id} className="bg-gray-800 rounded-lg p-4 shadow">
          <img
            src={anim.imageUrl || "/images/video-placeholder.png"}
            alt={anim.title}
            className="w-full h-48 object-cover rounded mb-2"
          />
          <h3 className="text-lg font-bold text-white mb-1">{anim.title || "Untitled"}</h3>
          <p className="text-sm text-gray-400 mb-2">
            {anim.createdAt?.seconds
              ? format(new Date(anim.createdAt.seconds * 1000), "PPpp")
              : "Unknown time"}
          </p>
          <a
            href={anim.imageUrl}
            target="_blank"
            className="text-blue-400 text-sm hover:underline"
            rel="noreferrer"
          >
            🔗 View / Download
          </a>
        </div>
      ))}
    </div>
  )
}