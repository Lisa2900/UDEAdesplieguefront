"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { Toaster, toast } from "react-hot-toast"
import Image from "next/image"
import { useAuthAdmin } from "../../../hooks/useAuthAdmin"
export default function LoginWithContext() {
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  })
  const { login, loading } = useAuthAdmin()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.correo || !formData.password) {
      toast.error("Por favor completa todos los campos")
      return
    }

    try {
      await login(formData.correo, formData.password)
      toast.success("Inicio de sesión exitoso")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error durante el inicio de sesión")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="font-[sans-serif] min-h-screen flex flex-col items-center justify-center bg-white"
    >
      <Toaster position="top-center" />
      <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-6 m-4 shadow-lg rounded-md">
        {/* Formulario */}
        <div className="md:max-w-md w-full px-6 py-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-12 flex items-center justify-between">
              <h3 className="text-gray-800 text-3xl font-extrabold text-center w-full">Iniciar Sesión</h3>
              <Image src="/udeaLogo2.jpg" alt="Logo" width={80} height={80} className="ml-auto" />
            </div>

            {/* Correo Electrónico */}
            <div className="mt-10">
              <label className="text-gray-800 text-base block mb-2">Correo electrónico:</label>
              <div className="relative flex items-center">
                <input
                  name="correo"
                  type="email"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Correo electrónico"
                />
                <Mail className="absolute right-2 text-gray-500" size={24} />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-800 text-base">Contraseña:</label>
                <Link href="/forgot-password" className="text-sm text-[#0048ac] hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Contraseña"
                />
                <Lock className="absolute right-2 text-gray-500" size={24} />
              </div>
            </div>

            {/* Botón de inicio de sesión */}
            <div className="mt-12 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full shadow-xl py-3 px-4 text-lg tracking-wide rounded-xl text-white bg-[#0048ac] hover:bg-[#03003f] focus:outline-none transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/registro" className="text-[#0048ac] hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Imagen decorativa */}
        <div className="md:h-full rounded-xl lg:p-12 p-8 relative w-full h-[400px]">
          <Image src="/UdeaLogin.jpg" alt="login-image" fill className="rounded-xl object-cover" />
        </div>
      </div>
    </motion.div>
  )
}
