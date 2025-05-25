import AlumnoGuard from '@/components/guards/AlumnoGuard'
import SubjectMaterials from '@/components/SubjectSection/SubjectMaterials'
import React from 'react'

export default function page() {
    return (<AlumnoGuard fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                <p className="text-gray-700">No tienes permisos para acceder a esta sección.</p>
            </div>
        }>
            <SubjectMaterials/>
        </AlumnoGuard>
        
    )
}
