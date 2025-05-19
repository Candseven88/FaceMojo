'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { updateUserPlan } from '@/firebase/userPlans';
import { upgradeUsageStatsForPaidUser } from '@/firebase/usage';

/**
 * Payment Success Page
 * This page handles the return from Creem payment system
 */
export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment details from URL parameters
        const paymentId = searchParams.get('payment_id');
        // Use the plan from localStorage that was set before redirect
        const planType = localStorage.getItem('facemojo_pending_plan') as 'basic' | 'pro';
        
        if (!paymentId) {
          setStatus('error');
          setErrorMessage('Payment ID is missing');
          return;
        }
        
        if (!planType) {
          setStatus('error');
          setErrorMessage('Plan type is missing');
          return;
        }
        
        // Get current user
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          setStatus('error');
          setErrorMessage('User is not authenticated');
          return;
        }
        
        // Update user's plan in Firestore
        await updateUserPlan(user.uid, planType, paymentId);
        
        // Update usage statistics for the paid user
        await upgradeUsageStatsForPaidUser(user.uid, planType);
        
        // Clear pending plan from localStorage
        localStorage.removeItem('facemojo_pending_plan');
        
        // Set success status
        setStatus('success');
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          // Add query parameters to indicate successful payment
          router.push(`/?creem=success&type=${planType}&id=${paymentId}`);
        }, 3000);
        
      } catch (error: any) {
        console.error('Error processing payment:', error);
        setStatus('error');
        setErrorMessage(error.message);
      }
    };
    
    processPayment();
  }, [searchParams, router]);
  
  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold mb-4">Processing Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your subscription...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="bg-green-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">Your subscription has been activated successfully.</p>
            <p className="text-gray-500 text-sm">Redirecting you back to the app...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Payment Error</h1>
            <p className="text-red-600 mb-4">{errorMessage || 'An error occurred while processing your payment.'}</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-6 py-2 transition-colors"
            >
              Return to App
            </button>
          </>
        )}
      </div>
    </div>
  );
} 