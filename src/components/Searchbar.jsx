"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { UserPlus, X } from "lucide-react";
import { toast } from "react-toastify";

export default function SearchBar({ workspaceId }) {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState(new Set());
  const searchRef = useRef(null);

  useEffect(() => {
    if (workspaceId) {
      loadWorkspaceMembers();
    }
  }, [workspaceId]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      searchUsers(searchTerm.toLowerCase());
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
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

  const loadWorkspaceMembers = () => {
    try {
      const members = JSON.parse(localStorage.getItem(`workspace-members-${workspaceId}`)) || [];
      setWorkspaceMembers(new Set(members));
    } catch (error) {
      console.error("Error loading workspace members:", error);
      toast.error("Failed to load workspace members");
    }
  };

  const searchUsers = async (term) => {
    setLoading(true);
    try {
      // For demo purposes, using mock users
      // In production, this should be replaced with an API call to your backend
      const mockUsers = [
        { id: "1", email: "user1@example.com", name: "User 1" },
        { id: "2", email: "user2@example.com", name: "User 2" },
        { id: "3", email: "user3@example.com", name: "User 3" },
      ];

      const matchedUsers = mockUsers.filter(mockUser => 
        mockUser.email.toLowerCase().includes(term) && 
        mockUser.email !== user?.emailAddresses[0]?.emailAddress &&
        !workspaceMembers.has(mockUser.id)
      );

      setUsers(matchedUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async (userId, userEmail) => {
    try {
      // Store invitation in local storage
      const invites = JSON.parse(localStorage.getItem(`workspace-invites-${workspaceId}`)) || [];
      if (!invites.includes(userId)) {
        invites.push(userId);
        localStorage.setItem(`workspace-invites-${workspaceId}`, JSON.stringify(invites));
        
        // Add to workspace members
        const members = Array.from(workspaceMembers);
        members.push(userId);
        localStorage.setItem(`workspace-members-${workspaceId}`, JSON.stringify(members));
        setWorkspaceMembers(new Set(members));
        
        // Remove from search results
        setUsers(users.filter(u => u.id !== userId));
        
        toast.success(`${userEmail} has been invited`);
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    }
  };

  return (
    <div className="relative flex items-center" ref={searchRef}>
      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search users to invite..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-200"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (searchTerm || users.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center text-gray-400">Searching...</div>
          ) : users.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {user.name || user.email}
                      </div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => inviteUser(user.id, user.email)}
                    className="p-1 hover:bg-gray-600 rounded"
                  >
                    <UserPlus className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="p-4 text-center text-gray-400">No users found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
