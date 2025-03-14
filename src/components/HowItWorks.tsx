"use client";
import { ArrowRightCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "1. Crie sua Conta",
      description:
        "Cadastre-se em poucos segundos e comece a controlar suas finanças de forma prática e rápida.",
      icon: "/user.png", 
    },
    {
      title: "2. Registre suas Transações",
      description:
        "Adicione receitas e despesas com facilidade. Organize por categorias e datas.",
      icon: "/transaction.png",
    },
    {
      title: "3. Acompanhe seu Progresso",
      description:
        "Visualize gráficos e relatórios personalizados para entender e melhorar sua vida financeira.",
      icon: "/progress.png",
    },
  ];

  return (
    <section className="py-24 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            Como Funciona
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Com apenas 3 passos simples, você assume o controle total das suas finanças.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
                <img src={step.icon} alt="" className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all"
          >
            Comece Agora
            <ArrowRightCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
