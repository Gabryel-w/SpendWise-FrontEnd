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

export default function TransactionTable({ transactions, handleEdit, handleDelete }: TransactionTableProps) {
    return (
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
                    {transactions.map((transaction) => (
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
    );
}