"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/header";
import BalanceInfo from "@/components/balanceInfo";
import Chatbot from "@/components/chatBot";
import TransactionTable from "@/components/TransactionTable";
import Pagination from "@/components/Pagination";
import EditTransactionModal from "@/components/EditTransactionModal";
import Filters from "@/components/Filters";

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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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

    useEffect(() => {
        const filtered = transactions.filter((transaction) =>
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTransactions(filtered);
        setCurrentPage(1);
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
        setCurrentPage(1);
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

            setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));

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
                <div className="grid grid-cols-1">
                    <BalanceInfo />
                    <motion.div className="bg-white p-4 rounded-xl shadow-md col-span-2 dark:bg-gray-800">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            <div className="w-full sm:w-auto">
                                <Link href="/dashboard/new-transaction">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition dark:bg-blue-600 dark:hover:bg-blue-700 w-full sm:w-auto">
                                        Adicionar Nova Transação
                                    </button>
                                </Link>
                            </div>

                            <Filters
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filterType={filterType}
                                setFilterType={setFilterType}
                                filterCategory={filterCategory}
                                setFilterCategory={setFilterCategory}
                                filterDate={filterDate}
                                setFilterDate={setFilterDate}
                            />
                        </div>

                        <TransactionTable
                            transactions={currentTransactions}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handleNextPage={handleNextPage}
                            handlePreviousPage={handlePreviousPage}
                        />
                    </motion.div>
                </div>

                {editingTransaction && (
                    <EditTransactionModal
                        editForm={editForm}
                        setEditForm={setEditForm}
                        setEditingTransaction={setEditingTransaction}
                        handleUpdate={handleUpdate}
                    />
                )}
            </div>
            <Chatbot />
        </>
    );
}