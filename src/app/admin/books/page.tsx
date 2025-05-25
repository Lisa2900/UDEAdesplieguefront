"use client";

import React, { useEffect, useState } from "react";
import { BookCheck, FilePenLine, ScanEye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "nextjs-toast-notify";

interface Libro {
  idLibro: string;
  nombre: string;
  autor: string;
  descripcion: string;
}

interface LibroAPI {
  idLibro: string;
  nombreLibro: string;
  autor: string;
  descripcion: string;
}

const LibroItem: React.FC<{
  libro: Libro;
  onEditar: () => void;
  onEliminar: () => void;
}> = ({ libro, onEditar, onEliminar }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="sm:col-span-2 flex items-center">
        <div className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded-md mr-4 font-bold text-white">
          {libro.nombre.charAt(0).toUpperCase()}
        </div>
        <div>
          <span className="text-gray-800 block font-semibold">
            {libro.nombre}
          </span>
          <span className="text-gray-600 block sm:hidden">{libro.autor}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center">
        <span className="text-gray-600">{libro.autor}</span>
      </div>

      <div className="hidden sm:flex items-center">
        <p className="text-gray-600 text-sm">{libro.descripcion}</p>
      </div>

      <div className="sm:col-span-2 flex items-center justify-center sm:justify-end space-x-4">
        <button
          className="text-blue-500 hover:text-blue-700 transition-colors"
          onClick={onEditar}
        >
          <ScanEye size={24} />
        </button>
        <button
          className="text-green-500 hover:text-[#008000] transition-colors"
          onClick={onEditar}
        >
          <FilePenLine size={24} />
        </button>
        <button
          className="text-red-500 hover:text-red-700 transition-colors"
          onClick={onEliminar}
        >
          <Trash2 size={24} />
        </button>
      </div>

      <div className="sm:hidden col-span-full">
        <p className="text-gray-600 text-sm">{libro.descripcion}</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const router = useRouter();

  const fetchLibros = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/getBooks`
      );
      const data: LibroAPI[] = await res.json();

      const adaptados: Libro[] = data.map((libro) => ({
        idLibro: libro.idLibro,
        nombre: (libro.nombreLibro ?? "").replaceAll('"', ""),
        autor: (libro.autor ?? "").replaceAll('"', ""),
        descripcion: (libro.descripcion ?? "").replaceAll('"', ""),
      }));
      setLibros(adaptados);
    } catch (error) {
      console.error("Error al cargar los libros:", error);
    }
  };

  const handleEliminar = async (idLibro: string) => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas eliminar este libro?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/deleteBook/${idLibro}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Libro eliminado correctamente");
        setLibros((prev) => prev.filter((libro) => libro.idLibro !== idLibro));
      } else {
        toast.error("Error al eliminar el libro");
      }
    } catch (err) {
      toast.error("No se pudo conectar con el servidor");
      console.error(err);
    }
  };

  const handleEditar = (idLibro: string) => {
    router.push(`/admin/books/editBook?id=${idLibro}`);
  };

  const handleAddBook = () => {
    router.push("/admin/books/addBook");
  };

  useEffect(() => {
    fetchLibros();
  }, []);

  return (
    <div className="font-sans bg-gray-100 min-h-screen p-5">
      <div className="flex justify-between items-center mb-6 mt-12">
        <button
          className="bg-green-600 text-white px-5 py-3 text-lg rounded-md flex items-center gap-2 hover:bg-green-800"
          onClick={handleAddBook}
        >
          <BookCheck size={24} />
          Agregar
        </button>
      </div>

      <h1 className="text-gray-800 text-center text-2xl font-bold mb-8">
        Libros
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="hidden sm:grid grid-cols-6 gap-4 p-4 border-b bg-gray-50">
          <div className="col-span-2 font-semibold">Libro</div>
          <div className="font-semibold">Autor</div>
          <div className="font-semibold">Descripción</div>
          <div className="col-span-2 font-semibold text-right">Acciones</div>
        </div>

        {libros.map((libro) => (
          <LibroItem
            key={libro.idLibro}
            libro={libro}
            onEditar={() => handleEditar(libro.idLibro)}
            onEliminar={() => handleEliminar(libro.idLibro)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
