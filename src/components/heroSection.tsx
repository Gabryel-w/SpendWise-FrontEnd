'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">

      {/* Conteúdo principal */}
      <div className="text-center px-6 max-w-3xl z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
          Controle suas <span className="text-yellow-300">finanças</span> com inteligência.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/90">
          Spend Wise te ajuda a acompanhar gastos, economizar mais e alcançar seus objetivos financeiros com facilidade.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          {/* Botão primário */}
          <Link
            href="/register"
            className="inline-flex items-center bg-yellow-400 text-black hover:bg-yellow-300 transition-all text-lg px-8 py-4 rounded-xl shadow-lg font-semibold"
          >
            Comece agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>

          {/* Botão secundário */}
          <Link
            href="#about"
            className="inline-flex items-center border border-white text-white hover:bg-white/10 transition-all text-lg px-8 py-4 rounded-xl font-semibold"
          >
            Saiba mais
          </Link>
        </div>
      </div>

      {/* Gradiente decorativo sutil */}
      <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
