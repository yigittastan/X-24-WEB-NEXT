export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-6">Profil Bilgileri</h1>

      {/* Form örneği */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Ad Soyad</label>
          <input
            type="text"
            defaultValue="Kullanıcı Adı"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input
            type="email"
            defaultValue="kullanici@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}
