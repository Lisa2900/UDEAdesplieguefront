"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/Modals/CardModal'; // Asegúrate de importar el componente Modal
import Image from 'next/image';

const Seccion2 = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const cards = [
    {
      image: "/8.jpg",
      options: "Saber más.."
    },
    {
      image: "/7.jpg",
      options: "Saber más.."
    },
    {
      image: "/6.jpg",
      options: "Saber más.."
    }
  ];

  const openModal = (index: number) => {
    setSelectedCard(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCard(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 text-left">
      <h1 className="text-5xl font-bold mb-14 text-[#336bbb]">Bienvenido</h1>
      <h2 className='text-center text-2xl text-gray-800 font-bold '>Más recientes</h2>
      <p className='text-center text-lg text-gray-500 mb-14'> Lorem ipsum dolor sit amet consectetur 
          adipisicing elit. Mollitia ad molestias iste veritatis tenetur vero.</p>
      <p className="text-gray-900 font-medium max-w-full mb-10 text-justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem
        ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
      </p>

      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">¿Quieres saber más?</h2>
      <p className="text-gray-600 mb-6 text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Image
              src={card.image}
              alt="Imagen"
              width={200}
              height={150}
              className="w-full h-80 object-cover transition-transform duration-300 transform hover:scale-105"
            />
            <div
              className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-opacity duration-300 ${hoveredCard === index ? 'opacity-100' : 'opacity-0'}`}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-200 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(index);
                }}
              >
                {card.options}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: modalVisible ? 1 : 0, opacity: modalVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Modal 
          isVisible={modalVisible} 
          closeModal={closeModal} 
          selectedCard={selectedCard} 
        />
      </motion.div>
    </div>
  );
};

export default Seccion2;
