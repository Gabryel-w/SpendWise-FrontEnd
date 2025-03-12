"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./darkModeToggle";

interface User {
    id: string;
    email: string;
    name: string;
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para o menu móvel
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false); // Estado para o submenu
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user") || "null");
            if (storedUser) {
                try {
                    const response = await fetch(`http://localhost:5000/user-by-email?email=${storedUser.email}`);
                    if (!response.ok) {
                        throw new Error("Erro ao buscar usuário");
                    }
                    const userData = await response.json();
                    setUser(userData);
                } catch (error) {
                    console.error("Erro ao buscar usuário:", error);
                }
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    const toggleSubmenu = () => {
        setIsSubmenuOpen(!isSubmenuOpen); // Alternar a visibilidade do submenu
    };

    return (
        <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md relative">
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold">
                    <Link href="/dashboard">SpendWise</Link>
                </h1>
                <p className="hidden md:block text-sm font-semibold hover:text-blue-300 transition-colors duration-200">
                    <Link href="/dashboard/charts">Gráficos financeiros</Link>
                </p>
            </div>

            {/* Menu para telas maiores */}
            <nav className="hidden md:flex items-center gap-6">
                {user ? (
                    <div className="relative">
                        <div className="flex items-center gap-2">
                            {/* Texto "Olá" (não clicável) */}
                            <p className="text-sm">Olá,</p>
                            {/* Nome do usuário (clicável) */}
                            <div
                                onClick={toggleSubmenu}
                                className="cursor-pointer text-sm hover:text-blue-300 transition-colors duration-200"
                            >
                                {user.name || user.email}
                            </div>
                            {/* Ícone de seta */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        {/* Submenu */}
                        {isSubmenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                <div className="py-1">
                                    <div className="px-4 py-2 hover:bg-gray-700 transition-colors duration-200">
                                        <DarkModeToggle />
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
                    >
                        Login
                    </Link>
                )}
            </nav>

            {/* Botão hambúrguer para telas menores */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 focus:outline-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                    />
                </svg>
            </button>

            {/* Menu para telas menores */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-gray-800 text-white transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-96" : "max-h-0"}`}
            >
                <div className="p-4 flex flex-col gap-4">
                    <p className="text-sm font-semibold hover:text-blue-300 transition-colors duration-200">
                        <Link href="/dashboard/charts">Gráficos financeiros</Link>
                    </p>

                    {user ? (
                        <>
                            <div className="flex items-center gap-2">
                                {/* Texto "Olá" (não clicável) */}
                                <p className="text-sm">Olá,</p>
                                {/* Nome do usuário (clicável) */}
                                <div
                                    onClick={toggleSubmenu}
                                    className="cursor-pointer text-sm hover:text-blue-300 transition-colors duration-200"
                                >
                                    {user.name || user.email}
                                </div>
                            </div>
                            {isSubmenuOpen && (
                                <div className="pl-4">
                                    <div className="py-2">
                                        <DarkModeToggle />
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left py-2 hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white text-center"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}