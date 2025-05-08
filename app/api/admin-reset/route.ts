// app/api/admin-reset/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export async function POST(req: Request) {
  const body = await req.json()
  const { uid, plan } = body

  if (!uid || !plan) {
    return NextResponse.json({ error: "Missing uid or plan" }, { status: 400 })
  }

  const maxCount = plan === "pro" ? 50 : plan === "basic" ? 10 : 0
  const userRef = doc(db, "userSubscriptions", uid)

  await updateDoc(userRef, {
    animationsLeft: maxCount,
    lastReset: new Date(),
  })

  return NextResponse.json({ success: true, newLimit: maxCount })
}