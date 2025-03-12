"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/Footer";

export default function NewTransaction() {
  const [description, setDescription] = useState("");
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) router.push("/login");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const transactionData = {
      user_id: user.id,
      description,
      type,
      amount: parseFloat(amount),
      category,
      date,
    };

    try {
      const response = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) throw new Error("Erro ao adicionar transação");

      setSuccessMessage("Transação adicionada com sucesso!");
      
      setTimeout(() => router.push("/dashboard"), 1500); // Redireciona com delay
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-8">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Nova Transação
          </h1>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Descrição */}
            <div>
              <label className="block text-gray-700 font-medium">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-700"
                placeholder="Ex: Salário, Mercado, Transporte..."
                required
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-gray-700 font-medium">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-700"
                required
              >
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-gray-700 font-medium">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-700"
                placeholder="Ex: 1500.00"
                required
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-gray-700 font-medium">Categoria</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-700"
                placeholder="Ex: Alimentação, Transporte..."
                required
              />
            </div>

            {/* Data */}
            <div>
              <label className="block text-gray-700 font-medium">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-700"
                required
              />
            </div>

            {/* Botão Adicionar */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Adicionando..." : "Adicionar Transação"}
            </button>
          </form>

          {/* Botão Voltar */}
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 w-full py-3 rounded-xl font-semibold text-white bg-gray-500 hover:bg-gray-600 transition"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
