"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CACHE_KEYS = ["user", "token"];
const CLEAN_INTERVAL = 30 * 60 * 1000; 

export default function CacheCleaner() {
    const router = useRouter();

    useEffect(() => {
        const clearCache = () => {
            CACHE_KEYS.forEach((key) => localStorage.removeItem(key));
            console.log("limpeza de cache realizada");
            router.push("/login"); 
        };

        const interval = setInterval(clearCache, CLEAN_INTERVAL);

        return () => clearInterval(interval); 
    }, [router]);

    return null; 
}
