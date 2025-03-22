"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CACHE_KEYS = ["user", "token"];
const CLEAN_INTERVAL = 30 * 60 * 1000; // 30 minutos

export default function CacheCleaner() {
    const router = useRouter();

    useEffect(() => {
        const clearCache = () => {
            CACHE_KEYS.forEach((key) => localStorage.removeItem(key));

            localStorage.removeItem("lastActivity"); // Remove a última atividade ao limpar o cache
            router.push("/login");
        };

        const checkInactivity = () => {
            const lastActivity = localStorage.getItem("lastActivity");
            const now = Date.now();

            if (lastActivity && now - parseInt(lastActivity) > CLEAN_INTERVAL) {
                clearCache();
            }
        };

        // Atualiza a última atividade sempre que o usuário interagir
        const updateActivity = () => localStorage.setItem("lastActivity", Date.now().toString());

        // Verifica inatividade ao carregar o site
        checkInactivity();

        // Monitora interações do usuário
        window.addEventListener("mousemove", updateActivity);
        window.addEventListener("keydown", updateActivity);

        return () => {
            window.removeEventListener("mousemove", updateActivity);
            window.removeEventListener("keydown", updateActivity);
        };
    }, [router]);

    return null;
}
