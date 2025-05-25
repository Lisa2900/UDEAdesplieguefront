"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./useAuth"

// Definimos los tipos de roles disponibles
export type UserRole = "alumno" | "admin" | "superadmin"

// Mapa de rutas permitidas por rol
const allowedRoutesByRole: Record<UserRole, string[]> = {
  alumno: ["/pageHome", "/pageLibrary", "/pageBook", "/pageSubject", "/pageArea", "/editProfile","/estudiante" , "/librosPorMateria"],
  admin: [
    "/admin",
    "/admin/books",
    "/admin/books/addBook",
    "/admin/books/editBook",
    "/admin/users",
    "/admin/users/addUser",
    "/admin/users/editUser",
    "/admin/matriculas",
    "/admin/Navegacion",
    "/admin/dashoboard",
  
  ],
  superadmin: [
    "/SuperAdmin",
    "/SuperAdmin/books",
    "/SuperAdmin/books/addBook",
    "/SuperAdmin/books/editBook",
    "/SuperAdmin/users",
    "/SuperAdmin/users/addUser",
    "/SuperAdmin/users/editUser",
    "/SuperAdmin/matriculas",
    "/SuperAdmin/Navegacion",
    "/SuperAdmin/dashoboard",
    "/pageSuperAdmin",
  ],
}

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/", "/registro", "/verification"]

export function useRoleGuard(requiredRole?: UserRole) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Esperar a que se cargue la información de autenticación
        if (loading) return

        // Si no hay usuario autenticado y no es una ruta pública, redirigir a login
        if (!isAuthenticated) {
          if (!isPublicRoute(window.location.pathname)) {
            router.push("/")
          } else {
            setIsAuthorized(true)
          }
          return
        }

        if (!user) return

        // Si se requiere un rol específico, verificar que el usuario tenga ese rol
        if (requiredRole && user.role !== requiredRole) {
          handleUnauthorized(user.role)
          return
        }

        // Verificar si la ruta actual está permitida para el rol del usuario
        if (!isRouteAllowedForRole(window.location.pathname, user.role)) {
          handleUnauthorized(user.role)
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Error al verificar la autorización:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredRole, user, isAuthenticated, loading])

  const isPublicRoute = (path: string): boolean => {
    // Añadimos /pageArea a las rutas públicas para permitir la redirección después del login
    return publicRoutes.some((route) => path === route || path.startsWith(`${route}/`)) || path === "/pageArea"
  }

  const isRouteAllowedForRole = (path: string, role: UserRole): boolean => {
    return allowedRoutesByRole[role].some((route) => path === route || path.startsWith(`${route}/`))
  }

  const handleUnauthorized = (userRole: UserRole) => {
    // Redirigir al usuario a la página principal correspondiente a su rol
    switch (userRole) {
      case "alumno":
        router.push("/estudiante")
        break
      case "admin":
        router.push("/admin")
        break
      case "superadmin":
        router.push("/SuperAdmin")
        break
      default:
        router.push("/")
    }
  }

  return { isAuthorized, isLoading }
}
