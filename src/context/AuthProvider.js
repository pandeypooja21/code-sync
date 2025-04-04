"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { isLoaded, userId, sessionId } = useClerkAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(!isLoaded);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded) {
      if (userId && sessionId) {
        // User is authenticated
        if (pathname === "/login" || pathname === "/" || pathname === "/register") {
          router.push("/dashboard");
        }
      } else {
        // User is not authenticated
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/workspace")) {
          router.push("/login");
        }
      }
      setLoading(false);
    }
  }, [isLoaded, userId, sessionId, pathname, router]);

  if (loading) return <div>Loading...</div>;

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
