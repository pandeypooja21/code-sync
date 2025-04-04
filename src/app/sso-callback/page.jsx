"use client";

import { useEffect } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SSOCallback() {
  const { signIn } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        await signIn?.handleRedirectCallback();
        router.push("/dashboard");
      } catch (error) {
        console.error("Error handling SSO callback:", error);
        router.push("/login?error=sso-failed");
      }
    }

    handleCallback();
  }, [signIn, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}
