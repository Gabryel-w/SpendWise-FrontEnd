"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: () => void; 
}

export default function GoalModal({ isOpen, onClose, onGoalCreated }: GoalModalProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch("http://localhost:5000/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name,
          target_amount: parseFloat(targetAmount),
          deadline,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar meta");
      }

      onGoalCreated(); 
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
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-lg relative shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-500">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4">Nova Meta</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome da Meta</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Valor Alvo (R$)</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Data Limite</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Salvando..." : "Criar Meta"}
          </button>
        </form>
      </div>
    </div>
  );
}
