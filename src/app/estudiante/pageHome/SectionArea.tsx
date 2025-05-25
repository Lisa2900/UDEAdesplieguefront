"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"

export default function Seccion1() {
    const router = useRouter()
    const [displayText, setDisplayText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [loopNum, setLoopNum] = useState(0)
    const [typingSpeed, setTypingSpeed] = useState(150)

    // Array of motivational words/phrases related to medicine
    const motivationalWords = [
        "¡Bienvenida!",
        "Innovación",
        "Excelencia",
        "Compromiso",
        "Salud",
        "Bienestar",
        "Humanidad",
        "Universidad De Los Angeles",
        "UDEA",
    ]

    const currentWord = motivationalWords[loopNum % motivationalWords.length]

    const handleTyping = useCallback(() => {
        // Create the new display text based on current word and whether we're deleting or adding
        const updatedText = isDeleting
        ? currentWord.substring(0, displayText.length - 1)
        : currentWord.substring(0, displayText.length + 1)

        setDisplayText(updatedText)

        // Set typing speed - faster when deleting
        setTypingSpeed(isDeleting ? 80 : 150)

        // If finished typing the word
        if (!isDeleting && updatedText === currentWord) {
        // Pause at the end of typing before starting to delete
        setTimeout(() => setIsDeleting(true), 1500)
        }
        // If finished deleting
        else if (isDeleting && updatedText === "") {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
        }
    }, [currentWord, displayText, isDeleting, loopNum])

    useEffect(() => {
        const timer = setTimeout(handleTyping, typingSpeed)
        return () => clearTimeout(timer)
    }, [displayText, handleTyping, typingSpeed])

    const handleClick = () => {
        router.push("/estudiante/pageSubject")
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/UdeaPrincipal.jpg')" }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
        </div>

        {/* Content container */}
        <div className="relative z-10 flex flex-col items-center justify-between min-h-screen px-4 py-12 max-w-7xl mx-auto">
            {/* Dynamic welcome text */}
            <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            >
            <h1 className="text-6xl md:text-7xl font-bold text-white min-h-[1.2em]">
                {displayText}
                <span className="animate-pulse ml-1 inline-block">|</span>
            </h1>
            <motion.div
                className="h-1 w-24 bg-[#0096c7] mx-auto mt-4"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            />
            </motion.div>

            {/* Main content card */}
            <motion.div
            className="w-full max-w-xl mx-auto mt-12 md:mt-0 md:mr-0 md:ml-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            >
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
                {/* Card header */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#00b4d8] via-[#023e8a] to-[#001233]"></div>

                <div className="p-8 md:p-10">
                {/* Badge */}
                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white bg-[#0048ac] rounded-full mb-6">
                    RECIÉN LLEGADO
                </span>

                {/* Card content */}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Algo nuevo que
                    <br />
                    aprender cada día
                </h2>

                <p className="text-white/80 mb-8 leading-relaxed">
                    Explora nuestra plataforma educativa diseñada para potenciar tu desarrollo profesional. Contenido
                    actualizado y herramientas interactivas para una experiencia de aprendizaje única.
                </p>

                {/* Button */}
                <motion.button
                    className="group flex items-center gap-2 bg-white text-[#0048ac] font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:bg-[#0048ac] hover:text-white"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClick}
                >
                    APRENDER MÁS
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
                </div>
            </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
            className="absolute bottom-10 left-10 w-24 h-24 rounded-full border-2 border-white/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            />
            <motion.div
            className="absolute top-32 right-20 w-16 h-16 rounded-full border-2 border-white/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            />
        </div>
        </div>
    )
}
