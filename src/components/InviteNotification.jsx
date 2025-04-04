"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const InviteNotification = () => {
  const { user } = useUser();
  const [invites, setInvites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    let eventSource;
    const connectToInvitesStream = () => {
      eventSource = new EventSource(`/api/users/${user.id}/invites/stream`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.invites) {
          setInvites(data.invites);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };
    };

    connectToInvitesStream();
    return () => eventSource?.close();
  }, [user]);

  const handleAcceptInvite = async (workspaceId) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/workspace/${workspaceId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          role: "contributor",
          displayName: user.fullName || user.username,
          imageUrl: user.imageUrl || "/robotic.png",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join workspace');
      }

      // Remove the invite
      await fetch(`/api/users/${user.id}/invites/${workspaceId}`, {
        method: 'DELETE',
      });

      setInvites((prev) => prev.filter((id) => id !== workspaceId));
      toast.success("You have joined the workspace!");
      router.push("/workspace/" + workspaceId);
    } catch (error) {
      console.error("Error accepting invite:", error);
      toast.error("Failed to join workspace");
    }
  };

  const handleDeleteInvite = async (workspaceId) => {
    if (!user) return;

    try {
      await fetch(`/api/users/${user.id}/invites/${workspaceId}`, {
        method: 'DELETE',
      });

      setInvites((prev) => prev.filter((id) => id !== workspaceId));
      toast.info("Invite declined.");
    } catch (error) {
      console.error("Error deleting invite:", error);
      toast.error("Failed to decline invite");
    }
  };

  return (
    <div className="fixed top-[30px] right-5 space-y-3 !z-[999999]">
      <AnimatePresence>
        {invites.map((workspaceId) => (
          <motion.div
            key={workspaceId}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative"
          >
            <div className="w-96 shadow-xl bg-slate-300 ring-2 ring-green-500 rounded-xl backdrop-blur-sm">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-black">
                    Workspace Invite
                  </CardTitle>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteInvite(workspaceId)}
                    className="text-gray-700 hover:text-white transition-colors"
                  >
                    <X size={20} strokeWidth={2} />
                  </motion.button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-gray-700 mb-4">
                  You have been invited to join this workspace.
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteInvite(workspaceId)}
                    className="bg-red-500 hover:bg-red-600 text-white border-none"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={() => handleAcceptInvite(workspaceId)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Accept
                  </Button>
                </div>
              </CardContent>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default InviteNotification;