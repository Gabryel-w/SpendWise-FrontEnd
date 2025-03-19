import React from "react";

interface ExportToCSVProps<T extends Record<string, unknown>> {
    data: T[]; 
    filename: string; 
    className?: string; 
}

const ExportToCSV = <T extends Record<string, unknown>>({
    data,
    filename,
    className
}: ExportToCSVProps<T>) => {
    const exportToCSV = () => {
        if (data.length === 0) {
            alert("Nenhum dado disponível para exportação.");
            return;
        }

        const headers = Object.keys(data[0]).join(",");
        const rows = data.map(item => Object.values(item).join(","));
        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join("\n")}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button onClick={exportToCSV} className={className}>
            Exportar para CSV
        </button>
    );
};

export default ExportToCSV;
