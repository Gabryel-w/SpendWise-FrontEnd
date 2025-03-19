"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface NewTransactionModalProps {
    onClose: () => void;
    onSuccess: (newTransaction: { id: string; description: string; type: string; amount: number; category: string; date: string; user_id: string }) => void;
}

export default function NewTransactionModal({ onClose, onSuccess }: NewTransactionModalProps) {
    const [formData, setFormData] = useState({
        description: "",
        type: "income",
        amount: "",
        category: "",
        date: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (!user?.id) {
                alert("Usuário não autenticado.");
                return;
            }

            const transactionData = {
                ...formData,
                amount: parseFloat(formData.amount),
                user_id: user.id,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) throw new Error("Erro ao adicionar transação.");

            const newTransaction = await response.json();
            onSuccess(newTransaction);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar transação.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-5">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Nova Transação
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descrição
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Salário, Compra..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="income">Receita</option>
                            <option value="expense">Despesa</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            step="0.01"
                            placeholder="0.00"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Alimentação, Transporte..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 p-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        Adicionar Transação
                    </button>
                </form>
            </div>
        </div>
    );
}
