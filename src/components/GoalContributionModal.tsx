"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface GoalContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
  onContributionAdded: () => void;
}

export default function GoalContributionModal({
  isOpen,
  onClose,
  goalId,
  onContributionAdded,
}: GoalContributionModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Insira um valor válido e maior que 0.");
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      const userId = user?.id;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goal-contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({ goal_id: goalId, user_id: userId, amount: parsedAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao adicionar contribuição");
      }

      setAmount("");

      onContributionAdded();

      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Nova Contribuição</h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-800 dark:text-gray-200">Valor da Contribuição (R$)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 100"
              min="0.01"
              step="0.01"
              className="w-full border rounded-lg p-3 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {loading ? "Salvando..." : "Adicionar Contribuição"}
          </button>
        </form>
      </div>
    </div>
  );
}
