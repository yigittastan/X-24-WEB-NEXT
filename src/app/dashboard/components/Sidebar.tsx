"use client";
import {
  Home,
  MessageSquareText,
  CheckSquare,
  FolderKanban,
  Calendar,
  BarChart2,
  HardDrive,
  Settings,
} from "lucide-react"; // Lucide ikonları

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
        justifyContent: "space-between",
        zIndex: 10,
      }}
    >
      {/* Üst Menü */}
      <div className="flex flex-col gap-4 text-black text-sm font-medium">
        <a
          href="/dashboard"
          className="hover:text-indigo-600 flex items-center gap-2"
        >
          <Home size={18} /> Anasayfa
        </a>
        <a
          href="/dashboard/messages"
          className="hover:text-indigo-600 flex items-center gap-2"
        >
          <MessageSquareText size={18} /> Mesajlar
        </a>
        <a
          href="/dashboard/tasks"
          className="hover:text-indigo-600 flex items-center gap-2"
        >
          <CheckSquare size={18} /> Görevler
        </a>
        <a
          href="/dashboard/projects"
          className="hover:text-indigo-600 flex items-center gap-2"
        >
          <FolderKanban size={18} /> Projeler
        </a>
        <a
          href="/dashboard/calender"
          className="hover:text-indigo-600 flex items-center gap-2"
        >
          <Calendar size={18} /> Takvim
        </a>
        <a
          href="/dashboard/analysis"
          className="hover:text-indigo-600 flex items-center gap-2"
        >
          <BarChart2 size={18} /> Analiz
        </a>
        <a
          href="/dashboard/disk"
          className="hover:text-indigo-600 flex items-center gap-2"
        >
          <HardDrive size={18} /> Disk
        </a>
      </div>

      {/* Alt Menü */}
      <div className="mt-auto pt-4">
        <a
          href="/dashboard/settings"
          className="text-black hover:text-indigo-600 flex items-center justify-center gap-2"
        >
          <Settings size={20} />
        </a>
      </div>
    </aside>
  );
}
