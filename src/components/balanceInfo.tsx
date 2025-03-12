import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from "lucide-react";

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
    fetchTransactions();

    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => console.log("WebSocket conectado!");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket recebeu:", message);

      if (message.type === "update") {
        setIsUpdating(true);
        fetchTransactions();
      }
    };

    return () => ws.close();
  }, []);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const currentBalance = totalIncome - totalExpense;
  const averageBalance = currentBalance / 12;

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      animate={{ opacity: isUpdating ? 0.5 : 1, scale: isUpdating ? 0.98 : 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Card Saldo Atual */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 dark:bg-gray-900 dark:border-gray-700">
        <Wallet className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Saldo Atual</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {currentBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
      </div>

      {/* Card Receitas */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 dark:bg-gray-900 dark:border-gray-700">
        <ArrowUpRight className="w-10 h-10 text-green-600 dark:text-green-400" />
        <div>
          <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Receitas</h3>
          <p className="text-2xl font-bold text-green-600">
            {totalIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
      </div>

      {/* Card Despesas */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 dark:bg-gray-900 dark:border-gray-700">
        <ArrowDownRight className="w-10 h-10 text-red-600 dark:text-red-400" />
        <div>
          <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Despesas</h3>
          <p className="text-2xl font-bold text-red-600">
            {totalExpense.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
      </div>

      {/* Card Saldo Médio */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 dark:bg-gray-900 dark:border-gray-700">
        <DollarSign className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Saldo Médio</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {averageBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
