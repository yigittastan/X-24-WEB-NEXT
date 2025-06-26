"use client";

import { useState } from "react";
import MessageList from "./components/MessageList";
import SidebarUsers from "./components/SidebarUsers";

export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleUserSelect = (userName: string) => {
    setSelectedUser(userName);
  };

  return (
    <div className="h-full flex">
      {/* Sol sidebar - kullanıcı listesi */}
      <div className="w-80 border-r border-gray-200 bg-gray-50">
        <SidebarUsers 
          onUserSelect={handleUserSelect} 
          selectedUser={selectedUser}
        />
      </div>
      
      {/* Ana mesaj alanı */}
      <div className="flex-1">
        <MessageList selectedUser={selectedUser} />
      </div>
    </div>
  );
}