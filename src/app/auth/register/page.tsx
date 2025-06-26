"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "@/app/utils/cookies";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
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

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const errors = {
      name: "",
      email: "",
      phone: "",
      password: "",
    };
    let hasError = false;

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

    if (hasError) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setCookie("userToken", data.token, 1); // 1 gün geçerli
        router.push("/dashboard");
      } else {
        setFormErrors((prev) => ({
          ...prev,
          email: data.message || "Kayıt başarısız.",
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
    alert("Google kayıt akışı (henüz uygulanmadı)");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Kayıt Ol</h1>

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

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
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
