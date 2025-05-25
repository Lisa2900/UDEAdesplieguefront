"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Book, BookOpenText, Eye, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import AlumnoGuard from "@/components/guards/AlumnoGuard"

interface BookInterface {
  id: number
  title: string
  subtitle: string
  author: string
  image: string
  fkIdMateria: number
}

interface RawBook {
  idLibro: number
  nombreLibro: string
  descripcion: string
  autor: string
  portadaUrl: string
  fkIdMateria: number
}

export default function LibrosPorMateriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ idMateria: string }>
  searchParams: Promise<{ materiaNombre?: string }>
}) {
  const { idMateria } = use(params)
  const { materiaNombre = "" } = use(searchParams)

  const [hoveredBook, setHoveredBook] = useState<number | null>(null)
  const [books, setBooks] = useState<BookInterface[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
//``
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/getBooks`)
        const data: RawBook[] = await res.json()

        const adaptedBooks: BookInterface[] = data
          .filter((book) => book.fkIdMateria === Number.parseInt(idMateria))
          .map((book) => ({
            id: book.idLibro,
            title: book.nombreLibro?.replaceAll('"', "") || "",
            subtitle: book.descripcion?.replaceAll('"', "") || "",
            author: book.autor?.replaceAll('"', "") || "",
            image: book.portadaUrl || "/default-image.jpg",
            fkIdMateria: book.fkIdMateria,
          }))

        setBooks(adaptedBooks)
      } catch (error) {
        console.error("Error al cargar los libros:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [idMateria])

  const handlerPage = (id: number) => {
    router.push(`/estudiante/pageBook/${id}`)
  }

  const goBack = () => {
    router.back()
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AlumnoGuard
    fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-700">No tienes permisos para acceder a esta sección.</p>
      </div>
  }
    >
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header - Thinner and better organized */}
      <div className="bg-[#0048ac] text-white py-3 px-6 md:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between">
            {/* Back button and title in one row */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={goBack}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-700 hover:bg-blue-600 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="sr-only">Regresar</span>
              </button>

              <div>
                <h1 className="text-2xl font-bold">Biblioteca Digital</h1>
              </div>
            </div>

            {/* Subject info and search in one row */}
            <div className="flex flex-col md:flex-row items-center gap-4 mt-3 md:mt-0 w-full md:w-auto">
              <div className="flex items-center gap-2 text-sm md:border-l md:border-blue-400 md:pl-4">
                <Book size={16} className="text-blue-200" />
                <span className="font-medium">{materiaNombre}</span>
                <span className="text-blue-200 text-xs px-2 py-0.5 bg-blue-700 rounded-full ml-2">
                  {filteredBooks.length} {filteredBooks.length === 1 ? "libro" : "libros"}
                </span>
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Buscar libros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <Search className="absolute left-3 top-2 text-gray-500" size={15} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0048ac]"></div>
          </div>
        ) : filteredBooks.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                onClick={() => handlerPage(book.id)}
                className="relative rounded-xl overflow-hidden cursor-pointer bg-white shadow-lg hover:shadow-xl transition-shadow"
                onMouseEnter={() => setHoveredBook(index)}
                onMouseLeave={() => setHoveredBook(null)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={`http://localhost:4000${book.image.startsWith("/") ? book.image : "/" + book.image}`}
                    alt={book.title}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                    style={{ transform: hoveredBook === index ? "scale(1.05)" : "scale(1)" }}
                  />

                  {hoveredBook === index && (
                    <motion.div
                      className="absolute inset-0 flex flex-col justify-center items-center bg-gradient-to-t from-black/70 to-black/30 p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Eye size={36} className="text-white mb-2" />
                      <span className="text-white text-sm font-medium">Ver libro</span>
                    </motion.div>
                  )}
                </div>

                <div className="p-5 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{book.title}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{book.subtitle}</p>
                  <div className="flex items-center mt-3">
                    <BookOpenText size={16} className="text-[#0048ac] mr-2" />
                    <p className="text-sm font-medium text-[#03045e]">Autor: {book.author}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <Book size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No se encontraron libros</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? "Intenta con otra búsqueda" : "No hay libros disponibles para esta materia"}
            </p>
          </div>
        )}
      </div>
    </div>
    </AlumnoGuard>
  )
}
