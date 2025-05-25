"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Definimos los tipos de roles disponibles
export type UserRole = "admin" | "superadmin"

// Tipo para los datos del usuario
export interface UserData {
  email: string
  name: string
  role: UserRole
  token?: string
}

// Contexto de autenticación
interface AuthContextType {
  user: UserData | null
  loading: boolean
  login: (correo: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const userDataStr = localStorage.getItem("userData")
      const authToken = localStorage.getItem("authToken")

      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr) as UserData
          if (authToken) userData.token = authToken
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

  const login = async (correo: string, password: string) => {
    setLoading(true)
    try {
      const loginEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/administrador/login`

      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, password }),
      })

      if (!response.ok) {
        throw new Error("Credenciales incorrectas")
      }

      const data = await response.json()

      if (!data.cookieLogin || !data.usuario) {
        throw new Error("Formato de respuesta inválido")
      }

      const userData: UserData = {
        email: data.usuario.correo,
        name: data.usuario.nombre,
        role: data.usuario.rol,
        token: data.cookieLogin,
      }

      localStorage.setItem("authToken", data.cookieLogin)
      localStorage.setItem("userData", JSON.stringify(userData))
      setUser(userData)

      // Redirigir según el rol
      if (userData.role === "admin") {
        router.push("/admin")
      } else if (userData.role === "superadmin") {
        router.push("/SuperAdmin")
      } else {
        router.push("/") // Por si acaso hay un rol inesperado
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

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
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthAdmin() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
