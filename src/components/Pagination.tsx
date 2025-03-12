interface PaginationProps {
    currentPage: number;
    totalPages: number;
    handleNextPage: () => void;
    handlePreviousPage: () => void;
  }
  
  export default function Pagination({
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
  }: PaginationProps) {
    return (
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Botão Anterior */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 ${
            currentPage === 1
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          }`}
        >
          <span>&larr;</span> Anterior
        </button>
  
        {/* Texto de Página Atual */}
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Página <span className="font-bold">{currentPage}</span> de{" "}
          <span className="font-bold">{totalPages}</span>
        </span>
  
        {/* Botão Próxima */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 ${
            currentPage === totalPages
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          }`}
        >
          Próxima <span>&rarr;</span>
        </button>
      </div>
    );
  }
  