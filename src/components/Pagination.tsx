interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  handleGoToPage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  handleNextPage,
  handlePreviousPage,
  handleGoToPage,
}: PaginationProps) {

  // Função para gerar as páginas a serem exibidas (limitando visualmente se muitas páginas)
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Máximo de páginas visíveis na numeração

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mt-6">
      {/* Botão Anterior */}
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 ${
          currentPage === 1
            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
        }`}
      >
        <span>&larr;</span> Anterior
      </button>

      {/* Numeração de páginas */}
      <div className="flex items-center gap-1">
        {generatePageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handleGoToPage(page)}
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              page === currentPage
                ? "bg-blue-600 text-white font-bold"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Botão Próxima */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 ${
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
