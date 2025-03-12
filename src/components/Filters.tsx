interface FiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterType: string;
    setFilterType: (type: string) => void;
    filterCategory: string;
    setFilterCategory: (category: string) => void;
    filterDate: string;
    setFilterDate: (date: string) => void;
  }
  
  export default function Filters({
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    filterDate,
    setFilterDate,
  }: FiltersProps) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full mt-4">
        
        {/* Campo de Pesquisa */}
        <input
          type="text"
          placeholder="Pesquisar transações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
        />
  
        {/* Filtros Avançados */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          
          {/* Filtrar por Tipo */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
  
          {/* Filtrar por Categoria */}
          <input
            type="text"
            placeholder="Filtrar por categoria"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-auto p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white  text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
  
          {/* Filtrar por Data */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full sm:w-auto p-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>
    );
  }
  