"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import BalanceInfo from "@/components/balanceInfo";
import Footer from "@/components/Footer";
import ExportToCSV from "@/components/ExportToCSV";

interface Transaction {
    id: string;
    description: string;
    type: "income" | "expense";
    amount: number;
    category: string;
    date: string;
}

interface BalanceData {
    date: string;
    balance: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

export default function GraphsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user") || "{}");

                if (!user?.id) {
                    router.push("/login");
                    return;
                }

                const response = await fetch(`http://localhost:5000/transactions?user_id=${user.id}`);
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Erro ao buscar transações", error);
            }
        };
        fetchTransactions();
    }, []);

    const categories = Array.from(new Set(transactions.map(t => t.category)));
    const categoryData = categories.map(category => ({
        name: category,
        value: transactions.filter(t => t.category === category).reduce((acc, t) => acc + t.amount, 0)
    }));

    const incomeExpensesData = transactions.reduce((acc, t) => {
        const date = t.date;
        const existing = acc.find(item => item.date === date);
        if (existing) {
            existing[t.type] += t.amount;
        } else {
            acc.push({ date, income: t.type === "income" ? t.amount : 0, expense: t.type === "expense" ? t.amount : 0 });
        }
        return acc;
    }, [] as { date: string; income: number; expense: number }[]);

    const balanceData: BalanceData[] = [];

    for (let i = 0; i < incomeExpensesData.length; i++) {
        const item = incomeExpensesData[i];
        const previousBalance = i === 0 ? 0 : balanceData[i - 1].balance;
        const currentBalance = previousBalance + item.income - item.expense;
        balanceData.push({ date: item.date, balance: currentBalance });
    }

    return (
        <>
            <Header />

            <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900 dark:text-white">
                <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-white tracking-tight">
                    Painel Financeiro <span className="text-blue-600 dark:text-blue-400">Interativo</span>
                </h1>

                {/* Cards de Resumo */}
                <BalanceInfo />

                {/* Gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gráfico de Distribuição de Gastos */}
                    <div className="bg-white p-4 rounded-xl shadow-md dark:bg-gray-800 dark:text-white">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Distribuição de Gastos</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfico de Receitas vs Despesas */}
                    <div className="bg-white p-4 rounded-xl shadow-md dark:bg-gray-800 dark:text-white">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Receitas vs Despesas</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={incomeExpensesData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="income" fill="#4CAF50" />
                                <Bar dataKey="expense" fill="#F44336" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráficos Adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Gráfico de Evolução do Saldo */}
                    <div className="bg-white p-4 rounded-xl shadow-md dark:bg-gray-800 dark:text-white">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Evolução do Saldo</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={balanceData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="balance" stroke="#2196F3" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfico de Gastos Acumulados */}
                    <div className="bg-white p-4 rounded-xl shadow-md dark:bg-gray-800 dark:text-white">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Gastos Acumulados</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={incomeExpensesData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="expense" stroke="#FF9800" fill="#FF9800" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Botão de Exportação Centralizado e Estilizado */}
                <div className="flex justify-center items-center mt-6">
                    <ExportToCSV
                        data={transactions}
                        filename="transacoes"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    />
                </div>
            </div>

            <Footer />
        </>
    );
}