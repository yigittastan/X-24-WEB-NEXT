import React, { useState } from "react";

interface QuickAddTaskProps {
  onAdd: (title: string) => void;
}

export default function QuickAddTask({ onAdd }: QuickAddTaskProps) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title);
    setTitle("");
  };

  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Yeni görev ekle..."
        className="flex-1 border border-gray-300 rounded px-2 py-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
      />
      <button
        onClick={handleAdd}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Ekle
      </button>
    </div>
  );
}
