import { useState } from "react";
import { Trash } from "lucide-react";

interface RemoveCollaboratorButtonProps {
  goalId: string;
  collaboratorId: string;
  onCollaboratorRemoved: () => void;
}

export default function RemoveCollaboratorButton({
  goalId,
  collaboratorId,
  onCollaboratorRemoved,
}: RemoveCollaboratorButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (!confirm("Tem certeza que deseja remover este colaborador?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/goals/${goalId}/collaborators/${collaboratorId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        throw new Error("Erro ao remover colaborador");
      }
      onCollaboratorRemoved();
    } catch (error) {
      console.error("Erro ao remover colaborador:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-all disabled:opacity-50"
    >
      <Trash className="w-4 h-4" /> {loading ? "Removendo..." : "Remover"}
    </button>
  );
}
