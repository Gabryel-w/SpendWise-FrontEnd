import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet } from "lucide-react";
import { JSX } from "react";

interface Transaction {
  id: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
}

interface BalanceInfoProps {
  transactions: Transaction[];
}

export default function BalanceInfo({ transactions }: BalanceInfoProps) {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
  const currentBalance = totalIncome - totalExpense;
  const averageBalance = currentBalance / 12;

  return (
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <BalanceCard icon={<Wallet className="w-10 h-10 text-blue-600 dark:text-blue-400" />} title="Saldo Atual" value={currentBalance} />
      <BalanceCard icon={<ArrowUpRight className="w-10 h-10 text-green-600 dark:text-green-400" />} title="Receitas" value={totalIncome} />
      <BalanceCard icon={<ArrowDownRight className="w-10 h-10 text-red-600 dark:text-red-400" />} title="Despesas" value={totalExpense} />
      <BalanceCard icon={<DollarSign className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />} title="Saldo Médio" value={averageBalance} />
    </motion.div>
  );
}

function BalanceCard({ icon, title, value }: { icon: JSX.Element; title: string; value: number }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4 dark:bg-gray-900 dark:border-gray-700">
      {icon}
      <div>
        <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          {value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </div>
    </div>
  );
}
