"use client";

import Image from "next/image";
import Link from "next/link";

const About: React.FC = () => {
    return (
        <section id="about" className="bg-gray-100 py-16 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">

                <div className="w-full md:w-1/2 bg-gray-400 dark:bg-gray-900 rounded-lg">
                    <Image
                        src="/AboutImage.png"
                        alt="Sobre o Spend Wise"
                        width={500}
                        height={500}
                        className="rounded-2xl shadow-lg"
                    />
                </div>

                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-white">
                        Sobre o Spend Wise
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4 dark:text-white">
                        O <span className="font-semibold text-blue-600 dark:text-white">Spend Wise</span> é um sistema inovador de gerenciamento de finanças pessoais.
                        Nossa missão é ajudar você a organizar seus gastos, economizar de forma inteligente
                        e alcançar seus objetivos financeiros sem complicação.
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 dark:text-white">
                        Com ferramentas intuitivas e relatórios detalhados, o Spend Wise permite que você
                        tenha total controle sobre sua vida financeira, garantindo um futuro mais seguro.
                    </p>

                    <Link
                        href="/login"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                    >
                         Faça Login
                    </Link>

                   
                </div>

            </div>
        </section>
    );
};

export default About;
