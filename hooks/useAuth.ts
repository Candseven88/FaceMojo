import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  signInAnonymousUser, 
  getCurrentUser, 
  authListener 
} from '../lib/firebase/auth';
import { 
  getUserUsage, 
  canGenerateThisWeek, 
  saveUsageLimitToLocalStorage,
  getUsageLimitFromLocalStorage
} from '../lib/firebase/usage';
import { serverTimestamp, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { getUserPlan, updateUserPlan, PlanType } from '../lib/firebase/userPlans';
import { upgradeUsageStatsForPaidUser } from '../lib/firebase/usage';

interface AuthState {
  user: User | null;
  loading: boolean;
  canGenerate: boolean;
  remainingAnimations: number;
  subscriptionExpired: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    canGenerate: false,
    remainingAnimations: 0,
    subscriptionExpired: false,
    error: null
  });

  // 检查订阅是否过期，如果过期则降级为免费用户
  const checkSubscriptionExpiry = async (user: User): Promise<boolean> => {
    try {
      // 获取用户订阅计划
      const planData = await getUserPlan(user.uid);
      
      // 如果用户没有订阅计划或已经是免费用户，无需检查
      if (!planData || planData.planType === 'free') {
        setState(prev => ({ ...prev, subscriptionExpired: false }));
        return false;
      }
      
      // 检查是否有过期日期且已过期
      if (planData.expireDate) {
        const expireDate = planData.expireDate.toDate();
        const now = new Date();
        
        if (now > expireDate) {
          // 更新用户计划为免费用户
          await updateUserPlan(user.uid, 'free');
          
          // 更新用户使用统计，将isProUser设为false，animationsLeft设为0
          const userStatsRef = doc(db, 'usageStats', user.uid);
          await setDoc(userStatsRef, {
            isProUser: false,
            animationsLeft: 0,
            lastUpdated: serverTimestamp()
          }, { merge: true });
          
          // 设置订阅过期状态
          setState(prev => ({ ...prev, subscriptionExpired: true }));
          
          return true; // 订阅已过期并已降级
        }
      }
      
      // 订阅未过期
      setState(prev => ({ ...prev, subscriptionExpired: false }));
      return false;
    } catch (error: any) {
      return false;
    }
  };

  // 检查用户是否可以生成动画
  const checkUserCanGenerate = async (user: User) => {
    try {
      // 首先检查订阅是否过期，如果过期则自动降级
      const wasDowngraded = await checkSubscriptionExpiry(user);
      
      // 查询Firestore获取最新的使用数据
      const usageData = await getUserUsage(user.uid);
      
      // 检查是否可以生成
      let canGenerate = false;
      let remainingAnimations = 0;
      
      if (usageData?.isProUser) {
        // 付费用户：检查剩余动画次数
        remainingAnimations = typeof usageData.animationsLeft === 'number' ? usageData.animationsLeft : 0;
        canGenerate = remainingAnimations > 0;
      } else {
        // 免费用户：检查本周是否已生成
        canGenerate = canGenerateThisWeek(usageData);
        // 免费用户每周只有1次，所以剩余数量是0或1
        remainingAnimations = canGenerate ? 1 : 0;
      }
      
      // 更新状态
      setState(prev => ({ 
        ...prev, 
        canGenerate, 
        remainingAnimations,
        loading: false 
      }));
      
      // 更新缓存
      saveUsageLimitToLocalStorage(canGenerate, user.uid);
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: `Failed to check usage limit: ${error.message}`, 
        loading: false,
        canGenerate: true, // 默认允许生成，以防错误情况
        remainingAnimations: 1
      }));
    }
  };

  // 登录并检查使用限制
  const initializeAuth = async () => {
    try {
      // 获取当前用户，如果没有则匿名登录
      let user = await getCurrentUser();
      
      if (!user) {
        user = await signInAnonymousUser();
      }
      
      if (user) {
        setState(prev => ({ ...prev, user }));
        await checkUserCanGenerate(user);
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to authenticate user', 
          loading: false 
        }));
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: `Authentication error: ${error.message}`, 
        loading: false 
      }));
    }
  };

  // 在用户成功生成视频后更新使用限制
  const updateUsageAfterGeneration = async () => {
    if (!state.user) return false;
    
    try {
      const uid = state.user.uid;
      
      // Get current usage data
      const usageData = await getUserUsage(uid);
      
      // Create update object with common fields
      const updateData: any = {
        lastGeneratedAt: serverTimestamp(),
        lastUsed: serverTimestamp()
      };
      
      // Check if user is a paid user (Pro/Basic)
      const isPaidUser = usageData?.isProUser === true;
      
      if (isPaidUser && typeof usageData?.animationsLeft === 'number') {
        // Update remaining animations for paid users
        const newCount = Math.max(0, usageData.animationsLeft - 1);
        updateData.animationsLeft = newCount;
        
        // For paid users, they can generate again if they have animations left
        const canGenerateNext = newCount > 0;
        setState(prev => ({ 
          ...prev, 
          canGenerate: canGenerateNext,
          remainingAnimations: newCount
        }));
        saveUsageLimitToLocalStorage(canGenerateNext, uid);
      } else {
        // For free users, they cannot generate again until next week
        setState(prev => ({ 
          ...prev, 
          canGenerate: false,
          remainingAnimations: 0 
        }));
        saveUsageLimitToLocalStorage(false, uid);
      }
      
      // Update the user's usage stats in Firestore
      const userDocRef = doc(db, 'usageStats', uid);
      await setDoc(userDocRef, updateData, { merge: true });
      
      return true;
    } catch (error: any) {
      return false;
    }
  };

  // 获取用户的剩余动画次数
  const getRemainingAnimations = async (): Promise<number> => {
    if (!state.user) return 0;
    
    try {
      const usageData = await getUserUsage(state.user.uid);
      
      if (usageData?.isProUser && typeof usageData.animationsLeft === 'number') {
        return usageData.animationsLeft;
      }
      
      // Free users don't have a counter, so return 1 if they can generate, 0 if not
      return state.canGenerate ? 1 : 0;
    } catch (error) {
      return 0;
    }
  };

  // 在组件挂载时初始化认证
  useEffect(() => {
    initializeAuth();
    
    // 设置认证状态监听器
    const unsubscribe = authListener((user) => {
      if (user) {
        setState(prev => ({ ...prev, user }));
        checkUserCanGenerate(user);
      } else {
        setState(prev => ({ 
          ...prev, 
          user: null, 
          loading: false, 
          canGenerate: false 
        }));
      }
    });
    
    return () => unsubscribe();
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    canGenerate: state.canGenerate,
    remainingAnimations: state.remainingAnimations,
    subscriptionExpired: state.subscriptionExpired,
    error: state.error,
    updateUsageAfterGeneration,
    getRemainingAnimations
  };
}; 