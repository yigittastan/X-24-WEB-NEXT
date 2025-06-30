"use client";

import { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import SearchBar from "./SearchBar";
import CreateTaskModal from "./CreateTaskModal";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
   onCreateTask: () => Promise<void>;
}

export default function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="mt-[72px] bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Görevler</h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Bugün: {new Date().toLocaleDateString("tr-TR")}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center h-10 px-4 space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Görev</span>
            </button>
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
