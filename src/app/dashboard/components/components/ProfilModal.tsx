"use client";

import { useRouter } from "next/navigation";

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleprofileClick = () => {
    router.push("dashboard/profile"); // /profile sayfasına yönlendir
    onClose(); // modal kapansın
  };

  const handleLogout = () => {
    // Örneğin localStorage veya cookie'den token sil
    localStorage.removeItem("token");
    // logout işlemini tamamladıktan sonra login sayfasına yönlendir
    window.location.href = "/auth/login";
  };

  return (
    <div className="absolute top-[72px] right-0 w-48 bg-white border border-gray-300 rounded-[20px] shadow-lg z-50 text-black">
      <div className="p-2 flex flex-col space-y-2">
        <button
          onClick={handleprofileClick}
          className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded"
        >
          Profil Detayları
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-100 rounded"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
