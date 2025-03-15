interface EditTransactionModalProps {
    editForm: {
      description: string;
      type: string;
      amount: number;
      category: string;
      date: string;
    };
    setEditForm: (form: any) => void;
    setEditingTransaction: (transaction: any) => void;
    handleUpdate: () => void;
  }
  
  export default function EditTransactionModal({
    editForm,
    setEditForm,
    setEditingTransaction,
    handleUpdate,
  }: EditTransactionModalProps) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
            Editar Transação
          </h2>
  
          {/* Descrição */}
          <input
            type="text"
            placeholder="Descrição"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
  
          {/* Valor */}
          <input
            type="number"
            placeholder="Valor"
            value={editForm.amount}
            onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
  
          {/* Tipo */}
          <select
            value={editForm.type}
            onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "income" | "expense" })}
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
  
          {/* Categoria */}
          <input
            type="text"
            placeholder="Categoria"
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
  
          {/* Data */}
          <input
            type="date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
  
          {/* Ações */}
          <div className="flex justify-between gap-4 pt-2">
            <button
              onClick={() => setEditingTransaction(null)}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>
    );
  }