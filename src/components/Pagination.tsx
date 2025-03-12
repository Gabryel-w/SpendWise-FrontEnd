interface PaginationProps {
    currentPage: number;
    totalPages: number;
    handleNextPage: () => void;
    handlePreviousPage: () => void;
}

export default function Pagination({ currentPage, totalPages, handleNextPage, handlePreviousPage }: PaginationProps) {
    return (
        <div className="flex justify-between mt-4">
            <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
                Anterior
            </button>
            <span className="text-gray-700 dark:text-white">
                Página {currentPage} de {totalPages}
            </span>
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
                Próxima
            </button>
        </div>
    );
}