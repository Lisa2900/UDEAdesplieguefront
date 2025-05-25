"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

function VerificationPage() {
  const router = useRouter()

  const handlerPages = () => {
    router.push("/")
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-5xl w-full p-0 shadow-xl bg-white rounded-2xl overflow-hidden"
      >
        <div className="w-full p-8 md:p-10 flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center">
            <div className="bg-blue-50 p-4 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-[#03003f]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#03003f] mb-2 text-center">Verificación Enviada</h1>
          </div>

          <p className="text-gray-600 mb-8 text-center text-sm md:text-base leading-relaxed">
            Hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada y sigue las instrucciones
            del mensaje para completar el proceso de validación de acceso.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-8 w-full">
            <p className="text-sm text-gray-500 italic text-center">
              Si no encuentras el correo, revisa tu carpeta de spam o intenta reenviar la verificación.
            </p>
          </div>

          <button
            onClick={handlerPages}
            className="w-full bg-[#03003f] text-white py-3 px-6 rounded-lg hover:bg-[#04004a] transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-base"
          >
            Iniciar sesión
          </button>
        </div>

        <div className="hidden md:block h-full bg-gradient-to-br from-[#03003f] to-[#050068]">
          <div className="relative h-full w-full flex items-center justify-center p-10">
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-lg">
              <Image
                src="/udeaLogo2.jpg"
                width={200}
                height={200}
                className="w-full h-auto object-contain rounded-xl"
                alt="Verification illustration"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default VerificationPage
