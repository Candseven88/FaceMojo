import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { updateUserPlan, getUserPlan, PlanType } from '../firebase/userPlans';
import { upgradeUsageStatsForPaidUser, getRemainingAnimations, getUserUsage } from '../firebase/usage';

interface SubscriptionState {
  loading: boolean;
  currentPlan: PlanType;
  remainingAnimations: number;
  expiryDate: Date | null;
  error: string | null;
}

/**
 * Hook for managing user subscription functionality
 * 
 * @param user Firebase User object
 * @returns Subscription state and management functions
 */
export const useSubscription = (user: User | null) => {
  const [state, setState] = useState<SubscriptionState>({
    loading: true,
    currentPlan: 'free',
    remainingAnimations: 0,
    expiryDate: null,
    error: null
  });
  
  // Fetch user's subscription details
  const fetchSubscriptionDetails = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // Get user plan details
      const planData = await getUserPlan(user.uid);
      const currentPlan = planData?.planType || 'free';
      
      // Get expiry date if available
      let expiryDate: Date | null = null;
      if (planData?.expireDate) {
        expiryDate = planData.expireDate.toDate();
      }
      
      // Get remaining animations
      const usageData = await getUserUsage(user.uid);
      const remainingAnimations = getRemainingAnimations(usageData);
      
      setState({
        loading: false,
        currentPlan,
        remainingAnimations,
        expiryDate,
        error: null
      });
      
    } catch (error: any) {
      console.error('Error fetching subscription details:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Failed to load subscription details: ${error.message}`
      }));
    }
  }, [user]);
  
  // Subscribe user to a plan
  const subscribeToPlan = async (
    planType: 'basic' | 'pro', 
    paymentId: string
  ): Promise<boolean> => {
    if (!user) {
      setState(prev => ({
        ...prev,
        error: 'User not authenticated'
      }));
      return false;
    }
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      // Update user plan in Firestore
      await updateUserPlan(user.uid, planType, paymentId);
      
      // Update usage statistics for the paid user
      await upgradeUsageStatsForPaidUser(user.uid, planType);
      
      // Refresh subscription details
      await fetchSubscriptionDetails();
      
      return true;
    } catch (error: any) {
      console.error('Error subscribing to plan:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Failed to subscribe: ${error.message}`
      }));
      return false;
    }
  };
  
  // Initial fetch of subscription details
  useEffect(() => {
    fetchSubscriptionDetails();
  }, [fetchSubscriptionDetails]);
  
  return {
    ...state,
    subscribeToPlan,
    refreshSubscription: fetchSubscriptionDetails,
    isPaidUser: state.currentPlan !== 'free',
    isProUser: state.currentPlan === 'pro',
    canGenerate: state.remainingAnimations > 0 || state.currentPlan === 'free'
  };
}; 