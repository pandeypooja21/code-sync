import { ClerkProvider } from '@clerk/nextjs';

export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
};

export default ClerkProvider;
