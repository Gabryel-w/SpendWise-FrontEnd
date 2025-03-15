"use client";

import { useEffect, useState } from "react";
import { Plus, Target } from "lucide-react";
import GoalModal from "@/components/GoalModal";
import Header from "@/components/header";

interface Goal {
    id: string;
    user_id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
    description: string;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
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
                            <div
                                key={goal.id}
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-3"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold">{goal.name}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Prazo: {new Date(goal.deadline).toLocaleDateString()}
                                    </p>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300">{goal.description}</p>

                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                    <div
                                        className="bg-green-500 h-4 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                (goal.current_amount / goal.target_amount) * 100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {goal.current_amount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}{" "}
                                    de{" "}
                                    {goal.target_amount.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal para criar meta */}
                <GoalModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onGoalCreated={fetchGoals}
                />
            </div>
        </>
    );
}
