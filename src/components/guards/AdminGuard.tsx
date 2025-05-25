import RoleGuard from "./RoleGuard"
import type { ReactNode } from "react"

interface AdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  return (
    <RoleGuard requiredRole="admin" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
