"use client"

import type React from "react"
import { useEffect, useState } from "react"
import ReusableModal from "./ReusableModal"
import { useRouter } from "next/navigation"
import { BookOpen, GraduationCap, Layers } from "lucide-react"

interface Area {
  id: number
  nombreArea: string
}

interface Materia {
  idMateria: number
  nombreMateria: string
  fkIdSemestre: number
  fkIdArea: number
}

interface Semestre {
  idSemestre: number
  nombreSemestre: string
  fkIdArea: number
  area: Area
  materias: Materia[]
}

interface SemestersModalProps {
  isOpen: boolean
  onClose: () => void
}

const SemestersModal: React.FC<SemestersModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const [semesters, setSemesters] = useState<Semestre[]>([])
  const [filteredSemesters, setFilteredSemesters] = useState<Semestre[]>([])
  const [isLoading, setIsLoading] = useState(false)
//`
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/semestre/`)
        .then((res) => res.json())
        .then((data: Semestre[]) => {
          console.log("Semestres recibidos: ", data)
          setSemesters(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error al obtener semestres:", error)
          setIsLoading(false)
        })
    }
  }, [isOpen])

  useEffect(() => {
    if (semesters.length > 0) {
      const storedUserData = localStorage.getItem("userData")
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData)
          const userArea = userData.area || userData.usuario?.area // por si viene diferente

          console.log("Área del usuario:", userArea)

          const semestersFiltered = semesters.filter(
            (semester) => semester.fkIdArea === userArea
          )
          setFilteredSemesters(semestersFiltered)
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    }
  }, [semesters])

  const fetchCompleteSemesterData = async (semesterId: number): Promise<Semestre | null> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semestre/${semesterId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch semester: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching semester details:", error)
      return null
    }
  }

  const handleSemesterClick = async (semester: Semestre) => {
    try {
      setIsLoading(true)

      const completeSemester = await fetchCompleteSemesterData(semester.idSemestre)
      const semesterToStore = completeSemester || semester

      console.log("Semestre seleccionado: ", semesterToStore)

      const query = new URLSearchParams({
        semestre: String(semesterToStore.idSemestre),
        nombre: semesterToStore.nombreSemestre,
      }).toString()

      router.push(`/estudiante/pageSubject?${query}`)
      onClose()
    } catch (error) {
      console.error("Error selecting semester:", error)
      setIsLoading(false)
    }
  }

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Semestres">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0048ac]"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredSemesters.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-16 w-16 text-gray-300" />
              </div>
              <p className="text-gray-500">No hay semestres disponibles para tu área.</p>
              <button
                onClick={() => setFilteredSemesters(semesters)}
                className="mt-4 text-[#0048ac] font-medium hover:underline"
              >
                Ver todos los semestres
              </button>
            </div>
          ) : (
            filteredSemesters.map((semester) => (
              <button
                key={semester.idSemestre}
                onClick={() => handleSemesterClick(semester)}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 text-gray-800 p-4 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#0048ac]/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-[#0048ac]" />
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-medium">{semester.nombreSemestre}</span>
                    {semester.area && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Layers className="h-3 w-3" />
                        <span>{semester.area.nombreArea}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-[#0048ac]">
                  <BookOpen className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">
                    {semester.materias ? semester.materias.length : 0} materias
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </ReusableModal>
  )
}

export default SemestersModal
