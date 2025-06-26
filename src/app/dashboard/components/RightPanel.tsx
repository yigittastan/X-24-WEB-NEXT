"use client";

export default function RightPanel() {
  return (
    <div
      style={{
        position: "fixed",       // Sabit pozisyon, sayfa kaydırılınca yerinde kalır
        top: "50px",            // Navbar veya üst boşluk için 50px aşağıdan başla
        right: 0,               // Sağdan sıfırda konumlandır
        width: "50px",          // Genişlik 50px
        height: `calc(100vh - 50px)`, // Yükseklik: viewport yüksekliği - 50px (navbar boşluğu)
        backgroundColor: "#f0f0f0", // Arka plan renk örneği (dilediğin gibi değiştir)
        borderLeft: "1px solid #ccc", // İstersen sol tarafına hafif çizgi
        zIndex: 1000,           // Üstte görünmesi için yüksek z-index
      }}
    >
      {/* Sağ panel içeriği buraya */}
    </div>
  );
}
