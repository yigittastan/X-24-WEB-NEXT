"use client";
import TimeTracker from "./components/TimeTracker";

export default function RightPanel() {
  return (
    <div
      style={{
        position: "fixed",
        top: "73px", // Header yüksekliği kadar aşağıdan başla
        right: 0,
        width: "60px",
        height: `calc(100vh - 73px)`, // Header yüksekliği kadar az yükseklik
        backgroundColor: "#f0f0f0",
        borderLeft: "1px solid #ccc",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "10px",
        gap: "10px",
        transition: "width 0.3s ease",
      }}
    >
      <TimeTracker />
      <hr className="w-8 border-gray-400" />
    </div>
  );
}
