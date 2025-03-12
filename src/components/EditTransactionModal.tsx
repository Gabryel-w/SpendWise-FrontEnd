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

export default function EditTransactionModal({ editForm, setEditForm, setEditingTransaction, handleUpdate }: EditTransactionModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-800">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Editar Transação</h2>
                <input
                    type="text"
                    placeholder="Descrição"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-800"
                />
                <input
                    type="number"
                    placeholder="Valor"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                    className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-800"
                />
                <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "income" | "expense" })}
                    className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-800"
                >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                </select>
                <input
                    type="text"
                    placeholder="Categoria"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-800"
                />
                <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="border p-2 rounded mb-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white text-gray-800"
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
    );
}