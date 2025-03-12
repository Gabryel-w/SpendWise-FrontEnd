"use client";

import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Seção: Sobre o Spend Wise */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Spend Wise</h2>
                    <p className="text-gray-400">
                        O Spend Wise ajuda você a gerenciar suas finanças de forma inteligente, oferecendo controle sobre gastos, orçamento e planejamento financeiro para um futuro mais seguro.
                    </p>
                </div>

                {/* Seção: Links rápidos */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Links Úteis</h2>
                    <ul className="text-gray-400 space-y-2">
                        <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                        <li><a href="#" className="hover:text-white transition">Suporte</a></li>
                        <li><a href="#" className="hover:text-white transition">Política de Privacidade</a></li>
                    </ul>
                </div>

                {/* Seção: Redes sociais */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Siga-nos</h2>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <FaInstagram size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <FaTwitter size={20} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <FaLinkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Direitos autorais */}
            <div className="text-center text-gray-500 mt-10 border-t border-gray-700 pt-4">
                <p>&copy; {new Date().getFullYear()} Spend Wise. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
