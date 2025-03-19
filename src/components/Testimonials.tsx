"use client";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Mariana Silva",
      role: "Empreendedora",
      feedback:
        "O SpendWise me ajudou a organizar as finanças do meu negócio. Finalmente consigo visualizar minhas despesas e receitas de forma clara e prática.",
      avatar: "/userWoman.png",
    },
    {
      name: "Carlos Santos",
      role: "Desenvolvedor",
      feedback:
        "Excelente app! Consigo acompanhar meus gastos do dia a dia e entender para onde meu dinheiro está indo. Recomendo para todos que querem ter mais controle financeiro.",
      avatar: "/userMan.png",
    },
    {
      name: "Ana Souza",
      role: "Designer",
      feedback:
        "O visual é intuitivo e os gráficos ajudam muito a visualizar meus gastos. Simplesmente o melhor app de finanças pessoais que já usei!",
      avatar: "/userWoman.png",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            O que dizem nossos usuários
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Veja como o SpendWise tem transformado a vida financeira de diversas pessoas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 mb-4"
              />
              <p className="text-gray-700 dark:text-gray-300 italic mb-4">{testimonial.feedback}</p>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{testimonial.name}</h4>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
