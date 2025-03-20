import { useState } from "react";
import { X } from "lucide-react";

interface AddCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
  onCollaboratorAdded: () => void;
}

export default function AddCollaboratorModal({
  isOpen,
  onClose,
  goalId,
  onCollaboratorAdded,
}: AddCollaboratorModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddCollaborator = async () => {
    if (!email) return setError("Digite um email válido.");
    setLoading(true);
    setError("");

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${goalId}/collaborators`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({ userEmail: email }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao adicionar colaborador.");
      }

      setEmail("");
      onCollaboratorAdded();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Não foi possível adicionar o colaborador.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Adicionar Colaborador</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          type="email"
          className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200"
          placeholder="Email do colaborador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-700">
            Cancelar
          </button>
          <button
            onClick={handleAddCollaborator}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
