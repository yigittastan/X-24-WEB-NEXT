"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/app/utils/cookies";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registrationType, setRegistrationType] = useState<'new' | 'invite'>('new');
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    inviteCode: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    companyName: "",
    inviteCode: "",
  });

  useEffect(() => {
    const token = getCookie("userToken");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // input değişince hatayı sıfırla
  }

  function handleRegistrationTypeChange(type: 'new' | 'invite') {
    setRegistrationType(type);
    // Tip değişince ilgili alanları temizle
    setRegisterData(prev => ({
      ...prev,
      companyName: "",
      inviteCode: ""
    }));
    setFormErrors(prev => ({
      ...prev,
      companyName: "",
      inviteCode: ""
    }));
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const errors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      companyName: "",
      inviteCode: "",
    };
    let hasError = false;

    // Temel validasyonlar
    if (!registerData.name.trim()) {
      errors.name = "Ad soyad zorunludur.";
      hasError = true;
    }
    if (!registerData.email.includes("@")) {
      errors.email = "Geçerli bir e-posta girin.";
      hasError = true;
    }
    if (!registerData.phone.trim()) {
      errors.phone = "Telefon numarası gereklidir.";
      hasError = true;
    }
    if (registerData.password.length < 6) {
      errors.password = "Şifre en az 6 karakter olmalıdır.";
      hasError = true;
    }

    // Tip bazlı validasyonlar
    if (registrationType === 'new' && !registerData.companyName.trim()) {
      errors.companyName = "Şirket adı zorunludur.";
      hasError = true;
    }
    if (registrationType === 'invite' && !registerData.inviteCode.trim()) {
      errors.inviteCode = "Davet kodu zorunludur.";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // API'ye gönderilecek data'yı hazırla
      const requestData: any = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
      };

      if (registrationType === 'new') {
        requestData.companyName = registerData.companyName;
      } else {
        requestData.inviteCode = registerData.inviteCode;
      }

      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Backend'den gelen token ve user bilgilerini kaydet
        setCookie("userToken", data.access_token, 7); // 7 gün geçerli
        setCookie("userData", JSON.stringify(data.user), 7);
        
        console.log("Kayıt başarılı:", data);
        router.push("/dashboard");
      } else {
        // Hata mesajını göster
        const errorMessage = data.message || "Kayıt başarısız.";
        setFormErrors((prev) => ({
          ...prev,
          email: errorMessage,
        }));
      }
    } catch (err) {
      console.error("Kayıt hatası:", err);
      setFormErrors((prev) => ({
        ...prev,
        email: "Sunucuya bağlanılamadı.",
      }));
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleRegister() {
    // Google OAuth yönlendirmesi
    window.location.href = `${baseUrl}/auth/google`;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Kayıt Ol</h1>

        {/* Kayıt Tipi Seçimi */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Kayıt Türü</h3>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="registrationType"
                value="new"
                checked={registrationType === 'new'}
                onChange={() => handleRegistrationTypeChange('new')}
                className="mr-2"
              />
              <span className="text-sm">Yeni Şirket</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="registrationType"
                value="invite"
                checked={registrationType === 'invite'}
                onChange={() => handleRegistrationTypeChange('invite')}
                className="mr-2"
              />
              <span className="text-sm">Davet Kodu</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 text-left">
          {formErrors.name && (
            <p className="text-sm text-red-600">{formErrors.name}</p>
          )}
          <input
            type="text"
            name="name"
            placeholder="Ad Soyad"
            value={registerData.name}
            onChange={handleInputChange}
            autoComplete="name"
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.email && (
            <p className="text-sm text-red-600">{formErrors.email}</p>
          )}
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            value={registerData.email}
            onChange={handleInputChange}
            autoComplete="email"
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.phone && (
            <p className="text-sm text-red-600">{formErrors.phone}</p>
          )}
          <input
            type="tel"
            name="phone"
            placeholder="Telefon"
            value={registerData.phone}
            onChange={handleInputChange}
            autoComplete="tel"
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {formErrors.password && (
            <p className="text-sm text-red-600">{formErrors.password}</p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={registerData.password}
            onChange={handleInputChange}
            autoComplete="new-password"
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />

          {/* Koşullu Alanlar */}
          {registrationType === 'new' && (
            <>
              {formErrors.companyName && (
                <p className="text-sm text-red-600">{formErrors.companyName}</p>
              )}
              <input
                type="text"
                name="companyName"
                placeholder="Şirket Adı"
                value={registerData.companyName}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
              />
            </>
          )}

          {registrationType === 'invite' && (
            <>
              {formErrors.inviteCode && (
                <p className="text-sm text-red-600">{formErrors.inviteCode}</p>
              )}
              <input
                type="text"
                name="inviteCode"
                placeholder="Davet Kodu"
                value={registerData.inviteCode}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
          </button>
        </form>

        <button
          onClick={handleGoogleRegister}
          className="mt-6 w-full bg-black text-white py-3 rounded-md flex items-center justify-center gap-3 hover:bg-gray-900 transition"
        >
          Google ile Kayıt Ol
        </button>

        <p className="mt-4 text-gray-600 text-sm">
          Hesabınız var mı?{" "}
          <a
            href="/auth/login"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Giriş Yap
          </a>
        </p>
      </div>
    </main>
  );
}