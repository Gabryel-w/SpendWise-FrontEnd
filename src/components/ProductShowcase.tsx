"use client";

import Image from "next/image";

export default function ProductShowcase() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Veja como o SpendWise funciona na prática
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Controle total das suas finanças em poucos cliques
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Com uma interface simples e objetiva, você consegue acompanhar suas receitas e despesas, criar categorias personalizadas e analisar gráficos detalhados de desempenho financeiro.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Tudo isso com segurança de dados e sincronização automática entre dispositivos.
            </p>
          </div>

         
          <div className="flex justify-center items-center relative">

            <div className="relative w-[300px] h-[550px] rounded-3xl shadow-2xl overflow-hidden border-4 border-white dark:border-gray-800">
              <Image
                src="/dashboard.png" 
                alt="Tela do app SpendWise"
                layout="fill"
                objectFit="cover"
                className="rounded-3xl"
              />
            </div>

            <div className="absolute -right-16 top-10 w-[200px] h-[400px] rounded-3xl shadow-xl overflow-hidden border-4 border-white dark:border-gray-800 hidden md:block">
              <Image
                src="/charts.png" 
                alt="Tela adicional do app"
                layout="fill"
                objectFit="cover"
                className="rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
