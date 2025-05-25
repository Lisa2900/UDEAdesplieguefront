"use client"

import Link from "next/link"
import { useAuth } from "../../hooks/useAuth"
import { useAuthAdmin } from "../../hooks/useAuthAdmin"
import { User, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface ProfileDropdownInlineProps {
  onClose?: () => void
}

export default function ProfileDropdownInline({ onClose }: ProfileDropdownInlineProps) {
  const { user: alumnoUser, logout: logoutAlumno } = useAuth()
  const { user: adminUser, logout: logoutAdmin } = useAuthAdmin()
  const router = useRouter()

  const user = adminUser || alumnoUser // Prefiere adminUser si existe
  const logout = adminUser ? logoutAdmin : logoutAlumno

  if (!user) return null

  const handleLogout = async () => {
    try {
      if (onClose) onClose()
      logout()
      toast.success("Sesión cerrada correctamente")
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast.error("Error al cerrar sesión")
    }
  }

  const getRoleLabel = () => {
    if (user.role === "superadmin") return "Super Administrador"
    if (user.role === "admin") return "Administrador"
    return "Estudiante"
  }

  const getDashboardRoute = () => {
    if (user.role === "superadmin") return "/superadmin"
    if (user.role === "admin") return "/admin"
    return "/estudiante" // para alumno normal
  }

  return (
    <div className="w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="px-4 py-3 border-b">
        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
        <span className="inline-block mt-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          {getRoleLabel()}
        </span>
      </div>

      {/* Panel principal dinámico */}
      <Link
        href={getDashboardRoute()}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={onClose}
      >
        <User className="mr-2 h-4 w-4" />
        Panel principal
      </Link>

      {/* Editar perfil */}
      <Link
        href="/editProfile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={onClose}
      >
        <Settings className="mr-2 h-4 w-4" />
        Editar perfil
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesión
      </button>
    </div>
  )
}
