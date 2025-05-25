"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { useState, useEffect } from "react"
import { User, Mail, Lock, Phone, IdCard } from "lucide-react"
import { motion } from "framer-motion"
import { Toaster, toast } from "react-hot-toast"
import Image from "next/image"

// Definir la interfaz para el área académica
interface AreaAcademica {
  id: number
  nombreArea: string
  // Añade otros campos si los hay en la respuesta de la API
}

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [areasAcademicas, setAreasAcademicas] = useState<AreaAcademica[]>([])
  const [loadingAreas, setLoadingAreas] = useState(true)
  const [formData, setFormData] = useState({
    matricula: "",
    confirmMatricula: "",
    nombre: "",
    telefono: "",
    correo: "",
    password: "",
    areaAcademica: "",
  })

  // Cargar las áreas académicas desde la API `` 
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/area`)

        if (response.ok) {
          const data = await response.json()
          console.log("Áreas académicas:", data) // Verifica la respuesta de la API
          setAreasAcademicas(data)

          // Establecer el valor predeterminado al primer elemento si existe
          if (data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              areaAcademica: data[0].id.toString(),
            }))
          }
        } else {
          console.error("Error al cargar áreas académicas")
          toast.error("No se pudieron cargar las carreras disponibles")
        }
      } catch (error) {
        console.error("Error al cargar áreas académicas:", error)
        toast.error("Error de conexión al cargar carreras")
      } finally {
        setLoadingAreas(false)
      }
    }

    fetchAreas()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (
      !formData.matricula ||
      !formData.nombre ||
      !formData.telefono ||
      !formData.correo ||
      !formData.password ||
      !formData.areaAcademica
    ) {
      toast.error("¡Necesitas llenar todos los campos!")
      return
    }

    if (formData.matricula !== formData.confirmMatricula) {
      toast.error("Las matrículas no coinciden")
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/alumno/CreateUser` , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          password: formData.password,
          matricula: formData.matricula,
          telefono: formData.telefono,
          areaAcademica: formData.areaAcademica,
        }),
      })

      const data = await response.text()

      if (response.ok) {
        toast.success("Registro exitoso. Revisa tu correo para verificar tu cuenta.")
        router.push("/verification")
      } else {
        toast.error(data || "Error al registrar. Intenta de nuevo.")
      }
    } catch (error) {
      toast.error("Error de conexión. Intenta de nuevo más tarde.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="font-[sans-serif] min-h-screen flex flex-col items-center justify-center bg-white"
    >
      <Toaster position="top-center" />
      <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-6 m-4 shadow-lg rounded-md">
        {/* Formulario */}
        <div className="md:max-w-md w-full px-6 py-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-12 flex items-center justify-between">
              <h3 className="text-gray-800 text-3xl font-extrabold text-center w-full">Registro</h3>
              <Image src="/udeaLogo2.jpg" alt="Logo" width={80} height={80} className="ml-auto" />
            </div>

            {/* Matrícula */}
            <div>
              <label className="text-gray-800 text-base block mb-2">Matrícula:</label>
              <div className="relative flex items-center">
                <input
                  name="matricula"
                  type="text"
                  required
                  value={formData.matricula}
                  onChange={handleChange}
                  className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Matrícula"
                />
                <IdCard className="absolute right-2 text-gray-500" size={24} />
              </div>
            </div>
            <br />
            <div>
              <label className="text-gray-800 text-base block mb-2">Confirma tu matrícula:</label>
              <div className="relative flex items-center">
                <input
                  name="confirmMatricula"
                  type="text"
                  required
                  value={formData.confirmMatricula}
                  onChange={handleChange}
                  className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Confirmar matrícula"
                />
                <IdCard className="absolute right-2 text-gray-500" size={24} />
              </div>
            </div>

            {/* Nombre Completo */}
            <div className="mt-10">
              <label className="text-gray-800 text-base block mb-2">Nombre completo:</label>
              <div className="relative flex items-center">
                <input
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Nombre completo"
                />
                <User className="absolute right-2 text-gray-500" size={24} />
              </div>
            </div>

            {/* Número Telefónico */}
            <div className="mt-8">
              <label className="text-gray-800 text-base block mb-2">Número telefónico:</label>
              <div className="relative flex items-center">
                <input
                  name="telefono"
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  pattern="\d{10}"
                  className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Número telefónico (10 dígitos)"
                />
                <Phone className="absolute right-2 text-gray-500" size={24} />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div className="mt-10">
              <label className="text-gray-800 text-base block mb-2">Correo electrónico:</label>
              <div className="relative flex items-center">
                <input
                  name="correo"
                  type="email"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Correo electrónico"
                />
                <Mail className="absolute right-2 text-gray-500" size={24} />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mt-8">
              <label className="text-gray-800 text-base block mb-2">Contraseña:</label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Contraseña"
                />
                <Lock className="absolute right-2 text-gray-500" size={24} />
              </div>
            </div>

            {/* Carrera */}
            <div className="mt-8">
              <label className="text-gray-800 text-base block mb-2">Carrera:</label>
              <div className="relative">
                {loadingAreas ? (
                  <div className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white">
                    Cargando carreras...
                  </div>
                ) : (
                  <select
                    name="areaAcademica"
                    value={formData.areaAcademica}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-600 transition-all duration-300 ease-in-out"
                    required
                  >
                    <option value="">Selecciona una carrera</option>
                    {areasAcademicas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nombreArea}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Botón de registro */}
            <div className="mt-12 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || loadingAreas}
                className="w-full shadow-xl py-3 px-4 text-lg tracking-wide rounded-xl text-white bg-[#0048ac] hover:bg-[#03003f] focus:outline-none transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Procesando..." : "Registrarse"}
              </button>
            </div>
          </form>
        </div>

        {/* Imagen decorativa */}
        <div className="md:h-full rounded-xl lg:p-12 p-8 relative w-full h-[400px]">
          <Image src="/UdeaLogin.jpg" alt="login-image" fill className="rounded-xl object-cover" />
        </div>
      </div>
    </motion.div>
  )
}
