import RoleGuard from "./RoleGuard"
import type { ReactNode } from "react"

interface SuperAdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function SuperAdminGuard({ children, fallback }: SuperAdminGuardProps) {
  return (
    <RoleGuard requiredRole="superadmin" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
