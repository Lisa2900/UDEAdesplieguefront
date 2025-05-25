"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { X } from "lucide-react"
import { useAuth } from "../../../hooks/useAuth"
import { useAuthAdmin } from "../../../hooks/useAuthAdmin"
import ProfileDropdownInline from "../ProfileDropdownInline"
import Link from "next/link"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user: userAlumno, isAuthenticated: isAuthenticatedAlumno } = useAuth()
  const { user: userAdmin, isAuthenticated: isAuthenticatedAdmin } = useAuthAdmin()
  const modalRef = useRef<HTMLDivElement>(null)

  // Definimos el usuario y autenticación
  const user = userAlumno || userAdmin
  const isAuthenticated = isAuthenticatedAlumno || isAuthenticatedAdmin

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-xs overflow-hidden transform transition-all"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Perfil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {isAuthenticated && user ? (
            <ProfileDropdownInline onClose={onClose} />
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">No has iniciado sesión</p>
              <Link
                href="/login" // 🔥 Siempre a login 🔥
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={onClose}
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
