"use client";

import React, { useState } from "react";
import ProfilModal from "./components/ProfilModal";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen((prev) => !prev);
  const closeModal = () => setModalOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">X-24</h1>
        </div>

        {/* Sağ üst bölüm */}
        <div className="flex items-center space-x-4 relative">
          {/* Davet Et Butonu */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
            <span>👥</span>
            <span>Davet Et</span>
          </button>
          {/* Profil (button olarak) */}
          <button
            onClick={toggleModal}
            className="flex items-center space-x-3 relative focus:outline-none"
          >
            {/* Modal */}
            {modalOpen && <ProfilModal onClose={closeModal} />}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">KA</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Kullanıcı Adı</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
