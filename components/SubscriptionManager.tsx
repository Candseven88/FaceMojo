'use client';

import { useState, useEffect } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';
import { PlanType, updateUserPlan } from '../firebase/userPlans';
import CreemCheckoutButton from './CreemCheckoutButton';

interface SubscriptionManagerProps {
  onClose?: () => void;
}

// Creem payment URLs
const CREEM_URLS = {
  basic: 'https://www.creem.io/payment/prod_FDwwEsjdqfy6bQ6MZ4T0p',
  pro: 'https://www.creem.io/payment/prod_7GcWnmwWJ9vqqO8LirnCCA'
};

// Plan features and details
const PLANS = [
  {
    id: 'free' as PlanType,
    title: 'Free',
    description: 'Basic access for casual users',
    price: '$0',
    features: [
      '1 animation per week',
      'Standard quality',
      'Basic support',
      'Watermarked output'
    ],
    buttonText: 'Current Plan'
  },
  {
    id: 'basic' as PlanType,
    title: 'Basic',
    description: 'More flexibility for regular users',
    price: '$5.00/month',
    features: [
      '10 animations per month',
      'Higher quality',
      'Priority support',
      'Download in HD',
      'No watermark'
    ],
    buttonText: 'Basic Plan'
  },
  {
    id: 'pro' as PlanType,
    title: 'Pro',
    description: 'Unlimited access for power users',
    price: '$15.00/month',
    features: [
      '50 animations per month',
      'Highest quality',
      'Priority support',
      'Download in 4K',
      'Advanced customization options',
      'No watermark'
    ],
    buttonText: 'Pro Plan'
  }
];

/**
 * Component for managing user subscription plans
 */
const SubscriptionManager = ({ onClose }: SubscriptionManagerProps) => {
  const { user } = useAuth();
  const { 
    currentPlan, 
    remainingAnimations,
    expiryDate,
    loading,
    subscribeToPlan,
    refreshSubscription
  } = useSubscription(user);
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  // Format date to readable string
  const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Check for returning payment flow from Creem
  useEffect(() => {
    if (typeof window === 'undefined' || !user) return;
    
    // Parse the URL for Creem payment status
    const url = new URL(window.location.href);
    const creemStatus = url.searchParams.get('creem');
    const planType = url.searchParams.get('type') as 'basic' | 'pro' | null;
    const paymentId = url.searchParams.get('id');
    
    // Process successful payment
    const processSuccessfulPayment = async () => {
      if (!planType || !paymentId) {
        setPaymentError('Missing payment information');
        return;
      }
      
      try {
        // Process the subscription with Creem payment ID
        await subscribeToPlan(planType, paymentId);
        setPaymentSuccess(true);
        
        // Remove URL params
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Auto-close success message after 3 seconds
        setTimeout(() => {
          setPaymentSuccess(false);
        }, 3000);
      } catch (error: any) {
        setPaymentError(`Failed to process payment: ${error.message}`);
      }
    };
    
    // Check if we're returning from a Creem payment
    if (creemStatus === 'success' && planType && paymentId) {
      processSuccessfulPayment();
    }
    
    // Also check localStorage for a pending plan in case of manual navigation
    const pendingPlan = localStorage.getItem('facemojo_pending_plan') as 'basic' | 'pro' | null;
    if (pendingPlan && !creemStatus) {
      // Show a message to complete the payment
      setPaymentError(`Your ${pendingPlan} plan payment was not completed. Please try again.`);
      localStorage.removeItem('facemojo_pending_plan');
    }
  }, [user, subscribeToPlan]);
  
  // Function to switch to free plan
  const switchToFreePlan = async () => {
    if (currentPlan === 'free' || !user) return;
    
    try {
      // Call the updateUserPlan function with 'free' as the plan type
      await updateUserPlan(user.uid, 'free');
      
      // Refresh the subscription data
      await refreshSubscription();
      
      setPaymentSuccess(true);
      
      // Auto-close success message after 3 seconds
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 3000);
    } catch (error: any) {
      setPaymentError(`Failed to switch to free plan: ${error.message}`);
    }
  };
  
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block">
          <svg className="loading-spinner mx-auto" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="mt-2">Loading subscription details...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800/95 rounded-xl shadow-lg p-6 border border-slate-700/50 backdrop-blur-md text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Your Subscription</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Current Subscription Status */}
      <div className="mb-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
        <h3 className="text-lg font-semibold mb-2">Current Plan: <span className="text-blue-400">{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</span></h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-300">Remaining Animations: <span className="font-medium text-white">{remainingAnimations}</span></p>
            <p className="text-slate-300">Expires: <span className="font-medium text-white">{formatDate(expiryDate)}</span></p>
          </div>
          {currentPlan !== 'free' && (
            <div className="text-right">
              <p className="text-slate-300">Status: <span className="font-medium text-green-400">Active</span></p>
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Success Message */}
      {paymentSuccess && (
        <div className="mb-6 p-3 bg-green-900/30 border border-green-500/50 text-green-300 rounded">
          Subscription updated successfully! Your new plan is now active.
        </div>
      )}
      
      {/* Payment Error Message */}
      {paymentError && (
        <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded">
          {paymentError}
        </div>
      )}
      
      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <CreemCheckoutButton 
          planType="free"
          creemUrl=""
          label={currentPlan === 'free' ? 'Current Plan' : 'Free Plan'}
          title={PLANS[0].title}
          description={PLANS[0].description}
          features={PLANS[0].features}
          price={PLANS[0].price}
          isCurrentPlan={currentPlan === 'free'}
        />
        
        {/* Basic Plan */}
        <CreemCheckoutButton 
          planType="basic"
          creemUrl={CREEM_URLS.basic}
          label={currentPlan === 'basic' ? 'Current Plan' : PLANS[1].buttonText}
          title={PLANS[1].title}
          description={PLANS[1].description}
          features={PLANS[1].features}
          price={PLANS[1].price}
          isCurrentPlan={currentPlan === 'basic'}
        />
        
        {/* Pro Plan */}
        <CreemCheckoutButton 
          planType="pro"
          creemUrl={CREEM_URLS.pro}
          label={currentPlan === 'pro' ? 'Current Plan' : PLANS[2].buttonText}
          title={PLANS[2].title}
          description={PLANS[2].description}
          features={PLANS[2].features}
          price={PLANS[2].price}
          isCurrentPlan={currentPlan === 'pro'}
        />
      </div>
    </div>
  );
};

export default SubscriptionManager; 