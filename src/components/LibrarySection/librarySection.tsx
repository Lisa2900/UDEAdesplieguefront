"use client"

import { Play, Search } from "lucide-react"
import Book from "../Book"
import Image from "next/image"
import { useEffect, useState } from "react"

interface Materia {
  idMateria: number
  nombreMateria: string
}

const LibrarySection = () => {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Función para obtener las materias de la API ``
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materias`)
        if (response.ok) {
          const data = await response.json()
          setMaterias(data)
        } else {
          console.error("Error al obtener materias:", response.statusText)
        }
      } catch (error) {
        console.error("Error al obtener materias:", error)
      }
    }

    fetchMaterias()
  }, [])

  // Guardar el término de búsqueda en localStorage para que Book lo use
  useEffect(() => {
    localStorage.setItem("bookSearchTerm", searchTerm)
  }, [searchTerm])
  // Checalo mas adelante, no estoy seguro si es necesario
  // Usar los datos de la API o datos estáticos si no hay datos
  const subjects =
    materias.length > 0 ? materias.map((m) => m.nombreMateria) : ["Materia 1", "Materia 2", "Materia 3", "Materia 4"]

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto p-6 gap-6">
      {/* Main Content */}
      <div className="lg:w-3/4 w-full p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Libros</h1>
        <p className="text-center text-gray-600 mb-6">Quizás algo te puede interesar</p>

        {/* Este es el componente de Book para visualizar los libros */}
        <Book />

        {/* Ver más Button */}
        <div className="flex justify-center mt-6">
          <button className="text-blue-900 px-12 border-blue-400 py-2 hover:bg-gray-500 transition">Ver más ...</button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-1/4 w-full bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full p-2 border rounded-md pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <h2 className="text-lg font-bold mb-2">Materias</h2>
        <ul>
          {subjects.map((subject, index) => (
            <li key={index} className="flex items-center justify-between gap-2 p-2 border-b">
              <div className="flex items-center gap-2">
                <Image src="/8.jpg" alt="icon" width={200} height={200} className="w-20 h-20 rounded-md" />
                {subject}
              </div>
              <button className="p-2 text-gray-500 rounded-full hover:text-gray-900 transition">
                <Play size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LibrarySection
    