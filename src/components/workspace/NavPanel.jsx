"use client";

import { Button } from "@/components/ui/button";
import { FileCode, Settings, Users, MessageSquare, Bot } from "lucide-react";
import Link from "next/link";

export default function NavPanel({ activeTab, workspaceId }) {
  const tabs = [
    { id: "code", icon: <FileCode className="w-4 h-4" />, label: "Code" },
    { id: "members", icon: <Users className="w-4 h-4" />, label: "Members" },
    { id: "ai-chat", icon: <Bot className="w-4 h-4" />, label: "AI Chat" },
    { id: "team-chat", icon: <MessageSquare className="w-4 h-4" />, label: "Team Chat" },
    { id: "settings", icon: <Settings className="w-4 h-4" />, label: "Settings" },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-800 border-r border-slate-700 h-full">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className={`justify-start gap-2 ${
            activeTab === tab.id ? "bg-blue-600 hover:bg-blue-700" : ""
          }`}
          asChild
        >
          <Link href={`/workspace/${workspaceId}/${tab.id}`}>
            {tab.icon}
            {tab.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
