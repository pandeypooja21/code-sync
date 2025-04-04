"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Providers({ children }) {
  const router = useRouter();

  return (
    <ClerkProvider
      navigate={(to) => router.push(to)}
      appearance={{
        baseTheme: "dark",
        variables: { colorPrimary: "#3b82f6" },
      }}
    >
      {children}
      <Toaster position="bottom-right" />
    </ClerkProvider>
  );
}
