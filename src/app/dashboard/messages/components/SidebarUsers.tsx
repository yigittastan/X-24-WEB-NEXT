import { useEffect, useState } from "react";
import SearchBar from "./Search";
import axios from "axios";

interface User {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

interface SidebarUsersProps {
  onUserSelect: (userName: string) => void;
  selectedUser: string | null;
}

export default function SidebarUsers({ onUserSelect, selectedUser }: SidebarUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    // API'den kullanıcıları çek
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`)
      .then(res => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch(err => console.error("Kullanıcılar alınamadı:", err));
  }, []);

  const handleSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  };

  return (
    <aside className="h-full flex flex-col bg-white" style={{ paddingTop: "73px" }}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Mesajlar</h2>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => onUserSelect(user.name)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedUser === user.name ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              {/* Avatar + Bilgi kısmı aynı */}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Yeni Sohbet
        </button>
      </div>
    </aside>
  );
}
