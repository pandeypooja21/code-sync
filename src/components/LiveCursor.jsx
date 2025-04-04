"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function LiveCursor({ workspaceId }) {
  const { user } = useUser();
  const [cursors, setCursors] = useState({});
  const [myPosition, setMyPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!user) return;

    const handleMouseMove = (e) => {
      const newPosition = {
        x: e.clientX,
        y: e.clientY,
        name: user.fullName || user.username,
        color: getRandomColor(user.id),
        timestamp: Date.now(),
      };
      setMyPosition(newPosition);

      // In a real app, this would be replaced with WebSocket communication
      // For now, we'll use localStorage for demo purposes
      const allCursors = JSON.parse(localStorage.getItem(`cursors-${workspaceId}`) || "{}");
      allCursors[user.id] = newPosition;
      localStorage.setItem(`cursors-${workspaceId}`, JSON.stringify(allCursors));
    };

    const handleCursorUpdates = () => {
      const allCursors = JSON.parse(localStorage.getItem(`cursors-${workspaceId}`) || "{}");
      // Remove stale cursors (older than 5 seconds)
      const now = Date.now();
      Object.keys(allCursors).forEach(key => {
        if (now - allCursors[key].timestamp > 5000) {
          delete allCursors[key];
        }
      });
      setCursors(allCursors);
    };

    document.addEventListener("mousemove", handleMouseMove);
    const interval = setInterval(handleCursorUpdates, 100);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
      // Clean up cursor when leaving
      const allCursors = JSON.parse(localStorage.getItem(`cursors-${workspaceId}`) || "{}");
      delete allCursors[user.id];
      localStorage.setItem(`cursors-${workspaceId}`, JSON.stringify(allCursors));
    };
  }, [user, workspaceId]);

  const getRandomColor = (userId) => {
    // Generate a consistent color based on user ID
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  return (
    <>
      {Object.entries(cursors).map(([userId, cursor]) => {
        if (userId === user?.id) return null;
        return (
          <div
            key={userId}
            className="pointer-events-none fixed top-0 left-0 z-50 transition-transform duration-100"
            style={{
              transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            }}
          >
            <div
              className="absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2"
              style={{ color: cursor.color }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5.64,16.36a9,9,0,1,1,12.72,0l-5.65,5.66a1,1,0,0,1-1.42,0Z" />
              </svg>
            </div>
            <div
              className="absolute left-4 top-2 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
          </div>
        );
      })}
    </>
  );
}
