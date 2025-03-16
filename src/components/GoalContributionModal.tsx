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
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/goal-contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal_id: goalId, amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao adicionar contribuição");
      }

      onContributionAdded();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-md relative shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-500">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Nova Contribuição</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Valor (R$)"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Salvando..." : "Adicionar Contribuição"}
          </button>
        </form>
      </div>
    </div>
  );
}
