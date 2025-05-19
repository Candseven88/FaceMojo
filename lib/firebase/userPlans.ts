import { db } from './config';
import { 
  doc, 
  getDoc,
  setDoc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';

// User plan collection name
const COLLECTION_NAME = 'userPlans';

// Plan type definition
export type PlanType = 'free' | 'basic' | 'pro';

/**
 * Updates a user's subscription plan in Firestore
 * 
 * @param uid User ID
 * @param planType Subscription plan type ('free', 'basic', or 'pro')
 * @param creemPaymentId Optional payment ID from Creem
 * @returns Promise that resolves when the update is complete
 */
export const updateUserPlan = async (
  uid: string,
  planType: PlanType,
  creemPaymentId?: string
): Promise<void> => {
  try {
    // Reference to the user's plan document
    const userPlanRef = doc(db, COLLECTION_NAME, uid);
    
    // Calculate expiration date for paid plans
    let expireDate: Timestamp | null = null;
    
    if (planType === 'basic' || planType === 'pro') {
      // Set expiration date to 30 days from now
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      expireDate = Timestamp.fromDate(expirationDate);
    }
    
    // Create plan data object
    const planData = {
      planType,
      subscribeDate: serverTimestamp(),
      expireDate,
      updatedAt: serverTimestamp(),
    };
    
    // Add payment ID if provided
    if (creemPaymentId) {
      Object.assign(planData, { creemPaymentId });
    }
    
    // Update the user's plan in Firestore
    await setDoc(userPlanRef, planData, { merge: true });
    
    console.log(`Successfully updated plan for user ${uid} to ${planType}`);
  } catch (error: any) {
    console.error('Error updating user plan:', error.message);
    throw new Error(`Failed to update user plan: ${error.message}`);
  }
};

/**
 * Gets the current plan for a user
 * 
 * @param uid User ID
 * @returns Promise that resolves with the user's current plan data
 */
export const getUserPlan = async (uid: string) => {
  try {
    // Reference to the user's plan document
    const userPlanRef = doc(db, COLLECTION_NAME, uid);
    
    // Get the user's plan document
    const userPlanDoc = await getDoc(userPlanRef);
    
    if (userPlanDoc.exists()) {
      return userPlanDoc.data();
    } else {
      // Return default free plan if no plan exists
      return {
        planType: 'free' as PlanType,
        subscribeDate: null,
        expireDate: null,
      };
    }
  } catch (error: any) {
    console.error('Error getting user plan:', error.message);
    throw new Error(`Failed to get user plan: ${error.message}`);
  }
}; 