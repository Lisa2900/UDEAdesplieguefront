"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

function VerificationToken() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (!token) return

    const confirmAccount = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/alumnos/confirmar/${token}`, {
          method: "GET",
        })

        if (response.ok) {
          setVerificationStatus("success")
        } else {
          setVerificationStatus("error")
        }
      } catch (error) {
        console.error("Error confirming account:", error)
        setVerificationStatus("error")
      }
    }

    confirmAccount()
  }, [token])

  const handlerPages = () => {
    router.push("/")
  }

  const getMessage = () => {
    if (verificationStatus === "loading") {
      return "Verificando tu cuenta, por favor espera..."
    }
    if (verificationStatus === "success") {
      return "¡Tu cuenta ha sido verificada exitosamente! Ahora puedes iniciar sesión."
    }
    if (verificationStatus === "error") {
      return "Hubo un problema al verificar tu cuenta. El enlace puede haber expirado o ya fue utilizado."
    }
  }

  const getStatusIcon = () => {
    if (verificationStatus === "loading") {
      return <Loader2 className="h-12 w-12 text-[#03003f] animate-spin" />
    }
    if (verificationStatus === "success") {
      return <CheckCircle className="h-12 w-12 text-green-500" />
    }
    if (verificationStatus === "error") {
      return <XCircle className="h-12 w-12 text-red-500" />
    }
  }

  const getStatusColor = () => {
    if (verificationStatus === "loading") return "bg-blue-50"
    if (verificationStatus === "success") return "bg-green-50"
    if (verificationStatus === "error") return "bg-red-50"
    return "bg-gray-50"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="font-sans min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 max-w-5xl w-full p-6 shadow-lg bg-white rounded-xl border border-gray-100">
        <div className="w-full p-6">
          <div className="flex flex-col items-center mb-6">
            <div className={`p-4 rounded-full mb-4 ${getStatusColor()}`}>{getStatusIcon()}</div>
            <h2 className="text-xl font-semibold text-[#03003f] text-center mb-2">
              {verificationStatus === "loading" && "Verificando Cuenta"}
              {verificationStatus === "success" && "Verificación Exitosa"}
              {verificationStatus === "error" && "Error de Verificación"}
            </h2>
          </div>

          <div
            className={`p-4 rounded-lg mb-6 ${
              verificationStatus === "loading"
                ? "bg-blue-50 border border-blue-100"
                : verificationStatus === "success"
                  ? "bg-green-50 border border-green-100"
                  : "bg-red-50 border border-red-100"
            }`}
          >
            <p className="text-gray-700 text-center text-sm md:text-base leading-relaxed">{getMessage()}</p>
          </div>

          {verificationStatus !== "loading" && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onClick={handlerPages}
              className="w-full bg-[#03003f] text-white py-3 rounded-lg hover:bg-[#03003f]/90 transition duration-200 ease-in-out shadow-sm font-medium"
            >
              Iniciar sesión
            </motion.button>
          )}

          {verificationStatus === "loading" && (
            <div className="w-full py-3 flex justify-center">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Esto puede tomar unos momentos</span>
                <span className="flex space-x-1">
                  <span className="animate-bounce delay-0">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block md:h-full bg-gradient-to-br from-[#03003f] to-[#050068] rounded-xl p-6 md:p-12 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-center h-full">
            <Image
              src="/udeaLogo2.jpg"
              width={80}
              height={80}
              className="w-auto h-auto max-w-full max-h-full object-contain rounded-xl shadow-lg"
              alt="Verification illustration"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VerificationToken
