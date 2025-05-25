"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Definimos los tipos de roles disponibles
export type UserRole = "alumno" | "admin" | "superadmin"

// Tipo para los datos del usuario
export interface UserData {
  email: string
  name: string
  role: UserRole
  token?: string
  matricula?: string
}

// Contexto de autenticación
interface AuthContextType {
  user: UserData | null
  loading: boolean
  login: (correo: string, password: string) => Promise<void>
  loginWithMatricula: (matricula: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const checkAuth = () => {
      const userDataStr = localStorage.getItem("userData")
      const authToken = localStorage.getItem("authToken")

      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr) as UserData

          // Si hay un token, lo añadimos a los datos del usuario
          if (authToken) {
            userData.token = authToken
          }

          setUser(userData)
        } catch (error) {
          console.error("Error al parsear los datos del usuario:", error)
          localStorage.removeItem("userData")
          localStorage.removeItem("authToken")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Función de inicio de sesión para alumnos con correo
  const login = async (correo: string, password: string) => {
    setLoading(true)
    try {
      // Endpoint para login de alumnos
      const loginEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/alumnos/loginAlumno`

      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error("Credenciales incorrectas")
      }

      const data = await response.json()

      if (!data.cookieLogin || !data.usuario) {
        throw new Error("Formato de respuesta inválido")
      }

      // Guardar el token JWT en localStorage
      localStorage.setItem("authToken", data.cookieLogin)

      // Crear datos del usuario
      const userData: UserData = {
        email: data.usuario.correo,
        name: data.usuario.nombre,
        role: data.usuario.rol, // Asignamos el rol de alumno
        token: data.cookieLogin,
      }

      // Guardar en localStorage
      localStorage.setItem("userData", JSON.stringify(userData))
      setUser(userData)

      // Redirigir a la página principal de alumnos
      router.push("/pageHome")
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función de inicio de sesión para alumnos con matrícula
  const loginWithMatricula = async (matricula: string, password: string) => {
    setLoading(true)
    try {
      // Convertir matrícula a correo (según la lógica de tu aplicación)
      const correo = `${matricula}@udea.edu.co`

      // Endpoint para login de alumnos
      const loginEndpoint = "http://localhost:4000/api/auth/alumnos/loginAlumno"

      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error("Credenciales incorrectas")
      }

      const data = await response.json()

      if (!data.cookieLogin || !data.usuario) {
        throw new Error("Formato de respuesta inválido")
      }

      // Guardar el token JWT en localStorage
      localStorage.setItem("authToken", data.cookieLogin)

      // Crear datos del usuario
      const userData: UserData = {
        email: data.usuario.correo,
        name: data.usuario.nombre,
        role: "alumno", // Asignamos el rol de alumno
        token: data.cookieLogin,
        matricula,
      }

      // Guardar en localStorage
      localStorage.setItem("userData", JSON.stringify(userData))
      setUser(userData)

      // Redirigir a la página principal de alumnos
      router.push("/estudiante")
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función de cierre de sesión
  const logout = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("authToken")
    setUser(null)
    router.push("/login")
  }

  const value = {
    user,
    loading,
    login,
    loginWithMatricula,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
