"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workspaces");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("workspaces", JSON.stringify(workspaces));
    }
  }, [workspaces]);

  const createWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }

    const workspace = {
      id: Date.now().toString(),
      name: newWorkspaceName,
      owner: user.id,
      members: [user.id],
    };

    setWorkspaces([...workspaces, workspace]);
    setNewWorkspaceName("");
    toast.success("Workspace created successfully!");
  };

  const deleteWorkspace = (id) => {
    setWorkspaces(workspaces.filter((w) => w.id !== id));
    toast.success("Workspace deleted successfully!");
  };

  const openWorkspace = (id) => {
    router.push(`/workspace/${id}`);
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user.firstName}!</h1>

        {/* Create Workspace Form */}
        <Card className="mb-8 bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="workspace-name">New Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter workspace name"
                />
              </div>
              <Button
                onClick={createWorkspace}
                className="self-end bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Workspace
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => openWorkspace(workspace.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold mb-2">{workspace.name}</h3>
                    <p className="text-sm text-slate-400">
                      {workspace.members.length} member
                      {workspace.members.length !== 1 && "s"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWorkspace(workspace.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}