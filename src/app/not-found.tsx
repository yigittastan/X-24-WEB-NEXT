"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* 404 Numarası */}
      <div className="text-center mb-8">
        <h1 className="text-8xl md:text-9xl font-bold text-gray-900 mb-4">
          404
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>

      {/* Başlık ve Açıklama */}
      <div className="text-center mb-12 max-w-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Aradığınız sayfa taşınmış, silinmiş veya mevcut olmayabilir.
        </p>
      </div>

      {/* Butonlar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
        >
          Ana Sayfaya Dön
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
        >
          Geri Git
        </button>
      </div>

      {/* Alt Bilgi */}
      <div className="mt-16 text-center">
        <p className="text-gray-500 text-sm">
          Hata Kodu: 404 | Sayfa Bulunamadı
        </p>
      </div>
    </div>
  );
}