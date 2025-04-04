"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Editor from "@/components/Editor";
import Chat from "@/components/Chat";
import Members from "@/components/Members";
import Navpanel from "@/components/Navpanel";
import Output from "@/components/Output";
import InviteNotification from "@/components/InviteNotification";

export default function WorkspacePage({ params: { id } }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState(null);
  const [activeTab, setActiveTab] = useState("code");
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/login");
      return;
    }

    const fetchWorkspace = async () => {
      try {
        const workspaces = JSON.parse(localStorage.getItem("workspaces") || "[]");
        const found = workspaces.find(w => w.id === id);
        
        if (found) {
          setWorkspace(found);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching workspace:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWorkspace();
    }
  }, [user, isLoaded, id, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "code":
        return (
          <div className="flex flex-col h-full">
            <Editor
              code={code}
              onChange={setCode}
              language="javascript"
            />
            <Output output={output} />
          </div>
        );
      case "members":
        return <Members workspace={workspace} />;
      case "ai-chat":
        return <Chat type="ai" workspaceId={id} code={code} />;
      case "team-chat":
        return <Chat type="team" workspaceId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Navpanel activeTab={activeTab} workspaceId={id} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h1 className="text-xl font-semibold">{workspace?.name}</h1>
          <InviteNotification workspaceId={id} />
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
