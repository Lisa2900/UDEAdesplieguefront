"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { BookOpen, GraduationCap, Layers } from "lucide-react"

interface Materia {
  idMateria: number
  nombreMateria: string
  fkIdArea: number
  area: {
    nombreArea: string
  }
  semestre: {
    nombreSemestre: string
  }
}

function MateriasGridContent() {
  const [materias, setMaterias] = useState<Materia[] | null>(null)
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const semestreParam = searchParams.get("semestre")
      const nombreParam = searchParams.get("nombre")

      if (semestreParam && nombreParam) {
        setSelectedSemester(nombreParam)
        localStorage.setItem(
          "selectedSemester",
          JSON.stringify({
            idSemestre: semestreParam,
            nombreSemestre: nombreParam,
          }),
        )
      } else {
        const storedSemester = localStorage.getItem("selectedSemester")
        if (storedSemester) {
          const semestre = JSON.parse(storedSemester)
          setSelectedSemester(semestre.nombreSemestre)
        }
      }
    }
  }, [isClient, searchParams])

  useEffect(() => {
    if (selectedSemester) {
      const fetchMaterias = async () => {
        setIsLoading(true)
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materias/`)
          const data = await res.json()
  
          const storedUserData = localStorage.getItem("userData")
          let userArea = null
  
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData)
              userArea = userData.area || userData.usuario?.area // igual que en tu otro efecto
              console.log("Área del usuario:", userArea)
            } catch (error) {
              console.error("Error parsing user data:", error)
            }
          }
  
          const filteredMaterias = data.filter((materia: Materia) =>
            materia.semestre.nombreSemestre === selectedSemester &&
            (!userArea || materia.fkIdArea === userArea) // filtramos también por área
          )
  
          setMaterias(filteredMaterias)
        } catch (error) {
          console.error("Error al cargar materias:", error)
          setMaterias([])
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchMaterias()
    }
  }, [selectedSemester])
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div
        className="container mx-auto px-4 md:px-6 lg:px-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mb-12 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#02013f] mb-3">Materias</h1>
          {selectedSemester && (
            <div className="inline-flex items-center gap-2 bg-[#0048ac]/10 px-4 py-2 rounded-full">
              <GraduationCap className="text-[#0048ac] h-5 w-5" />
              <span className="text-[#0048ac] font-medium">{selectedSemester}</span>
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0048ac]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {materias && materias.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materias.map((materia) => (
                    <div key={materia.idMateria} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-40 relative">
                        <Image
                          src="/portadaMateria.png"
                          alt={materia.nombreMateria}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">{materia.nombreMateria}</h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-[#0048ac]/10 flex items-center justify-center">
                              <Layers className="h-3 w-3 text-[#0048ac]" />
                            </div>
                            <p className="text-gray-600 text-sm">{materia.area?.nombreArea || "Sin área"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-[#0048ac]/10 flex items-center justify-center">
                              <GraduationCap className="h-3 w-3 text-[#0048ac]" />
                            </div>
                            <p className="text-gray-600 text-sm">
                              {materia.semestre?.nombreSemestre || "Sin semestre"}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={{
                            pathname: `/estudiante/librosPorMateria/${materia.idMateria}`,
                            query: { materiaNombre: materia.nombreMateria },
                          }}
                          className="block w-full bg-[#0048ac] text-white font-medium text-center py-2 rounded hover:bg-[#02013f] transition-colors"
                        >
                          VER LIBROS
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <BookOpen className="h-16 w-16 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay materias disponibles</h3>
                  <p className="text-gray-500">No se encontraron materias para este semestre.</p>
                </div>
              )}
            </motion.div>

            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-[#0048ac] to-[#02013f] text-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">¡Siempre hay algo nuevo!</h2>
                  <div className="relative h-56 mb-5 rounded-lg overflow-hidden">
                    <Image
                      src="/8.jpg"
                      alt="Nuevos cursos"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <p className="text-gray-200 text-base leading-relaxed mb-6">
                    Aprovecha los recursos de aprendizaje disponibles y sigue creciendo día a día.
                  </p>
                </div>
                <div className="bg-[#02013f] p-6">
                  <h3 className="font-semibold mb-3 text-white/90">Recursos destacados</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0048ac] flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white/80 text-sm">Biblioteca virtual</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0048ac] flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white/80 text-sm">Cursos complementarios</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function MateriasGrid() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0048ac]"></div>
        </div>
      }
    >
      <MateriasGridContent />
    </Suspense>
  )
}
