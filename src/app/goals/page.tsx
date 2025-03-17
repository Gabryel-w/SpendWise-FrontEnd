"use client";

import { useEffect, useState } from "react";
import { Plus, Target, Trash, Pencil, PiggyBank } from "lucide-react";
import GoalModal from "@/components/GoalModal";
import EditGoalModal from "@/components/EditGoalModal";
import GoalContributionModal from "@/components/GoalContributionModal";
import GoalContributionHistory from "@/components/GoalContributionHistory";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import PopUpConfirmDialog from "@/components/PopUpConfirmDialog"; // Import the PopUpConfirmDialog component
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Goal {
  id: string;
  user_id: string;
  title: string;
  goal_amount: number;
  saved_amount: number;
  deadline: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [contributingGoalId, setContributingGoalId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<{ [key: string]: boolean }>({});
  const [historyRefreshCounter, setHistoryRefreshCounter] = useState(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // State for confirmation dialog
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null); // State to store the goal to be deleted

  const fetchGoals = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`http://localhost:5000/goals?user_id=${user.id}`);
      const data = await res.json();
      setGoals(data);
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    await fetch(`http://localhost:5000/goals/${id}`, { method: "DELETE" });
    fetchGoals();
  };

  const handleConfirmDelete = (id: string) => {
    setGoalToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over.id);
      setGoals((goals) => arrayMove(goals, oldIndex, newIndex));
    }
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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={goals.map((goal) => goal.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {goals.map((goal) => (
                  <SortableGoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={() => setEditingGoal(goal)}
                    onDelete={() => handleConfirmDelete(goal.id)} // Use handleConfirmDelete instead of handleDeleteGoal
                    onContribute={() => setContributingGoalId(goal.id)}
                    onToggleHistory={() =>
                      setShowHistory((prev) => ({
                        ...prev,
                        [goal.id]: !prev[goal.id],
                      }))
                    }
                    showHistory={showHistory[goal.id]}
                    historyRefreshCounter={historyRefreshCounter}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Modais */}
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
      </div>
      <Footer />
    </>
  );
}

function SortableGoalCard({
  goal,
  onEdit,
  onDelete,
  onContribute,
  onToggleHistory,
  showHistory,
  historyRefreshCounter,
}: {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
  onContribute: () => void;
  onToggleHistory: () => void;
  showHistory: boolean;
  historyRefreshCounter: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCompleted = goal.saved_amount >= goal.goal_amount;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-6 border-4 border-blue-500 rounded-2xl shadow-lg space-y-3 transition-all duration-300 ${isCompleted
        ? "border-4 border-emerald-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900 dark:to-gray-800"
        : "bg-white dark:bg-gray-800"
        }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="top-1 left-1 p-2 bg-gray-700 rounded-full cursor-grab "
      >
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>
      </button>

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

      <div className={`w-full h-4 rounded-full overflow-hidden ${isCompleted ? "bg-emerald-200 dark:bg-emerald-800" : "bg-gray-200 dark:bg-gray-700"}`}>
        <div
          className={`h-4 rounded-full transition-all duration-500 ${isCompleted ? "bg-gradient-to-r from-green-400 to-emerald-600" : "bg-green-500"}`}
          style={{ width: `${Math.min((goal.saved_amount / goal.goal_amount) * 100, 100)}%` }}
        ></div>
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
      </div>

      {showHistory && (
        <GoalContributionHistory goalId={goal.id} refreshTrigger={historyRefreshCounter} />
      )}
    </div>
  );
}