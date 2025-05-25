"use client"

import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { useAuthAdmin } from "../../hooks/useAuthAdmin"
import { LogOut } from "lucide-react"
import { toast } from "react-hot-toast"

interface LogoutButtonProps {
  variant?: "default" | "minimal" | "icon"
  className?: string
}

export default function LogoutButton({ variant = "default", className = "" }: LogoutButtonProps) {
  const { user: alumnoUser, logout: logoutAlumno } = useAuth()  // Hook para estudiantes
  const { user: adminUser, logout: logoutAdmin } = useAuthAdmin()  // Hook para administradores
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Determinar cuál es el usuario logueado (si es alumno o admin)
  const user = alumnoUser || adminUser
  const logout = alumnoUser ? logoutAlumno : logoutAdmin

  // Depuración: Asegúrate de que el usuario es correcto
  console.log("Usuario logueado:", user)

  const handleLogout = async () => {
    try {
      if (!user) {
        console.error("No hay usuario para cerrar sesión.")
        return
      }

      setIsLoggingOut(true)

      // Ejecutar la función de logout del contexto de autenticación
      logout()

      // Mostrar mensaje de éxito
      toast.success("Sesión cerrada correctamente")

      // Redirigir a la página de login (por si el logout no hace la redirección)
      setTimeout(() => {
        window.location.href = "/"
      }, 1500)

    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast.error("Error al cerrar sesión")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Si no hay usuario, no mostrar el botón
  if (!user) return null

  // Variante por defecto (botón completo)
  if (variant === "default") {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-70 ${className}`}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
      </button>
    )
  }

  // Variante minimalista (solo texto)
  if (variant === "minimal") {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-70 ${className}`}
      >
        {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
      </button>
    )
  }

  // Variante de icono (solo icono)
  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`text-red-600 hover:text-red-800 transition-colors disabled:opacity-70 ${className}`}
      aria-label="Cerrar sesión"
    >
      <LogOut className="h-5 w-5" />
    </button>
  )
}
