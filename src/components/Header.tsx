"use client"

import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Home, Book, BookOpen, LayoutDashboard, Settings, User, UserPlus, BookPlus, UserPen, ShieldAlert, LogOut } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"  // Importa tu hook de autenticación

const Header: React.FC = () => {
  const pathname = usePathname()
  const { logout } = useAuth()  // Hook de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // ✅ Detectar si el usuario está logueado
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("userData")
    if (token && userData) {
      setIsLoggedIn(true)
    }
  }, [])

  const mapeo: Record<string, { name: string; icon: React.ReactNode }> = {
    pageSubject: { name: "Materias", icon: <BookOpen className="h-5 w-5" /> },
    pageLibrary: { name: "Libros", icon: <Book className="h-5 w-5" /> },
    pageBook: { name: "Libros", icon: <Book className="h-5 w-5" /> },
    pageArea: { name: "Bienvenida", icon: <Home className="h-5 w-5" /> },
    pageAdmin: { name: "Administración", icon: <LayoutDashboard className="h-5 w-5" /> },
    pageSuperAdmin: { name: "Super-Administración", icon: <Settings className="h-5 w-5" /> },
    SuperAdmin: { name: "Super-Administración", icon: <Settings className="h-5 w-5" /> },
    books: { name: "Libros", icon: <Book className="h-5 w-5" /> },
    addBook: { name: "Añadir nuevo libro", icon: <BookPlus className="h-5 w-5" /> },
    editBook: { name: "Editar libro", icon: <BookPlus className="h-5 w-5" /> },
    users: { name: "Usuarios", icon: <User className="h-5 w-5" /> },
    addUser: { name: "Crear nuevo usuario", icon: <UserPlus className="h-5 w-5" /> },
    editUser: { name: "Editar usuario", icon: <UserPen className="h-5 w-5" /> },
    verification: { name: "Verificación", icon: <ShieldAlert className="h-5 w-5" /> },
    editProfile: { name: "Editar perfil", icon: <UserPen className="h-5 w-5" /> },
  }

  const rutas = pathname
    .split("/")
    .filter(Boolean)
    .map((segmento) => ({
      name: mapeo[segmento]?.name || segmento,
      icon: mapeo[segmento]?.icon || <ChevronRight className="h-5 w-5" />,
      segment: segmento,
    }))

  return (
    <header className="w-full bg-gradient-to-r from-[#0048ac] to-[#0055c8] py-4 text-white shadow-lg border-b-4 border-blue-700">
      <div className="container mx-auto px-6">
        <nav className="relative">
          <ul className="flex flex-wrap items-center gap-2 text-base">
            {/* Breadcrumb dinámico */}
            {rutas.map((ruta, index) => {
              const path =
                "/" +
                pathname
                  .split("/")
                  .slice(1, index + 2)
                  .join("/")
              const isLast = index === rutas.length - 1

              const baseClass = "flex items-center gap-2 rounded-full px-4 py-2 transition-all"
              const conditionalClass = isLast
                ? "bg-white/25 font-semibold shadow-md ring-2 ring-white/20"
                : "hover:bg-white/15 hover:shadow-sm"

              return (
                <li key={index} className="flex items-center">
                  <Link href={path} className={`${baseClass} ${conditionalClass}`}>
                    <div className={`${isLast ? "bg-white/20" : "bg-white/10"} p-1.5 rounded-full`}>
                      {ruta.icon}
                    </div>
                    <span>{ruta.name}</span>
                  </Link>
                </li>
              )
            })}

            {/* ✅ Solo visible si está logueado */}
            {isLoggedIn && (
              <>
                <li>
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 rounded-full px-4 py-2 bg-white/20 hover:bg-white/30 shadow-md"
                  >
                    <User className="h-5 w-5" />
                    <span>Perfil</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/semestre"
                    className="flex items-center gap-2 rounded-full px-4 py-2 bg-white/20 hover:bg-white/30 shadow-md"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>Semestre</span>
                  </Link>
                </li>
                {/* Botón de Cerrar sesión */}
                <li>
                  <button
                    onClick={() => {
                      logout()  // Llama a la función de logout
                    }}
                    className="flex items-center gap-2 rounded-full px-4 py-2 bg-red-600 hover:bg-red-700 shadow-md"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar sesión</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
