import { useEffect, useState } from "react";
import { X, User, Shield } from "lucide-react";

interface Collaborator {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface CollaboratorsListModalProps {
    isOpen: boolean;
    onClose: () => void;
    goalId: string;
}

export default function CollaboratorsListModal({ isOpen, onClose, goalId }: CollaboratorsListModalProps) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);


    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!isOpen) return;

        const fetchCollaborators = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/${goalId}/collaborators`, { 
                    headers: { Authorization: `Bearer ${token}` 
                }, });
                
                if (!res.ok) {
                    throw new Error("Erro ao buscar colaboradores");
                }
                const data = await res.json();
                setCollaborators(data);
            } catch (error) {
                console.error(error);
                setCollaborators([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCollaborators();
    }, [isOpen, goalId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all scale-95 animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Colaboradores
                </h2>

                {loading ? (
                    <div className="flex justify-center py-6">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : collaborators.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-300">Nenhum colaborador encontrado.</p>
                ) : (
                    <ul className="space-y-4">
                        {collaborators.map((collaborator) => (
                            <li key={collaborator.id || Math.random()} className="flex items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full">
                                    {collaborator.role === "owner" ? <Shield size={20} /> : <User size={20} />}
                                </div>
                                <div className="ml-4">
                                    <p className="text-gray-900 dark:text-white font-medium">{collaborator.name}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{collaborator.email}</p>
                                </div>
                                <span
                                    className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${collaborator.role === "owner"
                                        ? "bg-green-500 text-white"
                                        : "bg-blue-500 text-white"
                                        }`}
                                >
                                    {collaborator.role === "owner" ? "Dono" : "Colaborador"}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
