"use client";

import { SignIn } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <Card className="w-full max-w-md bg-transparent border-0">
        <CardContent className="p-0">
          <SignIn
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
            signUpUrl="/register"
            appearance={{
              baseTheme: "dark",
              variables: { colorPrimary: "#3b82f6" },
              elements: {
                card: "bg-slate-800 border-slate-700",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-400",
                socialButtonsBlockButton: "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                footerActionLink: "text-blue-400 hover:text-blue-300",
                formFieldInput: "bg-slate-700 border-slate-600 text-white",
                formFieldLabel: "text-white",
                dividerLine: "bg-slate-600",
                dividerText: "text-slate-400",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}