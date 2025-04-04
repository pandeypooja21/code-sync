"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, User, Key } from "lucide-react";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    setName(user.fullName || user.username || "");
    setEmail(user.emailAddresses[0]?.emailAddress || "");
  }, [user, router]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await user.update({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Profile Settings</h2>
          <p className="mt-2 text-gray-400">Manage your account settings</p>
        </div>

        <div className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Profile Image</label>
            <div className="flex items-center space-x-4">
              <img
                src={user.imageUrl || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <Button
                onClick={() => user.update({ imageUrl: null })}
                variant="outline"
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Full Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              Email
            </label>
            <Input
              type="email"
              value={email}
              disabled
              className="w-full bg-gray-700 opacity-50"
            />
          </div>

          <div className="pt-4 space-y-4">
            <Button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Save Changes
            </Button>

            <Button
              onClick={() => router.push("/user/security")}
              variant="outline"
              className="w-full border-gray-600 hover:bg-gray-700"
            >
              <Key className="w-4 h-4 mr-2" />
              Security Settings
            </Button>

            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
