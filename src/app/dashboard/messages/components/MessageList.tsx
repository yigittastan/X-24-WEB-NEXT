"use client";

import { useEffect, useState } from "react";
import socket from "@/app/lib/socket"; // doğru path'e göre ayarladığını varsayıyorum

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  senderName: string;
}

interface MessageListProps {
  selectedUser: string | null;
}

export default function MessageList({ selectedUser }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!selectedUser) return;

    socket.emit("joinConversation", selectedUser);

    socket.on("receiveMessage", (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.emit("getPreviousMessages", selectedUser, (history: Message[]) => {
      setMessages(history);
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveConversation", selectedUser);
    };
  }, [selectedUser]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const message: Message = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      senderName: "Sen",
      timestamp: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages(prev => [...prev, message]);

    socket.emit("sendMessage", {
      to: selectedUser,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="h-full flex flex-col" style={{ paddingTop: "73px" }}>
      {/* UI render kısmı buraya */}
    </div>
  );
}
