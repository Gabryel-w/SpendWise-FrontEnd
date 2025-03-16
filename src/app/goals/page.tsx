"use client";

import { useEffect, useState } from "react";
import { Plus, Target, Trash, Pencil } from "lucide-react";
import GoalModal from "@/components/GoalModal";
import EditGoalModal from "@/components/EditGoalModal";
import Header from "@/components/header";
import Footer from "@/components/Footer";

interface Goal {
    id: string;
    user_id: string;
    title: string;
    goal_amount: number;
    saved_amount: number;
    deadline: string;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const fetchGoals = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const res = await fetch(`http://localhost:5000/goals?user_id=${user.id}`);
            const data = await res.json();
            setGoals(data);
        } catch (error) {
            console.error("Erro ao buscar metas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGoal = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir esta meta?")) {
            await fetch(`http://localhost:5000/goals/${id}`, { method: "DELETE" });
            fetchGoals();
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <>
            <Header />
            <div className="p-4 bg-gray-100 dark:bg-gray-900">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                        <Target className="w-8 h-8" />
                        Minhas Metas
                    </h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus /> Nova Meta
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500">Carregando metas...</p>
                ) : goals.length === 0 ? (
                    <p className="text-gray-500">Nenhuma meta cadastrada.</p>
                ) : (
                    <div className="space-y-6">
                        {goals.map((goal) => (
                            <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{goal.title}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Prazo: {new Date(goal.deadline).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                    <div
                                        className="bg-green-500 h-4 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                (goal.saved_amount / goal.goal_amount) * 100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {goal.saved_amount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}{" "}
                                    de{" "}
                                    {goal.goal_amount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </p>

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setEditingGoal(goal)}
                                        className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                                    >
                                        <Pencil className="w-4 h-4" /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGoal(goal.id)}
                                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                                    >
                                        <Trash className="w-4 h-4" /> Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <GoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onGoalCreated={fetchGoals} />
                {editingGoal && (
                    <EditGoalModal
                        goal={editingGoal}
                        onClose={() => setEditingGoal(null)}
                        onGoalUpdated={fetchGoals}
                    />
                )}
            </div>
            <Footer />
        </>
    );
}
