"use client"

import type { ReactNode } from "react"
import { useRoleGuard, type UserRole } from "../../../hooks/useRoleGuard"

interface RoleGuardProps {
  children: ReactNode
  requiredRole?: UserRole
  fallback?: ReactNode
}

export default function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { isAuthorized, isLoading } = useRoleGuard(requiredRole)

  // Si está cargando, mostrar un indicador de carga o nada
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Si no está autorizado y hay un fallback, mostrar el fallback
  if (!isAuthorized && fallback) {
    return <>{fallback}</>
  }

  // Si está autorizado, mostrar los children
  return isAuthorized ? <>{children}</> : null
}
