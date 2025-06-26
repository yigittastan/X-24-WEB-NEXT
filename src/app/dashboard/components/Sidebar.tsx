"use client";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside
      style={{
        position: "fixed",
        top: "73px",
        left: 0,
        width: "128px",
        height: "calc(100vh - 73px)",
        backgroundColor: "#f3f4f6",
        borderRight: "1px solid #d1d5db",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // üst ve alt içerik arasında boşluk
        zIndex: 1000,
      }}
    >
      {/* Üst Menü */}
      <div className="flex flex-col gap-4 text-black">
        <a href="/dashboard" className="hover:text-indigo-600">Anasayfa</a>
        <a href="/dashboard/messages" className="hover:text-indigo-600">Mesajlar</a>
        <a href="/dashboard/tasks" className="hover:text-indigo-600">Görevler</a>
        <a href="/dashboard/projects" className="hover:text-indigo-600">Projeler</a>
        <a href="/dashboard/calender" className="hover:text-indigo-600">Takvim</a>
        <a href="/dashboard/analysis" className="hover:text-indigo-600">Analiz</a>
        <a href="/dashboard/disk" className="hover:text-indigo-600">Disk</a>
      </div>

      {/* Alt Menü */}
      <div className="mt-auto pt-4">
        <a href="/dashboard/settings" className="hover:text-indigo-600 flex justify-center">
          <Image src="/settings.png" alt="Ayarlar" width={24} height={24} />
        </a>
      </div>
    </aside> 
  );
}
