# FaceMojo

FaceMojo is a web application that allows users to animate portrait images using the Replicate AI API. Users can upload a portrait image and a driving video, and the application will generate an animated version of the portrait.

## Features

- Upload portrait images (.jpg or .png)
- Upload driving videos (.mp4)
- Process the files with the Replicate AI API
- Display and download the resulting animated video
- Anonymous Firebase authentication
- Weekly usage limits (1 free animation per week)
- Subscription plans (Free, Basic, Pro) with different animation allowances
- Payment integration (simulated with Creem)

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- NPM or Yarn
- Replicate API token (sign up at [replicate.com](https://replicate.com) to get one)
- Firebase project with Authentication and Firestore enabled

### Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Anonymous Authentication in the Authentication section
3. Create a Firestore database and set up the security rules
4. Replace the Firebase configuration in `firebase/config.ts` with your project settings

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/facemojo.git
cd facemojo
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Create a `.env.local` file in the root directory and add your Replicate API token:
```
# Important: Use REPLICATE_API_TOKEN (without NEXT_PUBLIC_ prefix)
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage Limits and Subscription System

The application includes a comprehensive usage management system:

### Free Tier
- Users are automatically signed in anonymously when they visit the site
- Each user can generate 1 free animation per calendar week
- Usage data is stored in a Firestore collection called `usageStats`
- The UI will disable the "Run AI Magic" button and show a message when the limit is reached

### Paid Tiers
- **Basic Plan** ($4.99/month): 10 animations per month
- **Pro Plan** ($9.99/month): 50 animations per month
- Subscription data is stored in a Firestore collection called `userPlans`
- Paid users don't have weekly limits but are restricted by their monthly animation allocation

### Subscription Management
- Users can view their current subscription and remaining animations
- Payment processing is simulated (in a real app, you would integrate with a payment provider)
- Subscription expiration is automatically tracked (30 days from purchase)

## Firestore Collections

The application uses the following Firestore collections:

- **usageStats**: Tracks animation usage for each user
  - Fields: `lastGeneratedAt`, `isProUser`, `animationsLeft`, `lastUsed`

- **userPlans**: Stores subscription plan information
  - Fields: `planType`, `subscribeDate`, `expireDate`, `creemPaymentId`, `updatedAt`

## Troubleshooting

### API Authorization Errors

If you see "Error: API request failed: Unauthorized" when trying to generate animations, check the following:

1. Make sure you have created a `.env.local` file with your Replicate API token.
2. Verify that you're using the correct environment variable name: `REPLICATE_API_TOKEN` (not `NEXT_PUBLIC_REPLICATE_API_TOKEN`).
3. Ensure your API token is valid and has not expired.
4. Restart the development server after making changes to environment variables.

### CORS Issues

The application uses server-side API routes to avoid CORS issues when calling the Replicate API. If you're experiencing CORS-related errors, make sure you're using the `/api/generate-animation` and `/api/check-prediction` endpoints rather than calling the Replicate API directly from the client.

### Firebase Authentication Issues

If you encounter issues with Firebase authentication:

1. Verify your Firebase configuration in `firebase/config.ts`
2. Make sure Anonymous Authentication is enabled in your Firebase project
3. Check the browser console for detailed error messages

### Subscription Issues

If subscriptions are not working properly:

1. Check Firestore rules to ensure write permissions are correctly set
2. Verify that the Firestore database has the required collections (`usageStats` and `userPlans`)
3. Check browser console for any error messages during the subscription process

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Firestore
- Replicate AI API

## License

This project is licensed under the MIT License - see the LICENSE file for details. 