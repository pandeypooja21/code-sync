"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            AI-Powered Code Editor
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Write, execute, and collaborate on code in real-time with AI assistance
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg"
            >
              <Link href="/login">
                Get Started
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-600/10 px-8 py-3 rounded-lg text-lg"
            >
              <Link href="/register">
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Real-time Collaboration"
              description="Work together with your team in real-time with live cursor tracking and instant updates."
              icon="🤝"
            />
            <FeatureCard
              title="AI Assistant"
              description="Get intelligent code suggestions and explanations powered by advanced AI."
              icon="🤖"
            />
            <FeatureCard
              title="Multiple Languages"
              description="Support for multiple programming languages with syntax highlighting."
              icon="💻"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p> 2025 AI Code Editor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
