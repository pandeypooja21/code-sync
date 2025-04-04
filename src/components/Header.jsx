"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Home, Settings } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const isWorkspace = pathname.startsWith("/workspace/");

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">⚡ SynapseCode</span>
            </Link>
            {isWorkspace && (
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  onClick={() => router.push("/dashboard")}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  onClick={() => {
                    // Add settings functionality
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {!isWorkspace && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </Button>
                )}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
