"use client";
import { useState } from "react";
import { Search } from "lucide-react"; // Lucide ikonları kullanıyoruz

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log("🔍 Arama yapılıyor:", query);
    // Buraya arama isteğini bağlayabilirsin (API, filtreleme vs.)
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Ara..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-black"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </form>
  );
}
