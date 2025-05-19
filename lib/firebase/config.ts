// Firebase 配置
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 你的Firebase配置
// 请替换为你的实际Firebase项目配置
const firebaseConfig = {
  apiKey: "AIzaSyD3r97BabQ1M06tpQbuUGH70mNVALvc-Zc",
  authDomain: "facemojo-ccb1b.firebaseapp.com",
  projectId: "facemojo-ccb1b",
  storageBucket: "facemojo-ccb1b.firebasestorage.app",
  messagingSenderId: "7085206135",
  appId: "1:7085206135:web:b4ec995e9b3c70e201f472"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 