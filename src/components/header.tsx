"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./darkModeToggle";
import { Menu, X } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("token");
      if (storedUser) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-by-email?email=${storedUser.email}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Erro ao buscar usuário");
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
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const toggleSubmenu = () => setIsSubmenuOpen(!isSubmenuOpen);

  return (
    <header className="bg-gray-900 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        {/* Logo e Links */}
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-white dark:text-white">
            <Link href="/">SpendWise</Link>
          </h1>
          {user && (
            <nav className="hidden md:flex gap-6 text-sm">
              <Link href="/dashboard" className="hover:text-blue-500 transition-colors dark:text-gray-300">Dashboard</Link>
              <Link href="/dashboard/charts" className="hover:text-blue-500 transition-colors dark:text-gray-300">Gráficos</Link>
              <Link href="/goals" className="hover:text-blue-500 transition-colors dark:text-gray-300">Metas</Link>
            </nav>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <DarkModeToggle /> 

          {user ? (
            <div className="relative">
              <button
                onClick={toggleSubmenu}
                className="flex items-center gap-2 text-sm hover:text-blue-500 transition-colors"
              >
                Olá, {user.name || user.email}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${isSubmenuOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 111.02 1.1l-4 3.615a.75.75 0 01-1.02 0l-4-3.615a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isSubmenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden z-20">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left hover:bg-red-500 dark:hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-white transition-colors">
              Login
            </Link>
          )}
        </div>

        {/* Botão Menu Mobile */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
          {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Menu Mobile com Toggle de Tema */}
      <div
        className={`md:hidden bg-gray-900 dark:bg-gray-900 border-t dark:border-gray-700 transition-all overflow-hidden ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          <DarkModeToggle /> {/* Sempre visível também no mobile */}
          {user && (
            <>
              <Link href="/dashboard" className="hover:text-blue-500 transition-colors dark:text-gray-300">Dashboard</Link>
              <Link href="/dashboard/charts" className="hover:text-blue-500 transition-colors dark:text-gray-300">Gráficos</Link>
              <Link href="/goals" className="hover:text-blue-500 transition-colors dark:text-gray-300">Metas</Link>
              <button
                onClick={toggleSubmenu}
                className="flex items-center gap-2 text-sm hover:text-blue-500 transition-colors dark:text-gray-300"
              >
                Olá, {user.name || user.email}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${isSubmenuOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 111.02 1.1l-4 3.615a.75.75 0 01-1.02 0l-4-3.615a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isSubmenuOpen && (
                <div className="mt-2 space-y-2 pl-4">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
          {!user && (
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-white text-center transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
