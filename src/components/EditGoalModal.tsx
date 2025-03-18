"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface EditGoalModalProps {
    goal: {
        id: string;
        title: string;
        goal_amount: number;
        saved_amount: number;
        deadline: string;
    };
    onClose: () => void;
    onGoalUpdated: () => void;
}

export default function EditGoalModal({ goal, onClose, onGoalUpdated }: EditGoalModalProps) {
    const [title, setTitle] = useState(goal.title);
    const [goalAmount, setGoalAmount] = useState(goal.goal_amount.toString());
    const [savedAmount, setSavedAmount] = useState(goal.saved_amount.toString());
    const [deadline, setDeadline] = useState(goal.deadline);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/${goal.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                goal_amount: parseFloat(goalAmount),
                saved_amount: parseFloat(savedAmount),
                deadline,
            }),
        });

        onGoalUpdated();
        onClose();
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-lg relative shadow-lg">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-500">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Editar Meta</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Título da Meta</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-lg p-2 mt-1 text-gray-800 dark:text-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Valor Alvo (R$)</label>
                        <input
                            type="number"
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            className="w-full border rounded-lg p-2 mt-1 text-gray-800 dark:text-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Valor Atual (R$)</label>
                        <input
                            type="number"
                            value={savedAmount}
                            onChange={(e) => setSavedAmount(e.target.value)}
                            className="w-full border rounded-lg p-2 mt-1 text-gray-800 dark:text-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Data Limite</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full border rounded-lg p-2 mt-1 text-gray-800 dark:text-gray-600"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg text-gray-800 dark:text-gray-200">
                        {loading ? "Atualizando..." : "Atualizar Meta"}
                    </button>
                </form>
            </div>
        </div>
    );
}
