// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app"
import { getAuth, signInAnonymously } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// ✅ Step 1: 正确配置 Firebase config（保持你的值）
const firebaseConfig = {
  apiKey: "AIzaSyD3r97BabQ1M06tpQbuUGH70mNVALvc-Zc",
  authDomain: "facemojo-ccb1b.firebaseapp.com",
  projectId: "facemojo-ccb1b",
  storageBucket: "facemojo-ccb1b.appspot.com",
  messagingSenderId: "7085206135",
  appId: "1:7085206135:web:b4ec995e9b3c70e201f472"
}

// ✅ Step 2: 初始化 app（避免重复初始化）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// ✅ Step 3: 导出 auth 和 db，供其他文件使用
export const auth = getAuth(app)
export const db = getFirestore(app)

// ✅ Step 4: 匿名登录函数
export const signInAnonymouslyIfNeeded = async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      await signInAnonymously(auth)
      console.log("Signed in anonymously")
    }
  } catch (error) {
    console.error("Error signing in anonymously:", error)
  }
}