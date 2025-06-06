import type React from "react"
import DashboardLayout from "./DashboardLayout"
import SuperAdminGuard from "@/components/guards/SuperAdminGuard"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    return <SuperAdminGuard fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
            <p className="text-gray-700">No tienes permisos para acceder a esta sección.</p>
        </div>
    }>
        <DashboardLayout>{children}</DashboardLayout>
    </SuperAdminGuard>
}

