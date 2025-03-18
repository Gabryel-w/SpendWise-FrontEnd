"use client";

import { useEffect, useState } from "react";

interface Contribution {
    id: string;
    goal_id: string;
    amount: number;
    contributed_at: string;
}

interface GoalContributionHistoryProps {
    goalId: string;
    refreshTrigger?: number;
}

export default function GoalContributionHistory({ goalId, refreshTrigger }: GoalContributionHistoryProps) {
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchContributions = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goal-contributions/by-goal?goal_id=${goalId}`);
            const data = await res.json();

            setContributions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar contribuições:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContributions();
    }, [goalId, refreshTrigger]);

    return (
        <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Histórico de Contribuições</h3>
            {loading ? (
                <p className="text-gray-800 dark:text-gray-800">Carregando...</p>
            ) : contributions.length === 0 ? (
                <p className="text-gray-800 dark:text-gray-200">Nenhuma contribuição registrada.</p>
            ) : (
                <ul className="space-y-2 text-gray-800 dark:text-gray-200">
                    {contributions.map((contribution) => (
                        <li key={contribution.id} className="flex justify-between border-b pb-1 text-gray-800 dark:text-gray-200">
                            <span>
                                {parseFloat(contribution.amount.toString()).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </span>
                            <span className="text-sm text-gray-800 dark:text-gray-400">
                                {new Date(contribution.contributed_at).toLocaleDateString()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
