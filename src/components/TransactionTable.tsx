import { FiEdit, FiTrash } from "react-icons/fi";

interface Transaction {
  id: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  handleEdit: (transaction: Transaction) => void;
  handleDelete: (id: string) => void;
}

export default function TransactionTable({
  transactions,
  handleEdit,
  handleDelete,
}: TransactionTableProps) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Descrição
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Data
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Categoria
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              Valor
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{transaction.description}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{transaction.date}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{transaction.category}</td>
              <td
                className={`px-4 py-3 font-bold ${
                  transaction.type === "income" ? "text-green-500" : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"} R$ {transaction.amount.toFixed(2)}
              </td>
              <td className="px-4 py-3 flex justify-center gap-3">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  title="Editar"
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  title="Excluir"
                >
                  <FiTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                Nenhuma transação encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
