"use client";

import SearchBar from "./Search";
export default function SidebarUsers() {
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
       <SearchBar/>
      </div>
    </aside> 
  );
}
