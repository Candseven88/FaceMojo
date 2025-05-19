import { auth } from './config';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

// 匿名登录
export const signInAnonymousUser = async (): Promise<User | null> => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error: any) {
    console.error('匿名登录失败:', error.message);
    return null;
  }
};

// 获取当前用户
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// 监听认证状态变化
export const authListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 