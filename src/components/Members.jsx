"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { X, LogOut } from "lucide-react"; // Close & Exit Icons
import { useRouter } from "next/navigation";

export default function ShowMembers({ workspaceId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const membersRef = useRef(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!workspaceId || !user) return;
    let eventSource;

    const connectToMembersStream = () => {
      setLoading(true);
      eventSource = new EventSource(`/api/workspace/${workspaceId}/members/stream`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.members) {
          const membersData = data.members.map((member) => {
            if (member.userId === user.id) setUserRole(member.role);
            return {
              id: member.userId,
              displayName: member.displayName || "Unknown User",
              photoURL: member.imageUrl || "/robotic.png",
              role: member.role || "Member",
            };
          });
          setMembers(membersData);
          setLoading(false);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setLoading(false);
      };
    };

    connectToMembersStream();
    return () => eventSource?.close();
  }, [workspaceId, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (membersRef.current && !membersRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const exitWorkspace = async () => {
    if (!user || !workspaceId) return;
    try {
      await fetch(`/api/workspace/${workspaceId}/members/${user.id}`, {
        method: 'DELETE',
      });
      router.push("/dashboard");
      setIsOpen(false);
    } catch (error) {
      console.error("Error exiting workspace:", error);
    }
  };

  return (
    <div className="relative">
      {/* Stacked Member Avatars */}
      <div className="flex gap-2 text-sm items-center">
       👥 People: {members.length}
        <div className="flex -space-x-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {members.slice(0, 4).map((member, index) => (
            <img
              key={member.id}
              src={member.photoURL || "/robotic.png"}
              alt={""}
              className="w-7 rounded-full border-2 border-white shadow-lg"
              style={{ zIndex: members.length - index }}
            />
          ))}
          {members.length > 4 && (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full border-2 border-white text-xs shadow-lg">
              +{members.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Members Dropdown */}
      {isOpen && (
        <div
          ref={membersRef}
          className="absolute top-12 right-full bg-gray-900 p-4 rounded-lg shadow-lg w-80 z-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Members</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.photoURL}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {member.displayName}
                      {member.id === user?.id && " (You)"}
                    </p>
                    <p className="text-xs text-gray-400">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Exit Workspace Button */}
          <button
            onClick={exitWorkspace}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Exit Workspace
          </button>
        </div>
      )}
    </div>
  );
}
