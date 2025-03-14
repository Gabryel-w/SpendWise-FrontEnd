"use client";
import { DollarSign, PieChart, Smartphone, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <DollarSign className="w-8 h-8 text-blue-600" />,
    title: "Gerencie suas finanças",
    description: "Controle seus gastos e receitas de maneira simples e intuitiva, com atualizações em tempo real.",
  },
  {
    icon: <PieChart className="w-8 h-8 text-green-600" />,
    title: "Visualize gráficos interativos",
    description: "Entenda para onde vai seu dinheiro com gráficos e relatórios que facilitam suas decisões financeiras.",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-purple-600" />,
    title: "Acesso em qualquer dispositivo",
    description: "Use a aplicação no celular, tablet ou desktop com uma interface responsiva e otimizada.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-yellow-600" />,
    title: "Segurança garantida",
    description: "Seus dados são criptografados e protegidos com as melhores práticas de segurança do mercado.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          O que você encontra no SpendWise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
