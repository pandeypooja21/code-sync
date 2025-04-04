"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Code, Users, Sparkles, GitBranch } from "lucide-react";
import { useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const features = [
    { icon: <Users />, title: "Real-time Collaboration", description: "Work together seamlessly with live code editing and live cursor support.", titleColor: "text-green-400" },
    { icon: <Sparkles />, title: "AI-driven Tools", description: "Get intelligent code suggestions instantly with comprehensive documentation.", titleColor: "text-yellow-400" },
    { icon: <Code />, title: "Smart Linting", description: "Identify and fix syntax errors effortlessly as you type with smart AI suggestions.", titleColor: "text-red-400" },
    { icon: <GitBranch />, title: "Real-time Chatbot Support", description: "Integrated AI chat bot for instant help and guidance.", titleColor: "text-purple-400" },
  ];

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <nav className="flex justify-end items-center p-6">
        <div className="space-x-4">
          {isSignedIn ? (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </nav>

      <section className="text-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            AI-Powered Code Editor
          </motion.h1>
          <motion.p
            className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Write, collaborate, and debug with AI-assisted coding in real-time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              onClick={handleGetStarted}
            >
              {isSignedIn ? "Go to Dashboard" : "Get Started - It's Free"}
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-10 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
              }
            }
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${feature.titleColor}`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}