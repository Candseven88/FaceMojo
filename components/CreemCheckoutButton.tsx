'use client';

import { useState } from 'react';

export interface CreemCheckoutButtonProps {
  planType: 'free' | 'basic' | 'pro';
  creemUrl: string;
  label: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  isCurrentPlan?: boolean;
  onFreePlanClick?: () => void;
}

/**
 * Button component that redirects to Creem checkout page
 */
const CreemCheckoutButton: React.FC<CreemCheckoutButtonProps> = ({
  planType,
  creemUrl,
  label,
  title,
  description,
  features,
  price,
  isCurrentPlan = false,
  onFreePlanClick
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubscribe = () => {
    if (isCurrentPlan) return;
    
    // Free plan should use onFreePlanClick callback
    if (planType === 'free') {
      if (onFreePlanClick) {
        onFreePlanClick();
      }
      return;
    }
    
    setIsRedirecting(true);
    
    // Save plan type to localStorage for post-payment processing
    localStorage.setItem('facemojo_pending_plan', planType);
    
    // Redirect to Creem checkout page
    window.location.href = creemUrl;
  };

  return (
    <div className={`rounded-xl p-4 ${isCurrentPlan ? 'border-blue-500/70 bg-blue-900/30' : 'border-slate-700/70 bg-slate-700/20'} border backdrop-blur-sm`}>
      <div className="text-xl font-bold mb-1 text-white">{title}</div>
      <div className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{price}</div>
      <p className="text-slate-300 text-sm mb-4">{description}</p>
      
      <ul className="text-sm mb-4">
        {features.map((feature, index) => (
          <li key={index} className="mb-1 flex items-start">
            <svg className="h-5 w-5 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-slate-200">{feature}</span>
          </li>
        ))}
      </ul>
      
      {isCurrentPlan ? (
        <div className="w-full py-2 px-4 rounded-md bg-green-900/50 text-green-300 border border-green-500/50 text-center">
          Current Plan
        </div>
      ) : planType === 'free' ? (
        <div className="w-full py-2 px-4 rounded-md bg-slate-700/50 text-slate-400 border border-slate-600/50 text-center">
          {label}
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={isRedirecting}
          className="w-full py-2 px-4 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-colors disabled:opacity-50 disabled:from-blue-800 disabled:to-blue-700"
        >
          {isRedirecting ? 'Redirecting...' : label}
        </button>
      )}
    </div>
  );
};

export default CreemCheckoutButton; 