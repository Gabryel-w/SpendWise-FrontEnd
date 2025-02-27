"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./darkModeToggle";

export default function Header() {
    const [user, setUser] = useState<{ id: string; email: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar o menu hambúrguer
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <header className="bg-[#141315] text-white py-4 px-6 flex justify-between items-center shadow-md relative">
            {/* Logo e Link para Gráficos financeiros */}
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold">
                    <Link href="/dashboard">SpendWise</Link>
                </h1>

                {/* Link para Gráficos financeiros (visível em telas maiores) */}
                <p className="hidden md:block text-sm font-semibold hover:text-blue-300 transition-colors duration-200">
                    <Link href="/dashboard/charts">Gráficos financeiros</Link>
                </p>
            </div>

            {/* Menu para telas maiores */}
            <nav className="hidden md:flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-4">
                        <DarkModeToggle />
                        <span className="text-sm">{user.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                        >
                            Logout
                        </button>
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

            {/* Menu para telas menores (aparece quando o botão hambúrguer é clicado) */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-gray-800 text-white transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-96" : "max-h-0"}`}
            >
                <div className="p-4 flex flex-col gap-4">
                    {/* Link para Gráficos financeiros no menu móvel */}
                    <p className="text-sm font-semibold hover:text-blue-300 transition-colors duration-200">
                        <Link href="/dashboard/charts">Gráficos financeiros</Link>
                    </p>

                    {user ? (
                        <>
                            <span className="text-sm">{user.email}</span>
                            <DarkModeToggle />
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                            >
                                Logout
                            </button>
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