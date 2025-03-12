"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import ImageCarousel from "@/components/ImageCarousel";
import Footer from "@/components/Footer";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Limpa mensagens anteriores
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciais inválidas. Tente novamente.");

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMessage("Login realizado com sucesso! Redirecionando...");
      
      // Redireciona após pequeno delay para mostrar a mensagem
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="flex flex-col md:flex-row h-screen bg-white md:bg-gray-100">
        {/* Imagem lateral */}
        <div className="hidden md:block md:w-1/2">
          <ImageCarousel />
        </div>

        {/* Formulário de login */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Bem-vindo de volta</h1>

            {/* Mensagem de erro */}
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errorMessage}
              </div>
            )}

            {/* Mensagem de sucesso */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Campo Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-700"
                  required
                />
              </div>

              {/* Campo Senha */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-700"
                  required
                />
              </div>

              {/* Botão Login */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            {/* Link para Registro */}
            <p className="text-center text-sm mt-6 text-gray-700">
              Ainda não tem uma conta?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline font-semibold"
              >
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
