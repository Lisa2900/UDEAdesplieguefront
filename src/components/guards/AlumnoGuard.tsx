import RoleGuard from "./RoleGuard"
import type { ReactNode } from "react"

interface AlumnoGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function AlumnoGuard({ children, fallback }: AlumnoGuardProps) {
  return (
    <RoleGuard requiredRole="alumno" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
