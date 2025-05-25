import Image from 'next/image';
import React, { useState } from 'react';
// Asegúrese de que el estado de hoveredCard pueda aceptar tanto números como valores nulos

const SemestresSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    {
      title: "Semestres...",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      options: ["Español", "Inglés", "Formación", "Tics"]
    },
    {
      title: "Semestres...",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      options: ["Español", "Inglés", "Formación", "Tics"]
    },
    {
      title: "Semestres...",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      options: ["Español", "Inglés", "Formación", "Tics"]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Semestres</h1>
        <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative h-80">
              <Image
                src="/api/placeholder/400/400"
                alt="Students"
                className="w-full h-full object-cover"
              />
              <div 
                className={`absolute inset-0 flex flex-col justify-center items-center space-y-2 bg-black bg-opacity-75 transition-opacity duration-300 ${hoveredCard === index ? 'opacity-100' : 'opacity-0'}`}
              >
                {card.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className="w-40 p-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 bg-gray-200 text-center">
              <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemestresSection;







