import { useEffect, useState } from "react";

interface Collaborator {
    id: string;
    name: string;
    email: string;
}

interface CollaboratorsListProps {
    goalId: string;
    collaborators: string[];
    onCollaboratorsChange: () => Promise<void>;
}

export default function CollaboratorsList({ goalId }: CollaboratorsListProps) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/${goalId}/collaborators`);
                const data = await res.json();
                setCollaborators(data);
            } catch (error) {
                console.error("Erro ao buscar colaboradores:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollaborators();
    }, [goalId]);

    if (loading) return <p className="text-gray-500">Carregando colaboradores...</p>;

    if (collaborators.length === 0) return <p className="text-gray-500">Nenhum colaborador adicionado.</p>;

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Colaboradores</h3>
            <ul className="space-y-2">
                {collaborators.map((collaborator) => (
                    <li key={collaborator.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <span className="text-gray-800 dark:text-white">{collaborator.name} ({collaborator.email})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
