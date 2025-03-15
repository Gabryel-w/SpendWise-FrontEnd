"use client";

import { useEffect, useState } from "react";
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
  const [balance, setBalance] = useState(0);
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

  // Fetch inicial
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

  useEffect(() => {
    fetchTransactions();
  }, [router]);

  // Filtros dinâmicos
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

  // Ações
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm(transaction);
  };

  const handleUpdate = async () => {
    if (!editingTransaction) return;

    try {
      const response = await fetch(`http://localhost:5000/transactions/${editingTransaction.id}`, {
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
      const response = await fetch(`http://localhost:5000/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao deletar transação.");

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      const deletedTransaction = transactions.find((t) => t.id === id);
      if (deletedTransaction) {
        setBalance((prev) =>
          deletedTransaction.type === "income" ? prev - deletedTransaction.amount : prev + deletedTransaction.amount
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Adicionar nova transação
  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
    fetchTransactions();
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // ⚠️ Aqui está a função que faltava:
  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Header />
      <main className="p-4 sm:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen space-y-6">

        <BalanceInfo />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6"
        >

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              title="Adicionar Nova Transação"
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <Plus className="w-5 h-5" />
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
            handleGoToPage={handleGoToPage}
          />
        </motion.div>

        {editingTransaction && (
          <EditTransactionModal
            editForm={editForm}
            setEditForm={setEditForm}
            setEditingTransaction={setEditingTransaction}
            handleUpdate={handleUpdate}
          />
        )}

        {showAddModal && (
          <NewTransactionModal
            onClose={() => setShowAddModal(false)}
            onSuccess={handleAddTransaction}
          />
        )}
      </main>

      <Chatbot />
      <Footer />
    </>
  );
}
