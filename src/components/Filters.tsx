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
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input
                type="text"
                placeholder="Pesquisar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white w-full sm:w-80"
            />

            <div className="flex gap-4 w-full sm:w-auto">
                <select
                    className="p-2 border rounded text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white w-full sm:w-auto"
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="income">Receitas</option>
                    <option value="expense">Despesas</option>
                </select>
                <input
                    type="text"
                    placeholder="Filtrar por categoria"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-2 border rounded text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white w-full sm:w-auto"
                />
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="p-2 border rounded text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white w-full sm:w-auto"
                />
            </div>
        </div>
    );
}