"use client";

import { useEffect, useState } from "react";
import { Plus, Target, Trash, Pencil, PiggyBank, UserPlus, Users } from "lucide-react";
import GoalModal from "@/components/GoalModal";
import EditGoalModal from "@/components/EditGoalModal";
import GoalContributionModal from "@/components/GoalContributionModal";
import GoalContributionHistory from "@/components/GoalContributionHistory";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import PopUpConfirmDialog from "@/components/PopUpConfirmDialog";
import AddCollaboratorModal from "@/components/AddCollaboratorModal";
import CollaboratorsListModal from "@/components/CollaboratorsListModal";

interface Collaborator {
  id: string;
  name: string;
  email: string;
}

interface Goal {
  id: string;
  user_id: string;
  title: string;
  goal_amount: number;
  saved_amount: number;
  deadline: string;
  collaborators: Collaborator[];
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [contributingGoalId, setContributingGoalId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<{ [key: string]: boolean }>({});
  const [historyRefreshCounter, setHistoryRefreshCounter] = useState(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); 
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null); 
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isCollaboratorsListModalOpen, setIsCollaboratorsListModalOpen] = useState(false);
  const [selectedGoalForCollaborators, setSelectedGoalForCollaborators] = useState<string | null>(null);

  const fetchGoals = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals?user_id=${user.id}`);
      const data = await res.json();
  
      if (res.status !== 200) {
        throw new Error(data.error || "Erro ao buscar metas");
      }
    
      const goalsWithCollaborators = await Promise.all(
        data.map(async (goal: Goal) => {
          try {
            const collaboratorsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/${goal.id}/collaborators`);
            
            if (!collaboratorsRes.ok) {
              throw new Error("Collaborators not found");
            }
            const collaborators = await collaboratorsRes.json();
            return { ...goal, collaborators };
          } catch (error) {
            console.error(`Erro ao buscar colaboradores para a meta ${goal.id}:`, error);
            return { ...goal, collaborators: [] };
          }
        })
      );

      setGoals(goalsWithCollaborators);
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
      setGoals([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/${id}`, { method: "DELETE" });
    fetchGoals();
  };

  const handleConfirmDelete = (id: string) => {
    setGoalToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <>
      <Header />
      <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <Target className="w-8 h-8" />
            Minhas Metas
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus /> Nova Meta
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Carregando metas...</p>
        ) : goals.length === 0 ? (
          <p className="text-gray-500">Nenhuma meta cadastrada.</p>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => setEditingGoal(goal)}
                onDelete={() => handleConfirmDelete(goal.id)}
                onContribute={() => setContributingGoalId(goal.id)}
                onToggleHistory={() =>
                  setShowHistory((prev) => ({
                    ...prev,
                    [goal.id]: !prev[goal.id],
                  }))
                }
                showHistory={showHistory[goal.id]}
                historyRefreshCounter={historyRefreshCounter}
                onManageCollaborators={() => {
                  setSelectedGoalId(goal.id);
                  setIsCollaboratorModalOpen(true);
                }}
                onViewCollaborators={() => {
                  setSelectedGoalForCollaborators(goal.id);
                  setIsCollaboratorsListModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        <GoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onGoalCreated={fetchGoals} />
        {editingGoal && <EditGoalModal goal={editingGoal} onClose={() => setEditingGoal(null)} onGoalUpdated={fetchGoals} />}
        {contributingGoalId && (
          <GoalContributionModal
            isOpen={!!contributingGoalId}
            onClose={() => setContributingGoalId(null)}
            goalId={contributingGoalId}
            onContributionAdded={() => {
              fetchGoals();
              setHistoryRefreshCounter((prev) => prev + 1);
            }}
          />
        )}
        <PopUpConfirmDialog
          isOpen={isConfirmDialogOpen}
          message="Tem certeza que deseja excluir esta meta?"
          onConfirm={() => {
            if (goalToDelete) {
              handleDeleteGoal(goalToDelete);
              setGoalToDelete(null);
            }
            setIsConfirmDialogOpen(false);
          }}
          onCancel={() => setIsConfirmDialogOpen(false)}
        />
        {selectedGoalId && (
          <AddCollaboratorModal
            isOpen={isCollaboratorModalOpen}
            onClose={() => setIsCollaboratorModalOpen(false)}
            goalId={selectedGoalId}
            onCollaboratorAdded={fetchGoals}
          />
        )}
        {selectedGoalForCollaborators && (
          <CollaboratorsListModal
            isOpen={isCollaboratorsListModalOpen}
            onClose={() => setIsCollaboratorsListModalOpen(false)}
            goalId={selectedGoalForCollaborators}
          />
        )}
      </div>
      <Footer />
    </>
  );
}

function GoalCard({
  goal,
  onEdit,
  onDelete,
  onContribute,
  onToggleHistory,
  showHistory,
  historyRefreshCounter,
  onManageCollaborators,
  onViewCollaborators,
}: {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onContribute: () => void;
  onToggleHistory: () => void;
  showHistory: boolean;
  historyRefreshCounter: number;
  onManageCollaborators: () => void;
  onViewCollaborators: () => void;
}) {
  const isCompleted = goal.saved_amount >= goal.goal_amount;

  return (
    <div
      className={`relative p-6 border-4 border-blue-500 rounded-2xl shadow-lg space-y-3 transition-all duration-300 ${isCompleted
        ? "border-4 border-emerald-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900 dark:to-gray-800"
        : "bg-white dark:bg-gray-800"
        }`}
    >
      {isCompleted && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-2xl rounded-tr-xl shadow-md">
          🎉 Concluída
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${isCompleted ? "text-emerald-700 dark:text-emerald-300" : "text-gray-800 dark:text-white"}`}>
          {goal.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Prazo: {new Date(goal.deadline).toLocaleDateString()}</p>
      </div>

      <div className={`w-full h-4 rounded-full overflow-hidden relative ${isCompleted ? "bg-emerald-200 dark:bg-emerald-800" : "bg-gray-200 dark:bg-gray-700"}`}>
        <div
          className={`h-4 rounded-full transition-all duration-500 flex items-center justify-center ${isCompleted ? "bg-gradient-to-r from-green-400 to-emerald-600" : "bg-green-500"}`}
          style={{ width: `${Math.min((goal.saved_amount / goal.goal_amount) * 100, 100)}%` }}
        >
          <span className="text-xs text-white">{`${Math.min((goal.saved_amount / goal.goal_amount) * 100, 100).toFixed(2)}%`}</span>
        </div>
      </div>

      <p className={`text-sm ${isCompleted ? "text-emerald-700 dark:text-emerald-300 font-semibold" : "text-gray-600 dark:text-gray-300"}`}>
        {goal.saved_amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} de {goal.goal_amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>

      <div className="flex justify-end gap-2 flex-wrap">
        {!isCompleted && (
          <button
            onClick={onContribute}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <PiggyBank className="w-4 h-4" /> Contribuir
          </button>
        )}
        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <Pencil className="w-4 h-4" /> Editar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <Trash className="w-4 h-4" /> Excluir
        </button>
        <button
          onClick={onToggleHistory}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Histórico
        </button>
        <button
          onClick={onManageCollaborators}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <UserPlus className="w-4 h-4" /> Colaboradores
        </button>
        <button
          onClick={onViewCollaborators}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <Users className="w-4 h-4" /> Ver Colaboradores
        </button>
      </div>

      {showHistory && (
        <GoalContributionHistory goalId={goal.id} refreshTrigger={historyRefreshCounter} />
      )}
    </div>
  );
}