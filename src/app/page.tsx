"use client"

import { useState } from "react"
import AlumnoLogin from "@/components/AlumnoLogin/AlumnoLogin"
import AdminLogin from "@/components/LoginAdmin/AdminLogin"
import { AnimatePresence, motion } from "framer-motion"
import { UserIcon, ShieldIcon } from "lucide-react"

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-4">
      {/* Contenedor principal solo para título y switch */}
      <div className="w-full max-w-4xl mb-2">
        {/* Título y descripción en diseño horizontal mejorado */}
        <motion.div
          className="w-full text-center mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1
            className="text-3xl font-bold inline-flex items-center justify-center"
            key={isAdmin ? "admin-title" : "alumno-title"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {isAdmin ? (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-700">
                Bienvenido al portal de Administración
              </span>
            ) : (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">
                Bienvenido a la Biblioteca Virtual UDEA
              </span>
            )}
          </motion.h1>

          {/* Descripción horizontal */}
          <motion.div
            className="mt-2 px-4 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-center"
            key={isAdmin ? "admin-desc" : "alumno-desc"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <span className="font-medium text-gray-700">
              {isAdmin ? "Centro de control educativo" : "Tu puerta al conocimiento"}
            </span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="text-gray-600">
              {isAdmin
                ? "Gestiona cursos y usuarios con herramientas"
                : "Accede a tus cursos y recursos educativos personalizados"}
            </span>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="inline-flex items-center text-sm font-medium text-gray-700">
              {isAdmin ? "Acceso administrativo" : "Cuenta estudiantil"}
            </span>
          </motion.div>
        </motion.div>

        {/* Switch con menos margen - centrado */}
        <div className="flex justify-center mb-3">
          <div className="flex gap-4 p-2 bg-gray-100/50 rounded-xl">
            {/* Botón Alumno */}
            <motion.button
              onClick={() => setIsAdmin(false)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-lg ${
                !isAdmin ? "bg-white" : "bg-transparent hover:bg-white/50"
              }`}
              animate={{
                y: !isAdmin ? -4 : 0,
                boxShadow: !isAdmin
                  ? "0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.3)"
                  : "0 0 0 0 rgba(0, 0, 0, 0)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full ${
                  !isAdmin ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                <UserIcon className="h-4 w-4" />
              </div>
              <span className={`font-medium ${!isAdmin ? "text-blue-600" : "text-gray-600"}`}>Alumno</span>
            </motion.button>

            {/* Botón Admin */}
            <motion.button
              onClick={() => setIsAdmin(true)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-lg ${
                isAdmin ? "bg-white" : "bg-transparent hover:bg-white/50"
              }`}
              animate={{
                y: isAdmin ? -4 : 0,
                boxShadow: isAdmin
                  ? "0 10px 25px -5px rgba(124, 58, 237, 0.5), 0 8px 10px -6px rgba(124, 58, 237, 0.3)"
                  : "0 0 0 0 rgba(0, 0, 0, 0)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full ${
                  isAdmin ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                <ShieldIcon className="h-4 w-4" />
              </div>
              <span className={`font-medium ${isAdmin ? "text-purple-600" : "text-gray-600"}`}>Admin</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Formulario con animación - RESTAURADO AL DISEÑO ORIGINAL */}
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={isAdmin ? "admin" : "alumno"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {isAdmin ? <AdminLogin /> : <AlumnoLogin />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
