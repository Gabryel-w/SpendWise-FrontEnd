import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Transaction {
    id: string;
    description: string;
    type: "income" | "expense";
    amount: number;
    category: string;
    date: string;
}

export default function BalanceInfo() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchTransactions = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (!user?.id) return;

            const response = await fetch(`http://localhost:5000/transactions?user_id=${user.id}`);
            const data = await response.json();
            setTransactions(data);
            setIsUpdating(false);
        } catch (error) {
            console.error("Erro ao buscar transações", error);
        }
    };

    useEffect(() => {
        fetchTransactions(); // Fetch inicial

        const ws = new WebSocket("ws://localhost:5000");

        ws.onopen = () => console.log("WebSocket conectado!");

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("WebSocket recebeu:", message);

            if (message.type === "update") {
                setIsUpdating(true);
                fetchTransactions(); // Atualiza os dados ao receber evento do WebSocket
            }
        };

        return () => ws.close();
    }, []);

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    const currentBalance = totalIncome - totalExpense;

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            animate={{ opacity: isUpdating ? 0.5 : 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-white p-4 rounded-xl shadow-md dark:bg-gray-800 dark:text-white">
                <h3 className="text-gray-600 dark:text-gray-300">Saldo Atual</h3>
                <p className="text-2xl font-bold text-gray-600 dark:text-white">
                    {currentBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md dark:bg-gray-800 dark:text-white">
                <h3 className="text-gray-600 dark:text-gray-300">Receitas</h3>
                <p className="text-2xl font-bold text-green-500">
                    {totalIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md dark:bg-gray-800 dark:text-white">
                <h3 className="text-gray-600 dark:text-gray-300">Despesas</h3>
                <p className="text-2xl font-bold text-red-500">
                    {totalExpense.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md dark:bg-gray-800 dark:text-white">
                <h3 className="text-gray-600 dark:text-gray-300">Saldo Médio</h3>
                <p className="text-2xl font-bold text-gray-600 dark:text-white">
                    {(currentBalance / 12).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
            </div>
        </motion.div>
    );
}
