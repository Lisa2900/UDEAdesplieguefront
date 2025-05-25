
"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Book {
  id: number;
  title: string;
  subtitle: string;
  author: string;
  image: string;
}

// Estructura cruda desde la API
interface RawBook {
  idLibro: number;
  nombreLibro: string;
  descripcion: string;
  autor: string;
  portadaUrl: string;
}

export default function Book() {
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/getBooks` );
        const data: RawBook[] = await res.json();

        const adaptedBooks: Book[] = data.map((book) => ({
          id: book.idLibro,
          title: (book.nombreLibro || "").replaceAll('"', ''),
          subtitle: (book.descripcion || "").replaceAll('"', ''),
          author: (book.autor || "").replaceAll('"', ''),
          image: book.portadaUrl || "/default-image.jpg", // opción segura si no hay imagen
        }));

        setBooks(adaptedBooks);
      } catch (error) {
        console.error("Error al cargar los libros:", error);
      }
    };

    fetchBooks();
  }, []);

  const handlerPage = (id: number) => {
    router.push(`/estudiante/pageBook/${id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          onClick={() => handlerPage(book.id)}
          className="relative rounded-lg shadow-lg overflow-hidden cursor-pointer"
          onMouseEnter={() => setHoveredBook(index)}
          onMouseLeave={() => setHoveredBook(null)}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.08, transition: { duration: 0.15 } }}
        >
          <Image
  src={`http://localhost:4000${book.image.startsWith("/") ? book.image : "/" + book.image}`}
  alt={book.title}
  width={200}
  height={200}
  className="w-full h-80 object-cover"
/>


          {hoveredBook === index && (
            <motion.div
              className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white text-lg">
                <Eye size={40} />
              </span>
            </motion.div>
          )}

          <div className="p-4 bg-white text-center">
            <h2 className="text-lg font-bold">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.subtitle}</p>
            <p className="text-sm text-gray-500 mt-1">{book.author}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
