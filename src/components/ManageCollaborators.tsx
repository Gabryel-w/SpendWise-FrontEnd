"use client";

import { useState, useEffect } from "react";
import CollaboratorsList from "@/components/CollaboratorsList";
import AddCollaboratorModal from "@/components/AddCollaboratorModal";
import { UserPlus } from "lucide-react";

interface ManageCollaboratorsProps {
  goalId: string;
}

export default function ManageCollaborators({ goalId }: ManageCollaboratorsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  const fetchCollaborators = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/${goalId}/collaborators`);
      const data = await res.json();
      setCollaborators(data);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, [goalId]);

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Colaboradores</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus className="w-4 h-4" /> Adicionar
        </button>
      </div>
      <CollaboratorsList goalId={goalId} collaborators={collaborators} onCollaboratorsChange={fetchCollaborators} />
      <AddCollaboratorModal
        goalId={goalId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCollaboratorAdded={fetchCollaborators}
      />
    </div>
  );
}
