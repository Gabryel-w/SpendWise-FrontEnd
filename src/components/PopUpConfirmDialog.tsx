import { X } from "lucide-react";

interface PopUpConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PopUpConfirmDialog({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: PopUpConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full relative">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          <X />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Confirmação
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
          >
            Não
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
