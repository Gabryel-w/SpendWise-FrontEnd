"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Faq() {
  const faqs = [
    {
      question: "O SpendWise é gratuito?",
      answer:
        "Sim! O SpendWise oferece uma versão gratuita com todas as funcionalidades principais para ajudar você a gerenciar suas finanças pessoais. Futuramente, poderemos oferecer planos premium com recursos avançados.",
    },
    {
      question: "Como posso acompanhar meus gastos e receitas?",
      answer:
        "Você pode adicionar suas despesas e receitas de forma simples e rápida. Acompanhe gráficos intuitivos e relatórios detalhados dentro do painel do usuário.",
    },
    {
      question: "Meus dados financeiros estão seguros?",
      answer:
        "Sim, levamos a segurança muito a sério. Usamos criptografia para proteger seus dados e nunca compartilhamos suas informações com terceiros.",
    },
    {
      question: "Posso acessar o SpendWise pelo celular?",
      answer:
        "Sim! Nossa plataforma é 100% responsiva e você pode acessá-la de qualquer dispositivo, seja computador, tablet ou smartphone.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className={`py-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } bg-gradient-to-b from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            Perguntas Frequentes
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Tire suas dúvidas e comece a usar o SpendWise com confiança!
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 shadow-lg transition-shadow hover:shadow-xl"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-800 dark:text-white">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`px-6 pb-6 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
