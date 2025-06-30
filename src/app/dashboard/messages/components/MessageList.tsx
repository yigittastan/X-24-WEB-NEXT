"use client";

import { useEffect, useState, DragEvent } from "react";
import socket from "@/app/lib/socket";
import { SearchIcon, Video, Phone, MoreVertical } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  senderName: string;
  fileUrl?: string;
  fileName?: string;
}

interface MessageListProps {
  selectedUser: string | null;
}

export default function MessageList({ selectedUser }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (selectedUser === "notlarim") {
      const saved = localStorage.getItem("personal_notes");
      setMessages(saved ? JSON.parse(saved) : []);
      return;
    }

    if (!selectedUser) return;

    socket.emit("joinConversation", selectedUser);

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.emit("getPreviousMessages", selectedUser, (history: Message[]) => {
      setMessages(history);
    });

    return () => {
      socket.off("receiveMessage");
      socket.emit("leaveConversation", selectedUser);
    };
  }, [selectedUser]);

  // Dosyayı base64 stringe çeviren yardımcı fonksiyon
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject("Dosya okunamadı");
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || (!newMessage.trim() && !selectedFile)) return;

    let base64File: string | null = null;
    if (selectedFile) {
      base64File = await fileToBase64(selectedFile);
    }

    const message: Message = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      senderName: "Sen",
      timestamp: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
      fileName: selectedFile?.name,
    };

    setMessages((prev) => {
      const updated = [...prev, message];

      if (selectedUser === "notlarim") {
        localStorage.setItem("personal_notes", JSON.stringify(updated));
      } else {
        socket.emit("sendMessage", {
          to: selectedUser,
          text: newMessage,
          fileName: selectedFile?.name,
          fileData: base64File,
        });
      }

      return updated;
    });

    setNewMessage("");
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  if (!selectedUser) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{
          backgroundImage: 'url("/background.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    );
  }

  return (
    <div
      className={`h-full flex flex-col relative ${dragActive ? "bg-blue-50" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* 🧠 Sabit Başlık */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {selectedUser === "notlarim"
                  ? "N"
                  : selectedUser
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedUser === "notlarim" ? "Notlarım" : selectedUser}
              </h2>
              {selectedUser !== "notlarim" && <p className="text-sm text-green-500">• Çevrimiçi</p>}
            </div>
          </div>

          {/* 🔔 Arama ve Diğer Butonlar */}
          {selectedUser && selectedUser !== "notlarim" && (
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Ara">
                <SearchIcon size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Sesli Arama">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Görüntülü Arama">
                <Video size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Menü">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          )}

          {/* Notlarım için butonlar */}
          {selectedUser === "notlarim" && (
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Notları Ara">
                <SearchIcon size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Menü">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🗨️ Mesaj Alanı */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          marginTop: "73px", // Header yüksekliği kadar
          marginBottom: "80px", // Footer yüksekliği kadar
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              {message.fileUrl && (
                <a
                  href={message.fileUrl}
                  download={message.fileName}
                  className="text-sm underline block mt-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  📎 {message.fileName}
                </a>
              )}
              <p className="text-xs mt-1 text-right opacity-75">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 📝 Sabit Mesaj Barı */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <label
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm transition-colors"
            title="Dosya Ekle"
          >
            📎
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={selectedUser === "notlarim" ? "Not ekleyin..." : "Mesajınızı yazın..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Gönder
          </button>
        </form>
        {selectedFile && (
          <div className="text-sm text-gray-600 mt-2">
            Eklenen dosya: <strong>{selectedFile.name}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
