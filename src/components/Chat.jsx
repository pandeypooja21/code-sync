"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { X, Send, Trash2, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

export default function Chat({ workspaceId, onClose }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!workspaceId) return;

    // Load messages from localStorage
    const loadMessages = () => {
      try {
        const savedMessages = JSON.parse(localStorage.getItem(`chat-${workspaceId}`)) || [];
        setMessages(savedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load chat history");
      }
    };

    loadMessages();
  }, [workspaceId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, newMessage, isAIProcessing]);

  const saveMessages = (updatedMessages) => {
    try {
      localStorage.setItem(`chat-${workspaceId}`, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Error saving messages:", error);
      toast.error("Failed to save message");
    }
  };

  const generateAIResponse = async (prompt) => {
    setIsAIProcessing(true);
    try {
      const response = await fetch('/api/getChatResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.aiResponse;
    } catch (error) {
      console.error("API Error:", error);
      return "Sorry, I couldn't process that request. Please try again.";
    } finally {
      setIsAIProcessing(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const aiMatch = newMessage.match(/@(.+)/);
    let aiPrompt = null;
    let userMessage = newMessage;

    if (aiMatch) {
      aiPrompt = aiMatch[1].trim();
      userMessage = newMessage.replace(/@.+/, "").trim();
    }

    const messageObj = {
      id: Date.now().toString(),
      text: userMessage,
      createdAt: new Date().toISOString(),
      userId: user.id,
      userName: user.fullName || user.username,
      userImage: user.imageUrl,
      workspaceId,
    };

    const updatedMessages = [...messages, messageObj];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setNewMessage("");

    if (aiPrompt) {
      const aiResponse = await generateAIResponse(aiPrompt);
      const aiMessageObj = {
        id: Date.now().toString(),
        text: aiResponse,
        createdAt: new Date().toISOString(),
        userId: "ai",
        userName: "AI Assistant",
        userImage: "/ai-avatar.png",
        workspaceId,
        isAI: true,
      };
      const withAIResponse = [...updatedMessages, aiMessageObj];
      setMessages(withAIResponse);
      saveMessages(withAIResponse);
    }
  };

  const deleteMessage = (messageId) => {
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    toast.success("Message deleted");
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-t-lg border border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Chat</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.userId === user.id ? "flex-row-reverse" : ""
            }`}
          >
            <img
              src={message.userImage}
              alt={message.userName}
              className="w-8 h-8 rounded-full"
            />
            <div
              className={`group relative max-w-[80%] ${
                message.userId === user.id
                  ? "bg-blue-600"
                  : message.isAI
                  ? "bg-purple-600"
                  : "bg-gray-800"
              } rounded-lg p-3`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-300">
                  {message.userName}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
              {message.text.startsWith("```") ? (
                <div className="relative">
                  <SyntaxHighlighter
                    language="javascript"
                    style={vscDarkPlus}
                    className="rounded-md !bg-gray-900/50 !p-3"
                  >
                    {message.text.replace(/```/g, "")}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => copyToClipboard(message.text.replace(/```/g, ""))}
                    className="absolute top-2 right-2 p-1 bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-white whitespace-pre-wrap">{message.text}</p>
              )}
              {message.userId === user.id && (
                <button
                  onClick={() => deleteMessage(message.id)}
                  className="absolute top-2 right-2 p-1 bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          </div>
        ))}
        {isAIProcessing && (
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message... (Use @ for AI help)"
            className="flex-1 bg-gray-800 border-gray-700 focus:border-blue-500"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isAIProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}