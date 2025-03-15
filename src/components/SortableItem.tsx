import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiEdit, FiTrash } from "react-icons/fi";

interface Transaction {
  id: string;
  description: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
}

interface SortableItemProps {
  id: string;
  transaction: Transaction;
  handleEdit: (transaction: Transaction) => void;
  handleDelete: (id: string) => void;
}

export function SortableItem({ id, transaction, handleEdit, handleDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
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
  );
}