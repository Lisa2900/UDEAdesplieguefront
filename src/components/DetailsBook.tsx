"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X } from "lucide-react";
import Image from "next/image";

interface BookDetail {
  nombreLibro: string;
  autor: string;
  descripcion: string;
  portadaUrl: string;
  archivoUrl: string;
}

const BookDetailSection: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const [book, setBook] = useState<BookDetail | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/getBooks/${id}`);
        const data = await res.json();

        const cleanBook: BookDetail = {
          nombreLibro: (data.nombreLibro || "").replaceAll('"', ''),
          autor: (data.autor || "").replaceAll('"', ''),
          descripcion: (data.descripcion || "").replaceAll('"', ''),
          portadaUrl: data.portadaUrl || "/default-image.jpg",
          archivoUrl: data.archivoUrl || "",
        };

        setBook(cleanBook);
      } catch (err) {
        console.error("Error al obtener detalles del libro:", err);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) return <p className="text-center py-10">Cargando...</p>;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-8"
      >
        <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-shrink-0 flex justify-center"
          >
            <Image
              src={`http://localhost:4000${book.portadaUrl.startsWith("/") ? book.portadaUrl : "/" + book.portadaUrl}`}
              width={200}
              height={200}
              alt="Portada del libro"
              className="w-80 h-auto object-cover rounded"
            />

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col justify-center flex-1"
          >
            <h2 className="text-2xl font-bold mb-1">{book.nombreLibro}</h2>
            <p className="text-gray-600 mb-4">Autor: {book.autor}</p>
            <p className="text-gray-700 mb-6">{book.descripcion}</p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-start"
            >
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#0048ac] text-white px-8 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#3c7498] transition"
              >
                Ver en línea
                <Eye size={24} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-xl overflow-hidden"
            >
              {/* Botón de cerrar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-50 bg-white border border-gray-300 hover:bg-red-500 hover:text-white p-2 rounded-full transition"
              >
                <X size={20} />
              </button>

              <iframe
                src={`http://localhost:4000${book.archivoUrl.startsWith("/") ? book.archivoUrl : "/" + book.archivoUrl}`}
                className="w-full h-full border-none"
                title="PDF Viewer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookDetailSection;
