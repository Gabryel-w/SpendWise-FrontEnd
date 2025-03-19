"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/header";
import BalanceInfo from "@/components/balanceInfo";
import Chatbot from "@/components/chatBot";
import TransactionTable from "@/components/TransactionTable";
import Pagination from "@/components/Pagination";
import EditTransactionModal from "@/components/EditTransactionModal";
import Filters from "@/components/Filters";
import Footer from "@/components/Footer";
import { Plus } from "lucide-react";
import NewTransactionModal from "@/components/NewTransactionModal";

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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({ description: "", type: "income", amount: 0, category: "", date: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);

  const router = useRouter();

  const fetchTransactions = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions?user_id=${user.id}`);
      const data = await response.json();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações", error);
    }
  }, [router]);

  useEffect(() => {
    fetchTransactions();

    const ws = new WebSocket(`ws://${process.env.NEXT_PUBLIC_API_URL}`);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket recebeu:", message);

      if (message.type === "update") {
        fetchTransactions();
      }
    };

    return () => ws.close();
  }, [fetchTransactions]);

  useEffect(() => {
    let filtered = transactions.filter((transaction) =>
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType) filtered = filtered.filter((t) => t.type === filterType);
    if (filterCategory) filtered = filtered.filter((t) => t.category === filterCategory);
    if (filterDate) filtered = filtered.filter((t) => t.date === filterDate);

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCategory, filterDate, transactions]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm(transaction);
  };

  const handleUpdate = async () => {
    if (!editingTransaction) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${editingTransaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Erro ao atualizar transação");

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id ? { ...t, ...editForm, type: editForm.type as "income" | "expense" } : t
        )
      );

      setEditingTransaction(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao deletar transação.");

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTransaction = () => {
    fetchTransactions();
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

  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Header />
      <main className="p-4 sm:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen space-y-6">
        <BalanceInfo transactions={transactions} />

        <motion.div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            <Plus />
          </button>

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

          <TransactionTable transactions={currentTransactions} handleEdit={handleEdit} handleDelete={handleDelete} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            handleGoToPage={handleGoToPage}
          />
        </motion.div>

        {editingTransaction && <EditTransactionModal editForm={editForm} setEditForm={setEditForm} handleUpdate={handleUpdate} setEditingTransaction={setEditingTransaction} />}
        {showAddModal && <NewTransactionModal onClose={() => setShowAddModal(false)} onSuccess={handleAddTransaction} />}
      </main>

      <Chatbot />
      <Footer />
    </>
  );
}
