import { db } from './config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';

// 使用统计集合名称
const COLLECTION_NAME = 'usageStats';

// 用户使用数据接口
interface UserUsageData {
  lastGeneratedAt: Timestamp | null;
  isProUser?: boolean;
  animationsLeft?: number;
  lastUsed?: Timestamp;
}

// 获取用户使用数据
export const getUserUsage = async (uid: string): Promise<UserUsageData | null> => {
  try {
    const userDocRef = doc(db, COLLECTION_NAME, uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserUsageData;
    } else {
      // 如果文档不存在，创建一个新的
      const newUserData: UserUsageData = {
        lastGeneratedAt: null
      };
      await setDoc(userDocRef, newUserData);
      return newUserData;
    }
  } catch (error: any) {
    console.error('获取用户使用数据失败:', error.message);
    return null;
  }
};

// 更新最后生成时间
export const updateLastGeneratedTime = async (uid: string): Promise<boolean> => {
  try {
    const userDocRef = doc(db, COLLECTION_NAME, uid);
    
    // Get current usage data
    const currentUsage = await getUserUsage(uid);
    
    const updateData: any = {
      lastGeneratedAt: serverTimestamp()
    };
    
    // If user has animations left, decrement
    if (currentUsage?.isProUser && typeof currentUsage?.animationsLeft === 'number') {
      updateData.animationsLeft = Math.max(0, currentUsage.animationsLeft - 1);
    }
    
    await setDoc(userDocRef, updateData, { merge: true });
    return true;
  } catch (error: any) {
    console.error('更新使用数据失败:', error.message);
    return false;
  }
};

/**
 * Upgrade user's usage stats for paid plans
 * 
 * @param uid User ID
 * @param planType Plan type ('basic' or 'pro')
 * @returns Promise that resolves when the update is complete
 */
export const upgradeUsageStatsForPaidUser = async (
  uid: string,
  planType: 'basic' | 'pro'
): Promise<void> => {
  try {
    const userDocRef = doc(db, COLLECTION_NAME, uid);
    
    // Determine animations allocation based on plan type
    const animationsLeft = planType === 'basic' ? 10 : 50;
    
    // Update user's usage stats for paid plan
    await setDoc(userDocRef, {
      isProUser: true,
      animationsLeft,
      lastUsed: serverTimestamp()
    }, { merge: true });
    
    console.log(`Successfully upgraded usage stats for user ${uid} with ${planType} plan`);
  } catch (error: any) {
    console.error('Error upgrading usage stats for paid user:', error.message);
    throw new Error(`Failed to upgrade usage stats: ${error.message}`);
  }
};

// 检查用户是否可以在本周内生成动画
export const canGenerateThisWeek = (usageData: UserUsageData | null): boolean => {
  if (!usageData) return true;
  
  // If user is a paid user with animations left, they can generate
  if (usageData.isProUser && typeof usageData.animationsLeft === 'number' && usageData.animationsLeft > 0) {
    return true;
  }
  
  // Free users are limited by time
  if (!usageData.lastGeneratedAt) {
    return true; // 如果没有使用记录，可以生成
  }
  
  // 获取最后生成时间的日期
  const lastGenDate = usageData.lastGeneratedAt.toDate();
  const now = new Date();
  
  // 计算本周的起始日期（从周一开始）
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay() || 7; // 将周日从0转换为7
  // 如果不是周一，将日期设置为本周一
  if (day !== 1) {
    startOfWeek.setHours(-24 * (day - 1));
  }
  startOfWeek.setHours(0, 0, 0, 0);
  
  // 检查最后生成时间是否在本周之内
  return lastGenDate < startOfWeek;
};

// 获取剩余动画生成次数
export const getRemainingAnimations = (usageData: UserUsageData | null): number => {
  if (!usageData || !usageData.isProUser || typeof usageData.animationsLeft !== 'number') {
    return 0;
  }
  
  return usageData.animationsLeft;
};

// 将使用限制信息保存到localStorage
export const saveUsageLimitToLocalStorage = (canGenerate: boolean, uid: string) => {
  try {
    const usageInfo = {
      canGenerate,
      uid,
      checkedAt: new Date().toISOString()
    };
    localStorage.setItem('facemojo_usage_limit', JSON.stringify(usageInfo));
  } catch (error) {
    console.error('保存使用限制到localStorage失败:', error);
  }
};

// 从localStorage获取使用限制信息
export const getUsageLimitFromLocalStorage = (uid: string): { canGenerate: boolean, isValid: boolean } => {
  try {
    const storedInfo = localStorage.getItem('facemojo_usage_limit');
    if (!storedInfo) {
      return { canGenerate: true, isValid: false };
    }
    
    const usageInfo = JSON.parse(storedInfo);
    
    // 验证是否为同一用户
    if (usageInfo.uid !== uid) {
      return { canGenerate: true, isValid: false };
    }
    
    // 验证检查时间是否为本周
    const checkedAt = new Date(usageInfo.checkedAt);
    const now = new Date();
    
    // 如果是同一天，视为有效
    if (checkedAt.toDateString() === now.toDateString()) {
      return { canGenerate: usageInfo.canGenerate, isValid: true };
    }
    
    // 检查是否在同一周
    const startOfThisWeek = new Date(now);
    const day = startOfThisWeek.getDay() || 7;
    if (day !== 1) {
      startOfThisWeek.setHours(-24 * (day - 1));
    }
    startOfThisWeek.setHours(0, 0, 0, 0);
    
    if (checkedAt >= startOfThisWeek) {
      return { canGenerate: usageInfo.canGenerate, isValid: true };
    }
    
    return { canGenerate: true, isValid: false };
  } catch (error) {
    return { canGenerate: true, isValid: false };
  }
};

/**
 * Decrement animations left for paid users
 * 
 * @param uid User ID
 * @returns Promise that resolves when the update is complete
 */
export const decrementAnimationsLeft = async (uid: string): Promise<void> => {
  try {
    const userDocRef = doc(db, COLLECTION_NAME, uid);
    
    // Get current usage data
    const usageDoc = await getDoc(userDocRef);
    
    if (!usageDoc.exists()) {
      console.error('Usage document does not exist for user:', uid);
      return;
    }
    
    const userData = usageDoc.data() as UserUsageData;
    
    // Only decrement if this is a paid user with animations left
    if (userData.isProUser && typeof userData.animationsLeft === 'number' && userData.animationsLeft > 0) {
      // Update document with decremented value
      await setDoc(userDocRef, {
        animationsLeft: userData.animationsLeft - 1,
        lastUsed: serverTimestamp()
      }, { merge: true });
      
      console.log(`Decremented animations left for user ${uid}. Remaining: ${userData.animationsLeft - 1}`);
    } else {
      console.log(`No animations left to decrement for user ${uid} or not a paid user`);
    }
  } catch (error: any) {
    console.error('Error decrementing animations left:', error.message);
    throw new Error(`Failed to decrement animations left: ${error.message}`);
  }
}; 