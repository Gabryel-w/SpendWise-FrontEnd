"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function CallToAction() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 px-6 lg:px-8 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 dark:from-indigo-800 dark:via-purple-800 dark:to-fuchsia-700 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl font-extrabold mb-6 leading-tight">
          Pronto para controlar suas finanças de forma inteligente?
        </h2>
        <p className="text-lg mb-10 opacity-90">
          Comece agora a usar o SpendWise e transforme sua maneira de lidar com o dinheiro. Simples, seguro e gratuito!
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-200 transition-all text-lg"
        >
          Crie sua conta grátis
        </Link>
        <p className="mt-4 text-sm opacity-80">
          Já tem uma conta?{" "}
          <Link href="/login" className="underline hover:text-gray-200 transition-all">
            Acesse aqui
          </Link>
        </p>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 dark:opacity-20">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          fill="none"
          viewBox="0 0 1440 320"
        >
          <path
            fill="currentColor"
            d="M0,160L60,176C120,192,240,224,360,229.3C480,235,600,213,720,208C840,203,960,213,1080,197.3C1200,181,1320,139,1380,117.3L1440,96V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
