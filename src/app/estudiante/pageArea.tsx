import React from "react";
import Seccion1 from "./pageHome/SectionArea";
import Seccion2 from "./pageHome/SectionWelcome";
import AlumnoGuard from "@/components/guards/AlumnoGuard";

export default function PageArea() {
  return (<AlumnoGuard fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-700">No tienes permisos para acceder a esta sección.</p>
      </div>
    }>
        <div>
          <Seccion1/>
          <Seccion2/>
        </div>
    </AlumnoGuard>
    
  );
}
