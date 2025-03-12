"use client";

import Image from "next/image";

const Banner: React.FC = () => {
    return (
        <div className="relative w-full h-[400px] md:h-[600px]">
            {/* Imagem de fundo visível apenas em telas médias (md) para cima */}
            <div className="hidden md:block absolute inset-0 -z-1">
                <Image 
                    src="/banner.png" 
                    alt="Banner principal" 
                    layout="responsive"
                    width={1920} 
                    height={600}
                    objectFit="cover"
                    quality={100} 
                    priority
                />
            </div>

            {/* Texto exibido apenas em telas menores */}
            <div className="block md:hidden text-center p-6 bg-white">
                <h1 className="text-xl font-bold text-gray-900">
                    Spend Wise
                </h1>
                <p className="text-gray-700 text-lg mt-2">
                    Seus sonhos, nossa missão.<br />Controle suas finanças, transforme seu futuro.
                </p>
            </div>
        </div>
    );
};

export default Banner;
