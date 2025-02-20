"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiEdit, FiTrash } from "react-icons/fi";
import Header from "@/components/header";
import BalanceInfo from "@/components/balanceInfo";

interface Transaction {
    id: string;
    description: string;
    type: "income" | "expense";
    amount: number;
    category: string;
    date: string;
}

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState(0);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [editForm, setEditForm] = useState({ description: "", type: "income", amount: 0, category: "", date: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Estado para a página atual
    const [itemsPerPage] = useState(10); // Itens por página

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
                setFilteredTransactions(data);

                const total = data.reduce((acc: number, transaction: Transaction) => {
                    return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
                }, 0);
                setBalance(total);
            } catch (error) {
                console.error("Erro ao buscar transações", error);
            }
        };
        fetchTransactions();
    }, []);

    // Atualizar lista filtrada conforme o usuário digita na barra de pesquisa
    useEffect(() => {
        const filtered = transactions.filter((transaction) =>
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTransactions(filtered);
        setCurrentPage(1); // Resetar para a primeira página ao filtrar
    }, [searchTerm, transactions]);

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setEditForm(transaction);
    };

    useEffect(() => {
        let filtered = transactions.filter((transaction) =>
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filterType) {
            filtered = filtered.filter((transaction) => transaction.type === filterType);
        }

        if (filterCategory) {
            filtered = filtered.filter((transaction) => transaction.category === filterCategory);
        }

        if (filterDate) {
            filtered = filtered.filter((transaction) => transaction.date === filterDate);
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1); // Resetar para a primeira página ao filtrar
    }, [searchTerm, filterType, filterCategory, filterDate, transactions]);

    const handleUpdate = async () => {
        if (!editingTransaction) return;

        try {
            const response = await fetch(`http://localhost:5000/transactions/${editingTransaction.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (!response.ok) throw new Error("Erro ao atualizar transação");

            setTransactions((prevTransactions) => {
                const updatedTransactions = prevTransactions.map((t) =>
                    t.id === editingTransaction.id
                        ? { ...t, ...editForm, type: editForm.type as "income" | "expense" }
                        : t
                );

                // Recalcular saldo total
                const newBalance = updatedTransactions.reduce((acc, transaction) => {
                    return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
                }, 0);

                setBalance(newBalance);
                return updatedTransactions;
            });

            setEditingTransaction(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/transactions/${id}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("Erro ao deletar transação.");
            }

            // Atualiza a lista removendo a transação deletada
            setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));

            // Recalcula o saldo
            setBalance((prev) => {
                const deletedTransaction = transactions.find((t) => t.id === id);
                if (!deletedTransaction) return prev;
                return deletedTransaction.type === "income"
                    ? prev - deletedTransaction.amount
                    : prev + deletedTransaction.amount;
            });

            console.log("Transação deletada com sucesso.");
        } catch (error) {
            console.error(error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <Header />
            <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4">
                        <Link href="/dashboard/charts">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition dark:bg-blue-600 dark:hover:bg-blue-700">
                                Gráficos Financeiros
                            </button>
                        </Link>

                        <Link href="/dashboard/new-transaction">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition dark:bg-blue-600 dark:hover:bg-blue-700">
                                Adicionar Nova Transação
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Campo de pesquisa */}


                {/* Cards e Tabela */}
                <div className="grid grid-cols-1">
                    {/* Card de Saldo Total */}
                    <BalanceInfo />



                    {/* Tabela de Últimas Transações */}
                    <motion.div className="bg-white p-4 rounded-xl shadow-md col-span-2 dark:bg-gray-800">



                        {/* Filtros */}
                        <div className="flex justify-center sm:justify-end">

                            <input
                                type="text"
                                placeholder="Pesquisar transações..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-2 mb-4 mr-4 w-80 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />

                            <div className="flex gap-4 mb-4 flex-col sm:flex-row">
                                <select
                                    className="p-2 border rounded text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    <option value="income">Receitas</option>
                                    <option value="expense">Despesas</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Filtrar por categoria"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="p-2 border rounded text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                />
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="p-2 border rounded text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-3 space-y-2 h-96 overflow-y-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="text-left py-2 text-gray-700 dark:text-white">Descrição</th>
                                        <th className="text-left py-2 text-gray-700 dark:text-white">Data</th>
                                        <th className="text-left py-2 text-gray-700 dark:text-white">Categoria</th>
                                        <th className="text-left py-2 text-gray-700 dark:text-white">Valor</th>
                                        <th className="text-left py-2 text-gray-700 dark:text-white">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-b text-gray-500 dark:border-gray-700">
                                            <td className="py-2 dark:text-white">{transaction.description}</td>
                                            <td className="py-2 dark:text-white">{transaction.date}</td>
                                            <td className="py-2 dark:text-white">{transaction.category}</td>
                                            <td className={`py-2 font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                                {transaction.type === "income" ? "+" : "-"} R$ {transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="py-2">
                                                <div className="flex items-center gap-2">
                                                    <button className="text-red-500 hover:text-red-700 transition" onClick={() => handleDelete(transaction.id)}>
                                                        <FiTrash size={18} />
                                                    </button>
                                                    <button onClick={() => handleEdit(transaction)} className="text-blue-500">
                                                        <FiEdit />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginação */}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                Anterior
                            </button>
                            <span className="text-gray-700 dark:text-white">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                Próxima
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Modal de Edição */}
                {editingTransaction && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-800">
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Editar Transação</h2>
                            <input
                                type="text"
                                placeholder="Descrição"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <input
                                type="number"
                                placeholder="Valor"
                                value={editForm.amount}
                                onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                                className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <select
                                value={editForm.type}
                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "income" | "expense" })}
                                className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="income">Receita</option>
                                <option value="expense">Despesa</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Categoria"
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <input
                                type="date"
                                value={editForm.date}
                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingTransaction(null)} className="bg-gray-400 text-white px-4 py-2 rounded dark:bg-gray-600">
                                    Cancelar
                                </button>
                                <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                    Atualizar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}