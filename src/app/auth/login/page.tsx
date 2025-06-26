"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/app/utils/cookies"; // kendi yazdığın fonksiyonlar

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginData {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  token?: string;
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState<LoginData>({
    emailOrPhone: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    const token = getCookie("userToken");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  }

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON response");
      }

      const data: LoginResponse = await response.json();

      if (response.ok && data.token) {
        // kendi yazdığın setCookie fonksiyonu
        setCookie("userToken", data.token, loginData.rememberMe ? 7 : 1);
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          setError("İstek zaman aşımına uğradı.");
        } else {
          setError(error.message || "Sunucu hatası.");
        }
      } else {
        setError("Bilinmeyen bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSignIn(): void {
    alert("Google sign-in clicked (implement OAuth flow)");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="emailOrPhone"
            placeholder="E-Mail or Phone"
            value={loginData.emailOrPhone}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="border border-gray-300 rounded-md p-3 placeholder-black text-black"
          />
          <label className="inline-flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              name="rememberMe"
              checked={loginData.rememberMe}
              onChange={handleInputChange}
              disabled={loading}
              className="rounded"
            />
            Remember me
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-6 w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-gray-600">
          Hesabınız yok mu?{" "}
          <a href="./register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Kayıt Ol
          </a>
        </p>
      </div>
    </main>
  );
}
