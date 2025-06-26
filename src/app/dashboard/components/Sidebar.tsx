"use client";

export default function Sidebar() {
  return (
    <aside
      style={{
        position: "fixed",
        top: "73px",      // Navbar veya üst alan 60px olduğunda buradan başlar
        left: 0,
        width: "256px",
        height: "calc(100vh - 73px)",  // Yüksekliği 60px eksik, ekran sonuna kadar
        backgroundColor: "#f3f4f6",
        borderLeft: "1px solid #d1d5db",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        zIndex: 1000,
      }}
    >
      <nav className="flex flex-col gap-4 text-black">
        <a href="/dashboard" className="hover:text-indigo-600">Anasayfa</a>
        <a href="/dashboard/messages" className="hover:text-indigo-600">Mesajlar</a>
        <a href="/dashboard/task" className="hover:text-indigo-600">Görevler</a>
        <a href="/dashboard/projects" className="hover:text-indigo-600">Projeler</a>
        <a href="/dashboard/calender" className="hover:text-indigo-600">Takvim</a>
        <a href="/dashboard/analysis" className="hover:text-indigo-600">Analysis</a>
        <a href="/dashboard/disk" className="hover:text-indigo-600">Disk</a>
      </nav>
    </aside>
  );
}
